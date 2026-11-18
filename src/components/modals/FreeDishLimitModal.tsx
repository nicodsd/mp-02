"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, Crown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FreeDishLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCount: number;
  maxCount?: number;
}

export default function FreeDishLimitModal({
  isOpen,
  onClose,
  currentCount,
  maxCount = 10,
}: FreeDishLimitModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="free-dish-limit-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-200 flex flex-col items-center text-center gap-4"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar aviso"
              className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-full text-amber-600">
              <AlertTriangle size={32} />
            </div>

            <div className="flex flex-col gap-2">
              <h3
                id="free-dish-limit-title"
                className="text-xl font-extrabold text-gray-900"
              >
                Límite máximo de platos alcanzado
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Los usuarios del plan <span className="font-bold text-gray-800">Free</span> pueden cargar hasta{" "}
                <span className="font-bold text-gray-800">{maxCount} platos</span> como máximo. Ya superaste o alcanzaste esa cantidad ({currentCount}/{maxCount}), por lo que el formulario no está disponible.
              </p>
              <p className="text-xs text-gray-500">
                Mejora tu plan para cargar platos ilimitados o administra tus platos existentes desde tu menú.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row w-full gap-2.5 mt-1">
              <Link
                href="/pagos"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-black hover:bg-gray-800 text-white active:scale-95 transition-all shadow-md"
              >
                <Crown size={16} className="text-amber-400" />
                Mejorar plan
              </Link>
              <Link
                href="/mi-menu"
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 active:scale-95 transition-all"
              >
                Ir a Mi Menú
              </Link>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
            >
              Entendido
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
