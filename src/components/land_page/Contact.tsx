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
    <section id="contacto" className="pb-10 md:py-0 md:pb-4 relative w-full">
      <div className="w-full">
        {/* Layout: Stack en móvil, 2 columnas en LG */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 md:p-6 shadow items-start bg-stone-900 rounded-2xl p-6 md:px-12">

          <div className="text-center md:text-start md:mt-10">
            <motion.h2 initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl text-pretty leading-none md:text-5xl font-bold text-white mb-4">¿Quieres que armemos tu menú?</motion.h2>
            <motion.p initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-white text-base md:text-md mb-8 lg:mx-0 text-pretty">
              Si quieres que te carguemos tu menú, tienes dudas o necesitas un plan personalizado, escríbenos.
            </motion.p>
          </div>

          {/* Form Card */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">

              <div className='flex flex-col md:flex-row gap-4'>
                <div className='md:flex-1'>
                  <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">Nombre</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-600 rounded-lg px-4 py-3 text-base text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="Pizzería La Esquina"
                  />
                </div>
                <div className='md:flex-1'>
                  <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-600 rounded-lg px-4 py-3 text-base text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="email@ejemplo.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-white mb-2">Mensaje</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border border-gray-600 rounded-lg px-4 py-3 text-base text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Ej: Me gustaría un plan personalizado"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-stone-500 hover:bg-stone-600 text-lg hover:shadow-md text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 cursor-pointer group"
              >
                {status === 'loading' ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Contactar
                    <Send className="h-5 w-5 group-hover:translate-x-4 group-hover:rotate-45 transition-all" />
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