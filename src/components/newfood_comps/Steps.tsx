"use client";
import React, { useState } from "react";
import { MdChevronLeft } from "react-icons/md";
import Link from "next/link";
import { ListChecks, ShoppingBag, Rocket, HelpCircle } from "lucide-react";
import { motion, AnimatePresence, useDragControls, PanInfo } from "framer-motion";

export default function DisenoStepperLlamativo() {
    const [isOpen, setIsOpen] = useState(true);
    const dragControls = useDragControls();

    const steps = [
        {
            id: "01",
            icon: <ListChecks className="w-8 h-8 md:w-10 md:h-10" />,
            title: "Cargar Datos",
            description: "Sube una foto, el precio y categoría del plato",
        },
        {
            id: "02",
            icon: <ShoppingBag className="w-8 h-8 md:w-10 md:h-10" />,
            title: "Lista Temporal",
            description: "Revisa y edita los platos antes de publicar",
        },
        {
            id: "03",
            icon: <Rocket className="w-8 h-8 md:w-10 md:h-10" />,
            title: "Subir al Menú",
            description: "Publicación final visible para tus clientes",
        },
    ];

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.y > 90 || info.velocity.y > 400) {
            setIsOpen(false);
        }
    };

    return (
        <div className="w-full flex flex-col items-center pt-6 px-4">
            <div className="w-full max-w-6xl flex flex-col gap-6">
                {/* Header */}
                <header className="flex flex-col gap-5 items-start w-full">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/mi-menu"
                            className="flex items-center text-sm cursor-pointer font-semibold hover:opacity-80 transition-opacity"
                        >
                            <MdChevronLeft className="text-lg transition-transform group-hover:-translate-x-0.5" />
                            Volver
                        </Link>

                        <button
                            type="button"
                            onClick={() => setIsOpen(true)}
                            className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white/80 border border-gray-200 px-3 py-1 rounded-full shadow-xs hover:shadow transition-all cursor-pointer"
                        >
                            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                            Ver pasos
                        </button>
                    </div>

                    <div className="flex flex-col gap-1 mt-1">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                            Carga de Platos
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base">
                            Completa los pasos a continuación y comienza a vender en minutos.
                        </p>
                    </div>
                </header>
            </div>

            {/* Modal desplegable (Bottom Sheet arrastrable hacia abajo) */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-end justify-center">
                        {/* Fondo oscuro */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                        />

                        {/* Contenedor arrastrable */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 300 }}
                            drag="y"
                            dragControls={dragControls}
                            dragListener={false}
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={{ top: 0.05, bottom: 0.9 }}
                            onDragEnd={handleDragEnd}
                            className="relative z-10 w-full max-w-4xl bg-white rounded-t-3xl shadow-2xl border-t border-gray-200 px-4 pb-8 pt-2 flex flex-col items-center touch-none"
                        >
                            {/* Solapita / Tirador para arrastrar hacia abajo */}
                            <div
                                onPointerDown={(e) => dragControls.start(e)}
                                className="w-full flex flex-col items-center justify-center py-3 cursor-grab active:cursor-grabbing select-none"
                                title="Mantén presionado y arrastra hacia abajo para cerrar"
                            >
                                <div className="w-14 h-1.5 bg-gray-300 hover:bg-gray-400 active:bg-primary rounded-full transition-colors" />
                                <span className="text-[11px] font-medium text-gray-400 mt-1.5">
                                    Desliza hacia abajo para cerrar
                                </span>
                            </div>

                            <div className="w-full flex flex-col gap-4 mt-1">
                                <div className="text-center px-2">
                                    <h2 className="text-lg md:text-xl font-extrabold text-gray-900">
                                        Pasos para subir tus platos
                                    </h2>
                                    <p className="text-xs md:text-sm text-gray-500">
                                        Sigue esta guía rápida para publicar en tu menú
                                    </p>
                                </div>

                                <div
                                    onPointerDown={(e) => dragControls.start(e)}
                                    className="grid grid-cols-1 w-full md:grid-cols-3 gap-3 md:gap-5 relative cursor-grab active:cursor-grabbing"
                                >
                                    {steps.map((step) => (
                                        <div
                                            key={step.id}
                                            className="group relative flex md:flex-col items-center md:items-start gap-4 p-3.5 md:p-5 rounded-2xl bg-gray-50/90 border border-gray-200/80 shadow-xs hover:shadow-md hover:border-primary/30 transition-all duration-300 overflow-hidden select-none"
                                        >
                                            <span className="select-none pointer-events-none absolute -right-2 -bottom-4 text-7xl md:text-8xl font-black text-gray-900/4 group-hover:text-primary/8 transition-colors duration-300">
                                                {step.id}
                                            </span>

                                            <div className="flex items-center justify-between w-auto md:w-full shrink-0">
                                                <div className="relative flex items-center justify-center md:w-12 md:h-12 text-primary group-hover:scale-105 transition-all duration-300">
                                                    {step.icon}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-0.5 md:gap-1.5 z-10 flex-1 min-w-0">
                                                <h3 className="text-base md:text-lg font-bold text-gray-800 group-hover:text-gray-950 transition-colors truncate">
                                                    {step.title}
                                                </h3>
                                                <p className="text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-2">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
