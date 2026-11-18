"use server";

import { cookies } from "next/headers";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { URI } from "@/src/lib/const";
import type {
    OrderPayload,
    OrderStatus,
    OrderItemPayload,
    OrderFilterIdentifiers,
    BusinessOrderAnalytics,
    PeriodAnalyticsEntry,
} from "@/src/utils/orders";

const SECRET_KEY =
    process.env.ORDER_SIGNING_SECRET ||
    process.env.MP_WEBHOOK_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "qmenu-secure-orders-hmac-secret-2026";

const TOKEN_TTL_MS = 10 * 60 * 1000; // 10 minutos de validez por token de envío
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000; // 24 horas para expirar comandas en lista de espera
const DATA_DIR = path.join(process.cwd(), ".data");
const ORDERS_FILE = path.join(DATA_DIR, "comandas.json");

// Registro en memoria de nonces consumidos para evitar ataques de repetición (Replay Attacks)
const usedNonces = new Map<string, number>();

function cleanupExpiredNonces() {
    const now = Date.now();
    for (const [nonce, expiresAt] of usedNonces.entries()) {
        if (now > expiresAt) {
            usedNonces.delete(nonce);
        }
    }
}

function sanitizeText(input: unknown, maxLength = 160): string {
    if (typeof input !== "string") return "";
    return input
        .replace(/[<>]/g, "")
        .trim()
        .slice(0, maxLength);
}

function normalizeBusinessSlug(name?: string): string {
    if (!name) return "";
    return decodeURIComponent(name)
        .trim()
        .toLowerCase()
        .replace(/[-_\s]+/g, "-");
}

function computeCanonicalPayloadHash(data: {
    nonce: string;
    timestamp: number;
    cliente_id: string;
    cliente_nombre: string;
    tipo_entrega: string;
    items: Array<{ food_id: string; cantidad: number }>;
}): string {
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

    return crypto.createHash("sha256").update(canonicalString).digest("hex");
}

function signOrderRecord(order: OrderPayload): string {
    const raw = [
        order.id,
        order.cliente_id,
        order.menu_id || "",
        order.negocio_nombre || "",
        order.cliente_nombre || "",
        String(order.total),
        order.estado,
        order.createdAt || "",
    ].join("|");
    return crypto.createHmac("sha256", SECRET_KEY).update(raw).digest("hex");
}

type StoredOrderRecord = OrderPayload & {
    _sig?: string;
    _analyticsCounted?: boolean;
};

interface StoredAnalyticsRecord extends BusinessOrderAnalytics {
    userId?: string;
    menuId?: string;
    businessName?: string;
}

interface StoredOrdersFile {
    counter: number;
    orders: StoredOrderRecord[];
    analyticsByBusiness: Record<string, StoredAnalyticsRecord>;
}

function getAnalyticsBusinessKey(order: Pick<OrderPayload, "user_id" | "cliente_id" | "menu_id" | "negocio_nombre">): string {
    const uid = String(order.user_id || order.cliente_id || "").trim();
    if (uid && uid !== "anonimo") return `uid:${uid}`;
    const mid = String(order.menu_id || "").trim();
    if (mid) return `mid:${mid}`;
    const slug = normalizeBusinessSlug(order.negocio_nombre);
    if (slug) return `slug:${slug}`;
    return "anonimo";
}

function getMonthKey(isoOrDate?: string): string {
    const parsed = isoOrDate ? new Date(isoOrDate) : new Date();
    const d = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
}

function getISOWeekKey(isoOrDate?: string): string {
    const parsed = isoOrDate ? new Date(isoOrDate) : new Date();
    const d = Number.isNaN(parsed.getTime()) ? new Date() : new Date(parsed.getTime());
    d.setHours(0, 0, 0, 0);
    // Jueves de la semana actual determina el año ISO
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    const weekNumber =
        1 +
        Math.round(
            ((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
        );
    return `${d.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}

function addPeriodStats(
    map: Record<string, PeriodAnalyticsEntry>,
    periodKey: string,
    amount: number,
    reason: "completed" | "expired_24h"
) {
    const prev = map[periodKey] || {
        pedidos: 0,
        ingresos: 0,
        completados: 0,
        expirados24h: 0,
    };
    prev.pedidos += 1;
    prev.ingresos += amount;
    if (reason === "completed") {
        prev.completados += 1;
    } else {
        prev.expirados24h += 1;
    }
    map[periodKey] = prev;
}

function recordOrderInAnalytics(
    store: StoredOrdersFile,
    order: StoredOrderRecord,
    reason: "completed" | "expired_24h"
): boolean {
    if (order._analyticsCounted) return false;
    const key = getAnalyticsBusinessKey(order);
    const existing = store.analyticsByBusiness[key] || {
        totalPedidos: 0,
        totalIngresos: 0,
        pedidosCompletados: 0,
        pedidosExpirados24h: 0,
        porMes: {},
        porSemana: {},
        userId: String(order.user_id || order.cliente_id || "").trim() || undefined,
        menuId: order.menu_id ? String(order.menu_id).trim() : undefined,
        businessName: order.negocio_nombre ? String(order.negocio_nombre).trim() : undefined,
        updatedAt: new Date().toISOString(),
    };

    if (!existing.porMes) existing.porMes = {};
    if (!existing.porSemana) existing.porSemana = {};

    const amount = Number(order.total || 0);
    const referenceDate = order.createdAt || order.updatedAt;
    const monthKey = getMonthKey(referenceDate);
    const weekKey = getISOWeekKey(referenceDate);

    existing.totalPedidos += 1;
    existing.totalIngresos += amount;
    if (reason === "completed") {
        existing.pedidosCompletados += 1;
    } else {
        existing.pedidosExpirados24h += 1;
    }

    addPeriodStats(existing.porMes, monthKey, amount, reason);
    addPeriodStats(existing.porSemana, weekKey, amount, reason);

    if (!existing.userId && (order.user_id || order.cliente_id)) {
        existing.userId = String(order.user_id || order.cliente_id).trim();
    }
    if (!existing.menuId && order.menu_id) {
        existing.menuId = String(order.menu_id).trim();
    }
    if (!existing.businessName && order.negocio_nombre) {
        existing.businessName = String(order.negocio_nombre).trim();
    }
    existing.updatedAt = new Date().toISOString();

    store.analyticsByBusiness[key] = existing;
    order._analyticsCounted = true;
    return true;
}

function purgeExpiredWaitingOrders(store: StoredOrdersFile, nowMs = Date.now()): boolean {
    let changed = false;
    const remaining: StoredOrderRecord[] = [];

    for (const order of store.orders) {
        const createdMs = new Date(order.createdAt || 0).getTime();
        const isExpiredWaiting =
            order.estado === "pendiente" &&
            !Number.isNaN(createdMs) &&
            createdMs > 0 &&
            nowMs - createdMs >= TWENTY_FOUR_HOURS_MS;

        if (isExpiredWaiting) {
            recordOrderInAnalytics(store, order, "expired_24h");
            changed = true;
            continue;
        }
        remaining.push(order);
    }

    if (changed) {
        store.orders = remaining;
    }
    return changed;
}

async function readOrdersStore(): Promise<StoredOrdersFile> {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        const content = await fs.readFile(ORDERS_FILE, "utf-8");
        const parsed = JSON.parse(content);
        if (parsed && Array.isArray(parsed.orders)) {
            return {
                counter: typeof parsed.counter === "number" ? parsed.counter : 100,
                orders: parsed.orders,
                analyticsByBusiness:
                    parsed.analyticsByBusiness && typeof parsed.analyticsByBusiness === "object"
                        ? parsed.analyticsByBusiness
                        : {},
            };
        }
    } catch {
        // Archivo aún no existe o está vacío
    }
    return { counter: 100, orders: [], analyticsByBusiness: {} };
}

async function readOrdersStoreAndPurge(): Promise<StoredOrdersFile> {
    const store = await readOrdersStore();
    if (purgeExpiredWaitingOrders(store)) {
        await writeOrdersStore(store);
    }
    return store;
}

async function writeOrdersStore(store: StoredOrdersFile): Promise<void> {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tempFile = `${ORDERS_FILE}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(store, null, 2), "utf-8");
    await fs.rename(tempFile, ORDERS_FILE);
}

function matchesOrderIdentifiers(
    order: OrderPayload,
    identifiers: OrderFilterIdentifiers
): boolean {
    const targetUserIds = new Set(
        [identifiers.userId, ...(identifiers.extraIds || [])]
            .filter(Boolean)
            .map((x) => String(x).trim())
    );
    const targetMenuIds = new Set(
        [identifiers.menuId, ...(identifiers.extraIds || [])]
            .filter(Boolean)
            .map((x) => String(x).trim())
    );
    const targetSlug = normalizeBusinessSlug(identifiers.businessName);

    const orderClienteId = String(order.cliente_id || "").trim();
    const orderMenuId = String(order.menu_id || "").trim();
    const orderUserId = String(order.user_id || "").trim();
    const orderSlug = normalizeBusinessSlug(order.negocio_nombre);

    if (orderClienteId && (targetUserIds.has(orderClienteId) || targetMenuIds.has(orderClienteId))) {
        return true;
    }
    if (orderUserId && (targetUserIds.has(orderUserId) || targetMenuIds.has(orderUserId))) {
        return true;
    }
    if (orderMenuId && (targetMenuIds.has(orderMenuId) || targetUserIds.has(orderMenuId))) {
        return true;
    }
    if (targetSlug && orderSlug && targetSlug === orderSlug) {
        return true;
    }

    return false;
}

/**
 * Genera un token criptográfico firmado con HMAC-SHA256 y un nonce único de un solo uso
 * para proteger el envío de la comanda contra intercepción o repetición.
 */
export async function getOrderSecurityTokenServerAction(clienteId: string): Promise<{
    nonce: string;
    timestamp: number;
    signature: string;
}> {
    cleanupExpiredNonces();
    const nonce = crypto.randomBytes(16).toString("hex");
    const timestamp = Date.now();
    const payload = `${nonce}.${timestamp}.${String(clienteId || "anonimo").trim()}`;
    const signature = crypto
        .createHmac("sha256", SECRET_KEY)
        .update(payload)
        .digest("hex");

    return { nonce, timestamp, signature };
}

/**
 * Obtiene el catálogo oficial de platos del negocio desde el backend en el servidor
 * para validar precios reales y evitar que un usuario altere los montos desde el navegador.
 */
async function fetchOfficialMenuFoods(params: {
    userId?: string;
    businessName?: string;
}): Promise<{
    foods: any[];
    resolvedUserId?: string;
    resolvedMenuId?: string;
    resolvedName?: string;
    resolvedPlan?: string;
}> {
    if (!URI) return { foods: [] };

    try {
        if (params.businessName && params.userId !== "ejemplo") {
            const slug = encodeURIComponent(params.businessName.trim().replace(/\s+/g, "-"));
            const res = await fetch(`${URI}/menu/${slug}`, {
                cache: "no-store",
            });
            if (res.ok) {
                const data = await res.json().catch(() => null);
                const menuData = data?.data;
                if (menuData) {
                    const foods = Array.isArray(menuData.foods) ? menuData.foods : [];
                    const ownerId =
                        menuData.user_id ||
                        foods[0]?.user_id ||
                        menuData.id ||
                        undefined;
                    return {
                        foods,
                        resolvedUserId: ownerId ? String(ownerId) : undefined,
                        resolvedMenuId: menuData._id ? String(menuData._id) : undefined,
                        resolvedName: menuData.name ? String(menuData.name) : params.businessName,
                        resolvedPlan: menuData.plan ? String(menuData.plan).toLowerCase() : undefined,
                    };
                }
            }
        }

        if (params.userId && params.userId !== "anonimo" && params.userId !== "ejemplo") {
            const res = await fetch(`${URI}/foods?user_id=${encodeURIComponent(params.userId)}`, {
                cache: "no-store",
            });
            if (res.ok) {
                const data = await res.json().catch(() => null);
                if (Array.isArray(data?.foods) && data.foods.length > 0) {
                    const ownerId = data.foods[0]?.user_id
                        ? String(data.foods[0].user_id)
                        : params.userId;
                    return { foods: data.foods, resolvedUserId: ownerId };
                }
            }
        }
    } catch {
        // Si el backend externo no responde, se continúa con validación estructural
    }

    return { foods: [] };
}

export interface SecureOrderSubmissionInput {
    order: OrderPayload;
    security: {
        nonce: string;
        timestamp: number;
        signature: string;
        payloadHash: string;
    };
}

/**
 * Recibe la comanda en el servidor, verifica la firma HMAC, el nonce anti-replay,
 * el hash de integridad del payload y recalcula los precios reales contra la base de datos.
 */
export async function submitOrderServerAction(
    input: SecureOrderSubmissionInput
): Promise<{ success: boolean; order?: OrderPayload; error?: string; blockedByPlan?: boolean }> {
    try {
        cleanupExpiredNonces();
        const { order, security } = input;

        if (!order || !security) {
            return { success: false, error: "Solicitud de pedido inválida." };
        }

        const { nonce, timestamp, signature, payloadHash } = security;
        const now = Date.now();

        // 1. Validar ventana de tiempo del token (anti-replay)
        if (!timestamp || Math.abs(now - timestamp) > TOKEN_TTL_MS) {
            return { success: false, error: "El token de seguridad del pedido ha expirado." };
        }

        // 2. Verificar que el nonce no haya sido utilizado previamente
        if (!nonce || usedNonces.has(nonce)) {
            return { success: false, error: "Este pedido ya fue procesado (nonce duplicado)." };
        }

        // 3. Verificar firma HMAC-SHA256 del token emitido por el servidor
        const expectedTokenPayload = `${nonce}.${timestamp}.${String(order.cliente_id || "anonimo").trim()}`;
        const expectedTokenSig = crypto
            .createHmac("sha256", SECRET_KEY)
            .update(expectedTokenPayload)
            .digest("hex");

        const sigBuf = Buffer.from(signature || "", "hex");
        const expBuf = Buffer.from(expectedTokenSig, "hex");
        if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
            return { success: false, error: "Firma de seguridad inválida. Petición rechazada." };
        }

        // 4. Verificar hash de integridad de los datos enviados por el cliente
        const expectedPayloadHash = computeCanonicalPayloadHash({
            nonce,
            timestamp,
            cliente_id: String(order.cliente_id || "anonimo"),
            cliente_nombre: String(order.cliente_nombre || ""),
            tipo_entrega: String(order.tipo_entrega || "takeaway"),
            items: Array.isArray(order.items)
                ? order.items.map((i) => ({
                      food_id: String(i.food_id || ""),
                      cantidad: Number(i.cantidad || 1),
                  }))
                : [],
        });

        if (payloadHash !== expectedPayloadHash) {
            return {
                success: false,
                error: "Los datos del pedido fueron alterados durante el envío.",
            };
        }

        // Consumir nonce
        usedNonces.set(nonce, now + TOKEN_TTL_MS);

        // 5. Validar y sanitizar datos del cliente y productos
        const clienteNombre = sanitizeText(order.cliente_nombre, 80);
        if (!clienteNombre) {
            return { success: false, error: "El nombre del cliente es obligatorio." };
        }

        if (!Array.isArray(order.items) || order.items.length === 0) {
            return { success: false, error: "El pedido no contiene productos." };
        }

        // 6. Consultar catálogo oficial en el servidor para verificar precios reales, plan e identificadores del comercio
        const {
            foods: officialFoods,
            resolvedUserId,
            resolvedMenuId,
            resolvedName,
            resolvedPlan,
        } = await fetchOfficialMenuFoods({
            userId: order.user_id || order.cliente_id,
            businessName: order.negocio_nombre,
        });

        // Las cuentas Free no pueden guardar comandas (solo Plus y Premium)
        const cookieStore = await cookies();
        let cookiePlan: string | undefined;
        try {
            const rawUser = cookieStore.get("user")?.value;
            if (rawUser) {
                const parsed = JSON.parse(rawUser);
                if (parsed?.plan) cookiePlan = String(parsed.plan).toLowerCase();
            }
        } catch {
            cookiePlan = undefined;
        }
        const effectivePlan = resolvedPlan || cookiePlan;
        const isExample = String(order.user_id || order.cliente_id || "") === "ejemplo";
        if (!isExample && effectivePlan && effectivePlan !== "plus" && effectivePlan !== "premium") {
            return {
                success: false,
                error: "Las comandas solo están disponibles para cuentas Plus y Premium.",
                blockedByPlan: true,
            };
        }

        const officialFoodsMap = new Map<string, any>();
        for (const f of officialFoods) {
            if (f && f._id != null) {
                officialFoodsMap.set(String(f._id), f);
            }
        }

        const verifiedItems: OrderItemPayload[] = [];
        for (const rawItem of order.items.slice(0, 50)) {
            const foodId = sanitizeText(String(rawItem.food_id || ""), 64);
            const qty = Math.max(1, Math.min(99, Math.floor(Number(rawItem.cantidad) || 1)));
            const officialFood = officialFoodsMap.get(foodId);

            if (officialFood) {
                // Precio verificado desde el servidor (ignora cualquier manipulación del cliente)
                const officialUnitPrice =
                    officialFood.is_promo && typeof officialFood.promo_price === "number"
                        ? Number(officialFood.promo_price)
                        : Number(officialFood.price || 0);
                verifiedItems.push({
                    food_id: foodId,
                    nombre: sanitizeText(officialFood.name || rawItem.nombre, 120),
                    cantidad: qty,
                    precio_unitario: officialUnitPrice,
                    subtotal: officialUnitPrice * qty,
                });
            } else {
                // Ítem personalizado (creado manualmente por el dueño o menú de ejemplo)
                const safeUnitPrice = Math.max(0, Number(rawItem.precio_unitario) || 0);
                verifiedItems.push({
                    food_id: foodId || `item_${Date.now()}`,
                    nombre: sanitizeText(rawItem.nombre || "Producto", 120),
                    cantidad: qty,
                    precio_unitario: safeUnitPrice,
                    subtotal: safeUnitPrice * qty,
                });
            }
        }

        const verifiedTotal = verifiedItems.reduce((acc, item) => acc + item.subtotal, 0);
        const tipoEntrega = order.tipo_entrega === "delivery" ? "delivery" : "takeaway";

        // 7. Guardar comanda en el almacenamiento persistente del servidor (purgando expiradas >24h)
        const store = await readOrdersStoreAndPurge();
        const nextOrderNumber = store.counter + 1;
        const nowIso = new Date().toISOString();
        const orderId = `ord_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

        const effectiveUserId = String(
            resolvedUserId || order.user_id || order.cliente_id || "anonimo"
        ).trim();
        const effectiveMenuId = String(
            resolvedMenuId || order.menu_id || order.cliente_id || ""
        ).trim();
        const effectiveBizName = sanitizeText(
            resolvedName || order.negocio_nombre || "",
            100
        );

        const verifiedOrder: OrderPayload & { _sig?: string } = {
            id: orderId,
            _id: orderId,
            numero_orden: nextOrderNumber,
            cliente_id: effectiveUserId,
            user_id: effectiveUserId,
            menu_id: effectiveMenuId || undefined,
            negocio_nombre: effectiveBizName || undefined,
            cliente_nombre: clienteNombre,
            nota: order.nota ? sanitizeText(order.nota, 200) : undefined,
            items: verifiedItems,
            total: verifiedTotal,
            tipo_entrega: tipoEntrega,
            ...(tipoEntrega === "delivery" && order.envio
                ? {
                      envio: {
                          lat: Number(order.envio.lat) || 0,
                          lng: Number(order.envio.lng) || 0,
                          direccion_texto: sanitizeText(order.envio.direccion_texto, 200),
                          referencia: order.envio.referencia
                              ? sanitizeText(order.envio.referencia, 160)
                              : undefined,
                      },
                  }
                : {}),
            estado: "pendiente",
            createdAt: nowIso,
            updatedAt: nowIso,
        };

        verifiedOrder._sig = signOrderRecord(verifiedOrder);

        store.counter = nextOrderNumber;
        store.orders.unshift(verifiedOrder);
        // Mantener hasta 1000 órdenes recientes en el archivo del servidor
        if (store.orders.length > 1000) {
            store.orders = store.orders.slice(0, 1000);
        }
        await writeOrdersStore(store);

        const { _sig, ...cleanOrder } = verifiedOrder;
        return { success: true, order: cleanOrder };
    } catch (error) {
        console.error("Error procesando comanda en el servidor:", error);
        return { success: false, error: "Error interno al registrar el pedido." };
    }
}

/**
 * Obtiene la identidad autenticada del dueño del negocio desde las cookies HttpOnly del servidor.
 */
async function getAuthenticatedBusinessIdentifiers(
    clientHints?: OrderFilterIdentifiers
): Promise<OrderFilterIdentifiers | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const rawUser = cookieStore.get("user")?.value;
    const rawMenu = cookieStore.get("menu")?.value;

    let parsedUser: Record<string, any> | null = null;
    let parsedMenu: Record<string, any> | null = null;

    try {
        if (rawUser) parsedUser = JSON.parse(rawUser);
    } catch {
        parsedUser = null;
    }
    try {
        if (rawMenu) parsedMenu = JSON.parse(rawMenu);
    } catch {
        parsedMenu = null;
    }

    if (!token && !parsedUser && !clientHints?.userId) {
        return null;
    }

    const userId = String(
        parsedUser?.id || parsedUser?._id || parsedMenu?.user_id || clientHints?.userId || ""
    ).trim();
    const menuId = String(parsedMenu?._id || parsedMenu?.id || clientHints?.menuId || "").trim();
    const businessName = String(
        parsedMenu?.name || parsedUser?.name || clientHints?.businessName || ""
    ).trim();

    const extraIds = new Set<string>();
    if (userId) extraIds.add(userId);
    if (menuId) extraIds.add(menuId);
    if (clientHints?.userId) extraIds.add(String(clientHints.userId));
    if (clientHints?.menuId) extraIds.add(String(clientHints.menuId));
    if (Array.isArray(clientHints?.extraIds)) {
        for (const id of clientHints.extraIds) {
            if (id) extraIds.add(String(id));
        }
    }

    return {
        userId: userId || undefined,
        menuId: menuId || undefined,
        businessName: businessName || undefined,
        extraIds: Array.from(extraIds),
        plan: parsedUser?.plan ? String(parsedUser.plan).toLowerCase() : undefined,
    } as OrderFilterIdentifiers & { plan?: string };
}

function isPlanBlocked(authIdentifiers: (OrderFilterIdentifiers & { plan?: string }) | null): boolean {
    if (!authIdentifiers) return true;
    return authIdentifiers.plan === "free";
}

function stripInternalFields(order: StoredOrderRecord): OrderPayload {
    const { _sig, _analyticsCounted, ...rest } = order;
    return rest;
}

function matchesAnalyticsRecord(
    record: StoredAnalyticsRecord,
    identifiers: OrderFilterIdentifiers
): boolean {
    const targetIds = new Set(
        [identifiers.userId, identifiers.menuId, ...(identifiers.extraIds || [])]
            .filter(Boolean)
            .map((x) => String(x).trim())
    );
    if (record.userId && targetIds.has(record.userId)) return true;
    if (record.menuId && targetIds.has(record.menuId)) return true;
    const targetSlug = normalizeBusinessSlug(identifiers.businessName);
    const recordSlug = normalizeBusinessSlug(record.businessName);
    if (targetSlug && recordSlug && targetSlug === recordSlug) return true;
    return false;
}

/**
 * Devuelve todas las comandas del negocio autenticado desde el servidor.
 */
export async function getOrdersServerAction(
    clientHints?: OrderFilterIdentifiers
): Promise<OrderPayload[]> {
    const authIdentifiers = await getAuthenticatedBusinessIdentifiers(clientHints);
    if (!authIdentifiers || isPlanBlocked(authIdentifiers)) return [];

    const store = await readOrdersStoreAndPurge();
    const matched = store.orders
        .filter((o) => matchesOrderIdentifiers(o, authIdentifiers))
        .map(stripInternalFields);

    return matched.sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
}

function mergePeriodMaps(
    target: Record<string, PeriodAnalyticsEntry>,
    source?: Record<string, PeriodAnalyticsEntry>
) {
    if (!source) return;
    for (const [periodKey, entry] of Object.entries(source)) {
        const prev = target[periodKey] || {
            pedidos: 0,
            ingresos: 0,
            completados: 0,
            expirados24h: 0,
        };
        prev.pedidos += Number(entry.pedidos || 0);
        prev.ingresos += Number(entry.ingresos || 0);
        prev.completados += Number(entry.completados || 0);
        prev.expirados24h += Number(entry.expirados24h || 0);
        target[periodKey] = prev;
    }
}

/**
 * Devuelve las métricas acumuladas de analítica (total de pedidos, ingresos totales e historial por mes/semana)
 * para el negocio autenticado (Plus y Premium).
 */
export async function getOrderAnalyticsServerAction(
    clientHints?: OrderFilterIdentifiers
): Promise<BusinessOrderAnalytics> {
    const empty: BusinessOrderAnalytics = {
        totalPedidos: 0,
        totalIngresos: 0,
        pedidosCompletados: 0,
        pedidosExpirados24h: 0,
        porMes: {},
        porSemana: {},
    };

    const authIdentifiers = await getAuthenticatedBusinessIdentifiers(clientHints);
    if (!authIdentifiers || isPlanBlocked(authIdentifiers)) return empty;

    const store = await readOrdersStoreAndPurge();
    const aggregated: BusinessOrderAnalytics = {
        totalPedidos: 0,
        totalIngresos: 0,
        pedidosCompletados: 0,
        pedidosExpirados24h: 0,
        porMes: {},
        porSemana: {},
    };

    for (const [key, record] of Object.entries(store.analyticsByBusiness)) {
        const keyId = key.startsWith("uid:") ? key.slice(4) : key.startsWith("mid:") ? key.slice(4) : "";
        const matchesKeyId =
            keyId &&
            (keyId === authIdentifiers.userId ||
                keyId === authIdentifiers.menuId ||
                (authIdentifiers.extraIds || []).includes(keyId));
        if (matchesKeyId || matchesAnalyticsRecord(record, authIdentifiers)) {
            aggregated.totalPedidos += Number(record.totalPedidos || 0);
            aggregated.totalIngresos += Number(record.totalIngresos || 0);
            aggregated.pedidosCompletados += Number(record.pedidosCompletados || 0);
            aggregated.pedidosExpirados24h += Number(record.pedidosExpirados24h || 0);
            mergePeriodMaps(aggregated.porMes, record.porMes);
            mergePeriodMaps(aggregated.porSemana, record.porSemana);
            if (!aggregated.updatedAt || (record.updatedAt && record.updatedAt > aggregated.updatedAt)) {
                aggregated.updatedAt = record.updatedAt;
            }
        }
    }

    return aggregated;
}

/**
 * Limpia todos los registros históricos de analíticas del negocio autenticado.
 */
export async function clearOrderAnalyticsServerAction(
    clientHints?: OrderFilterIdentifiers
): Promise<BusinessOrderAnalytics> {
    const empty: BusinessOrderAnalytics = {
        totalPedidos: 0,
        totalIngresos: 0,
        pedidosCompletados: 0,
        pedidosExpirados24h: 0,
        porMes: {},
        porSemana: {},
    };

    const authIdentifiers = await getAuthenticatedBusinessIdentifiers(clientHints);
    if (!authIdentifiers || isPlanBlocked(authIdentifiers)) return empty;

    const store = await readOrdersStoreAndPurge();
    let removedAny = false;

    for (const [key, record] of Object.entries(store.analyticsByBusiness)) {
        const keyId = key.startsWith("uid:") ? key.slice(4) : key.startsWith("mid:") ? key.slice(4) : "";
        const matchesKeyId =
            keyId &&
            (keyId === authIdentifiers.userId ||
                keyId === authIdentifiers.menuId ||
                (authIdentifiers.extraIds || []).includes(keyId));
        if (matchesKeyId || matchesAnalyticsRecord(record, authIdentifiers)) {
            delete store.analyticsByBusiness[key];
            removedAny = true;
        }
    }

    if (removedAny) {
        await writeOrdersStore(store);
    }

    return empty;
}

/**
 * Actualiza el estado de una comanda en el servidor verificando que pertenezca al negocio autenticado.
 */
export async function updateOrderStatusServerAction(
    orderId: string,
    nuevoEstado: OrderStatus,
    clientHints?: OrderFilterIdentifiers
): Promise<{ success: boolean; orders: OrderPayload[] }> {
    const authIdentifiers = await getAuthenticatedBusinessIdentifiers(clientHints);
    if (!authIdentifiers || isPlanBlocked(authIdentifiers)) return { success: false, orders: [] };

    const validStates: OrderStatus[] = ["pendiente", "en_proceso", "enviado_cobrado"];
    const safeStatus: OrderStatus = validStates.includes(nuevoEstado) ? nuevoEstado : "pendiente";

    const store = await readOrdersStoreAndPurge();
    let updatedAny = false;
    const nowIso = new Date().toISOString();

    store.orders = store.orders.map((order) => {
        const matchesId = order.id === orderId || order._id === orderId;
        if (matchesId && matchesOrderIdentifiers(order, authIdentifiers)) {
            updatedAny = true;
            const updatedOrder: StoredOrderRecord = {
                ...order,
                estado: safeStatus,
                updatedAt: nowIso,
            };
            if (safeStatus === "enviado_cobrado") {
                recordOrderInAnalytics(store, updatedOrder, "completed");
            }
            updatedOrder._sig = signOrderRecord(updatedOrder);
            return updatedOrder;
        }
        return order;
    });

    if (updatedAny) {
        await writeOrdersStore(store);
    }

    const currentOrders = store.orders
        .filter((o) => matchesOrderIdentifiers(o, authIdentifiers))
        .map(stripInternalFields);

    return { success: updatedAny, orders: currentOrders };
}

/**
 * Elimina una comanda del servidor verificando pertenencia al negocio autenticado.
 */
export async function deleteOrderServerAction(
    orderId: string,
    clientHints?: OrderFilterIdentifiers
): Promise<{ success: boolean; orders: OrderPayload[] }> {
    const authIdentifiers = await getAuthenticatedBusinessIdentifiers(clientHints);
    if (!authIdentifiers || isPlanBlocked(authIdentifiers)) return { success: false, orders: [] };

    const store = await readOrdersStoreAndPurge();
    const beforeCount = store.orders.length;

    store.orders = store.orders.filter((order) => {
        const matchesId = order.id === orderId || order._id === orderId;
        if (matchesId && matchesOrderIdentifiers(order, authIdentifiers)) {
            return false;
        }
        return true;
    });

    if (store.orders.length !== beforeCount) {
        await writeOrdersStore(store);
    }

    const currentOrders = store.orders
        .filter((o) => matchesOrderIdentifiers(o, authIdentifiers))
        .map(stripInternalFields);

    return { success: true, orders: currentOrders };
}

/**
 * Limpia todas las comandas en estado "enviado_cobrado" del negocio autenticado.
 */
export async function clearCompletedOrdersServerAction(
    clientHints?: OrderFilterIdentifiers
): Promise<{ success: boolean; orders: OrderPayload[] }> {
    const authIdentifiers = await getAuthenticatedBusinessIdentifiers(clientHints);
    if (!authIdentifiers || isPlanBlocked(authIdentifiers)) return { success: false, orders: [] };

    const store = await readOrdersStoreAndPurge();
    store.orders = store.orders.filter(
        (order) =>
            !(
                matchesOrderIdentifiers(order, authIdentifiers) &&
                order.estado === "enviado_cobrado"
            )
    );

    await writeOrdersStore(store);

    const currentOrders = store.orders
        .filter((o) => matchesOrderIdentifiers(o, authIdentifiers))
        .map(stripInternalFields);

    return { success: true, orders: currentOrders };
}

