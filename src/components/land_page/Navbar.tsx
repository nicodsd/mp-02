"use client"
import React, { useState, useEffect } from 'react';
import { Menu, X, UtensilsCrossed } from 'lucide-react';
import BotonAccion from '@/src/components/buttons/index/BotonAction';
import Link from 'next/link';

export default function Navbar({ isIndex }: { isIndex: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  let navLinks: any = [];
  if (isIndex) {
    navLinks = [
      { name: 'Inicio', href: 'inicio' },
      { name: 'Características', href: 'caracteristicas' },
      { name: 'Demo', href: 'demo' },
      { name: 'Planes', href: 'planes' },
      { name: 'Preguntas', href: 'faq' },
      { name: 'Contacto', href: 'contacto' }
    ];
  }

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const logoOnClick = () => {
    if (isIndex) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = '/';
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all  border-amber-300 duration-300 ${scrolled
      ? ' shadow-md border-b-3 md:shadow-none bg-background'
      : 'bg-background border-b'
      }`}>
      <div className={`${scrolled ? 'hidden py-0' : 'w-full block md:py-6 py-2'} flex items-center justify-center gap-2 sm:gap-4 z-100 bg-blue-400 text-white transform transition-transform duration-300 text-center px-4 text-sm sm:text-md leading-5 md:text-lg font-bold`}>
        <span className='text-xs'>
          ⭐⭐⭐
        </span>
        <p>Creá tu menú mundialista gratis en 5 minutos</p>
        <span className='text-xs'>
          ⭐⭐⭐
        </span>
      </div>
      <div className="max-w-7xl px-4 p-2 mx-auto md:px-14">
        <div className="flex items-center justify-between">
          <div
            className="shrink-0 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            onClick={() => { logoOnClick() }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="40" fill="none" viewBox="0 0 2507 898"><path fill="#50a2ff" d="M1636.41 417.827c1.54-8.993.48-31.922-1.14-40.915-18.63-103.262-61.65-153.657-139.92-169.294-132.35-23.617-236.34 58.579-235.04 192.385-7.21 149.97 45.65 271.866 214.83 264.007l2.26-.122c33.06-1.985 64.09-10.573 93.34-25.035 43.35-21.835 91.03-77.456 48.82-112.012-58.66-54.73-95.33 18.919-147.91 31.234-39.38 9.236-80.13-18.473-92.73-58.7-.61-2.147-.77-8.386-.93-14.26-.16-5.793 5.06-10.127 10.82-9.115 65.71 11.83 98.03 0 161.96-17.419 5.26-2.35 17.5-5.55 23.01-7.17 22.6-6.725 57.6-4.457 62.63-33.543zm-149.61-20.012c-29.41 2.998-70.32 8.629-99.09 12.032-10.04 1.175-18.39-7.738-16.57-17.703 3.57-19.526 10.62-37.473 22.53-51.611 22.85-25.764 88.59-29.856 118.82-11.343 30.26 14.26 33.74 58.943-4.58 65.627-6.97 1.216-14.02 2.269-21.07 2.998zm202.77 228.596c-3.93 22.929 7.09 33.26 18.64 34.88 18.63 1.985 47.72 1.013 68.3 1.134 6.72 0 13.32-.202 19.44-.648 20.7-1.337 16.81-8.993 17.34-31.355V398.904c0-9.155 2.47-18.229 7.13-26.129l.12-.162c14.26-30.95 66.88-69.921 98.77-55.945 50.11 22.2 27.95 88.11 22.28 132.955-13.7 108.326-5.55 137.615-4.82 170.469-1.22 17.946 9.56 33.826 20.09 39.011l3.69 1.337c23.25 6.928 58.17 2.593 84.66 3.201 8.83-.77 20.06-.608 24.47-9.277 6.48-43.59-11.38-63.48-9.48-133.077.12-46.588 13.25-170.955-1.25-215.557-27.19-102.897-164.48-150.375-227.35-41.321-.89 1.297-2.27 3.646-3.93 6.604-3.93 7.008-14.62 4.253-14.58-3.808.12-17.096.2-32.814.08-39.417-.16-5.186-1.05-10.006-6.48-11.829l-.89-.324c-6.53-2.107-20.42-2.066-38.89-2.107-22 .122-45.86-.405-57.37.972-6.52.811-26.53-2.592-29.16 6.928-16.37 92.04 26.45 203.97 9.15 405.105zm803.96-369.79c3.89-22.522-7.01-32.733-18.44-34.297-18.45-1.935-47.23-.988-67.6-1.112-6.66 0-13.19.206-19.25.618-20.48 1.317-16.64 8.852-17.16 30.838V485.13c0 9.016-2.44 17.951-7.05 25.691l-.12.165c-14.12 30.427-66.2 68.759-97.75 55.007-49.6-21.822-27.67-86.669-22.06-130.724 13.56-106.514 5.5-140.111 4.78-172.431 1.2-17.622-9.47-33.268-19.89-38.373l-3.65-1.318c-23.01-6.793-57.58-2.552-83.8-3.129-8.74.782-19.84.618-24.21 9.14-6.42 42.861 11.26 67.277 9.38 135.706-.12 45.784-13.11 168.108 1.24 211.957 26.9 101.162 162.78 147.893 225.01 40.638.88-1.277 2.25-3.582 3.89-6.506 3.89-6.917 14.47-4.158 14.43 3.747-.12 16.799-.2 32.238-.08 38.785.16 5.105 1.05 9.84 6.42 11.611l.88.288c6.46 2.1 20.21 2.058 38.49 2.1 21.77-.083 45.39.37 56.78-.988 6.45-.783 26.26 2.511 28.86-6.794 16.2-90.498-26.18-205.37-9.06-403.164zm-223.52-105.66c12.11 10.654 24.55 36.419 37.31 41.806l.97.243c5.59 2.553 16.61-8.547 27.1-18.715 4.94-4.781 20.78-26.17 25.65-31.031 50.31-50.598 72.18-32.125 87.86-51.651 2.51-5.145.69-8.67-3.08-13.612-8.63-10.37-22.52-22.767-33.21-33.38a1.7 1.7 0 0 1-.33-.284c-17.46-14.462-42.21-15.759-60.04-1.783-31.76 24.874-28.47 65.506-56.51 80.9-11.66 6.401-36.42 16.69-25.68 27.507zM1211.35 630.465c-1.74-90.611-24.2-324.191-32.68-384.136-1.94-16.771-11.11-43.695-29.29-53.431-26.54-12.128-58.29-7.97-87.05-4.644-16 2.946-24.72 5.96-36.56 13.653-25.09 17.983-42.012 63.445-54.939 111.332-4.323 16.459-7.999 40.784-11.311 63.653-3.474 24.082-9.17 24.082-12.644 0s-6.989-47.194-11.311-63.653c-12.887-47.887-25.773-93.349-50.899-111.332-11.796-7.658-24.602-10.707-40.598-13.653-28.763-3.326-60.474-7.484-87.054 4.644-18.179 9.736-27.308 36.66-29.288 53.431-8.483 59.945-30.903 293.525-32.68 384.136-2.505 17.603 16.845 33.265 35.185 39.571 27.389 9.598 59.261 11.504 87.094 3.916 17.128-8.351 12.644-29.661 13.452-44.561-.646-76.994-1.333-155.2-2.383-232.852-1.212-15.108 7.19-31.844 21.087-12.405 8.362 14.38 10.543 31.463 15.189 47.194 13.775 53.085 8.281 118.228 26.419 157.453 7.513 21.206 42.537 34.858 67.784 34.061 25.208.797 52.837-12.855 60.397-34.061 18.09-39.225 8.56-104.368 22.38-157.453 4.64-15.731 6.82-32.848 15.18-47.194 13.9-19.404 22.3-2.703 21.09 12.405-1.05 77.617-1.74 155.858-2.38 232.852.81 14.865-3.68 36.21 13.45 44.561 27.83 7.588 67.1 5.682 94.49-3.916 18.34-6.306 30.33-21.968 27.83-39.571zm-742.147 65.892c-2.826 6.387-11.459 25.897-3.871 34.258 5.612 6.193 15.329 1.006 27.561 9.716 3.716 2.671 8.013 5.69 8.864 11.303 1.162 7.549 2.362 4.297.426 14.284-1.471 7.51-.464 18.348 5.69 23.458 10.181 8.439 18.852 1.742 29.962 9.407 7.858 5.419 7.471 17.69 7.122 30.425-.619 20.904.968 5.226-.967 24.426-.426 4.375-3.562 38.633 11.109 43.704 16.026 5.535 35.691-30.697 42.465-38.362 9.716-11.071 27.445-31.316 31.974-58.8 4.49-27.445-11.961-33.755-27.484-59.806-19.703-33.058-21.716-11.884-56.593-57.639-15.058-19.742-20.168-29.845-32.129-29.381-18.62.697-36.775 26.323-44.129 42.968z" /><path fill="#50a2ff" d="M542.128 221.577c-5.033-6.425-11.188-14.284-16.839-20.554-5.574-8.246-16.181-12.542-23.613-3.988-2.09 2.4-3.097 6-2.826 9.329 2.09 25.2 8.129 46.8 13.007 70.104 8.593 34.993 10.142 73.355 9.445 108.89-1.897 41.961-10.258 80.903-34.258 116.787-22.994 42.233-71.958 60.118-119.533 64.492-59.225 5.768-123.46-5.742-163.657-43.068-83.574-65.303-122.062-200.224-71.43-291.308-5.187-22.142-13.703-43.509-15.174-68.051-.619-4.646-.813-10.375-4.723-13.626-4.684-4.491-12.735-4.684-17.496 0-24.581 23.342-44.323 50.98-59.459 81.174-36.58 73.277-45.406 161.265-24.348 240.271 43.549 205.858 311.187 345.755 505.433 212.4 79.625-54.697 112.413-180.387 104.748-274.297-5.226-65.806-33.097-128.632-78.929-188.051l-.348-.465z" /><path fill="#50a2ff" d="M260.551.234c-4.35-.909-8.931.97-13.089 3.21-46.273 25.168-98.937 111.421-86.58 173.263 5.428 51.365 48.43 93.885 55.051 144.704 3.157 21.231.077 44.672-4.311 64.872-.616 7.723-12.512 39.674 4.927 31.618 46.081-25.076 92.047-108.059 85.425-159.907-2.233-34.102-15.976-61.45-25.908-91.796-8.855-26.015-13.243-56.24-12.435-84.678-1.001-32.526 10.856-74.169-2.81-81.195l-.231-.06zm179.812 68.911c-3.959-.88-8.156.818-11.957 2.788-43.711 23.763-86.471 98.627-78.988 149.153 2.415 45.798 36.465 86.049 40.939 131.27 2.099 18.732-.673 38.645-4.197 56.346-.554 7.031-9.898 33.704 6.098 26.49 40.266-21.823 80.651-95.475 76.613-138.272-.396-30.067-10.215-54.951-17.501-81.108-7.008-24.278-10.017-52.041-8.552-77.986.594-32.977 9.859-61.407-2.217-68.59z" /></svg>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link: any) => (
                <a
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-stone-800 cursor-pointer hover:text-primary-600 px-1 py-2 text-sm font-semibold transition-colors relative group"
                >
                  {link.name}
                </a>
              ))}
              <Link href="/login"
                className="text-stone-800 hover:text-primary-600 px-1 py-2 text-sm font-semibold transition-colors relative group pl-6 border-l border-gray-300">
                Iniciar Sesión
              </Link>
            </div>
            <BotonAccion color="primary" textColor="white" />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <Link href="/login"
              className="text-stone-600 hover:text-primary hover:bg-primary-50 block px-4 py-3 rounded-xl text-base font-bold transition-all">
              Iniciar Sesión
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-xl border border-gray-300 text-stone-600 hover:bg-gray-300 transition-colors focus:outline-none"
            >
              <span className="sr-only">Abrir menú</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Animado y contenido */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full md:hidden bg-background border-b border-gray-300 shadow-lg shadow-black/20 animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="px-4 pt-2 pb-8 w-full space-y-2">
            {navLinks.map((link: any) => (
              <a
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-stone-600 hover:text-primary block px-4 py-3 rounded-xl text-base font-bold transition-all"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 px-2 w-full">
              <Link
                href="/registro-de-usuario"
                className={`
          group
          w-full
          px-4 py-3 
        bg-primary
          text-white 
          font-black 
          rounded-lg
          uppercase
          transition-all duration-300
          hover:border-red-500
        `}
              >
                ¡Probar Ahora!
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};