"use client";
import React, { useState } from 'react';
import { Send, Mail, MapPin, Loader2 } from 'lucide-react';
import emailjs from 'emailjs-com';
import Navbar from "@/src/components/land_page/Navbar";
import Footer from "@/src/components/land_page/Footer";

export default function ContactoPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        restaurant: '',
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
                setFormData({ name: '', email: '', restaurant: '', message: '' });
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
            <div className="flex selection:bg-primary selection:text-white relative bg-background-2 flex-col items-center w-full min-h-auto">
                <Navbar isIndex={false} />
                <main className="grow md:rounded-b-2xl border-x border-gray-300 bg-background w-full relative flex flex-col items-center justify-start md:max-w-7xl mx-auto px-4 border-b md:px-14 pt-40 pb-20">
                    <section id="contacto" className="w-full relative">
                        <div className="w-full">
                            {/* Layout: Stack en móvil, 2 columnas en LG */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                                <div className="text-center md:text-start mb-12 md:mb-16 px-2">
                                    <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">Contacto</h1>
                                    <p className="text-stone-600 text-base md:text-md mb-8 lg:mx-0">
                                        Únete a miles de restaurantes que ya usan QMenú. <br /> Si tienes dudas, quieres realizar un reembolso o necesitas un plan personalizado, comunicate por aquí.
                                    </p>

                                    <div className="space-y-3 max-w-md mx-auto lg:mx-0">
                                        <div className="flex items-center text-left p-4 rounded-xl border border-gray-300">
                                            <div className="mr-4 shrink-0">
                                                <MapPin className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="text-stone-900 font-semibold text-sm md:text-base">Ubicación</h4>
                                                <p className="text-stone-500 text-xs md:text-sm">Santiago del Estero, Argentina.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Card */}
                                <div className="p-6 md:p-8 rounded-2xl border border-gray-300">
                                    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-bold text-stone-700 mb-2">Nombre completo</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base text-stone-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                placeholder="Tu nombre"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-bold text-stone-700 mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base text-stone-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                    placeholder="email@ejemplo.com"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="restaurant" className="block text-sm font-bold text-stone-700 mb-2">Restaurante</label>
                                                <input
                                                    type="text"
                                                    id="restaurant"
                                                    name="restaurant"
                                                    value={formData.restaurant}
                                                    onChange={handleChange}
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base text-stone-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                                    placeholder="Ej. La Trattoria"
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
                                </div>

                            </div>
                        </div>
                    </section>
                </main>
            </div>
            <Footer />
        </>
    );
}
