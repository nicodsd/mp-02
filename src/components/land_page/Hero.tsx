"use client";
import { ArrowRight, QrCode, Smartphone } from 'lucide-react';
import HeroImage from '@/public/images/placeholders/hero_image_preview.webp';
import Image from 'next/image';

export default function Hero() {
  return (
    <div id="inicio" className="relative border-b border-bone-300 w-full pt-26 pb-16 md:pt-50 lg:pb-20 overflow-hidden">
      <div className="relative flex flex-col md:flex-row md:grid md:grid-cols-2 items-center md:items-end justify-between z-10">
        {/* Alineación central en móvil, izquierda en desktop */}
        <div className="text-start w-full flex md:pb-5 flex-col items-start md:items-start">
          <div className='w-full flex items-center justify-center'>
            <Image
              src={HeroImage}
              alt="Hero Image"
              className="w-100 h-auto mb-10 drop-shadow-sm md:hidden"
              width={1920}
              height={1080}
              priority
            />
          </div>
          {/* Tamaño de fuente fluido: text-4xl en móvil, 7xl en desktop */}
          <h1 className="text-5xl sm:text-6xl font-extrabold text-[#B10000] tracking-tight leading-none mb-6 md:mb-8">
            tu menú
            <br className="block" />
            en el móvil
            <br className="block" />
            <span className='text-5xl sm:text-6xl leading-none md:text-6xl font-black' style={{
              lineHeight: "1.1",
              background: "linear-gradient(90deg, #BE0000 0%, #FF2020 50%, #FF8800 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              de tus clientes
            </span>
          </h1>

          <p className="max-w-2xl sm:w-[60%] text-base md:text-lg text-stone-600 leading-relaxed font-medium mb-8 md:mb-10">
            Sube tus platos, actualiza precios en tiempo real y genera tu código QR en minutos. Moderniza la experiencia de tu restaurante.
          </p>

          {/* Botones full width en móvil pequeño */}
          <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full sm:w-auto">
            <a href="#planes" className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-linear-to-r from-primary to-orange-500 hover:bg-primary-600 text-white px-4 py-3 rounded-lg tracking-tight font-black text-md transition-all hover:-translate-y-1">
              Crea tu Menú
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="/ejemplo" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-bone-50 text-stone-700 px-4 py-3 rounded-lg font-semibold text-md tracking-tight border border-bone-300 transition-all hover:-translate-y-1">
              <Smartphone className="h-5 w-5 text-stone-500" />
              Ver Ejemplo
            </a>
          </div>
        </div>
        <div className="h-full w-full flex items-center justify-end">
          <Image
            src={HeroImage}
            alt="Hero Image"
            className="w-auto h-auto hidden md:block"
            width={1920}
            height={1080}
            priority
          />
        </div>
      </div>
    </div>
  );
}