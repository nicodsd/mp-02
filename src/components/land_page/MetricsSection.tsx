"use client";
import React, { useEffect, useRef, useState } from 'react';

interface MetricItem {
    value: string;
    label: string;
    icon: string;
}

const metrics: MetricItem[] = [
    { value: '+1,000', label: 'Restaurantes activos', icon: '🏪' },
    { value: '+100k', label: 'QR escaneados al mes', icon: '📱' },
    { value: '25%', label: 'Aumento del ticket promedio', icon: '📈' },
    { value: '0%', label: 'Comisiones por pedido', icon: '💰' },
];

// Subcomponente interno para aislar y manejar la animación del contador sin depender de framer-motion
const AnimatedCounter: React.FC<{ value: string }> = ({ value }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
    const [displayNum, setDisplayNum] = useState(numericValue);

    const hasPlus = value.startsWith("+");
    const hasK = value.toLowerCase().includes("k");
    const hasPercent = value.includes("%");
    const hasComma = value.includes(",");

    useEffect(() => {
        const el = ref.current;
        if (!el || numericValue === 0) return;

        let rafId = 0;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                const duration = 1000;
                const start = performance.now();
                const tick = (now: number) => {
                    const progress = Math.min(1, (now - start) / duration);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setDisplayNum(Math.floor(eased * numericValue));
                    if (progress < 1) {
                        rafId = requestAnimationFrame(tick);
                    } else {
                        setDisplayNum(numericValue);
                    }
                };
                rafId = requestAnimationFrame(tick);
            },
            { rootMargin: "-10px" }
        );
        observer.observe(el);
        return () => {
            observer.disconnect();
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [numericValue]);

    const formatted = hasComma ? displayNum.toLocaleString("en-US") : displayNum.toString();

    return (
        <span ref={ref}>
            {hasPlus && "+"}
            <span>{formatted}</span>
            {hasK && "k"}
            {hasPercent && "%"}
        </span>
    );
};

export const MetricsSection: React.FC = () => {
    return (
        <section id="metricas" className="py-20 md:py-0 md:pb-30 relative overflow-hidden w-full">
            <div className="w-full relative z-10">
                {/* Título alineado a la izquierda según la estructura de la web */}
                <div className="mb-8 md:pl-3 text-center md:text-left">
                    <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 text-balance">
                        El impacto de <span className="text-red-700">QMenú</span> en números
                    </h2>
                    <p className="text-base text-zinc-600 text-balance">
                        Ayudamos a los negocios gastronómicos a optimizar su atención y potenciar sus ventas desde el primer día.
                    </p>
                </div>

                {/* Grilla de métricas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 logo-god-rays bg-linear-to-bl from-stone-900 via-slate-900 to-black rounded-xl">
                    {metrics.map((metric, index) => (
                        <div
                            key={index}
                            className={`p-4 md:p-10 text-left ${index !== metrics.length - 1 ? "md:border-r md:border-stone-800" : ""}`}
                        >
                            <div className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                                <AnimatedCounter value={metric.value} />
                            </div>
                            <p className="mt-1 text-sm font-medium text-stone-300">
                                {metric.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MetricsSection;