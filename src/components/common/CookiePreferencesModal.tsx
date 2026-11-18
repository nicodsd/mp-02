"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaCookieBite, FaShieldAlt, FaLock, FaChartBar, FaBullhorn, FaSlidersH } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import {
  ALL_ACCEPTED_PREFERENCES,
  ONLY_NECESSARY_PREFERENCES,
  getStoredCookiePreferences,
  saveCookiePreferences,
} from "@/src/lib/cookieConsent";

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

interface CategoryItem {
  key: "necessary" | "preferences" | "analytics" | "marketing";
  title: string;
  description: string;
  details: string;
  icon: React.ReactNode;
  required?: boolean;
}

const CATEGORIES: CategoryItem[] = [
  {
    key: "necessary",
    title: "Cookies esenciales y técnicas",
    description:
      "Necesarias para que la plataforma funcione correctamente, mantener tu sesión activa, proteger la seguridad y recordar tu carrito o preferencias de consentimiento.",
    details: "Cookies de sesión (token, user, menu), seguridad y almacenamiento del carrito.",
    icon: <FaLock size={15} className="text-stone-600" />,
    required: true,
  },
  {
    key: "preferences",
    title: "Cookies de preferencias y funcionalidad",
    description:
      "Permiten recordar tus elecciones de interfaz, configuraciones de visualización y datos útiles para mejorar tu experiencia en futuras visitas.",
    details: "Google Consent Mode: functionality_storage y personalization_storage.",
    icon: <FaSlidersH size={15} className="text-primary" />,
  },
  {
    key: "analytics",
    title: "Cookies analíticas y de rendimiento",
    description:
      "Nos ayudan a entender cómo interactúan los visitantes con la app para medir el tráfico, detectar errores y mejorar el rendimiento.",
    details: "Google Tag Manager, Google Analytics (analytics_storage), Vercel Analytics y Speed Insights.",
    icon: <FaChartBar size={15} className="text-primary" />,
  },
  {
    key: "marketing",
    title: "Cookies de marketing y publicidad",
    description:
      "Se utilizan a través de Google Tag Manager para medir la efectividad de campañas publicitarias, atribución y personalización de anuncios.",
    details: "Google Consent Mode: ad_storage, ad_user_data y ad_personalization.",
    icon: <FaBullhorn size={15} className="text-primary" />,
  },
];

export default function CookiePreferencesModal({
  isOpen,
  onClose,
  onSaved,
}: CookiePreferencesModalProps) {
  const [preferences, setPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const stored = getStoredCookiePreferences();
    if (stored) {
      setPreferences(stored.preferences);
      setAnalytics(stored.analytics);
      setMarketing(stored.marketing);
    } else {
      setPreferences(false);
      setAnalytics(false);
      setMarketing(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getCategoryValue = (key: CategoryItem["key"]): boolean => {
    if (key === "necessary") return true;
    if (key === "preferences") return preferences;
    if (key === "analytics") return analytics;
    return marketing;
  };

  const toggleCategory = (key: CategoryItem["key"]) => {
    if (key === "necessary") return;
    if (key === "preferences") setPreferences((prev) => !prev);
    if (key === "analytics") setAnalytics((prev) => !prev);
    if (key === "marketing") setMarketing((prev) => !prev);
  };

  const handleSaveCustom = () => {
    saveCookiePreferences({ preferences, analytics, marketing });
    onSaved?.();
    onClose();
  };

  const handleAcceptAll = () => {
    saveCookiePreferences(ALL_ACCEPTED_PREFERENCES);
    onSaved?.();
    onClose();
  };

  const handleRejectOptional = () => {
    saveCookiePreferences(ONLY_NECESSARY_PREFERENCES);
    onSaved?.();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-preferences-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-4 sm:p-5 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <FaCookieBite size={20} className="text-primary" />
            </div>
            <div>
              <h2
                id="cookie-preferences-title"
                className="font-bold text-stone-900 text-base sm:text-lg"
              >
                Preferencias de cookies
              </h2>
              <p className="text-xs text-stone-500">
                Elige qué tipos de cookies y recolección de datos deseas permitir.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar preferencias de cookies"
            className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Usamos cookies propias y de terceros (como Google Tag Manager y analítica) para el
            funcionamiento del sitio, análisis de uso y medición. Puedes cambiar estas preferencias
            en cualquier momento desde nuestras{" "}
            <Link
              href="/politicas"
              onClick={onClose}
              className="text-primary underline underline-offset-2 font-medium hover:opacity-80"
            >
              Políticas de Privacidad
            </Link>
            .
          </p>

          <div className="space-y-2.5 pt-1">
            {CATEGORIES.map((cat) => {
              const checked = getCategoryValue(cat.key);
              const toggleId = `cookie-toggle-${cat.key}`;
              return (
                <div
                  key={cat.key}
                  className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="shrink-0">{cat.icon}</span>
                      <label
                        htmlFor={toggleId}
                        className="font-semibold text-sm text-stone-900 cursor-pointer"
                      >
                        {cat.title}
                      </label>
                    </div>

                    {cat.required ? (
                      <span className="shrink-0 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-700">
                        Siempre activas
                      </span>
                    ) : (
                      <button
                        id={toggleId}
                        type="button"
                        role="switch"
                        aria-checked={checked}
                        aria-label={`Activar o desactivar ${cat.title}`}
                        onClick={() => toggleCategory(cat.key)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                          checked ? "bg-primary" : "bg-stone-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            checked ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">{cat.description}</p>
                  <p className="text-[11px] text-stone-400">{cat.details}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleRejectOptional}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-stone-600 hover:bg-stone-200/70 rounded-xl transition-colors cursor-pointer"
          >
            Solo esenciales
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              type="button"
              onClick={handleSaveCustom}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-stone-800 border border-stone-300 bg-white hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              Guardar preferencias
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="px-5 py-2 text-xs sm:text-sm font-bold bg-primary hover:bg-red-700 text-white rounded-xl shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <FaShieldAlt size={13} />
              Aceptar todas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
