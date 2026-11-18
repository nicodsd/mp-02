import {
    getOrderSecurityTokenServerAction,
    submitOrderServerAction,
    getOrdersServerAction,
    getOrderAnalyticsServerAction,
    clearOrderAnalyticsServerAction,
    updateOrderStatusServerAction,
    deleteOrderServerAction,
    clearCompletedOrdersServerAction,
} from "@/src/utils/ordersServerAction";

export type OrderStatus = "pendiente" | "en_proceso" | "enviado_cobrado";

export interface DeliveryLocation {
    lat: number;
    lng: number;
    direccion_texto: string;
    referencia?: string;
}

export interface OrderItemPayload {
    food_id: string;
    nombre: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
}

export interface OrderPayload {
    id?: string;
    _id?: string;
    numero_orden?: number;
    cliente_id: string;
    user_id?: string;
    menu_id?: string;
    negocio_nombre?: string;
    cliente_nombre?: string;
    nota?: string;
    items: OrderItemPayload[];
    total: number;
    tipo_entrega: "delivery" | "takeaway";
    envio?: DeliveryLocation;
    estado: OrderStatus;
    createdAt?: string;
    updatedAt?: string;
}

export interface OrderFilterIdentifiers {
    userId?: string;
    menuId?: string;
    businessName?: string;
    extraIds?: string[];
}

export interface PeriodAnalyticsEntry {
    pedidos: number;
    ingresos: number;
    completados: number;
    expirados24h: number;
}

export interface BusinessOrderAnalytics {
    totalPedidos: number;
    totalIngresos: number;
    pedidosCompletados: number;
    pedidosExpirados24h: number;
    porMes: Record<string, PeriodAnalyticsEntry>;
    porSemana: Record<string, PeriodAnalyticsEntry>;
    updatedAt?: string;
}

const LOCAL_ORDERS_KEY = "qmenu_orders_v1";
const LOCAL_ANALYTICS_KEY = "qmenu_orders_analytics_v1";
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
const ORDERS_CHANNEL_NAME = "qmenu_orders_channel";
const ORDERS_CUSTOM_EVENT = "qmenu-orders-updated";

function notifyOrdersChanged() {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent(ORDERS_CUSTOM_EVENT));
    try {
        if ("BroadcastChannel" in window) {
            const channel = new BroadcastChannel(ORDERS_CHANNEL_NAME);
            channel.postMessage({ type: "ORDERS_UPDATED", timestamp: Date.now() });
            channel.close();
        }
    } catch {
        // Ignorar si BroadcastChannel no está disponible
    }
}

function normalizeStatus(status?: string): OrderStatus {
    if (status === "en_proceso" || status === "proceso" || status === "preparando") {
        return "en_proceso";
    }
    if (
        status === "enviado_cobrado" ||
        status === "completado" ||
        status === "entregado" ||
        status === "cobrado"
    ) {
        return "enviado_cobrado";
    }
    return "pendiente";
}

function normalizeBusinessSlug(name?: string): string {
    if (!name) return "";
    try {
        return decodeURIComponent(name)
            .trim()
            .toLowerCase()
            .replace(/[-_\s]+/g, "-");
    } catch {
        return name.trim().toLowerCase().replace(/[-_\s]+/g, "-");
    }
}

function normalizeOrder(raw: any): OrderPayload {
    const id = String(raw?.id || raw?._id || `ord_${Date.now()}`);
    return {
        id,
        _id: raw?._id ? String(raw._id) : id,
        numero_orden: typeof raw?.numero_orden === "number" ? raw.numero_orden : undefined,
        cliente_id: String(raw?.cliente_id || raw?.user_id || "anonimo"),
        user_id: raw?.user_id ? String(raw.user_id) : raw?.cliente_id ? String(raw.cliente_id) : undefined,
        menu_id: raw?.menu_id ? String(raw.menu_id) : undefined,
        negocio_nombre: raw?.negocio_nombre ? String(raw.negocio_nombre) : undefined,
        cliente_nombre: raw?.cliente_nombre ? String(raw.cliente_nombre).trim() : "Cliente WhatsApp",
        nota: raw?.nota ? String(raw.nota) : undefined,
        items: Array.isArray(raw?.items)
            ? raw.items.map((item: any) => ({
                  food_id: String(item?.food_id || item?._id || ""),
                  nombre: String(item?.nombre || item?.name || "Plato"),
                  cantidad: Number(item?.cantidad || item?.quantity || 1),
                  precio_unitario: Number(item?.precio_unitario || item?.price || 0),
                  subtotal: Number(
                      item?.subtotal ??
                          Number(item?.precio_unitario || item?.price || 0) *
                              Number(item?.cantidad || item?.quantity || 1)
                  ),
              }))
            : [],
        total: Number(raw?.total || 0),
        tipo_entrega: raw?.tipo_entrega === "delivery" ? "delivery" : "takeaway",
        envio: raw?.envio
            ? {
                  lat: Number(raw.envio.lat || 0),
                  lng: Number(raw.envio.lng || 0),
                  direccion_texto: String(raw.envio.direccion_texto || ""),
                  referencia: raw.envio.referencia ? String(raw.envio.referencia) : undefined,
              }
            : undefined,
        estado: normalizeStatus(raw?.estado),
        createdAt: raw?.createdAt || raw?.created_at || new Date().toISOString(),
        updatedAt: raw?.updatedAt || raw?.updated_at || new Date().toISOString(),
    };
}

function isWaitingOrderExpired(order: OrderPayload, nowMs = Date.now()): boolean {
    if (order.estado !== "pendiente") return false;
    const createdMs = new Date(order.createdAt || 0).getTime();
    return !Number.isNaN(createdMs) && createdMs > 0 && nowMs - createdMs >= TWENTY_FOUR_HOURS_MS;
}

function readAllLocalOrders(): OrderPayload[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        const normalized = parsed.map(normalizeOrder);
        const nowMs = Date.now();
        const active = normalized.filter((o) => !isWaitingOrderExpired(o, nowMs));
        if (active.length !== normalized.length) {
            writeAllLocalOrders(active);
        }
        return active;
    } catch {
        return [];
    }
}

function writeAllLocalOrders(orders: OrderPayload[]) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    } catch {
        // Ignorar errores de cuota en localStorage
    }
}

function matchesBusiness(order: OrderPayload, identifiers?: OrderFilterIdentifiers): boolean {
    if (!identifiers) return true;
    const { userId, menuId, businessName, extraIds } = identifiers;
    if (!userId && !menuId && !businessName && (!extraIds || extraIds.length === 0)) return true;

    const targetIds = new Set(
        [userId, menuId, ...(extraIds || [])]
            .filter(Boolean)
            .map((x) => String(x).trim())
    );

    const orderClienteId = String(order.cliente_id || "").trim();
    const orderUserId = String(order.user_id || "").trim();
    const orderMenuId = String(order.menu_id || "").trim();

    if (orderClienteId && targetIds.has(orderClienteId)) return true;
    if (orderUserId && targetIds.has(orderUserId)) return true;
    if (orderMenuId && targetIds.has(orderMenuId)) return true;

    const targetSlug = normalizeBusinessSlug(businessName);
    const orderSlug = normalizeBusinessSlug(order.negocio_nombre);
    if (targetSlug && orderSlug && targetSlug === orderSlug) {
        return true;
    }

    return false;
}

export function getLocalOrders(identifiers?: OrderFilterIdentifiers): OrderPayload[] {
    const all = readAllLocalOrders();
    const filtered = all.filter((o) => matchesBusiness(o, identifiers));
    return filtered.sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
}

export function saveOrderLocally(payload: OrderPayload): OrderPayload {
    const now = new Date().toISOString();
    const generatedId =
        payload.id || payload._id || `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const normalized = normalizeOrder({
        ...payload,
        id: generatedId,
        _id: payload._id || generatedId,
        createdAt: payload.createdAt || now,
        updatedAt: payload.updatedAt || now,
    });

    if (typeof window !== "undefined") {
        const all = readAllLocalOrders();
        const existingIndex = all.findIndex(
            (o) => (o.id && o.id === normalized.id) || (o._id && o._id === normalized._id)
        );
        if (existingIndex >= 0) {
            all[existingIndex] = { ...all[existingIndex], ...normalized };
        } else {
            all.unshift(normalized);
        }
        writeAllLocalOrders(all);
        notifyOrdersChanged();
    }

    return normalized;
}

/**
 * Calcula en el cliente el hash SHA-256 canónico del payload para que el servidor verifique
 * que la petición no fue interceptada ni alterada en tránsito.
 */
async function computeClientPayloadHash(data: {
    nonce: string;
    timestamp: number;
    cliente_id: string;
    cliente_nombre: string;
    tipo_entrega: string;
    items: Array<{ food_id: string; cantidad: number }>;
}): Promise<string> {
    const canonicalItems = data.items
        .map((i) => `${String(i.food_id).trim()}:${Number(i.cantidad)}`)
        .join("|");
    const canonicalString = [
        data.nonce,
        String(data.timestamp),
        String(data.cliente_id).trim(),
        String(data.cliente_nombre).trim(),
        String(data.tipo_entrega).trim(),
        canonicalItems,
    ].join("::");

    const encoder = new TextEncoder();
    const bytes = encoder.encode(canonicalString);
    const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Suscribe un callback a los cambios de comandas en tiempo real (misma pestaña o entre pestañas).
 */
export function subscribeToOrders(callback: () => void): () => void {
    if (typeof window === "undefined") return () => {};

    const handleStorage = (e: StorageEvent) => {
        if (e.key === LOCAL_ORDERS_KEY || e.key === null) {
            callback();
        }
    };
    const handleCustom = () => callback();

    window.addEventListener("storage", handleStorage);
    window.addEventListener(ORDERS_CUSTOM_EVENT, handleCustom);

    let channel: BroadcastChannel | null = null;
    try {
        if ("BroadcastChannel" in window) {
            channel = new BroadcastChannel(ORDERS_CHANNEL_NAME);
            channel.onmessage = () => callback();
        }
    } catch {
        channel = null;
    }

    return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(ORDERS_CUSTOM_EVENT, handleCustom);
        if (channel) {
            channel.close();
        }
    };
}

/**
 * Busca ubicaciones por texto en Nominatim (Forward Geocoding).
 */
export async function searchAddress(
    query: string,
    signal?: AbortSignal
): Promise<Array<{ lat: number; lng: number; displayName: string }>> {
    if (!query || query.trim().length < 3) return [];
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query.trim()
    )}&format=jsonv2&limit=5&accept-language=es&addressdetails=1`;

    const response = await fetch(url, {
        signal,
        headers: {
            Accept: "application/json",
            "User-Agent": "QMenuApp/1.0",
        },
    });

    if (!response.ok) return [];
    const data = await response.json();
    if (!Array.isArray(data)) return [];

    return data.map((item: any) => ({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        displayName: item.display_name,
    }));
}

/**
 * Consulta Nominatim (OpenStreetMap) para convertir coordenadas (lat, lng) en dirección legible.
 */
export async function reverseGeocode(
    lat: number,
    lng: number,
    signal?: AbortSignal
): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=es&addressdetails=1`;

    const response = await fetch(url, {
        signal,
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("No se pudo obtener la dirección");
    }

    const data = await response.json();
    const addr = data?.address;

    if (addr) {
        const street =
            addr.road ||
            addr.pedestrian ||
            addr.footway ||
            addr.path ||
            addr.residential ||
            addr.neighbourhood ||
            addr.suburb ||
            "";
        const number = addr.house_number ? ` ${addr.house_number}` : "";
        const area =
            addr.suburb && addr.suburb !== street
                ? `, ${addr.suburb}`
                : addr.neighbourhood && addr.neighbourhood !== street
                  ? `, ${addr.neighbourhood}`
                  : "";
        const city =
            addr.city || addr.town || addr.village || addr.municipality || "";

        const built = `${street}${number}${area}${city ? `, ${city}` : ""}`.trim().replace(/^,\s*/, "");
        if (built) return built;
    }

    if (data?.display_name) {
        return data.display_name.split(",").slice(0, 3).join(",").trim();
    }

    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

/**
 * Envía el pedido al servidor de Next.js mediante Server Action firmada con HMAC-SHA256 + SHA-256 Digest
 * para evitar que la petición sea interceptada o alterada y para que se cargue en el Panel de Usuario.
 */
export async function submitOrderToBackend(payload: OrderPayload): Promise<boolean> {
    try {
        const clienteId = String(payload.cliente_id || "anonimo").trim();
        const { nonce, timestamp, signature } = await getOrderSecurityTokenServerAction(clienteId);

        const payloadHash = await computeClientPayloadHash({
            nonce,
            timestamp,
            cliente_id: clienteId,
            cliente_nombre: String(payload.cliente_nombre || ""),
            tipo_entrega: String(payload.tipo_entrega || "takeaway"),
            items: (payload.items || []).map((i) => ({
                food_id: String(i.food_id || ""),
                cantidad: Number(i.cantidad || 1),
            })),
        });

        const result = await submitOrderServerAction({
            order: {
                ...payload,
                cliente_id: clienteId,
            },
            security: {
                nonce,
                timestamp,
                signature,
                payloadHash,
            },
        });

        if (result.success && result.order) {
            saveOrderLocally(result.order);
            return true;
        }

        if (result.blockedByPlan) {
            return false;
        }

        // Respaldo local en caso de validación offline
        saveOrderLocally(payload);
        return false;
    } catch (error) {
        console.error("Error al enviar la comanda al servidor:", error);
        saveOrderLocally(payload);
        return false;
    }
}

/**
 * Obtiene las comandas del negocio desde el servidor (autenticado con cookies HttpOnly)
 * y las sincroniza con la caché local.
 */
export async function fetchOrdersForBusiness(
    identifiers: OrderFilterIdentifiers
): Promise<OrderPayload[]> {
    try {
        const serverOrders = await getOrdersServerAction(identifiers);
        if (Array.isArray(serverOrders)) {
            const allLocal = readAllLocalOrders();
            const mapById = new Map<string, OrderPayload>();

            // Conservar órdenes de otros negocios y fusionar las del servidor como fuente de verdad
            for (const localOrd of allLocal) {
                if (!matchesBusiness(localOrd, identifiers)) {
                    mapById.set(String(localOrd.id || localOrd._id), localOrd);
                }
            }
            for (const srvOrd of serverOrders) {
                const norm = normalizeOrder(srvOrd);
                mapById.set(String(norm.id || norm._id), norm);
            }

            writeAllLocalOrders(Array.from(mapById.values()));
            return serverOrders.map(normalizeOrder);
        }
    } catch (error) {
        console.error("Error al obtener comandas del servidor:", error);
    }

    return getLocalOrders(identifiers);
}

/**
 * Actualiza el estado de una comanda en el servidor (Lista de espera -> En proceso -> Enviados y cobrados).
 */
export async function updateOrderStatus(
    orderId: string,
    nuevoEstado: OrderStatus,
    identifiers?: OrderFilterIdentifiers
): Promise<boolean> {
    const now = new Date().toISOString();
    const all = readAllLocalOrders();
    const updated = all.map((order) => {
        if (order.id === orderId || order._id === orderId) {
            return { ...order, estado: nuevoEstado, updatedAt: now };
        }
        return order;
    });
    writeAllLocalOrders(updated);
    notifyOrdersChanged();

    try {
        const res = await updateOrderStatusServerAction(orderId, nuevoEstado, identifiers);
        return res.success;
    } catch {
        return false;
    }
}

/**
 * Elimina una comanda por ID en el servidor.
 */
export async function deleteOrderById(
    orderId: string,
    identifiers?: OrderFilterIdentifiers
): Promise<boolean> {
    const all = readAllLocalOrders();
    const filtered = all.filter((order) => order.id !== orderId && order._id !== orderId);
    writeAllLocalOrders(filtered);
    notifyOrdersChanged();

    try {
        const res = await deleteOrderServerAction(orderId, identifiers);
        return res.success;
    } catch {
        return false;
    }
}

/**
 * Limpia todas las comandas en estado "enviado_cobrado" del negocio actual en el servidor.
 */
export async function clearCompletedOrders(identifiers?: OrderFilterIdentifiers): Promise<void> {
    const all = readAllLocalOrders();
    const remaining = all.filter(
        (order) => !(matchesBusiness(order, identifiers) && order.estado === "enviado_cobrado")
    );
    writeAllLocalOrders(remaining);
    notifyOrdersChanged();

    try {
        await clearCompletedOrdersServerAction(identifiers);
    } catch {
        // Ignorar si falla
    }
}

function getLocalAnalyticsStorageKey(identifiers?: OrderFilterIdentifiers): string {
    return (
        identifiers?.userId ||
        identifiers?.menuId ||
        normalizeBusinessSlug(identifiers?.businessName) ||
        "default"
    );
}

export function getLocalOrderAnalytics(
    identifiers?: OrderFilterIdentifiers
): BusinessOrderAnalytics {
    const empty: BusinessOrderAnalytics = {
        totalPedidos: 0,
        totalIngresos: 0,
        pedidosCompletados: 0,
        pedidosExpirados24h: 0,
        porMes: {},
        porSemana: {},
    };
    if (typeof window === "undefined") return empty;
    try {
        const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
        if (!raw) return empty;
        const parsed = JSON.parse(raw);
        const key = getLocalAnalyticsStorageKey(identifiers);
        return parsed?.[key] ? { ...empty, ...parsed[key] } : empty;
    } catch {
        return empty;
    }
}

export async function fetchOrderAnalyticsForBusiness(
    identifiers: OrderFilterIdentifiers
): Promise<BusinessOrderAnalytics> {
    try {
        const analytics = await getOrderAnalyticsServerAction(identifiers);
        if (typeof window !== "undefined" && analytics) {
            try {
                const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
                const parsed = raw ? JSON.parse(raw) : {};
                const key = getLocalAnalyticsStorageKey(identifiers);
                parsed[key] = analytics;
                localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(parsed));
            } catch {
                // Ignorar error de cuota en localStorage
            }
        }
        return analytics;
    } catch (error) {
        console.error("Error al obtener analíticas de comandas:", error);
        return getLocalOrderAnalytics(identifiers);
    }
}

export async function clearOrderAnalytics(
    identifiers: OrderFilterIdentifiers
): Promise<BusinessOrderAnalytics> {
    const empty: BusinessOrderAnalytics = {
        totalPedidos: 0,
        totalIngresos: 0,
        pedidosCompletados: 0,
        pedidosExpirados24h: 0,
        porMes: {},
        porSemana: {},
    };

    if (typeof window !== "undefined") {
        try {
            const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
            const parsed = raw ? JSON.parse(raw) : {};
            const key = getLocalAnalyticsStorageKey(identifiers);
            delete parsed[key];
            localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(parsed));
        } catch {
            // Ignorar error en localStorage
        }
    }

    try {
        return await clearOrderAnalyticsServerAction(identifiers);
    } catch (error) {
        console.error("Error al limpiar analíticas de comandas:", error);
        return empty;
    }
}
