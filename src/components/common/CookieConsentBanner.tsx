"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaCookieBite, FaShieldAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const COOKIE_CONSENT_KEY = "qmenu_cookie_consent";

export default function CookieConsentBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Verificamos si el usuario ya dio o rechazó su consentimiento anteriormente
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
            // Breve delay para que no aparezca de golpe al cargar
            const timer = setTimeout(() => setIsVisible(true), 1200);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <aside
            aria-label="Consentimiento de cookies"
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-9999 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
            <div className="bg-white/95 backdrop-blur-md border border-stone-200 text-stone-800 p-4 sm:p-5 rounded-2xl shadow-2xl flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 text-primary">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <FaCookieBite size={20} className="text-primary" />
                        </div>
                        <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                            Valoramos tu privacidad
                        </h3>
                    </div>
                    <button
                        onClick={handleDecline}
                        className="text-stone-400 hover:text-stone-600 transition-colors p-1"
                        aria-label="Cerrar aviso de cookies"
                    >
                        <IoClose size={20} />
                    </button>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Utilizamos cookies técnicas necesarias para el funcionamiento del sitio y para recordar tus preferencias de navegación. Consulta nuestras{" "}
                    <Link
                        href="/politicas"
                        className="text-primary underline underline-offset-2 hover:opacity-80 font-medium"
                    >
                        Políticas de Privacidad
                    </Link>
                    .
                </p>

                <div className="flex items-center justify-end gap-2.5 pt-1">
                    <button
                        type="button"
                        onClick={handleDecline}
                        className="px-4 py-2 text-xs sm:text-sm font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                    >
                        Rechazar
                    </button>
                    <button
                        type="button"
                        onClick={handleAccept}
                        className="px-5 py-2 text-xs sm:text-sm font-bold bg-primary hover:bg-red-700 text-white rounded-xl shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                        <FaShieldAlt size={13} />
                        Aceptar
                    </button>
                </div>
            </div>
        </aside>
    );
}

