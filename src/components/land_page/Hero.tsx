import { ArrowRight, Smartphone } from 'lucide-react';
import HeroImage from '@/public/images/placeholders/hero_image_preview.webp';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <div id="inicio" className="relative w-full pt-30 md:pt-50 pb-30 overflow-hidden">
      <div className="relative w-full flex flex-col md:flex-row items-center justify-between z-10">
        <div className="order-2 md:order-1 text-center w-full z-10 flex md:pb-5 flex-col items-center md:justify-center">
          <h1 className="text-[3.5rem] md:text-[5rem] leading-none text-primary px-2 text-balance font-black mb-4 md:mb-8">
            Tu menú digital gratis
            <br />
            <span className='text-red-900 leading-none text-[1.5rem] md:text-3xl'>y con QR para tu restaurante</span>
          </h1>

          <p className="max-w-2xl sm:w-[60%] text-base md:text-lg text-gray-700 leading-relaxed font-medium mb-4 md:mb-6">
            Sube tus platos, actualiza precios en tiempo real y vende por WhatsApp.
          </p>

          {/* Botones full width en móvil pequeño */}
          <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full sm:w-auto">
            <a href="#planes" className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-linear-to-r from-red-700 to-red-600 hover:bg-red-800 text-white px-4 py-3 rounded-lg tracking-tight font-black text-md transition-all hover:-translate-y-1">
              Crear Menú Gratis
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </a>
            <Link href="/ejemplo" prefetch={false} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-4 py-3 rounded-lg font-semibold text-md tracking-tight border border-gray-300 transition-all hover:-translate-y-1">
              <Smartphone className="h-5 w-5 text-white" aria-hidden="true" />
              Ver Demo en Vivo
            </Link>
          </div>
        </div>
        <div className="order-1 md:order-2 h-full relative w-full flex items-center justify-center md:justify-end">
          <Image
            src={HeroImage}
            alt="Vista previa de QMenú, menú digital QR en celular para restaurantes"
            className="w-80 md:w-full h-auto mb-10 md:mb-0 z-10"
            sizes="(max-width: 767px) 320px, (max-width: 1280px) 48vw, 600px"
            priority
            fetchPriority="high"
            decoding="sync"
          />
        </div>
      </div>
    </div>
  );
}