"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    OrderPayload,
    OrderStatus,
    OrderItemPayload,
    getLocalOrders,
    fetchOrdersForBusiness,
    updateOrderStatus,
    deleteOrderById,
    clearCompletedOrders,
    submitOrderToBackend,
    subscribeToOrders,
} from "@/src/utils/orders";
import { useFoodStore } from "@/src/lib/useFoodStore";
import {
    FaWhatsapp,
    FaUser,
    FaMapMarkerAlt,
    FaStore,
    FaMotorcycle,
    FaClock,
    FaArrowRight,
    FaArrowLeft,
    FaCheckCircle,
    FaTrashAlt,
    FaPlus,
    FaMinus,
    FaSyncAlt,
    FaSearch,
    FaExternalLinkAlt,
    FaRegCommentDots,
} from "react-icons/fa";
import { HiOutlineClipboardCheck, HiOutlineFire, HiOutlineClock } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
});

function formatOrderTime(isoString?: string): string {
    if (!isoString) return "Reciente";
    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return "Reciente";
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const timeStr = date.toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
        });

        if (diffMins < 1) return `Recién • ${timeStr}`;
        if (diffMins < 60) return `Hace ${diffMins} min • ${timeStr}`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `Hace ${diffHours}h • ${timeStr}`;
        return `${date.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })} • ${timeStr}`;
    } catch {
        return "Reciente";
    }
}

export default function ComandasPanel({ user: initialUser }: { user: any }) {
    const { user: storeUser, foods: storeFoods, menus: storeMenus } = useFoodStore();
    const user =
        storeUser && storeUser.id === initialUser?.id
            ? { ...initialUser, ...storeUser }
            : initialUser;

    const identifiers = useMemo(() => {
        const extra = new Set<string>();
        if (user?.id) extra.add(String(user.id));
        if (user?._id) extra.add(String(user._id));
        if (user?.user_id) extra.add(String(user.user_id));
        for (const m of storeMenus || []) {
            if (m?._id) extra.add(String(m._id));
            if (m?.user_id) extra.add(String(m.user_id));
        }
        return {
            userId: String(user?.id || user?.user_id || ""),
            menuId: user?._id ? String(user._id) : undefined,
            businessName: user?.name ? String(user.name) : undefined,
            extraIds: Array.from(extra),
        };
    }, [user?.id, user?.user_id, user?._id, user?.name, storeMenus]);

    const [orders, setOrders] = useState<OrderPayload[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [deliveryFilter, setDeliveryFilter] = useState<"all" | "delivery" | "takeaway">("all");
    const [activeMobileTab, setActiveMobileTab] = useState<OrderStatus>("pendiente");

    // Estado para modal de nueva comanda manual / prueba
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [manualClientName, setManualClientName] = useState("");
    const [manualDeliveryType, setManualDeliveryType] = useState<"takeaway" | "delivery">("takeaway");
    const [manualAddress, setManualAddress] = useState("");
    const [manualNote, setManualNote] = useState("");
    const [manualQuantities, setManualQuantities] = useState<Record<string, number>>({});
    const [customItemName, setCustomItemName] = useState("");
    const [customItemPrice, setCustomItemPrice] = useState("");
    const [customItems, setCustomItems] = useState<OrderItemPayload[]>([]);

    const loadOrders = useCallback(
        async (syncWithBackend = false) => {
            const local = getLocalOrders(identifiers);
            setOrders(local);

            if (syncWithBackend) {
                setIsRefreshing(true);
                try {
                    const synced = await fetchOrdersForBusiness(identifiers);
                    setOrders(synced);
                } finally {
                    setIsRefreshing(false);
                }
            }
        },
        [identifiers]
    );

    useEffect(() => {
        void loadOrders(true);
        const unsubscribe = subscribeToOrders(() => {
            setOrders(getLocalOrders(identifiers));
        });

        // Sincronización periódica con el servidor para recibir pedidos de clientes desde cualquier dispositivo
        const interval = setInterval(() => {
            if (typeof document !== "undefined" && document.visibilityState === "visible") {
                void fetchOrdersForBusiness(identifiers).then((synced) => {
                    setOrders(synced);
                });
            }
        }, 5000);

        const handleFocus = () => {
            void loadOrders(true);
        };
        window.addEventListener("focus", handleFocus);

        return () => {
            unsubscribe();
            clearInterval(interval);
            window.removeEventListener("focus", handleFocus);
        };
    }, [identifiers, loadOrders]);

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            if (deliveryFilter !== "all" && order.tipo_entrega !== deliveryFilter) {
                return false;
            }
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase().trim();
            const matchesName = (order.cliente_nombre || "").toLowerCase().includes(q);
            const matchesNumber = String(order.numero_orden || "").includes(q);
            const matchesItems = order.items?.some((item) =>
                item.nombre.toLowerCase().includes(q)
            );
            const matchesAddress = (order.envio?.direccion_texto || "")
                .toLowerCase()
                .includes(q);
            return matchesName || matchesNumber || matchesItems || matchesAddress;
        });
    }, [orders, deliveryFilter, searchQuery]);

    const waitingOrders = useMemo(
        () => filteredOrders.filter((o) => o.estado === "pendiente"),
        [filteredOrders]
    );
    const processingOrders = useMemo(
        () => filteredOrders.filter((o) => o.estado === "en_proceso"),
        [filteredOrders]
    );
    const completedOrders = useMemo(
        () => filteredOrders.filter((o) => o.estado === "enviado_cobrado"),
        [filteredOrders]
    );

    const totalRevenueCollected = useMemo(
        () => completedOrders.reduce((acc, o) => acc + Number(o.total || 0), 0),
        [completedOrders]
    );

    const handleMoveStatus = async (orderId: string, nextStatus: OrderStatus) => {
        await updateOrderStatus(orderId, nextStatus, identifiers);
        setOrders(getLocalOrders(identifiers));
    };

    const handleDeleteOrder = async (orderId: string) => {
        await deleteOrderById(orderId, identifiers);
        setOrders(getLocalOrders(identifiers));
    };

    const handleClearCompleted = async () => {
        if (completedOrders.length === 0) return;
        await clearCompletedOrders(identifiers);
        setOrders(getLocalOrders(identifiers));
    };

    // Helpers para crear comanda manual desde el panel
    const availableFoods = useMemo(
        () => (storeFoods || []).filter((f: any) => !f.is_archived),
        [storeFoods]
    );

    const handleAddCustomItem = () => {
        if (!customItemName.trim()) return;
        const priceNum = Number(customItemPrice) || 0;
        setCustomItems((prev) => [
            ...prev,
            {
                food_id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
                nombre: customItemName.trim(),
                cantidad: 1,
                precio_unitario: priceNum,
                subtotal: priceNum,
            },
        ]);
        setCustomItemName("");
        setCustomItemPrice("");
    };

    const handleCreateManualOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualClientName.trim()) {
            alert("Ingresa el nombre del cliente para identificar la comanda.");
            return;
        }

        const selectedFromMenu: OrderItemPayload[] = availableFoods
            .filter((f: any) => (manualQuantities[f._id] || 0) > 0)
            .map((f: any) => {
                const qty = manualQuantities[f._id];
                const unitPrice =
                    f.is_promo && typeof f.promo_price === "number"
                        ? Number(f.promo_price)
                        : Number(f.price || 0);
                return {
                    food_id: String(f._id),
                    nombre: f.name,
                    cantidad: qty,
                    precio_unitario: unitPrice,
                    subtotal: unitPrice * qty,
                };
            });

        const allItems = [...selectedFromMenu, ...customItems];
        if (allItems.length === 0) {
            alert("Agrega al menos un plato o producto a la comanda.");
            return;
        }

        const total = allItems.reduce((acc, item) => acc + item.subtotal, 0);

        const newOrder: OrderPayload = {
            cliente_id: identifiers.userId || "anonimo",
            user_id: identifiers.userId || "anonimo",
            menu_id: identifiers.menuId,
            negocio_nombre: identifiers.businessName,
            cliente_nombre: manualClientName.trim(),
            nota: manualNote.trim() || undefined,
            items: allItems,
            total,
            tipo_entrega: manualDeliveryType,
            ...(manualDeliveryType === "delivery" && manualAddress.trim()
                ? {
                    envio: {
                        lat: 0,
                        lng: 0,
                        direccion_texto: manualAddress.trim(),
                        referencia: manualNote.trim() || undefined,
                    },
                }
                : {}),
            estado: "pendiente",
        };

        await submitOrderToBackend(newOrder);
        await loadOrders(true);
        setManualClientName("");
        setManualAddress("");
        setManualNote("");
        setManualQuantities({});
        setCustomItems([]);
        setIsNewModalOpen(false);
    };

    const renderOrderCard = (order: OrderPayload) => {
        const orderKey = String(order.id || order._id);
        const isDelivery = order.tipo_entrega === "delivery";
        const hasValidCoords =
            order.envio &&
            typeof order.envio.lat === "number" &&
            typeof order.envio.lng === "number" &&
            (order.envio.lat !== 0 || order.envio.lng !== 0);

        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                key={orderKey}
                className="bg-white rounded-2xl border border-black hover:shadow-md transition-shadow p-2 flex flex-col gap-3 md:gap-2"
            >
                {/* Contenedor principal: Azul para Envío, Amber para Retiro */}
                <div className={`${isDelivery ? "bg-blue-700" : "bg-amber-500"} rounded-xl md:px-3 p-3 text-md flex flex-col gap-3`}>

                    <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${isDelivery ? "bg-white text-black" : "bg-white text-black"}`}>
                            <span className={`text-md font-black tracking-wide`}>
                                #{order.numero_orden || orderKey.slice(-4).toUpperCase()}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-black">
                                <FaClock className="text-black" size={11} />
                                {formatOrderTime(order.createdAt)}
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <span className="inline-flex items-center text-white">
                                <FaWhatsapp size={22} />
                            </span>
                            <button
                                type="button"
                                onClick={() => handleDeleteOrder(orderKey)}
                                title="Eliminar comanda"
                                className="p-1.5 text-white hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            >
                                <FaTrashAlt size={15} />
                            </button>
                        </div>
                    </div>

                    {/* Solo muestra sección de dirección si es un envío */}
                    {isDelivery && order.envio?.direccion_texto && (
                        <div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-white flex items-center gap-1.5">
                                    <FaMapMarkerAlt className="text-white shrink-0" size={20} />
                                    <span>{order.envio.direccion_texto}</span>
                                </span>
                                {hasValidCoords && (
                                    <a
                                        href={`https://www.google.com/maps?q=${order.envio.lat},${order.envio.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:underline font-bold inline-flex items-center gap-1 shrink-0 text-[11px]"
                                    >
                                        Mapa <FaExternalLinkAlt size={10} />
                                    </a>
                                )}
                            </div>
                            {order.envio.referencia && (
                                <p className="text-gray-100 italic text-sm">
                                    Ref: {order.envio.referencia}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="min-w-0">
                                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-200 leading-none">
                                    Para:
                                </p>
                                <h4 className="text-white font-semibold text-lg lg:text-xl truncate">
                                    {order.cliente_nombre || "Cliente sin nombre"}
                                </h4>
                            </div>
                        </div>

                        {/* Etiqueta de tipo de entrega */}
                        <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${isDelivery ? "bg-white text-blue-700" : "bg-white text-amber-700"
                                }`}
                        >
                            {isDelivery ? (
                                <>
                                    <FaMotorcycle size={13} /> Envío
                                </>
                            ) : (
                                <>
                                    <FaStore size={12} /> Retiro
                                </>
                            )}
                        </span>
                    </div>
                </div>

                {!isDelivery && order.nota && (
                    <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-2 text-xs text-amber-900 flex items-start gap-1.5">
                        <FaRegCommentDots className="mt-0.5 shrink-0 text-amber-600" size={12} />
                        <span>
                            <strong>Nota:</strong> {order.nota}
                        </span>
                    </div>
                )}

                {/* Detalle de lo que pide */}
                <div className="flex flex-col gap-2 p-2 md:px-3 md:py-0">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400">
                        Detalle del pedido ({order.items.reduce((a, b) => a + b.cantidad, 0)} ítems)
                    </span>
                    <ul className="divide-y divide-gray-200/60">
                        {order.items.map((item, idx) => (
                            <li
                                key={`${item.food_id}_${idx}`}
                                className="py-0.5 first:pt-0.5 last:pb-0 flex items-center justify-between gap-2 text-lg"
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    {/* Cantidad del ítem */}
                                    <span className={`text-base font-extrabold px-1 rounded-md shrink-0 ${isDelivery ? "bg-blue-700 text-white" : "bg-amber-500 text-white"
                                        }`}>
                                        {item.cantidad}x
                                    </span>
                                    <span className="font-semibold text-black truncate">
                                        {item.nombre}
                                    </span>
                                </div>
                                <span className="text-xs font-bold text-gray-600 shrink-0">
                                    {priceFormatter.format(item.subtotal)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Total y Botones de cambio de estado */}
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col gap-2.5 pt-1">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-xs font-bold text-black uppercase">Total comanda</span>
                            <span className="text-3xl lg:text-2xl font-bold text-gray-900">
                                {priceFormatter.format(order.total)}
                            </span>
                        </div>

                        {order.estado === "pendiente" && (
                            <button
                                type="button"
                                onClick={() => handleMoveStatus(orderKey, "en_proceso")}
                                className="w-full py-2.5 px-4 rounded-xl bg-black hover:bg-amber-600 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
                            >
                                <span>Pasar a En Proceso</span>
                                <FaArrowRight size={12} />
                            </button>
                        )}

                        {order.estado === "en_proceso" && (
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleMoveStatus(orderKey, "pendiente")}
                                    title="Devolver a lista de espera"
                                    className="py-2.5 px-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 font-bold text-sm flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                >
                                    <FaArrowLeft size={11} />
                                    <span>Espera</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleMoveStatus(orderKey, "enviado_cobrado")}
                                    className="flex-1 py-2.5 px-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-lg md:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                                >
                                    <FaCheckCircle size={13} />
                                    <span>Enviado y Cobrado</span>
                                </button>
                            </div>
                        )}

                        {order.estado === "enviado_cobrado" && (
                            <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
                                    <FaCheckCircle size={16} /> Entregado y cobrado
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleMoveStatus(orderKey, "en_proceso")}
                                    className="text-xs font-bold text-gray-500 hover:text-gray-800 underline cursor-pointer px-2 py-1"
                                >
                                    Reabrir a En proceso
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="p-3 flex flex-col gap-5 w-full pb-24">
            {/* Encabezado */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-gray-800">Comandas</h1>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Gestiona todos los pedidos enviados por WhatsApp con el nombre del cliente y su detalle.
                    </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => loadOrders(true)}
                        disabled={isRefreshing}
                        className="px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                        <FaSyncAlt className={isRefreshing ? "animate-spin" : ""} size={12} />
                        <span>Actualizar</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsNewModalOpen(true)}
                        className="px-4 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                        <FaPlus size={11} />
                        <span>Nueva comanda</span>
                    </button>
                </div>
            </header>

            {/* Resumen de indicadores */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                <div className="bg-red-700 rounded-2xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl text-white flex items-center justify-center">
                            <HiOutlineClock size={46} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white uppercase">Lista de espera</p>
                            <p className="text-4xl font-semibold leading-none text-white">
                                {waitingOrders.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-amber-500 rounded-2xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl text-white flex items-center justify-center">
                            <HiOutlineFire size={46} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white uppercase">En proceso</p>
                            <p className="text-4xl font-semibold leading-none text-white">
                                {processingOrders.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-green-600 rounded-2xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl text-white flex items-center justify-center">
                            <HiOutlineClipboardCheck size={46} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white uppercase">Enviados y cobrados</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-semibold leading-none text-white">
                                    {completedOrders.length}
                                </p>
                                <span className="text-xs font-extrabold text-white">
                                    ({priceFormatter.format(totalRevenueCollected)})
                                </span>
                            </div>
                        </div>
                    </div>
                    {completedOrders.length > 0 && (
                        <button
                            type="button"
                            onClick={handleClearCompleted}
                            className="text-xs font-bold text-white hover:bg-white px-2.5 py-1 rounded-lg border transition-colors cursor-pointer"
                        >
                            Limpiar
                        </button>
                    )}
                </div>
            </div>

            {/* Buscador y Filtros */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-2.5 rounded-2xl border border-gray-200">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar por nombre del cliente, # de comanda o plato..."
                        className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-black outline-none transition-colors"
                    />
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {[
                        { id: "all", label: "Todos" },
                        { id: "delivery", label: "Envío a domicilio" },
                        { id: "takeaway", label: "Retiro en local" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setDeliveryFilter(tab.id as any)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${deliveryFilter === tab.id
                                ? "bg-black text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                {/* Selector de pestaña en móvil / tablet */}
                <div className="flex lg:hidden p-2 rounded-2xl gap-1">
                    <button
                        type="button"
                        onClick={() => setActiveMobileTab("pendiente")}
                        className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeMobileTab === "pendiente"
                            ? "bg-red-100/30 text-red-900 shadow-xs"
                            : "text-gray-600"
                            }`}
                    >
                        <span>Espera</span>
                        <span className="bg-red-600 text-white px-1.5 py-0.2 rounded-full text-[10px]">
                            {waitingOrders.length}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveMobileTab("en_proceso")}
                        className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeMobileTab === "en_proceso"
                            ? "bg-amber-100 text-amber-900 shadow-xs"
                            : "text-gray-600"
                            }`}
                    >
                        <span>En Proceso</span>
                        <span className="bg-amber-600 text-white px-1.5 py-0.2 rounded-full text-[10px]">
                            {processingOrders.length}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveMobileTab("enviado_cobrado")}
                        className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeMobileTab === "enviado_cobrado"
                            ? "bg-green-100 text-green-900 shadow-xs"
                            : "text-gray-600"
                            }`}
                    >
                        <span>Cobrados</span>
                        <span className="bg-green-700 text-white px-1.5 py-0.2 rounded-full text-[10px]">
                            {completedOrders.length}
                        </span>
                    </button>
                </div>

                {/* Tablero de 3 listas: Lista de espera, Lista en proceso, Lista de enviados y cobrados */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                    {/* 1. LISTA DE ESPERA */}
                    <section
                        className={`flex flex-col bg-red-100/30 border border-gray-200 rounded-2xl p-3 min-h-105 ${activeMobileTab !== "pendiente" ? "hidden lg:flex" : "flex"
                            }`}
                    >
                        <div className="flex items-center justify-between px-1 pb-3 mb-2 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                                <h2 className="font-extrabold text-gray-800 text-lg">Lista de espera</h2>
                            </div>
                            <span className="bg-red-200 text-red-800 text-xs font-black px-2.5 py-0.5 rounded-full">
                                {waitingOrders.length}
                            </span>
                        </div>

                        <div className="flex flex-col gap-3 flex-1">
                            <AnimatePresence mode="popLayout">
                                {waitingOrders.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center text-center py-14 px-4 text-gray-400">
                                        <HiOutlineClock size={36} className="mb-2 opacity-60" />
                                        <p className="text-sm font-bold text-gray-500">
                                            No hay pedidos en espera
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Los pedidos enviados por WhatsApp desde tu menú aparecerán aquí automáticamente.
                                        </p>
                                    </div>
                                ) : (
                                    waitingOrders.map(renderOrderCard)
                                )}
                            </AnimatePresence>
                        </div>
                    </section>

                    {/* 2. LISTA EN PROCESO */}
                    <section
                        className={`flex flex-col bg-amber-100/30 border border-gray-200 rounded-2xl p-3 min-h-105 ${activeMobileTab !== "en_proceso" ? "hidden lg:flex" : "flex"
                            }`}
                    >
                        <div className="flex items-center justify-between px-1 pb-3 mb-2 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                                <h2 className="font-extrabold text-gray-800 text-lg">En proceso</h2>
                            </div>
                            <span className="bg-amber-200 text-amber-800 text-xs font-black px-2.5 py-0.5 rounded-full">
                                {processingOrders.length}
                            </span>
                        </div>

                        <div className="flex flex-col gap-3 flex-1">
                            <AnimatePresence mode="popLayout">
                                {processingOrders.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center text-center py-14 px-4 text-gray-400">
                                        <HiOutlineFire size={36} className="mb-2 opacity-60" />
                                        <p className="text-sm font-bold text-gray-500">
                                            Ninguna comanda en preparación
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Pasa los pedidos desde la lista de espera cuando comiences a prepararlos.
                                        </p>
                                    </div>
                                ) : (
                                    processingOrders.map(renderOrderCard)
                                )}
                            </AnimatePresence>
                        </div>
                    </section>

                    {/* 3. LISTA DE ENVIADOS Y COBRADOS */}
                    <section
                        className={`flex flex-col bg-gray-100/80 border border-gray-200 rounded-2xl p-3 min-h-105 ${activeMobileTab !== "enviado_cobrado" ? "hidden lg:flex" : "flex"
                            }`}
                    >
                        <div className="flex items-center justify-between px-1 pb-3 mb-2 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-700" />
                                <h2 className="font-extrabold text-gray-800 text-lg">
                                    Enviados y cobrados
                                </h2>
                            </div>
                            <span className="bg-green-100 text-green-800 text-xs font-black px-2.5 py-0.5 rounded-full">
                                {completedOrders.length}
                            </span>
                        </div>

                        <div className="flex flex-col gap-3 flex-1">
                            <AnimatePresence mode="popLayout">
                                {completedOrders.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center text-center py-14 px-4 text-gray-400">
                                        <HiOutlineClipboardCheck size={36} className="mb-2 opacity-60" />
                                        <p className="text-sm font-bold text-gray-500">
                                            Sin pedidos finalizados aún
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Aquí se registran los pedidos que ya fueron entregados y cobrados.
                                        </p>
                                    </div>
                                ) : (
                                    completedOrders.map(renderOrderCard)
                                )}
                            </AnimatePresence>
                        </div>
                    </section>
                </div>
            </div>

            {/* Modal para agregar comanda manual / rápida */}
            {isNewModalOpen && (
                <div
                    className="fixed inset-0 z-100 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
                    onClick={() => setIsNewModalOpen(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white w-full sm:max-w-lg max-h-[90dvh] rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                            <div>
                                <h3 className="text-lg font-extrabold text-gray-900">
                                    Registrar Comanda Manual
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Ingresa el nombre del cliente y lo que pidió por WhatsApp o mostrador.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsNewModalOpen(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-600 cursor-pointer"
                            >
                                <IoClose size={22} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleCreateManualOrder}
                            className="flex-1 overflow-y-auto py-4 flex flex-col gap-4 pr-1"
                        >
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    Nombre del cliente *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={manualClientName}
                                    onChange={(e) => setManualClientName(e.target.value)}
                                    placeholder="Ej: María Gómez"
                                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:border-black"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setManualDeliveryType("takeaway")}
                                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 cursor-pointer ${manualDeliveryType === "takeaway"
                                        ? "bg-black text-white border-black"
                                        : "bg-gray-50 text-gray-700 border-gray-200"
                                        }`}
                                >
                                    <FaStore /> Retiro en local
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setManualDeliveryType("delivery")}
                                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 cursor-pointer ${manualDeliveryType === "delivery"
                                        ? "bg-black text-white border-black"
                                        : "bg-gray-50 text-gray-700 border-gray-200"
                                        }`}
                                >
                                    <FaMotorcycle /> Envío a domicilio
                                </button>
                            </div>

                            {manualDeliveryType === "delivery" && (
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">
                                        Dirección de entrega
                                    </label>
                                    <input
                                        type="text"
                                        value={manualAddress}
                                        onChange={(e) => setManualAddress(e.target.value)}
                                        placeholder="Ej: Av. Libertad 1230"
                                        className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:border-black"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    Aclaración / Referencia (Opcional)
                                </label>
                                <input
                                    type="text"
                                    value={manualNote}
                                    onChange={(e) => setManualNote(e.target.value)}
                                    placeholder="Ej: Sin cebolla, abona con transferencia"
                                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:border-black"
                                />
                            </div>

                            {/* Selección rápida de platos del menú */}
                            {availableFoods.length > 0 && (
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-700">
                                        Seleccionar platos de tu menú
                                    </label>
                                    <div className="max-h-44 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100 p-1.5 bg-gray-50">
                                        {availableFoods.map((food: any) => {
                                            const qty = manualQuantities[food._id] || 0;
                                            const unitPrice =
                                                food.is_promo && typeof food.promo_price === "number"
                                                    ? Number(food.promo_price)
                                                    : Number(food.price || 0);
                                            return (
                                                <div
                                                    key={food._id}
                                                    className="flex items-center justify-between py-1.5 px-2 text-xs"
                                                >
                                                    <div className="min-w-0 pr-2">
                                                        <p className="font-bold text-gray-800 truncate">
                                                            {food.name}
                                                        </p>
                                                        <p className="text-gray-500">
                                                            {priceFormatter.format(unitPrice)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setManualQuantities((prev) => ({
                                                                    ...prev,
                                                                    [food._id]: Math.max(
                                                                        0,
                                                                        (prev[food._id] || 0) - 1
                                                                    ),
                                                                }))
                                                            }
                                                            className="w-6 h-6 rounded-md bg-white border border-gray-300 flex items-center justify-center text-gray-700 cursor-pointer"
                                                        >
                                                            <FaMinus size={9} />
                                                        </button>
                                                        <span className="w-4 text-center font-extrabold">
                                                            {qty}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setManualQuantities((prev) => ({
                                                                    ...prev,
                                                                    [food._id]: (prev[food._id] || 0) + 1,
                                                                }))
                                                            }
                                                            className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center cursor-pointer"
                                                        >
                                                            <FaPlus size={9} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* O agregar ítem libre */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-700">
                                    Agregar ítem personalizado
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={customItemName}
                                        onChange={(e) => setCustomItemName(e.target.value)}
                                        placeholder="Ej: Promo 2x1 Burger"
                                        className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-xl outline-none"
                                    />
                                    <input
                                        type="number"
                                        value={customItemPrice}
                                        onChange={(e) => setCustomItemPrice(e.target.value)}
                                        placeholder="Precio $"
                                        className="w-24 px-3 py-2 text-xs border border-gray-300 rounded-xl outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddCustomItem}
                                        className="px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                                    >
                                        +
                                    </button>
                                </div>
                                {customItems.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {customItems.map((ci) => (
                                            <span
                                                key={ci.food_id}
                                                className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-lg"
                                            >
                                                1x {ci.nombre} ({priceFormatter.format(ci.subtotal)})
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setCustomItems((prev) =>
                                                            prev.filter((x) => x.food_id !== ci.food_id)
                                                        )
                                                    }
                                                    className="text-red-500 font-bold cursor-pointer"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsNewModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-green-600 hover:bg-green-700 text-white shadow-sm cursor-pointer"
                                >
                                    Guardar en Lista de Espera
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

