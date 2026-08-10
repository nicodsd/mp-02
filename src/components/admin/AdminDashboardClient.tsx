"use client";

import React, { useEffect, useState } from "react";
import { Users, Utensils, Eye, Activity, Bell, Mail, Send, ExternalLink } from "lucide-react";
import { URI, NEXT_PUBLIC_URL } from "@/src/lib/const";

interface Metrics {
  users: number;
  menus: number;
  visits: number;
}

interface LogEvent {
  id: string;
  message: string;
  time: string;
  type: 'user' | 'menu' | 'visit';
}

export default function AdminDashboardClient({ user }: { user: any }) {
  const [metrics, setMetrics] = useState<Metrics>({ users: 0, menus: 0, visits: 0 });
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);

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
            setLogs((prev) => [
              { id: Date.now().toString(), message: `Nuevo usuario registrado: ${data.user?.email || 'Desconocido'}`, time: now, type: 'user' as const },
              ...prev,
            ].slice(0, 50));
            break;

          case "NEW_MENU":
            setMetrics((prev) => ({ ...prev, menus: data.totalMenus }));
            setLogs((prev) => [
              { id: Date.now().toString(), message: `Nuevo menú creado (ID: ${data.menu?._id || 'Desconocido'})`, time: now, type: 'menu' as const },
              ...prev,
            ].slice(0, 50));
            break;

          case "NEW_VISIT":
            setMetrics((prev) => ({ ...prev, visits: data.totalVisits }));
            setLogs((prev) => [
              { id: Date.now().toString(), message: `Nueva visita desde IP: ${data.visit?.ip || 'Desconocida'}`, time: now, type: 'visit' as const },
              ...prev,
            ].slice(0, 50));
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

      // Auto-reconnect try after 5 seconds could be implemented here if wanted,
      // but EventSource does it automatically.
    };

    return () => {
      eventSource.close();
    };
  }, []);

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
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-sm font-medium text-gray-600">
            {isConnected ? "Conectado al Stream" : "Desconectado"}
          </span>
        </div>
      </header>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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
                    <div className={`mt-1 rounded-full p-1.5 ${log.type === 'user' ? 'bg-blue-100 text-blue-600' :
                      log.type === 'menu' ? 'bg-orange-100 text-orange-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                      {log.type === 'user' ? <Users size={14} /> :
                        log.type === 'menu' ? <Utensils size={14} /> :
                          <Eye size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 text-sm font-medium truncate">{log.message}</p>
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
          <UsersList />
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
        setStatus({ type: "success", msg: "Campaña encolada exitosamente. Enviando en segundo plano..." });
        setSubject("");
        setHtmlContent("");
      } else {
        setStatus({ type: "error", msg: data.message || "Error al encolar la campaña." });
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
        <label className="block text-sm font-semibold text-gray-700 mb-1">Asunto de la Campaña</label>
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
        <label className="block text-sm font-semibold text-gray-700 mb-1">Contenido HTML</label>
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
        <div className={`p-3 rounded-lg text-sm font-medium ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
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

function MetricCard({ title, value, icon, gradient, borderColor }: any) {
  return (
    <div className={`bg-linear-to-br ${gradient} border ${borderColor} rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 font-medium text-sm mb-2">{title}</p>
          <h3 className="text-4xl font-bold text-gray-900 tracking-tight">{value.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
}

function UsersList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="text-gray-500 py-4 text-center">Cargando usuarios...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-600 text-sm">
            <th className="px-4 py-3 font-medium rounded-tl-lg">Nombre</th>
            <th className="px-4 py-3 font-medium">Correo Electrónico</th>
            <th className="px-4 py-3 font-medium">Rol</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium rounded-tr-lg text-center">Menú</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((u) => (
            <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{u.name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
              <td className="px-4 py-3 text-sm text-gray-600 capitalize">{u.role}</td>
              <td className="px-4 py-3 text-sm">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {u.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-center">
                <a
                  href={`${NEXT_PUBLIC_URL}/menu-digital/${encodeURIComponent(u.name.trim().replace(/\s+/g, "-"))}`}
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
          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No hay usuarios registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
