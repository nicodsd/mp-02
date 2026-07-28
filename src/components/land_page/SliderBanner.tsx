"use client";
import { useState, useEffect, useRef, ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Slide {
    title: ReactNode;
    subtitle: ReactNode;
    bgClass: string;
    ctaText: string;
    ctaLink: string;
    ctaBg?: string;
    image?: string;
    imageAlt?: string;
}

const slidesData: Slide[] = [
    {
        title: (
            <>
                ¿Te imaginas tener tu{" "}
                <span className="bg-clip-text text-transparent bg-lime-200">
                    local en internet?
                </span>
            </>
        ),
        subtitle: (
            <>
                Ahora es posible, y gratis, con <span className="font-black">QMenu</span> puedes crear un menú digital profesional en minutos y compartirlo con tus clientes.
            </>
        ),
        bgClass: "from-red-600 to-orange-500",
        ctaText: "Empieza ahora",
        ctaLink: "/registro-de-usuario",
        ctaBg: "bg-lime-300 hover:bg-lime-400 text-green-900",
        image: "/images/placeholders/image-background-foods.png",

        imageAlt: "hamburguesa-deliciosa"
    },
    {
        title: "Pedidos directos al WhatsApp",
        subtitle: "Recibe los pedidos de tus clientes directamente en tu WhatsApp, sin intermediarios ni comisiones.",
        bgClass: "from-emerald-500 to-teal-400",
        ctaText: "Empieza ahora",
        ctaLink: "/registro-de-usuario",
        ctaBg: "bg-lime-300 hover:bg-lime-400 text-green-900",
        image: "/images/placeholders/woman-phone.webp",
        imageAlt: "mujer-usando-celular"
    },
    {
        title: "Actualiza en tiempo real",
        subtitle: "Cambia precios, oculta platos agotados y agrega promociones al instante. Tus clientes siempre verán la versión más reciente.",
        bgClass: "from-slate-800 to-black",
        ctaText: "Empieza ahora",
        ctaLink: "/registro-de-usuario",
        ctaBg: "bg-lime-300 hover:bg-lime-400 text-green-900",
        image: "/images/placeholders/burger.webp",
        imageAlt: "hamburguesa"
    }
];

export default function SliderBanner() {
    const [current, setCurrent] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slidesData.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slidesData.length) % slidesData.length);

    useEffect(() => {
        autoPlayRef.current = setInterval(nextSlide, 7000);
        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        };
    }, [current]);

    const minSwipeDistance = 50;
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };
    const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance) nextSlide();
        if (distance < -minSwipeDistance) prevSlide();
    };

    return (
        <section className="relative w-full overflow-hidden md:my-10">
            {/* Fondo en gradiente ocupando estrictamente 100% de ancho y alto del slide */}
            <div className={`absolute inset-0 w-full rounded-2xl h-full bg-linear-to-br ${slidesData[current].bgClass} z-0 pointer-events-none`} />
            <div className="w-full relative min-h-100 md:min-h-0 md:h-90 overflow-hidden shadow-2xl group flex flex-col justify-between">
                <div
                    className="flex w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {slidesData.map((slide, index) => (
                        <div key={index} className="min-w-full rounded-2xl w-full h-full min-h-full p-10 md:p-0 relative flex items-center justify-center overflow-hidden">


                            {/* Contenido principal */}
                            <div className="relative h-full z-10 flex flex-col md:flex-row items-center justify-between rounded-2xl w-full md:max-w-6xl mx-auto gap-6 md:gap-8">

                                {/* Textos y Botón (Capa superior z-20) */}
                                <div className="text-center relative md:text-left flex-1 z-20 w-full flex flex-col items-center md:items-start">
                                    <motion.h2
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 }}
                                        className="text-4xl md:text-5xl leading-none text-balance font-bold text-white mb-3 md:mb-6"
                                    >
                                        {slide.title}
                                    </motion.h2>

                                    <motion.p
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 }}
                                        className="text-white/95 text-base md:text-lg max-w-lg mx-auto md:mx-0 leading-6 mb-6 md:mb-0"
                                    >
                                        {slide.subtitle}
                                    </motion.p>

                                    {/* Botón CTA */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 }}
                                        className="mt-2 md:mt-8 flex justify-center md:justify-start w-full md:w-auto"
                                    >
                                        <Link
                                            href={slide.ctaLink}
                                            className={`font-bold py-3 px-8 rounded-lg hover:shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0 text-base md:text-xl ${slide.ctaBg || "bg-lime-300 hover:bg-lime-400 text-green-900"
                                                }`}
                                        >
                                            {slide.ctaText}
                                        </Link>
                                    </motion.div>
                                </div>

                                {/* Imagen Mobile absoluta en el fondo inferior */}
                                {slide.image && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.25 }}
                                        className="md:hidden absolute inset-x-0 -bottom-10 w-full flex items-end justify-center z-0 pointer-events-none overflow-hidden rounded-b-2xl"
                                    >
                                        <Image
                                            src={slide.image}
                                            alt={slide.imageAlt || "banner-image"}
                                            width={600}
                                            height={600}
                                            className="w-full h-auto object-cover object-bottom drop-shadow-2xl"
                                        />
                                    </motion.div>
                                )}

                                {/* Lado Derecho: Imagen Desktop */}
                                {slide.image && (
                                    <div className="hidden md:flex flex-1 rounded-2xl justify-end relative z-20">
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.4 }}
                                            className="w-112.5 lg:w-180 rounded-2xl -mr-50"
                                        >
                                            <Image
                                                src={slide.image}
                                                alt={slide.imageAlt || "banner-image"}
                                                width={500}
                                                height={500}
                                                className="w-full drop-shadow-xl aspect-square h-auto object-contain"
                                            />
                                        </motion.div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Controles del Slider */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30">
                    {slidesData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={`h-2.5 rounded-full transition-all duration-300 ${index === current ? "bg-white w-7" : "bg-white/50 w-2.5 hover:bg-white/80"
                                }`}
                            aria-label={`Ir al slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}