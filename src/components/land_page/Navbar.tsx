"use client"
import React, { useState, useEffect } from 'react';
import { Menu, X, UtensilsCrossed } from 'lucide-react';
import { logotipo } from '@/src/lib/const';
import Image from 'next/image';
import BotonAccion from '@/src/components/buttons/index/BotonAction';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Demo', href: '#demo' },
    { name: 'Características', href: '#caracteristicas' },
    { name: 'Planes', href: '#planes' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 px-4 ${scrolled
      ? 'bg-background border-b border-bone-300 py-2'
      : 'border bg-white border-bone-300 py-5'
      }`}>
      {/* Contenedor con Padding Lateral de seguridad (px-4) */}
      <div className="max-w-7xl mx-auto md:px-14">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <div
            className="shrink-0 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {/* Ajusté el tamaño del logo para que en móvil no sea invasivo */}
            <Image
              src={logotipo}
              alt="Logo"
              priority
              className="w-24 h-auto md:w-28"
              width={112}
              height={40}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-baseline gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-stone-600 hover:text-primary-600 px-1 py-2 text-sm font-semibold transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                </a>
              ))}
            </div>
            <BotonAccion color="primary" textColor="white" />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-xl border border-bone-300 text-stone-600 hover:bg-bone-200 transition-colors focus:outline-none"
            >
              <span className="sr-only">Abrir menú</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Animado y contenido */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full md:hidden bg-background border-b border-bone-300 shadow-2xl animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-stone-600 hover:text-primary hover:bg-primary-50 block px-4 py-3 rounded-xl text-base font-bold transition-all"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 px-2">
              <a
                href="#pricing"
                onClick={() => setIsOpen(false)}
                className="w-full text-center block bg-primary text-white px-4 py-4 rounded-xl text-lg font-black shadow-lg shadow-primary-600/20 active:scale-[0.98] transition-transform"
              >
                Crear Mi Menú Gratis
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};