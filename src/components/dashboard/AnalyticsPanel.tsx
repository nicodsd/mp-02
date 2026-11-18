"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    BusinessOrderAnalytics,
    OrderPayload,
    clearOrderAnalytics,
    fetchOrderAnalyticsForBusiness,
    fetchOrdersForBusiness,
    getLocalOrderAnalytics,
    getLocalOrders,
    subscribeToOrders,
} from "@/src/utils/orders";
import { useFoodStore } from "@/src/lib/useFoodStore";
import { FaSyncAlt, FaShoppingBag, FaDollarSign, FaCheckCircle, FaClock, FaTrashAlt, FaCalendarAlt } from "react-icons/fa";
import { HiOutlineChartBar } from "react-icons/hi";

const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
});

const MONTH_NAMES_ES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function formatMonthLabel(monthKey: string): string {
    const [year, month] = monthKey.split("-");
    const monthIndex = Number(month) - 1;
    const monthName = MONTH_NAMES_ES[monthIndex] || month;
    return `${monthName} ${year}`;
}

function formatWeekLabel(weekKey: string): string {
    const match = /^(\d{4})-W(\d{2})$/.exec(weekKey);
    if (!match) return weekKey;
    return `Semana ${Number(match[2])} • ${match[1]}`;
}

export default function AnalyticsPanel({ user: initialUser }: { user: any }) {
    const { user: storeUser, menus: storeMenus } = useFoodStore();
    const user =
        storeUser && storeUser.id === initialUser?.id
            ? { ...initialUser, ...storeUser }
            : initialUser;

    const canUseAnalytics = user?.plan === "plus" || user?.plan === "premium";

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

    const [analytics, setAnalytics] = useState<BusinessOrderAnalytics>({
        totalPedidos: 0,
        totalIngresos: 0,
        pedidosCompletados: 0,
        pedidosExpirados24h: 0,
        porMes: {},
        porSemana: {},
    });
    const [activeOrders, setActiveOrders] = useState<OrderPayload[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [historyView, setHistoryView] = useState<"month" | "week">("month");

    const loadAnalytics = useCallback(
        async (syncWithBackend = false) => {
            if (!canUseAnalytics) return;

            setAnalytics(getLocalOrderAnalytics(identifiers));
            setActiveOrders(getLocalOrders(identifiers));

            if (syncWithBackend) {
                setIsRefreshing(true);
                try {
                    const [syncedAnalytics, syncedOrders] = await Promise.all([
                        fetchOrderAnalyticsForBusiness(identifiers),
                        fetchOrdersForBusiness(identifiers),
                    ]);
                    setAnalytics(syncedAnalytics);
                    setActiveOrders(syncedOrders);
                } finally {
                    setIsRefreshing(false);
                }
            }
        },
        [canUseAnalytics, identifiers]
    );

    useEffect(() => {
        if (!canUseAnalytics) return;
        void loadAnalytics(true);
        const unsubscribe = subscribeToOrders(() => {
            void loadAnalytics(true);
        });
        return () => unsubscribe();
    }, [canUseAnalytics, loadAnalytics]);

    const handleClearRecords = async () => {
        if (!canUseAnalytics || isClearing) return;
        const confirmed = window.confirm(
            "¿Estás seguro de que deseas limpiar todos los registros históricos de pedidos e ingresos? Esta acción no se puede deshacer."
        );
        if (!confirmed) return;

        setIsClearing(true);
        try {
            const cleared = await clearOrderAnalytics(identifiers);
            setAnalytics(cleared);
        } finally {
            setIsClearing(false);
        }
    };

    const monthlyEntries = useMemo(
        () =>
            Object.entries(analytics.porMes || {}).sort(([a], [b]) => b.localeCompare(a)),
        [analytics.porMes]
    );

    const weeklyEntries = useMemo(
        () =>
            Object.entries(analytics.porSemana || {}).sort(([a], [b]) => b.localeCompare(a)),
        [analytics.porSemana]
    );

    const activeHistoryEntries = historyView === "month" ? monthlyEntries : weeklyEntries;

    const averageTicket =
        analytics.totalPedidos > 0
            ? Math.round(analytics.totalIngresos / analytics.totalPedidos)
            : 0;

    const waitingCount = activeOrders.filter((o) => o.estado === "pendiente").length;
    const processingCount = activeOrders.filter((o) => o.estado === "en_proceso").length;
    const completedActiveCount = activeOrders.filter((o) => o.estado === "enviado_cobrado").length;

    return (
        <div className="p-3 flex flex-col gap-5 w-full pb-24">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-800">Analíticas</h1>
                    <p className="text-gray-500 text-sm">
                        Resumen acumulado de pedidos e ingresos totales de tu negocio.
                    </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => loadAnalytics(true)}
                        disabled={isRefreshing || !canUseAnalytics}
                        className="px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                        <FaSyncAlt className={isRefreshing ? "animate-spin" : ""} size={12} />
                        <span>Actualizar</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleClearRecords}
                        disabled={
                            isClearing ||
                            !canUseAnalytics ||
                            (analytics.totalPedidos === 0 && analytics.totalIngresos === 0)
                        }
                        className="px-3.5 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <FaTrashAlt size={12} />
                        <span>{isClearing ? "Limpiando..." : "Limpiar registros"}</span>
                    </button>
                </div>
            </header>

            {/* Métricas principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
                <div className="bg-black text-white rounded-2xl p-3 flex flex-col justify-between gap-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                            Contador de pedidos
                        </span>
                        <FaShoppingBag className="text-gray-300" size={18} />
                    </div>
                    <div>
                        <p className="text-4xl font-semibold leading-none">
                            {analytics.totalPedidos}
                        </p>
                        <p className="text-xs text-gray-400 mt-1.5">
                            Total histórico registrado
                        </p>
                    </div>
                </div>

                <div className="bg-green-600 text-white rounded-2xl p-3 flex flex-col justify-between gap-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-green-100">
                            Ingresos totales
                        </span>
                        <FaDollarSign className="text-green-100" size={18} />
                    </div>
                    <div>
                        <p className="text-3xl sm:text-4xl font-extrabold leading-none">
                            {priceFormatter.format(analytics.totalIngresos)}
                        </p>
                        <p className="text-xs text-green-100 mt-1.5">
                            Acumulado histórico
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-3 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            Ticket promedio
                        </span>
                        <HiOutlineChartBar className="text-gray-400" size={20} />
                    </div>
                    <div>
                        <p className="text-3xl font-extrabold text-gray-900 leading-none">
                            {priceFormatter.format(averageTicket)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1.5">
                            Promedio por pedido
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-3 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            Origen de registros
                        </span>
                        <FaCheckCircle className="text-green-600" size={18} />
                    </div>
                    <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Completados:</span>
                            <span className="font-bold text-gray-900">{analytics.pedidosCompletados}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Expirados (+24h):</span>
                            <span className="font-bold text-amber-600">{analytics.pedidosExpirados24h}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estado actual en tablero de comandas */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-gray-800">Estado actual de comandas activas</h2>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                        <FaClock size={12} />
                        Lista de espera expira a las 24h
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl bg-red-50 border border-red-100 p-3.5">
                        <p className="text-xs font-bold uppercase text-red-700">En espera (&lt; 24h)</p>
                        <p className="text-2xl font-extrabold text-red-900 mt-1">{waitingCount}</p>
                    </div>
                    <div className="rounded-xl bg-amber-50 border border-amber-100 p-3.5">
                        <p className="text-xs font-bold uppercase text-amber-700">En proceso</p>
                        <p className="text-2xl font-extrabold text-amber-900 mt-1">{processingCount}</p>
                    </div>
                    <div className="rounded-xl bg-green-50 border border-green-100 p-3.5">
                        <p className="text-xs font-bold uppercase text-green-700">Enviados y cobrados (en tablero)</p>
                        <p className="text-2xl font-extrabold text-green-900 mt-1">{completedActiveCount}</p>
                    </div>
                </div>

                <p className="text-xs text-gray-500">
                    Las comandas que permanecen en la lista de espera durante más de 24 horas se eliminan automáticamente del tablero y se suman al contador de pedidos y al total de ingresos de esta sección.
                </p>
            </div>

            {/* Registro histórico por meses y semanas */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-700" size={16} />
                        <h2 className="text-base font-bold text-gray-800">
                            Registro histórico por período
                        </h2>
                    </div>

                    <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
                        <button
                            type="button"
                            onClick={() => setHistoryView("month")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${historyView === "month"
                                ? "bg-black text-white shadow-xs"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Por Meses
                        </button>
                        <button
                            type="button"
                            onClick={() => setHistoryView("week")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${historyView === "week"
                                ? "bg-black text-white shadow-xs"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Por Semanas
                        </button>
                    </div>
                </div>

                {activeHistoryEntries.length === 0 ? (
                    <div className="text-center py-8 text-sm text-gray-400">
                        Aún no hay registros históricos {historyView === "month" ? "mensuales" : "semanales"}.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {activeHistoryEntries.map(([periodKey, stats]) => (
                            <div
                                key={periodKey}
                                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">
                                        {historyView === "month"
                                            ? formatMonthLabel(periodKey)
                                            : formatWeekLabel(periodKey)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {stats.completados} completados • {stats.expirados24h} expirados (+24h)
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-bold bg-gray-100 text-gray-800 px-2.5 py-1 rounded-lg">
                                        {stats.pedidos} {stats.pedidos === 1 ? "pedido" : "pedidos"}
                                    </span>
                                    <span className="text-base font-extrabold text-green-700 min-w-24 text-right">
                                        {priceFormatter.format(stats.ingresos)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
