"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
    name: string;
    role: string;
    content: string;
    avatar: string;
    rating: number;
}

const testimonials: Testimonial[] = [
    {
        name: 'Alejandro Gómez',
        role: 'Dueño de Hamburguesería',
        content: 'Cambiar los precios en tiempo real nos salvó. Muy buena la velocidad con la que carga el QR!',
        avatar: '👨‍🍳',
        rating: 5
    },
    {
        name: 'Mariana Silva',
        role: 'Dueña de Pizería',
        content: 'Los pedidos llegan directo al WhatsApp del encargado de barra perfectamente organizados. Excelente herramienta',
        avatar: '👩‍🍳',
        rating: 5
    },
    {
        name: 'Carlos Mendoza',
        role: 'Emprendedor gastronómico',
        content: 'Empezamos con el plan gratuito para probar y a las dos semanas nos pasamos al Premium. Muy buena la app y facil de usar sobre todo',
        avatar: '👨‍🍳',
        rating: 5
    },
    {
        name: 'Nicolas Barrera',
        role: 'Fundador de QMenú',
        content: 'QMenú es una herramienta potente que permite a los restaurantes ofrecer sus menús digitales de forma rápida y sencilla. Con esta app pueden gestionar sus menús, precios, fotos y promociones desde un solo lugar. Estamos en constante mejora, poco a poco iremos agregando mas opciones y funcionalidades.',
        avatar: '👨‍🍳',
        rating: 5
    },
    {
        name: 'Micaela',
        role: 'Dueña de restaurante',
        content: 'Encantadaa',
        avatar: '👨‍🍳',
        rating: 5
    },
    {
        name: 'Valeria',
        role: 'Dueña de restaurante',
        content: 'Buenaa, faltan que agreguen mas opciones de pago',
        avatar: '👨‍🍳',
        rating: 4
    }
];

export const TestimonialsSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // Variantes optimizadas: En móvil usamos un barrido de 100% para evitar saltos raros de contenedor
    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? "100%" : "-100%",
            opacity: 0,
            scale: 0.95
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                x: { type: "spring", stiffness: 180, damping: 24 },
                opacity: { duration: 0.3, ease: "linear" },
                scale: { duration: 0.3, ease: "easeOut" }
            }
        },
        exit: (dir: number) => ({
            x: dir < 0 ? "100%" : "-100%",
            opacity: 0,
            scale: 0.95,
            transition: {
                x: { type: "spring", stiffness: 180, damping: 24 },
                opacity: { duration: 0.3, ease: "linear" }
            }
        })
    };

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <div className='py-10 md:py-0 md:pb-30 relative w-full'>
            {/* Elipses decorativas sutiles en los laterales */}
            <div className='relative hidden md:block'>
                <div className='absolute top-20 rounded-3xl -bottom-60 -right-30 blur-3xl h-100 z-0 w-full bg-yellow-400/5'></div>
                <div className='absolute top-20 rounded-3xl -bottom-60 -left-30 blur-3xl h-100 z-0 w-full bg-red-600/5'></div>
            </div>

            <section id="testimonios" className="z-10 relative overflow-hidden w-full">
                <div className="w-full relative z-10 max-w-6xl mx-auto md:px-0">

                    {/* Cabecera de sección */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 text-center md:text-left"
                            >
                                Opiniones de nuestros <span className="text-red-600">usuarios</span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-sm text-zinc-500 text-center md:text-left"
                            >
                                Los dueños de restaurantes eliminaron la fricción en la promoción de sus platos.
                            </motion.p>
                        </div>
                    </div>

                    {/* Contenedor del Carrusel */}
                    <div className="relative w-full rounded-xl overflow-hidden">

                        {/* VISTA DESKTOP: Carrusel corregido por ID único desplazando bloques estables */}
                        <div className="hidden md:block relative w-full min-h-[320px]">
                            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                <motion.div
                                    key={currentIndex}
                                    custom={direction}
                                    variants={slideVariants as any}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="grid grid-cols-3 gap-3 w-full"
                                >
                                    {[0, 1, 2].map((offset) => {
                                        const itemIndex = (currentIndex + offset) % testimonials.length;
                                        const item = testimonials[itemIndex];
                                        return (
                                            <div
                                                key={`${currentIndex}-${offset}`}
                                                className="flex flex-col justify-between p-6 bg-white rounded-xl border border-zinc-100 text-left min-h-[280px] shadow-xs"
                                            >
                                                <div>
                                                    <div className="flex space-x-0.5 mb-3 text-red-600">
                                                        {Array.from({ length: item.rating }).map((_, i) => (
                                                            <svg className="w-5 h-5 fill-current" key={i} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" /></svg>
                                                        ))}
                                                    </div>
                                                    <p className="text-zinc-600 text-sm leading-relaxed select-none">
                                                        "{item.content}"
                                                    </p>
                                                </div>

                                                <div className="flex items-center mt-6 pt-4 border-t border-zinc-100">
                                                    <span className="text-xl select-none" role="img" aria-label="Avatar">{item.avatar}</span>
                                                    <div className="ml-3">
                                                        <h4 className="text-xs font-bold text-zinc-950 leading-tight">{item.name}</h4>
                                                        <p className="text-[11px] text-zinc-400 mt-0.5">{item.role}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* VISTA MOBILE: Slider adaptativo y limpio */}
                        <div className="md:hidden relative w-full min-h-[240px]">
                            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                <motion.div
                                    key={currentIndex}
                                    custom={direction}
                                    variants={slideVariants as any}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="w-full p-6 bg-white rounded-xl border border-zinc-100 text-left flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex space-x-0.5 mb-3 text-red-600">
                                            {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                                                <svg className="w-5 h-5 fill-current" key={i} viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <p className="text-zinc-600 text-sm leading-relaxed">
                                            "{testimonials[currentIndex].content}"
                                        </p>
                                    </div>

                                    <div className="flex items-center mt-6 pt-4 border-t border-zinc-100">
                                        <span className="text-xl" role="img" aria-label="Avatar">{testimonials[currentIndex].avatar}</span>
                                        <div className="ml-3">
                                            <h4 className="text-xs font-bold text-zinc-950 leading-tight">{testimonials[currentIndex].name}</h4>
                                            <p className="text-[11px] text-zinc-400 mt-0.5">{testimonials[currentIndex].role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Botones de Navegación Manual */}
                    <div className="flex w-full justify-end mt-4 items-center">
                        <div className="flex space-x-3 shrink-0">
                            <button
                                onClick={prevSlide}
                                className="w-10 h-10 cursor-pointer rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-600 hover:border-red-600 hover:text-red-600 active:bg-zinc-50 transition-all duration-200 focus:outline-none"
                                aria-label="Testimonio anterior"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="w-10 h-10 cursor-pointer rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-600 hover:border-red-600 hover:text-red-600 active:bg-zinc-50 transition-all duration-200 focus:outline-none"
                                aria-label="Siguiente testimonio"
                            >
                                <svg fill="none" stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default TestimonialsSection;