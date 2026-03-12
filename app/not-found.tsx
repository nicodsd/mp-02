"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const NotFound = ({ name }: { name: string }) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5); // Contador visual de 5 segundos

  useEffect(() => {
    // Intervalo para el contador visual
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Redirección automática tras 5 segundos
    const redirect = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      {/* Contenedor del Spinner */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Círculo de fondo (estático) */}
        <div className="w-24 h-24 border-8 border-slate-200 rounded-full"></div>

        {/* Spinner animado (borde superior) */}
        <div className="absolute w-24 h-24 border-8 border-black border-t-transparent rounded-full animate-spin"></div>

        {/* Número del contador en el centro */}
        <span className="absolute text-xl font-bold text-slate-700">
          {countdown}s
        </span>
      </div>

      {/* Texto de Error */}
      <h1 className="text-6xl font-black text-slate-900 mb-4">¡Ups!... 404</h1>
      <h2 className="text-2xl font-semibold text-slate-800 mb-10">
        ¡Menú no encontrado!
      </h2>

      {/* Botón de acción manual */}
      <button
        onClick={() => router.push("/")}
        className="px-8 py-3 bg-primary hover:bg-red-700 text-white font-bold rounded-full shadow-lg shadow-blue-200 transition-all active:scale-95 transform"
      >
        Volver al Menú Principal
      </button>

      {/* Decoración sutil */}
      <div className="mt-12 flex gap-1">
        <div
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  );
};

export default NotFound;
