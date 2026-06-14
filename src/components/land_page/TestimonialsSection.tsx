"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
    name: string;
    role: string;
    content: string;
    avatar: string;
    rating: number;
}

const testimonials: Testimonial[] = [
    {
        name: "Alejandro Gómez",
        role: "Dueño de Hamburguesería",
        content: "Cambiar los precios en tiempo real nos salvó. Muy buena la velocidad con la que carga el QR!",
        avatar: "👨‍🍳",
        rating: 5,
    },
    {
        name: "Mariana Silva",
        role: "Dueña de Pizería",
        content: "Los pedidos llegan directo al WhatsApp del encargado de barra perfectamente organizados. Excelente herramienta",
        avatar: "👩‍🍳",
        rating: 5,
    },
    {
        name: "Carlos Mendoza",
        role: "Emprendedor gastronómico",
        content: "Empezamos con el plan gratuito para probar y a las dos semanas nos pasamos al Premium. Muy buena la app y facil de usar sobre todo",
        avatar: "👨‍🍳",
        rating: 5,
    },
    {
        name: "Nicolas Barrera",
        role: "Fundador de QMenú",
        content: "QMenú es una herramienta potente que permite a los restaurantes ofrecer sus menús digitales de forma rápida y sencilla. Con esta app pueden gestionar sus menús, precios, fotos y promociones desde un solo lugar. Estamos en constante mejora, poco a poco iremos agregando mas opciones y funcionalidades.",
        avatar: "👨‍🍳",
        rating: 5,
    },
    {
        name: "Micaela",
        role: "Dueña de restaurante",
        content: "Encantadaa",
        avatar: "👨‍🍳",
        rating: 5,
    },
    {
        name: "Valeria",
        role: "Dueña de restaurante",
        content: "Buenaa, faltan que agreguen mas opciones de pago",
        avatar: "👨‍🍳",
        rating: 4,
    },
];

const slideVariants: Variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.4, ease: "easeInOut" }
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0,
        transition: { duration: 0.3, ease: "easeInOut" }
    })
};

export default function TestimonialsSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        if (newDirection > 0) {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        } else {
            setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        }
    };

    return (
        <section className="w-full max-w-7xl md:mb-30 mx-auto py-16 text-left">
            {/* Cabecera de sección - Estilo QMenú */}
            <div className="flex flex-col md:pl-12 md:flex-row md:items-end md:justify-between mb-12 gap-6">
                <div>
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-stone-900 mb-4"
                    >
                        Opiniones de nuestros usuarios
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base text-zinc-500"
                    >
                        Los dueños de restaurantes eliminaron la fricción en la promoción de sus platos y la gestión de sus pedidos diarios.
                    </motion.p>
                </div>
            </div>

            {/* Contenedor del Carrusel Animado */}
            <div className="overflow-hidden relative">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="w-full"
                    >
                        {/* VISTA DESKTOP: Muestra 3 tarjetas continuas */}
                        <div className="hidden md:grid grid-cols-3 gap-2 w-full">
                            {[0, 1, 2].map((offset) => {
                                const itemIndex = (currentIndex + offset) % testimonials.length;
                                const item = testimonials[itemIndex];
                                return (
                                    <div
                                        key={`${currentIndex}-${offset}`}
                                        className="flex flex-col justify-between p-6 bg-background-2 rounded-2xl border border-gray-300 h-full"
                                    >
                                        <div>
                                            <div className="flex gap-1 mb-4">
                                                {Array.from({ length: item.rating }).map((_, i) => (
                                                    <Star key={i} className="w-7 h-7 fill-primary text-primary" />
                                                ))}
                                            </div>
                                            <p className="text-zinc-600 text-sm leading-relaxed mb-6">
                                                "{item.content}"
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 pt-4 border-t border-zinc-50">
                                            <span className="text-2xl" role="img" aria-label="avatar">{item.avatar}</span>
                                            <div>
                                                <h4 className="font-semibold text-sm text-stone-900">{item.name}</h4>
                                                <p className="text-xs text-zinc-400">{item.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* VISTA MOBILE: Muestra 1 tarjeta limpia de altura dinámica */}
                        <div className="block md:hidden w-full">
                            {(() => {
                                const item = testimonials[currentIndex];
                                return (
                                    <div className="flex flex-col justify-between p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm min-h-[220px]">
                                        <div>
                                            <div className="flex gap-1 mb-4">
                                                {Array.from({ length: item.rating }).map((_, i) => (
                                                    <Star key={i} className="w-6 h-6 fill-primary text-primary" />
                                                ))}
                                            </div>
                                            <p className="text-zinc-600 text-sm leading-relaxed mb-6">
                                                "{item.content}"
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 pt-4 border-t border-zinc-50">
                                            <span className="text-2xl" role="img" aria-label="avatar">{item.avatar}</span>
                                            <div>
                                                <h4 className="font-semibold text-sm text-stone-900">{item.name}</h4>
                                                <p className="text-xs text-zinc-400">{item.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
            {/* Botones de Navegación */}
            <div className="flex gap-2 mt-3 w-full justify-end">
                <button
                    onClick={() => paginate(-1)}
                    className="p-3 rounded-full border border-gray-300 bg-white hover:bg-zinc-50 active:scale-95 transition text-zinc-700"
                    aria-label="Anterior"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={() => paginate(1)}
                    className="p-3 rounded-full border border-gray-300 bg-white hover:bg-zinc-50 active:scale-95 transition text-zinc-700"
                    aria-label="Siguiente"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </section>
    );
}