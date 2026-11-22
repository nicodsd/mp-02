"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import {
  ALL_ACCEPTED_PREFERENCES,
  COOKIE_CONSENT_UPDATED_EVENT,
  ONLY_NECESSARY_PREFERENCES,
  getStoredCookiePreferences,
  openCookiePreferences,
  saveCookiePreferences,
} from "@/src/lib/cookieConsent";

interface CookieConsentBannerProps {
  onOpenPreferences?: () => void;
}

export default function CookieConsentBanner({
  onOpenPreferences,
}: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = getStoredCookiePreferences();
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleConsentUpdated = () => {
      setIsVisible(false);
    };
    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, handleConsentUpdated);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, handleConsentUpdated);
    };
  }, []);

  const handleAcceptAll = () => {
    saveCookiePreferences(ALL_ACCEPTED_PREFERENCES);
    setIsVisible(false);
  };

  const handleDeclineOptional = () => {
    saveCookiePreferences(ONLY_NECESSARY_PREFERENCES);
    setIsVisible(false);
  };

  const handleConfigure = () => {
    if (onOpenPreferences) {
      onOpenPreferences();
    } else {
      openCookiePreferences();
    }
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Consentimiento de cookies"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-lg z-9999"
    >
      <div className="bg-white border border-stone-200 text-stone-800 p-4 sm:p-5 rounded-2xl shadow-2xl flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 text-red-700">
            <div className="w-9 h-9 rounded-xl bg-red-700/10 flex items-center justify-center shrink-0">
              <Cookie size={20} className="text-red-700" aria-hidden="true" />
            </div>
            <p className="font-bold text-stone-900 text-sm sm:text-base">
              Valoramos tu privacidad
            </p>
          </div>
          <button
            type="button"
            onClick={handleDeclineOptional}
            className="text-stone-500 hover:text-stone-700 transition-colors p-1 cursor-pointer"
            aria-label="Cerrar aviso de cookies"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Utilizamos cookies esenciales para el funcionamiento del sitio y cookies opcionales
          (analíticas con Google Tag Manager, preferencias y marketing) para medir y mejorar tu
          experiencia. Puedes elegir cuáles aceptar o consultar nuestras{" "}
          <Link
            href="/politicas"
            prefetch={false}
            className="text-red-700 underline underline-offset-2 hover:opacity-80 font-medium"
          >
            Políticas de Privacidad
          </Link>
          .
        </p>

        <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={handleConfigure}
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-stone-700 border border-stone-300 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <SlidersHorizontal size={12} aria-hidden="true" />
            Preferencias
          </button>
          <button
            type="button"
            onClick={handleDeclineOptional}
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            Solo esenciales
          </button>
          <button
            type="button"
            onClick={handleAcceptAll}
            className="px-4 py-2 text-xs sm:text-sm font-bold bg-red-700 hover:bg-red-800 text-white rounded-xl shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ShieldCheck size={13} aria-hidden="true" />
            Aceptar todas
          </button>
        </div>
      </div>
    </aside>
  );
}
