"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { URI } from "@/src/lib/const";
import BttnBack from '@/src/components/buttons/BttnBack';
import logo from "@/public/images/logo/logo-rojo.png";
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
    <div className="w-full py-8 pt-14 relative mt-2">
      {/* Brand Logo in top circle */}
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
        <div className="w-24 h-24 rounded-full ring-1 bg-background border-white ring-gray-300 flex items-center justify-center">
          <Image
            src={logo}
            alt="User"
            width={100}
            height={100}
            className="w-full h-full rounded-full"
          />
        </div>
      </div>

      {status === "loading" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="text-start mb-5 px-5 flex flex-col gap-2 w-full">
            <h1 className="text-stone-800 text-3xl leading-none font-extrabold tracking-tight text-center">
              Validando Cuenta
            </h1>
            <p className="text-gray-600 text-sm font-semibold text-center mt-2">
              {message}
            </p>
          </div>

          <div className="flex justify-center mt-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="text-primary"
            >
              <Loader2 className="w-12 h-12 stroke-[1.5]" />
            </motion.div>
          </div>
        </motion.div>
      )}

      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-3"
        >
          <div className="text-start mb-5 px-5 flex flex-col gap-2">
            <h1 className="text-stone-800 text-3xl leading-none font-extrabold tracking-tight text-center">
              ¡Excelente!
            </h1>
            <div className="flex items-center justify-center gap-1.5 text-green-600 text-md font-semibold mt-2">
              <Sparkles className="w-4 h-4" />
              <span>Cuenta Verificada</span>
            </div>
            <p className="text-gray-600 text-sm font-semibold text-center mt-2">
              {message}
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
              className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center shadow-inner"
            >
              <CheckCircle2 className="w-12 h-12 stroke-[1.75]" />
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/login")}
            className="w-full bg-primary active:scale-90 text-white font-bold py-4 px-3 rounded-lg cursor-pointer uppercase tracking-wide transition-all flex items-center justify-center gap-2"
          >
            <span>Iniciar Sesión</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-3"
        >
          <div className="text-start mb-5 px-5 flex flex-col gap-2">
            <h1 className="text-stone-800 text-3xl leading-none font-extrabold tracking-tight text-center">
              Algo salió mal
            </h1>
            <div className="flex items-center justify-center gap-1.5 text-red-600 text-md font-semibold mt-2">
              <XCircle className="w-4 h-4" />
              <span>Validación Fallida</span>
            </div>
            <p className="text-gray-600 text-sm font-semibold text-center mt-2">
              {message}
            </p>
          </div>

          <div className="flex flex-col gap-2 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/registro-de-usuario")}
              className="w-full bg-stone-900 active:scale-90 text-white font-bold py-4 px-3 rounded-lg cursor-pointer uppercase tracking-wide transition-all"
            >
              Regresar al Registro
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/contacto")}
              className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-4 px-3 rounded-lg cursor-pointer uppercase tracking-wide transition-all"
            >
              Contactar Soporte
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function AccountValidationPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="relative h-full px-4 w-full md:w-[60%] lg:w-[50%] xl:w-[30%] md:mx-auto flex flex-col items-center">
        <div className="w-full py-3 z-10">
          <BttnBack />
        </div>
        <main className="flex-1 w-full flex flex-col items-end justify-start mt-18">
          <Suspense
            fallback={
              <div className="w-full py-8 pt-14 relative mt-2 flex flex-col items-center">
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                  <div className="w-24 h-24 rounded-full ring-1 bg-background border-white ring-gray-300 flex items-center justify-center">
                    <Image
                      src={logo}
                      alt="User"
                      width={100}
                      height={100}
                      className="w-full h-full rounded-full"
                    />
                  </div>
                </div>
                <Loader2 className="w-12 h-12 animate-spin text-primary stroke-[1.5] mt-6" />
                <h2 className="text-xl font-bold text-stone-800 mt-4 tracking-tight">Cargando verificación...</h2>
              </div>
            }
          >
            <ValidationContent />
          </Suspense>
        </main>
      </div>
      <footer className="w-full h-fit flex flex-col items-center justify-between bg-background space-y-5 py-2">
        <div className="text-center py-2 text-xs">
          <p>© {new Date().getFullYear()} QMenu.</p>
        </div>
      </footer>
    </div>
  );
}
