"use client";
import React from 'react';
import Link from 'next/link';
import { BookOpen, Settings, Tag, Utensils, Zap, HelpCircle, ArrowRight } from 'lucide-react';
import Navbar from "@/src/components/land_page/Navbar";
import Footer from "@/src/components/land_page/Footer";
import { useRouter } from 'next/navigation';
import { MdChevronLeft } from 'react-icons/md';

const guides = [
  {
    title: "¿Cómo crear un menú digital?",
    description: "La guía definitiva para digitalizar el menú de tu restaurante paso a paso.",
    href: "/guias/como-crear-un-menu-digital",
    icon: <BookOpen className="w-8 h-8 text-blue-900" />,
    color: "bg-orange-50",
    date: "Actualizado hoy"
  },
  {
    title: "Creación de Platos",
    description: "Aprende a cargar platos con fotos atractivas, descripciones, precios y variantes/adicionales para potenciar tus ventas.",
    href: "/guias/como-crear-platos-para-menu-digital",
    icon: <Utensils className="w-8 h-8 text-blue-900" />,
    color: "bg-blue-50",
    date: "Actualizado recientemente"
  },
  {
    title: "Personalización Visual",
    description: "Configura colores, tipografías y el logo de tu marca para que tu menú sea único.",
    href: "/guias/como-personalizar-tu-menu-digital",
    icon: <Settings className="w-8 h-8 text-blue-900" />,
    color: "bg-green-50",
    date: "Actualizado recientemente"
  },
  {
    title: "Creación de Promociones",
    description: "Descubre cómo crear combos, aplicar descuentos y destacar ofertas especiales en la cabecera de tu menú.",
    href: "/guias/como-crear-promociones-en-tu-restaurante",
    icon: <Tag className="w-8 h-8 text-blue-900" />,
    color: "bg-yellow-50",
    date: "Actualizado recientemente"
  },
  {
    title: "Características del Menú",
    description: "Conoce a fondo todas las funcionalidades que ofrece nuestra plataforma para tu local gastronómico.",
    href: "/guias/caracteristicas-menu-digital",
    icon: <Zap className="w-8 h-8 text-blue-900" />,
    color: "bg-purple-50",
    date: "Artículo clásico"
  },
  {
    title: "¿Cuánto sale crear un menú?",
    description: "Análisis de costos y planes para adaptar la tecnología a tu presupuesto.",
    href: "/guias/cuanto-sale-crear-un-menu-digital",
    icon: <HelpCircle className="w-8 h-8 text-blue-900" />,
    color: "bg-red-50",
    date: "Artículo clásico"
  }
];


export default function GuiasPage() {
  const router = useRouter();
  return (
    <>
      <div className="flex selection:bg-primary selection:text-white relative bg-background flex-col items-center w-full min-h-screen mb-20">
        <Navbar isIndex={false} />
        <main className="w-full relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-40 pt-28 grow">
          <div className='relative bg-blue-700 w-full h-150 md:h-100 bg-radial rounded-3xl p-5 md:p-10 mb-3'>
            <button
              type="button"
              onClick={() => {
                router.push("/");
              }}
              className="flex items-center text-white text-sm cursor-pointer font-semibold hover:opacity-80 transition-opacity"
            >
              <MdChevronLeft className="text-xl mr-1" />
              Inicio
            </button>
            <div className='flex flex-col md:flex-row justify-between'>
              <div className="text-center w-full md:w-[70%] md:text-start md:mb-16 mt-5">
                <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
                  Guías y Recursos de <span className="text-orange-400">QMenú</span>
                </h1>
                <p className="text-xl text-white/80">
                  Todo lo que necesitas saber para sacarle el máximo provecho a tu menú digital, aumentar tus ventas y mejorar la experiencia de tus clientes.
                </p>
              </div>
              <video className='w-30 border-3 md:-translate-y-27 mt-6 border-white md:w-50 rounded-3xl shadow-lg object-cover relative top-0 left-0 right-0 mx-auto' autoPlay loop muted>
                <source src="/videos/recording-screen-qmenu-app.webm" type="video/webm" />
              </video>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {guides.map((guide, idx) => (
              <Link
                key={idx}
                href={guide.href}
                className="group relative bg-background rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full transform hover:-translate-y-1"
              >
                <div className={`w-16 h-16 rounded-2xl ${guide.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {guide.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                  {guide.title}
                </h3>
                <p className="text-slate-600 mb-8 grow leading-relaxed">
                  {guide.description}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-6">
                  <span className="text-sm font-medium text-slate-400">
                    {guide.date}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-colors text-slate-400">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main >
      </div >
      <Footer />
    </>
  );
}
