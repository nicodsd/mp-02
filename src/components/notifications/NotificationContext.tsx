"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";

type NotificationType = "success" | "error" | "info";

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, type: NotificationType = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    
    // Auto-eliminar después de 4 segundos
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {/* Contenedor de Toasts */}
      <div className="fixed bottom-5 right-5 z-100 flex flex-col gap-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border animate-fade-in-up transition-all ${
              n.type === "success" ? "bg-white border-green-100 text-green-700" : 
              n.type === "error" ? "bg-white border-red-100 text-red-700" : 
              "bg-white border-blue-100 text-blue-700"
            }`}
          >
            {n.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
            <p className="text-sm font-medium">{n.message}</p>
            <button onClick={() => setNotifications(prev => prev.filter(notif => notif.id !== n.id))}>
              <FaTimes className="text-gray-400 hover:text-gray-600 ml-2" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification debe usarse dentro de NotificationProvider");
  return context;
};