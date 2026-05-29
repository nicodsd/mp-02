"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { URI } from "@/src/lib/const";
import logo from "@/public/images/logo/LOGOTIPO.svg";
import Image from "next/image";

function ValidationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verificando tu dirección de correo electrónico...");

  useEffect(() => {
    if (!code) {
      setStatus("error");
      setMessage("Falta el código de verificación en el enlace.");
      return;
    }

    const verifyCode = async () => {
      try {
        const response = await fetch(`${URI}/auth/verify-email?code=${encodeURIComponent(code)}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus("success");
          setMessage(data.message || "¡Tu email ha sido verificado con éxito!");
        } else {
          setStatus("error");
          setMessage(data.message || "El enlace de verificación no es válido o ha expirado.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Ocurrió un error al conectar con el servidor. Inténtalo de nuevo.");
      }
    };

    verifyCode();
  }, [code]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-md p-8 md:p-10 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(255,30,0,0.08)] flex flex-col items-center text-center relative overflow-hidden"
    >
      {/* Decorative God Ray background light */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Brand Logo */}
      <div className="w-16 h-16 mb-8 relative z-10 flex items-center justify-center p-2 bg-stone-50 border border-stone-100 rounded-2xl shadow-sm">
        <Image src={logo} alt="QMenú Logo" width={100} height={100} className="w-full h-full object-contain" />
      </div>

      {status === "loading" && (
        <div className="flex flex-col items-center relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="text-red-500 mb-6"
          >
            <Loader2 className="w-16 h-16 stroke-[1.5]" />
          </motion.div>
          <h2 className="text-2xl font-black text-stone-800 mb-3 tracking-tight">Validando Cuenta</h2>
          <p className="text-stone-500 text-sm leading-relaxed">{message}</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center relative z-10 w-full">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            className="w-20 h-20 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner"
          >
            <CheckCircle2 className="w-12 h-12 stroke-[1.75]" />
          </motion.div>

          <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold mb-4 shadow-sm border border-green-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cuenta Verificada</span>
          </div>

          <h2 className="text-3xl font-black text-stone-800 mb-3 tracking-tight">¡Excelente!</h2>
          <p className="text-stone-500 text-sm leading-relaxed mb-8 px-2">{message}</p>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(255, 30, 0, 0.15)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/login")}
            className="w-full bg-primary text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#e01a00] transition-colors duration-300 shadow-lg shadow-primary/20 cursor-pointer"
          >
            <span>Iniciar Sesión</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center relative z-10 w-full">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
            className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-inner"
          >
            <XCircle className="w-12 h-12 stroke-[1.75]" />
          </motion.div>

          <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-semibold mb-4 shadow-sm border border-red-100">
            <span>Validación Fallida</span>
          </div>

          <h2 className="text-2xl font-black text-stone-800 mb-3 tracking-tight">Vaya, algo salió mal</h2>
          <p className="text-red-600/80 text-sm leading-relaxed mb-8 px-2 font-medium bg-red-50/50 py-3 rounded-xl border border-red-100/50 w-full">{message}</p>

          <div className="flex flex-col gap-3 w-full">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/registro-de-usuario")}
              className="w-full bg-stone-900 text-white font-bold py-4 px-6 rounded-2xl hover:bg-stone-800 transition-colors duration-300 shadow-md cursor-pointer"
            >
              Regresar al Registro
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/contacto")}
              className="w-full bg-white text-stone-600 border border-stone-200 font-bold py-4 px-6 rounded-2xl hover:bg-stone-50 transition-colors duration-300 cursor-pointer"
            >
              Contactar Soporte
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function AccountValidationPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background relative overflow-hidden font-sans">
      {/* Dynamic Background Circles */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[80px] pointer-events-none" />

      <Suspense
        fallback={
          <div className="w-full max-w-md p-10 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg flex flex-col items-center text-center">
            <Loader2 className="w-16 h-16 animate-spin text-red-500 stroke-[1.5] mb-6" />
            <h2 className="text-2xl font-black text-stone-800 mb-3 tracking-tight">Cargando verificación...</h2>
          </div>
        }
      >
        <ValidationContent />
      </Suspense>
    </div>
  );
}
