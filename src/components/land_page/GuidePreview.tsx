"use client";
import React from 'react';
import Link from 'next/link';
import { BookOpen, Settings, Utensils, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const topGuides = [
  {
    title: "¿Cómo crear un menú digital?",
    description: "La guía definitiva para digitalizar el menú de tu restaurante paso a paso.",
    href: "/guias/como-crear-un-menu-digital",
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    color: "bg-orange-50",
    date: "Actualizado hoy"
  },
  {
    title: "Creación de Platos",
    description: "Aprende a cargar platos con fotos atractivas, descripciones, precios y variantes/adicionales para potenciar tus ventas.",
    href: "/guias/como-crear-platos-para-menu-digital",
    icon: <Utensils className="w-8 h-8 text-primary" />,
    color: "bg-blue-50",
    date: "Actualizado recientemente"
  },
  {
    title: "Personalización Visual",
    description: "Configura colores, tipografías y el logo de tu marca para que tu menú sea único.",
    href: "/guias/como-personalizar-tu-menu-digital",
    icon: <Settings className="w-8 h-8 text-primary" />,
    color: "bg-green-50",
    date: "Actualizado recientemente"
  }
];

export default function GuidePreview() {
  return (
    <section className="py-20 md:py-0 md:pb-40 relative overflow-hidden w-full">
      <div className="w-full relative z-10">
        <div className="text-center md:text-start mb-12 md:mb-16 px-2 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <motion.h2 initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 md:mb-6">
              Aprende y crece con nuestras guías
            </motion.h2>
            <motion.p initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-stone-600 text-base md:text-lg">
              Recursos útiles para sacar el máximo provecho de tu menú digital.
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <Link href="/guias" className="w-fit cursor-pointer bg-stone-900 px-6 py-3 hover:bg-stone-800 transition-all rounded-lg items-center justify-center gap-2 text-white hover:shadow-sm hidden md:flex">
              <span className="text-md font-bold text-white">Ver todas las guías</span>
              <ArrowRight className="text-white w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2 px-2">
          {topGuides.map((guide, idx) => (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} key={idx}>
              <Link
                href={guide.href}
                className="group relative bg-white rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-300 flex flex-col h-full transform hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl ${guide.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {guide.icon}
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-primary transition-colors">
                  {guide.title}
                </h3>
                <p className="text-stone-600 mb-6 grow text-sm leading-relaxed">
                  {guide.description}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-xs font-medium text-stone-400">
                    {guide.date}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-stone-50 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-colors text-stone-400">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="flex justify-center mt-8 md:hidden px-2">
          <Link href="/guias" className="w-full cursor-pointer bg-stone-900 px-6 py-3 hover:bg-stone-800 transition-all rounded-lg flex items-center justify-center gap-2 text-white hover:shadow-sm">
            <span className="text-md font-bold text-white">Ver todas las guías</span>
            <ArrowRight className="text-white w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
