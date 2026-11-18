"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaCookieBite, FaShieldAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

interface MenuCookieConsentModalProps {
    restaurantName?: string;
    template?: any;
}

const MENU_COOKIE_KEY = "qmenu_customer_consent";

export default function MenuCookieConsentModal({
    restaurantName,
    template,
}: MenuCookieConsentModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(MENU_COOKIE_KEY);
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 800);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(MENU_COOKIE_KEY, "accepted");
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem(MENU_COOKIE_KEY, "declined");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[1200] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
            <div
                className={`${template?.backgroundColor || "bg-white"} w-full max-w-md p-5 rounded-2xl shadow-2xl border ${template?.border || "border-gray-200"} flex flex-col gap-3 relative`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="cookie-title"
            >
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                            <FaCookieBite size={22} className="text-green-600" />
                        </div>
                        <div>
                            <h3
                                id="cookie-title"
                                className={`text-base font-bold ${template?.textColor || "text-gray-900"}`}
                            >
                                Cookies y Datos de Entrega
                            </h3>
                            <p className="text-[11px] text-gray-500 font-medium">
                                {restaurantName ? `Menú digital de ${restaurantName}` : "Pedidos directos por WhatsApp"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleDecline}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Cerrar"
                    >
                        <IoClose size={20} />
                    </button>
                </div>

                <p className={`text-xs sm:text-sm ${template?.textColor || "text-gray-600"} opacity-90 leading-relaxed`}>
                    Este menú digital tiene habilitada la opción de <strong>pedidos por WhatsApp</strong>. Para facilitar tu experiencia y calcular el envío, solicitaremos tu <strong>nombre y ubicación</strong> únicamente al encargar comida. Usamos almacenamiento local para recordar tu carrito y preferencias.
                </p>

                <p className="text-[11px] text-gray-500 leading-normal">
                    Puedes consultar el tratamiento de datos en nuestras{" "}
                    <Link
                        href="/politicas"
                        target="_blank"
                        className="text-green-600 underline underline-offset-2 font-semibold hover:opacity-80"
                    >
                        Políticas de Privacidad
                    </Link>
                    .
                </p>

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={handleDecline}
                        className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                    >
                        Rechazar
                    </button>
                    <button
                        type="button"
                        onClick={handleAccept}
                        className="px-5 py-2 text-xs sm:text-sm font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                        <FaShieldAlt size={13} />
                        Aceptar y Continuar
                    </button>
                </div>
            </div>
        </div>
    );
}

