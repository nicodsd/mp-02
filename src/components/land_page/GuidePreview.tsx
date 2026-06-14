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
    icon: <BookOpen className="w-13 h-13 text-blue-700" />,
    color: "bg-orange-50",
    date: "Actualizado hoy"
  },
  {
    title: "Creación de Platos",
    description: "Aprende a cargar platos con fotos atractivas, descripciones, precios, variantes, etc.",
    href: "/guias/como-crear-platos-para-menu-digital",
    icon: <Utensils className="w-13 h-13 text-blue-700" />,
    color: "bg-blue-50",
    date: "Actualizado recientemente"
  },
  {
    title: "Personalización Visual",
    description: "Configura colores, tipografías y el logo de tu marca para que tu menú sea único.",
    href: "/guias/como-personalizar-tu-menu-digital",
    icon: <Settings className="w-13 h-13 text-blue-700" />,
    color: "bg-green-50",
    date: "Actualizado recientemente"
  }
];

export default function GuidePreview() {
  return (
    <section className="py-20 md:py-0 md:pb-40 relative overflow-hidden w-full">
      <div className="w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
          {/* Columna Derecha: Contenedor vertical de tarjetas (Toma las 2 columnas restantes en escritorio `md:col-span-2`) */}
          <div className="flex items-end flex-col gap-2 md:col-span-2 md:pl-12 justify-end h-full w-full">
            <div className="text-center w-full md:text-start mb-8 md:mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
              <div>
                <motion.h2 initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
                  Nuestras <span className="text-blue-700">guías</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-base text-zinc-500"
                >
                  Recursos útiles para sacar el máximo provecho de tu menú digital.
                </motion.p>
              </div>
            </div>
            <div className="w-full md:hidden md:invisible mb-4 md:mb-0 flex justify-center md:items-center">
              <video
                className="w-50 h-auto border-3 border-white rounded-3xl shadow-xl object-cover"
                autoPlay
                loop
                muted
              >
                <source src="/videos/recording-screen-qmenu-app.webm" type="video/webm" />
              </video>
            </div>
            {topGuides.map((guide, idx) => (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className="w-full"
              >
                <Link
                  href={guide.href}
                  className="group relative hover:bg-background-2 rounded-xl py-2 px-4 hover:shadow-xl gap-2 md:gap-4 transition-all duration-300 border border-gray-300 hover:border-blue-600 flex flex-col md:flex-row h-full transform hover:-translate-y-1"
                >
                  <div className='flex w-full md:w-40 justify-between'>

                    <div className="w-16 h-16 group-hover:scale-105 group-hover:shadow-sm group-hover:-translate-y-1 aspect-square rounded-full flex items-center transition-all justify-center">
                      {guide.icon}
                    </div>
                    <div className="w-8 h-8 md:hidden aspect-square rounded-full bg-stone-50 group-hover:bg-primary group-hover:text-white text-blue-700 flex items-center transition-colors md:text-stone-400">
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
                    </div>
                  </div>

                  <div className='w-full'>
                    <h3 className="text-xl md:text-2xl font-bold text-pretty text-gray-500 mb-1 group-hover:text-blue-600 transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-stone-600 grow text-sm leading-relaxed">
                      {guide.description}
                    </p>
                  </div>
                  <div className="w-8 h-8 hidden aspect-square rounded-full bg-stone-50 group-hover:bg-primary group-hover:text-white text-blue-700 md:flex items-center transition-colors md:text-stone-400">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="flex md:my-8 mt-2 justify-center">
              <Link href="/guias" className="w-full cursor-pointer bg-blue-700 px-6 py-3 hover:bg-blue-900 transition-all rounded-lg flex items-center justify-center gap-2 text-white hover:shadow-sm">
                <span className="text-md font-bold text-white">Ver todas las guías</span>
                <ArrowRight className="text-white w-5 h-5" />
              </Link>
            </motion.div>
          </div>
          {/* Columna Izquierda: Video (Ocupa 1 columna en escritorio) */}
          <motion.div initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="p-8 bg-background-2/70 shadow-inner w-fit rounded-4xl invisible md:visible hidden md:flex h-150 justify-center md:items-center">
            <video
              className="w-30 border-4 border-blue-700 md:w-65 rounded-3xl shadow-xl object-cover"
              autoPlay
              loop
              muted
            >
              <source src="/videos/recording-screen-qmenu-app.webm" type="video/webm" />
            </video>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
