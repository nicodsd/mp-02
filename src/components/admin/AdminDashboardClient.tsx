"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  Utensils,
  Eye,
  Activity,
  Bell,
  Mail,
  Send,
  ExternalLink,
  Radio,
  Clock,
  MapPin,
  Wifi,
  WifiOff,
} from "lucide-react";
import { URI, NEXT_PUBLIC_URL } from "@/src/lib/const";
import type { OnlineUserSnapshot } from "@/src/lib/presenceStore";

interface Metrics {
  users: number;
  menus: number;
  visits: number;
}

interface LogEvent {
  id: string;
  message: string;
  time: string;
  type: "user" | "menu" | "visit" | "online" | "offline";
}

function formatRouteLabel(path: string): string {
  if (!path || path === "/") return "Inicio";
  if (path.startsWith("/mi-menu")) return "Mi Menú";
  if (path.startsWith("/panel-de-usuario")) return "Panel de Usuario";
  if (path.startsWith("/nuevo-plato")) return "Nuevo Plato";
  if (path.startsWith("/admin")) return "Admin Dashboard";
  if (path.startsWith("/pagos")) return "Pagos / Suscripción";
  if (path.startsWith("/menu-digital")) return "Menú Digital";
  if (path.startsWith("/cotizar-menu")) return "Cotizar Menú";
  if (path.startsWith("/contacto")) return "Contacto";
  if (path.startsWith("/guias")) return "Guías";
  return path;
}

function formatDuration(fromMs: number, nowMs: number): string {
  const diffSec = Math.max(0, Math.floor((nowMs - fromMs) / 1000));
  if (diffSec < 60) return `${diffSec}s`;
  const mins = Math.floor(diffSec / 60);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return remMins > 0 ? `${hours}h ${remMins}m` : `${hours}h`;
}

function formatPlanBadge(plan?: string) {
  const normalized = (plan || "free").toLowerCase();
  if (normalized === "premium") {
    return "bg-amber-100 text-amber-800 border-amber-200";
  }
  if (normalized === "plus") {
    return "bg-indigo-100 text-indigo-800 border-indigo-200";
  }
  return "bg-gray-100 text-gray-600 border-gray-200";
}

interface AdminUser {
  email?: string;
  name?: string;
  role?: string;
}

interface DirectoryUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role?: string;
  is_active?: boolean;
}

export default function AdminDashboardClient({ user }: { user: AdminUser }) {
  const [metrics, setMetrics] = useState<Metrics>({
    users: 0,
    menus: 0,
    visits: 0,
  });
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUserSnapshot[]>([]);
  const [isPresenceConnected, setIsPresenceConnected] = useState(false);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  // Tick every 5s to keep live session durations fresh
  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 5_000);
    return () => clearInterval(timer);
  }, []);

  // Backend metrics SSE stream
  useEffect(() => {
    const eventSourceUrl = `${URI}/stream/metrics-stream`;
    const eventSource = new EventSource(eventSourceUrl);

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const now = new Date().toLocaleTimeString();

        switch (data.type) {
          case "INITIAL_METRICS":
            setMetrics({
              users: data.totalUsers || 0,
              menus: data.totalMenus || 0,
              visits: data.totalVisits || 0,
            });
            break;

          case "NEW_USER":
            setMetrics((prev) => ({ ...prev, users: data.totalUsers }));
            setLogs((prev) =>
              [
                {
                  id: `${Date.now()}-${Math.random()}`,
                  message: `Nuevo usuario registrado: ${data.user?.email || "Desconocido"}`,
                  time: now,
                  type: "user" as const,
                },
                ...prev,
              ].slice(0, 50)
            );
            break;

          case "NEW_MENU":
            setMetrics((prev) => ({ ...prev, menus: data.totalMenus }));
            setLogs((prev) =>
              [
                {
                  id: `${Date.now()}-${Math.random()}`,
                  message: `Nuevo menú creado (ID: ${data.menu?._id || "Desconocido"})`,
                  time: now,
                  type: "menu" as const,
                },
                ...prev,
              ].slice(0, 50)
            );
            break;

          case "NEW_VISIT":
            setMetrics((prev) => ({ ...prev, visits: data.totalVisits }));
            setLogs((prev) =>
              [
                {
                  id: `${Date.now()}-${Math.random()}`,
                  message: `Nueva visita desde IP: ${data.visit?.ip || "Desconocida"}`,
                  time: now,
                  type: "visit" as const,
                },
                ...prev,
              ].slice(0, 50)
            );
            break;
        }
      } catch (err) {
        console.error("Error parsing SSE data", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Error", err);
      setIsConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Real-time presence SSE stream for registered online users
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const connect = () => {
      if (cancelled) return;

      eventSource = new EventSource("/api/admin/online-users?stream=1");

      eventSource.onopen = () => {
        if (!cancelled) {
          setIsPresenceConnected(true);
        }
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const now = new Date().toLocaleTimeString();

          if (Array.isArray(data.onlineUsers)) {
            setOnlineUsers(data.onlineUsers);
            setNowMs(Date.now());
          }

          if (data.type === "USER_ONLINE" && data.user) {
            setLogs((prev) =>
              [
                {
                  id: `${Date.now()}-${Math.random()}`,
                  message: `${data.user.name} (${data.user.email}) está online en ${formatRouteLabel(data.user.currentPath)}`,
                  time: now,
                  type: "online" as const,
                },
                ...prev,
              ].slice(0, 50)
            );
          } else if (data.type === "USER_OFFLINE" && data.user) {
            setLogs((prev) =>
              [
                {
                  id: `${Date.now()}-${Math.random()}`,
                  message: `${data.user.name} (${data.user.email}) se desconectó`,
                  time: now,
                  type: "offline" as const,
                },
                ...prev,
              ].slice(0, 50)
            );
          }
        } catch (err) {
          console.error("Error parsing presence SSE data", err);
        }
      };

      eventSource.onerror = () => {
        setIsPresenceConnected(false);
        eventSource?.close();
        if (!cancelled) {
          reconnectTimeout = setTimeout(connect, 3_000);
        }
      };
    };

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      eventSource?.close();
    };
  }, []);

  const activeCount = useMemo(
    () => onlineUsers.filter((u) => u.status === "active").length,
    [onlineUsers]
  );
  const idleCount = onlineUsers.length - activeCount;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Activity className="text-blue-600" size={32} />
            Dashboard en Tiempo Real
          </h1>
          <p className="text-gray-500 mt-1">
            Bienvenido, admin <span className="font-semibold text-gray-700">Nico</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2.5 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isPresenceConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500"
              }`}
            />
            <span className="text-sm font-medium text-gray-600">
              {isPresenceConnected ? "Presencia en Vivo" : "Presencia Desconectada"}
            </span>
          </div>
          <div className="flex items-center gap-2.5 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
              }`}
            />
            <span className="text-sm font-medium text-gray-600">
              {isConnected ? "Conectado al Stream" : "Stream Desconectado"}
            </span>
          </div>
        </div>
      </header>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Usuarios Online"
          value={onlineUsers.length}
          subtitle={
            onlineUsers.length > 0
              ? `${activeCount} operativos${idleCount > 0 ? ` · ${idleCount} en 2° plano` : ""}`
              : "Ninguno conectado ahora"
          }
          icon={<Radio size={28} className="text-emerald-600" />}
          gradient="from-emerald-50 to-emerald-100/60"
          borderColor="border-emerald-200"
          liveDot={onlineUsers.length > 0}
        />
        <MetricCard
          title="Usuarios Totales"
          value={metrics.users}
          icon={<Users size={28} className="text-blue-500" />}
          gradient="from-blue-50 to-blue-100/50"
          borderColor="border-blue-200"
        />
        <MetricCard
          title="Menús Creados"
          value={metrics.menus}
          icon={<Utensils size={28} className="text-orange-500" />}
          gradient="from-orange-50 to-orange-100/50"
          borderColor="border-orange-200"
        />
        <MetricCard
          title="Visitas Registradas"
          value={metrics.visits}
          icon={<Eye size={28} className="text-purple-500" />}
          gradient="from-purple-50 to-purple-100/50"
          borderColor="border-purple-200"
        />
      </div>

      {/* Real-Time Online Registered Users Panel */}
      <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 p-2 rounded-lg">
              <Wifi size={20} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2.5">
                Usuarios Operativos en Tiempo Real
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {onlineUsers.length} online
                </span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Usuarios registrados con sesión activa actualmente en la plataforma
              </p>
            </div>
          </div>
          {onlineUsers.length > 0 && (
            <div className="flex items-center gap-3 text-xs font-medium text-gray-600">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Operativos: {activeCount}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                En 2° plano: {idleCount}
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          {onlineUsers.length === 0 ? (
            <div className="py-10 flex flex-col items-center justify-center text-gray-400">
              <WifiOff size={40} className="mb-3 opacity-30" />
              <p className="text-sm font-medium text-gray-500">
                No hay usuarios registrados conectados en este momento
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Aparecerán automáticamente aquí en cuanto inicien sesión o naveguen en la app.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {onlineUsers.map((onlineUser) => {
                const isSelf =
                  user?.email &&
                  onlineUser.email.toLowerCase() === user.email.toLowerCase();
                const isActive = onlineUser.status === "active";

                return (
                  <div
                    key={onlineUser.userId || onlineUser.email}
                    className={`rounded-xl border p-4 transition-all ${
                      isActive
                        ? "bg-emerald-50/30 border-emerald-200/80 hover:border-emerald-300"
                        : "bg-amber-50/20 border-amber-200/70 hover:border-amber-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              isActive
                                ? "bg-emerald-500 animate-pulse"
                                : "bg-amber-400"
                            }`}
                          />
                          <h3 className="font-semibold text-gray-900 text-sm truncate">
                            {onlineUser.name}
                          </h3>
                          {isSelf && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 shrink-0">
                              Tú
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {onlineUser.email}
                        </p>
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize shrink-0 ${formatPlanBadge(
                          onlineUser.plan
                        )}`}
                      >
                        {onlineUser.plan || "free"}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-600">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="inline-flex items-center gap-1.5 text-gray-700 font-medium truncate"
                          title={onlineUser.currentPath}
                        >
                          <MapPin size={13} className="text-gray-400 shrink-0" />
                          <span className="truncate">
                            {formatRouteLabel(onlineUser.currentPath)}
                          </span>
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${
                            isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isActive ? "Operativo" : "En 2° plano"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-gray-100/80">
                        <span className="inline-flex items-center gap-1.5 text-gray-500">
                          <Clock size={12} className="text-gray-400" />
                          Conectado hace {formatDuration(onlineUser.connectedAt, nowMs)}
                          {onlineUser.tabsCount > 1 && (
                            <span className="text-[11px] text-gray-400">
                              · {onlineUser.tabsCount} pestañas
                            </span>
                          )}
                        </span>
                        {onlineUser.name && (
                          <a
                            href={`${NEXT_PUBLIC_URL}/menu-digital/${encodeURIComponent(
                              onlineUser.name.trim().replace(/\s+/g, "-")
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                            title="Visitar menú"
                          >
                            <span>Menú</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Manager (Left - 2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Mail size={20} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Email Marketing</h2>
          </div>

          <div className="p-6 flex-1 bg-gray-50/30">
            <CampaignManager />
          </div>
        </div>

        {/* Activity Log (Right - 1 Col) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-125">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg">
              <Bell size={20} className="text-gray-700" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Actividad</h2>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Activity size={48} className="mb-4 opacity-20" />
                <p className="text-sm">Esperando nuevos eventos...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors animate-in fade-in slide-in-from-top-2"
                  >
                    <div
                      className={`mt-1 rounded-full p-1.5 ${
                        log.type === "online"
                          ? "bg-emerald-100 text-emerald-600"
                          : log.type === "offline"
                            ? "bg-gray-200 text-gray-600"
                            : log.type === "user"
                              ? "bg-blue-100 text-blue-600"
                              : log.type === "menu"
                                ? "bg-orange-100 text-orange-600"
                                : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {log.type === "online" ? (
                        <Wifi size={14} />
                      ) : log.type === "offline" ? (
                        <WifiOff size={14} />
                      ) : log.type === "user" ? (
                        <Users size={14} />
                      ) : log.type === "menu" ? (
                        <Utensils size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 text-sm font-medium break-words">
                        {log.message}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Users List Area */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="bg-purple-50 p-2 rounded-lg">
            <Users size={20} className="text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Directorio de Usuarios</h2>
        </div>
        <div className="p-6">
          <UsersList onlineUsers={onlineUsers} />
        </div>
      </div>
    </div>
  );
}

function CampaignManager() {
  const [subject, setSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setStatus({ type: "", msg: "" });

    try {
      const res = await fetch(`${URI}/admin/campaigns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, htmlContent }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus({
          type: "success",
          msg: "Campaña encolada exitosamente. Enviando en segundo plano...",
        });
        setSubject("");
        setHtmlContent("");
      } else {
        setStatus({
          type: "error",
          msg: data.message || "Error al encolar la campaña.",
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: "Error de conexión." });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSendCampaign} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Asunto de la Campaña
        </label>
        <input
          required
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Ej: 🚀 ¡Descubre las nuevas funciones de QMenú!"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Contenido HTML
        </label>
        <textarea
          required
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
          placeholder="<h1>Hola, te tenemos una sorpresa...</h1>"
          rows={8}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none bg-white font-mono text-sm"
        />
      </div>

      {status.msg && (
        <div
          className={`p-3 rounded-lg text-sm font-medium ${
            status.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {status.msg}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSending}
          className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <>Enviando a cola...</>
          ) : (
            <>
              <Send size={18} />
              Lanzar Campaña Masiva
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  gradient,
  borderColor,
  liveDot,
}: {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  gradient: string;
  borderColor: string;
  liveDot?: boolean;
}) {
  return (
    <div
      className={`bg-linear-to-br ${gradient} border ${borderColor} rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 font-medium text-sm mb-2 flex items-center gap-2">
            {liveDot && (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            )}
            {title}
          </p>
          <h3 className="text-4xl font-bold text-gray-900 tracking-tight">
            {value.toLocaleString()}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-600 mt-1.5 font-medium">{subtitle}</p>
          )}
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm">{icon}</div>
      </div>
    </div>
  );
}

function UsersList({ onlineUsers }: { onlineUsers: OnlineUserSnapshot[] }) {
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<"all" | "online">("all");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`${URI}/admin/users`);
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const onlineLookup = useMemo(() => {
    const byId = new Map<string, OnlineUserSnapshot>();
    const byEmail = new Map<string, OnlineUserSnapshot>();
    for (const ou of onlineUsers) {
      if (ou.userId) byId.set(String(ou.userId), ou);
      if (ou.email) byEmail.set(ou.email.toLowerCase(), ou);
    }
    return { byId, byEmail };
  }, [onlineUsers]);

  const { displayedUsers, onlineDirectoryCount } = useMemo(() => {
    const findPresence = (u: DirectoryUser): OnlineUserSnapshot | undefined => {
      const idKey = String(u._id || u.id || "");
      if (idKey && onlineLookup.byId.has(idKey)) {
        return onlineLookup.byId.get(idKey);
      }
      const emailKey = String(u.email || "").toLowerCase();
      if (emailKey && onlineLookup.byEmail.has(emailKey)) {
        return onlineLookup.byEmail.get(emailKey);
      }
      return undefined;
    };

    let onlineCount = 0;
    const enriched = users.map((u) => {
      const presence = findPresence(u);
      if (presence) onlineCount++;
      return { user: u, presence };
    });

    // Put online users first (active before idle), keeping original order otherwise
    enriched.sort((a, b) => {
      const scoreA = a.presence ? (a.presence.status === "active" ? 2 : 1) : 0;
      const scoreB = b.presence ? (b.presence.status === "active" ? 2 : 1) : 0;
      return scoreB - scoreA;
    });

    const filtered =
      filterMode === "online"
        ? enriched.filter((item) => Boolean(item.presence))
        : enriched;

    return { displayedUsers: filtered, onlineDirectoryCount: onlineCount };
  }, [users, onlineLookup, filterMode]);

  if (loading)
    return (
      <div className="text-gray-500 py-4 text-center">Cargando usuarios...</div>
    );

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="inline-flex rounded-xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === "all"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Todos ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("online")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
              filterMode === "online"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                onlineDirectoryCount > 0
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-gray-400"
              }`}
            />
            Solo Online ({onlineDirectoryCount})
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="px-4 py-3 font-medium rounded-tl-lg">Nombre</th>
              <th className="px-4 py-3 font-medium">Correo Electrónico</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Presencia</th>
              <th className="px-4 py-3 font-medium">Cuenta</th>
              <th className="px-4 py-3 font-medium rounded-tr-lg text-center">
                Menú
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayedUsers.map(({ user: u, presence }) => (
              <tr
                key={u._id}
                className={`transition-colors ${
                  presence
                    ? "bg-emerald-50/30 hover:bg-emerald-50/60"
                    : "hover:bg-gray-50/50"
                }`}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {u.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                  {u.role}
                </td>
                <td className="px-4 py-3 text-sm">
                  {presence ? (
                    <div className="flex flex-col gap-0.5">
                      <span
                        className={`inline-flex items-center gap-1.5 w-fit px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          presence.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            presence.status === "active"
                              ? "bg-emerald-500 animate-pulse"
                              : "bg-amber-400"
                          }`}
                        />
                        {presence.status === "active"
                          ? "Online"
                          : "En 2° plano"}
                      </span>
                      <span
                        className="text-[11px] text-gray-500"
                        title={presence.currentPath}
                      >
                        {formatRouteLabel(presence.currentPath)}
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                      <span className="w-2 h-2 rounded-full bg-gray-300" />
                      Offline
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      u.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.is_active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  <a
                    href={`${NEXT_PUBLIC_URL}/menu-digital/${encodeURIComponent(
                      u.name.trim().replace(/\s+/g, "-")
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 font-medium rounded-lg transition-colors"
                    title="Visitar menú"
                  >
                    <ExternalLink size={14} />
                    <span>Visitar</span>
                  </a>
                </td>
              </tr>
            ))}
            {displayedUsers.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {filterMode === "online"
                    ? "No hay usuarios del directorio conectados en este momento."
                    : "No hay usuarios registrados."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
