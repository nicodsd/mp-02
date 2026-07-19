"use client";
import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { motion } from "framer-motion";
import Navbar from "@/src/components/land_page/Navbar";
import Footer from "@/src/components/land_page/Footer";


export default function ContactoPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        setTimeout(() => {
            if (formData.name && formData.email) {
                emailjs.send(
                    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
                    formData,
                    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
                );
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
            }
            setTimeout(() => setStatus('idle'), 3000);
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <>
            {/* Contenedor principal: ahora incluye al Footer dentro de su estructura Flexbox */}
            <div className="flex flex-col items-center w-full min-h-screen selection:bg-primary selection:text-white relative">
                <Navbar isIndex={false} />

                {/* 'grow' hace que el main ocupe todo el espacio disponible, empujando al footer al fondo */}
                <main className="grow md:rounded-b-2xl bg-background w-full relative flex flex-col items-center justify-start md:max-w-7xl mx-auto px-4 pt-30">
                    <section id="contacto" className="w-full p-6 relative border rounded-2xl border-gray-300">
                        <div className="w-full">
                            {/* Layout: Stack en móvil, 2 columnas en LG */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

                                <div className="text-center md:text-start md:mb-16 px-2">
                                    <motion.h1 initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">Contacto</motion.h1>
                                    <motion.p initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-stone-600 text-base md:text-md mb-8 lg:mx-0">
                                        Si tienes dudas, quieres realizar un reembolso, un reclamo o necesitas un plan personalizado, comunicate por aquí.
                                    </motion.p>
                                </div>

                                {/* Form Card */}
                                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="p-6 md:p-8 rounded-2xl border border-gray-300">
                                    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                                        <div className='flex flex-col md:flex-row gap-4'>
                                            <div className='md:flex-1'>
                                                <label htmlFor="name" className="block text-sm font-bold text-stone-700 mb-2">Nombre</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base text-stone-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                                                    placeholder="Pizzería La Esquina"
                                                />
                                            </div>
                                            <div className='md:flex-1'>
                                                <label htmlFor="email" className="block text-sm font-bold text-stone-700 mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base text-stone-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                                                    placeholder="email@ejemplo.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-bold text-stone-700 mb-2">Mensaje</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                rows={4}
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base text-stone-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                                                placeholder="¿En qué podemos ayudarte?"
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="w-full bg-primary hover:bg-primary-500 hover:shadow-md text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 cursor-pointer"
                                        >
                                            {status === 'loading' ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <>
                                                    Contactar
                                                    <Send className="h-5 w-5" />
                                                </>
                                            )}
                                        </button>
                                        {status === 'success' && (
                                            <p className="text-green-600 text-sm text-center font-medium mt-2 transition-all">¡Mensaje enviado con éxito!</p>
                                        )}
                                        {status === 'error' && (
                                            <p className="text-red-600 text-sm text-center font-medium mt-2 transition-all">Error al enviar el mensaje. Intenta de nuevo.</p>
                                        )}
                                    </form>
                                </motion.div>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        </>
    );
}
