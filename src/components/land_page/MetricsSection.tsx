"use client";
import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";

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

// Subcomponente interno para aislar y manejar la animación del contador de cada métrica
const AnimatedCounter: React.FC<{ value: string }> = ({ value }) => {
    const ref = useRef<HTMLSpanElement>(null);
    // 💡 Reducimos el margen a -10px para que se active perfectamente en pantallas móviles pequeñas
    const isInView = useInView(ref, { once: true, margin: "-10px" });

    // Parseamos el string para extraer solo los números
    const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;

    // Identificamos prefijos y sufijos del string original
    const hasPlus = value.startsWith("+");
    const hasK = value.toLowerCase().includes("k");
    const hasPercent = value.includes("%");
    const hasComma = value.includes(",");

    const count = useMotionValue(0);

    // Formateamos el número intermedio en cada frame de la animación
    const rounded = useTransform(count, (latest) => {
        let num = Math.floor(latest);

        // Si el string original llevaba coma como separador de miles (ej: 1,200)
        if (hasComma) {
            return num.toLocaleString("en-US");
        }
        return num.toString();
    });

    useEffect(() => {
        if (isInView) {
            // Animación fluida de 0 al valor objetivo en 1 segundo con aceleración suave
            const controls = animate(count, numericValue, {
                duration: 1,
                ease: "easeOut",
            });
            return controls.stop;
        }
    }, [isInView, count, numericValue]);

    return (
        <span ref={ref}>
            {hasPlus && "+"}
            <motion.span>{rounded}</motion.span>
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
                    <motion.h2 initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
                        El impacto de <span className="text-red-600">QMenú</span> en números
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base text-zinc-500 max-"
                    >
                        Ayudamos a los negocios gastronómicos a optimizar su atención y potenciar sus ventas desde el primer día.
                    </motion.p>
                </div>

                {/* Grilla de métricas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 logo-god-rays bg-linear-to-bl from-stone-900 via-slate-900 to-black rounded-xl">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                            className={`p-4 md:p-10 text-left  ${index !== metrics.length - 1 ? "md:border-r md:border-stone-800" : ""}`}
                        >
                            <div className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                                <AnimatedCounter value={metric.value} />
                            </div>
                            <p className="mt-1 text-sm font-medium text-stone-400 md:text-stone-300">
                                {metric.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MetricsSection;