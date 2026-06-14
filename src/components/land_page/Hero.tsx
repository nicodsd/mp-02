"use client";
import { ArrowRight, QrCode, Smartphone } from 'lucide-react';
import HeroImage from '@/public/images/placeholders/hero_image_preview.webp';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <div id="inicio" className="relative w-full pt-30 md:pt-50 pb-30 overflow-hidden">
      <div className="relative w-full flex flex-col md:flex-row items-center md:items-end justify-between z-10">
        <div className="text-center w-full z-10 flex md:pb-5 flex-col items-center md:justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className='w-full flex items-center justify-center'>
            <Image
              src={HeroImage}
              alt="Hero Image"
              className="w-80 h-auto mb-10 drop-shadow-sm md:hidden"
              width={1920}
              height={1080}
              priority
            />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-[3.5rem] md:text-7xl leading-none text-primary px-2 text-balance font-black mb-4 md:mb-8">
            Tu menú digital gratis
            <br />
            <span className='text-red-900 leading-none text-[1.5rem] md:text-3xl'>y con QR para tu restaurante</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="max-w-2xl sm:w-[60%] text-base md:text-lg text-gray-700 leading-relaxed font-medium mb-4 md:mb-6">
            Sube tus platos, actualiza precios en tiempo real y genera tu código QR en minutos. Moderniza la experiencia de tu restaurante.
          </motion.p>

          {/* Botones full width en móvil pequeño */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full sm:w-auto">
            <Link href="#planes" className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-linear-to-r from-primary to-orange-500 hover:bg-primary-600 text-white px-4 py-3 rounded-lg tracking-tight font-black text-md transition-all hover:-translate-y-1">
              Crear Menú Gratis
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/ejemplo" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-4 py-3 rounded-lg font-semibold text-md tracking-tight border border-gray-300 transition-all hover:-translate-y-1">
              <Smartphone className="h-5 w-5 text-white" />
              Ver Demo en Vivo
            </Link>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="h-full relative w-full flex items-center justify-end">
          <Image
            src={HeroImage}
            alt="Hero Image"
            className="w-auto h-auto hidden md:block z-10"
            width={1920}
            height={1080}
            priority
          />
        </motion.div>
      </div>
    </div>
  );
}