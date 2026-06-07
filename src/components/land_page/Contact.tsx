"use client";
import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { motion } from "framer-motion";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // 1. Validar que las variables existen
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error("Faltan variables de entorno");
      }

      // 2. Enviar usando async/await en lugar de setTimeout (más limpio)
      await emailjs.send(
        serviceId,
        templateId,
        formData,
        publicKey
      );

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error("Error en EmailJS:", error);
      setStatus('error');
    } finally {
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contacto" className="py-10 md:py-0 md:pb-20 relative w-full">
      <div className="w-full">
        {/* Layout: Stack en móvil, 2 columnas en LG */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 md:p-6 px-2 shadow items-start bg-white rounded-2xl py-6">

          <div className="text-center md:text-start md:mb-16 px-2">
            <motion.h2 initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl leading-none md:text-5xl font-bold text-stone-900 mb-4">Crea tu menú QR hoy mismo o agenda una asesoría</motion.h2>
            <motion.p initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-stone-600 text-base md:text-md mb-8 lg:mx-0 text-pretty">
              Únete a miles de restaurantes que ya usan QMenú. Si tienes dudas o necesitas un plan personalizado, escríbenos.
            </motion.p>
          </div>

          {/* Form Card */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-stone-700 mb-2">Nombre</label>
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

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-stone-700 mb-2">Email</label>
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
                <label htmlFor="message" className="block text-sm font-semibold text-stone-700 mb-2">Mensaje</label>
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
  );
}