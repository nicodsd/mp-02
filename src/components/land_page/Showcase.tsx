"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Showcase() {
    // 1. Definimos las plantillas (puedes agregar más estilos aquí)
    const templates = {
        naranja: {
            name: 'Clasico',
            primary: '#FF1E00',
            appBg: '#fff', // Fondo naranja muy claro
            cardBg: '#ffffff',
            text: '#7c2d12'
        },
        dark: {
            name: 'Medianoche',
            primary: '#10b981',
            appBg: '#1c1917', // Fondo casi negro
            cardBg: '#292524',
            text: '#ffffff'
        },
        azul: {
            name: 'Cielo',
            primary: '#3b82f6',
            appBg: '#eff6ff', // Fondo azul claro
            cardBg: '#ffffff',
            text: '#1e3a8a'
        },
        minimal: {
            name: 'Noche',
            primary: '#000',
            appBg: '#000', // Gris neutro
            cardBg: '#fff3',
            text: '#fff'
        }
    };

    const [activeTheme, setActiveTheme] = useState(templates.naranja);

    return (
        <div id="demo" className="my-10 pb-20 md:pb-10 overflow-hidden md:rounded-4xl w-full relative">
            <div style={{ backgroundColor: activeTheme.primary }} className="w-[130vw] rotate-12 rounded-full translate-y-full translate-x-[-5%] h-full absolute top-0 left-0 z-0"></div>
            <div className="w-[180vw] hidden md:block bg-background-2 -rotate-30 rounded-full translate-y-[50%] md:translate-y-[80%] backdrop-blur-xl translate-x-[-40%] h-full absolute top-0 left-0 z-0"></div>
            <div style={{ backgroundColor: activeTheme.primary }} className="w-[130vw] rotate-12 md:opacity-20 rounded-full translate-y-[50%] md:translate-y-[80%] md:translate-x-[-2%] h-full absolute top-0 left-0 z-0"></div>
            <div className="w-[180vw] hidden md:block bg-background-2 -rotate-16 rounded-full translate-y-[90%] backdrop-blur-xl translate-x-[-40%] h-full absolute top-0 left-0 z-0"></div>
            <div className="w-full relative z-10">
                <div className="text-center md:text-start mb-8 md:mb-12 px-2 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 md:mb-6">
                            Personalización Total, <span style={{ color: activeTheme.primary }}>Experiencia Premium</span>
                        </h2>
                        <p className="text-stone-600 text-base md:text-lg">
                            Cambia el estilo de tu restaurante con un solo clic <strong>desde el panel</strong>.
                        </p>
                    </div>
                </div>
                <AnimatePresence>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex justify-center flex-col items-center gap-4">

                        {/* Mobile Preview Mockup */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }} className="flex justify-center lg:justify-end relative">
                            <div className="relative no-scrollbar w-[255px] h-[500px] md:w-[280px] md:h-[560px] bg-stone-900 rounded-4xl border-5 border-stone-800 overflow-hidden transition-all">

                                {/* SCREEN CONTENT - EL FONDO DE LA APP CAMBIA AQUÍ */}
                                <div
                                    className="w-full h-full overflow-y-auto no-scrollbar relative transition-colors duration-500"
                                    style={{ backgroundColor: activeTheme.appBg }}
                                >
                                    {/* Header Image */}
                                    <div
                                        className="h-50 flex justify-center items-center gap-2 flex-col transition-colors duration-500"
                                        style={{ backgroundColor: activeTheme.primary }}
                                    >
                                        <div className='w-18 h-18 rounded-full bg-white'></div>
                                        <div className="font-bold text-white text-lg">Burger House</div>
                                    </div>

                                    <div className="px-2 space-y-1 w-full py-6 relative">
                                        {/* Search Bar */}
                                        <div className="flex gap-1 px-3 py-2 absolute -top-6 left-1/2 -translate-x-1/2 w-[90%] shadow rounded-lg bg-white z-20 text-xs text-stone-400 border border-stone-100">
                                            <span>Buscar plato...</span>
                                        </div>

                                        {/* Categories */}
                                        <div className="flex gap-1 p-2 overflow-x-auto no-scrollbar ml-2 sticky top-0 z-20 transition-colors">
                                            <span
                                                className="text-white px-3 py-1 rounded-md text-xs font-medium"
                                                style={{ backgroundColor: activeTheme.primary }}
                                            >
                                                Todo
                                            </span>
                                            <span style={{ color: activeTheme.text }} className="bg-stone-200/50 text-stone-500 px-3 py-1 rounded-md text-xs font-medium">Entradas</span>
                                            <span style={{ color: activeTheme.text }} className="bg-stone-200/50 text-stone-500 px-3 py-1 rounded-md text-xs font-medium">Bebidas</span>
                                        </div>

                                        {/* PLATOS - EL FONDO DE LA CARD TAMBIÉN CAMBIA */}
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className="flex gap-3 items-center p-2 rounded-md border transition-all duration-500"
                                                style={{
                                                    backgroundColor: activeTheme.cardBg,
                                                    borderColor: activeTheme.name === 'Dark Mode' ? '#444' : '#eee',
                                                }}
                                            >
                                                <div className="w-16 h-16 bg-stone-200 rounded-md shrink-0"></div>
                                                <div className="flex flex-col w-full">
                                                    <h4 className="font-bold text-sm" style={{ color: activeTheme.text }}>Doble Cheese</h4>
                                                    <p className="text-[10px] opacity-60" style={{ color: activeTheme.text }}>Carne 100% Angus...</p>
                                                    <div className="font-bold text-xs mt-1" style={{ color: activeTheme.text }}>$12.50</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* SELECTOR DE PLANTILLAS */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }} className="flex gap-5 flex-col items-center absolute md:-bottom-12 md:-right-5 bg-background w-fit md:w-fit -bottom-20 mx-auto md:mx-0 p-2 md:p-4 px-6 md:px-8 rounded-t-3xl border border-stone-200">

                            <div className="flex gap-5">
                                {Object.values(templates).map((t) => (
                                    <button
                                        key={t.name}
                                        onClick={() => setActiveTheme(t)}
                                        className={`group cursor-pointer relative flex flex-col items-center gap-1`}
                                    >
                                        <div
                                            className={`w-10 h-10 md:w-13 md:h-13 rounded-full border-4 transition-all ${activeTheme.name === t.name ? 'border-stone-800 scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: t.primary }}
                                        />
                                        <span className="text-[10px] text-black uppercase">{t.name}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}