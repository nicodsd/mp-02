"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    template?: {
        backgroundColor?: string;
        textColor?: string;
        textColorOpacity?: string;
    };
}

export default function ExitConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    template
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate__animated animate__fadeIn">
            <div
                className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-gray-200/50 flex flex-col items-center text-center gap-4 animate__animated animate__zoomInFast
          ${template?.backgroundColor || "bg-white"}`}
            >
                {/* Icono de Alerta de Atención */}
                <div className="p-3 bg-amber-50 rounded-full text-amber-500">
                    <AlertTriangle size={32} />
                </div>

                {/* Textos informativos */}
                <div className="flex flex-col gap-1">
                    <h3 className={`text-lg font-bold ${template?.textColor || "text-gray-900"}`}>
                        ¿Cerrar sin guardar?
                    </h3>
                    <p className={`text-xs leading-normal px-2 ${template?.textColorOpacity || "text-gray-500"}`}>
                        Tienes cambios en el menú que no fueron guardados. Si sales ahora, perderás el progreso actual de tus platos.
                    </p>
                </div>

                {/* Botonera de Acción */}
                <div className="flex w-full gap-2 mt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 active:scale-95 transition-all"
                    >
                        Seguir editando
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white active:scale-95 transition-all shadow-md shadow-red-600/20"
                    >
                        Salir de todos modos
                    </button>
                </div>
            </div>
        </div>
    );
}