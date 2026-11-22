"use client";
import { useEffect, useRef, useState } from 'react';
import { MousePointerClick, Zap, Smartphone } from 'lucide-react';

export default function VideoSection() {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    const el = videoContainerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="como-funciona" className="pt-30 lg:pb-10 relative overflow-hidden w-full">
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 mx-auto md:mb-10">

        <div className="w-full relative z-10">
          <div className="text-center md:text-start md:pl-3 md:pr-20">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 text-balance">
              Una experiencia simple e intuitiva
            </h2>
            <p className="text-base text-zinc-600">
              Tu cliente puede entrar a tú menú desde tú red social favorita o también escaneando el código QR, elegir sus platos favoritos, personalizar su pedido y enviar su orden directamente por WhatsApp.
            </p>
          </div>
          <div className='mt-10 hidden md:flex justify-end'>
            {/* Pastillas informativas */}
            <div className="flex flex-col gap-2 w-full px-6 md:w-3/4">
              {/* Pill 1 */}
              <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-4xl shadow-lg border border-red-100 hover:scale-105 transition-transform cursor-default">
                <div className="bg-red-600 rounded-full p-4 flex items-center justify-center min-w-14 min-h-14 shadow-lg shadow-red-200">
                  <MousePointerClick className="text-white w-6 h-6" aria-hidden="true" />
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">Accesible</span>
              </div>

              {/* Pill 2 */}
              <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-4xl shadow-lg border border-red-100 hover:scale-105 transition-transform cursor-default">
                <div className="bg-red-600 rounded-full p-4 flex items-center justify-center min-w-14 min-h-14 shadow-lg shadow-red-200">
                  <Zap className="text-white w-6 h-6" aria-hidden="true" />
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">Fácil y rápido</span>
              </div>

              {/* Pill 3 */}
              <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-4xl shadow-lg border border-red-100 hover:scale-105 transition-transform cursor-default">
                <div className="bg-red-600 rounded-full p-4 flex items-center justify-center min-w-14 min-h-14 shadow-lg shadow-red-200">
                  <Smartphone className="text-white w-6 h-6" aria-hidden="true" />
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight leading-tight">Desde cualquier dispositivo</span>
              </div>
            </div>
          </div>
        </div>
        {/* Video */}
        <div
          ref={videoContainerRef}
          className="w-full rounded-3xl relative overflow-hidden border border-gray-200/50 aspect-square bg-stone-100"
        >
          {shouldLoadVideo && (
            <video
              className="w-full h-full object-cover aspect-square"
              autoPlay
              loop
              muted
              playsInline
              preload="none"
            >
              <source src="/videos/man_walking.webm" type="video/webm" />
              Tu navegador no soporta el elemento de video.
            </video>
          )}

          <div
            className="absolute md:hidden bottom-4 left-3 right-4 sm:top-6 sm:left-6 flex flex-col gap-2.5 items-start pointer-events-none"
          >
            {/* Pill 1 */}
            <div
              className="pointer-events-auto flex items-center gap-3 bg-white/85 backdrop-blur-md px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-md border border-red-100 hover:scale-105 transition-transform cursor-default w-fit max-w-[85%] sm:max-w-xs">
              <div className="bg-red-600 rounded-full p-2 flex items-center justify-center shrink-0 shadow-sm shadow-red-200">
                <MousePointerClick className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-sm sm:text-base font-bold text-gray-900 tracking-tight truncate">
                Accesible
              </span>
            </div>

            {/* Pill 2 */}
            <div
              className="pointer-events-auto flex items-center gap-3 bg-white/85 backdrop-blur-md px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-md border border-red-100 hover:scale-105 transition-transform cursor-default w-fit max-w-[85%] sm:max-w-xs">
              <div className="bg-red-600 rounded-full p-2 flex items-center justify-center shrink-0 shadow-sm shadow-red-200">
                <Zap className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-sm sm:text-base font-bold text-gray-900 tracking-tight truncate">
                Fácil y rápido
              </span>
            </div>

            {/* Pill 3 */}
            <div
              className="pointer-events-auto flex items-center gap-3 bg-white/85 backdrop-blur-md px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-md border border-red-100 hover:scale-105 transition-transform cursor-default w-fit max-w-[85%] sm:max-w-xs">
              <div className="bg-red-600 rounded-full p-2 flex items-center justify-center shrink-0 shadow-sm shadow-red-200">
                <Smartphone className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-sm sm:text-base font-bold text-gray-900 tracking-tight leading-snug">
                Desde cualquier dispositivo
              </span>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}