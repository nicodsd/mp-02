"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

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
      <div className="relative flex items-center justify-center mb-8">
        <div className="w-24 h-24 border-8 border-slate-200 rounded-full"></div>
        <div className="absolute w-24 h-24 border-8 border-black border-t-transparent rounded-full animate-spin"></div>
        <span className="absolute text-xl font-bold text-slate-700">
          {countdown}s
        </span>
      </div>
      <h1 className="text-6xl font-black text-slate-900 mb-4">¡Ups!... 404</h1>
      <h2 className="text-2xl font-semibold text-slate-800 mb-10">
        ¡Menú no encontrado!
      </h2>

      <button
        onClick={() => router.push("/")}
        className="px-8 py-3 bg-primary cursor-pointer hover:bg-red-700 text-white font-bold rounded-2xl text-lg transition-all active:scale-95 transform"
      >
        Volver al Menú Principal
      </button>

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
