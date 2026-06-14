"use client";
import { Camera, QrCode, Smartphone, CloudLightning, ArrowRight, PieChart, Zap, ChevronDown } from 'lucide-react';
import { motion } from "framer-motion";
import Link from "next/link";

const featuresList = [
  {
    icon: <QrCode className="h-6 w-6" />,
    title: "Códigos QR Personalizables",
    description: "Genera QRs únicos. Descárgalos en alta resolución listos para imprimir."
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Ultra rápido",
    description: "Tu menú cargará en segundos, garantizando una experiencia fluida para tus clientes."
  },
  {
    icon: <CloudLightning className="h-6 w-6" />,
    title: "Actualizaciones en Tiempo Real",
    description: "Modifica precios, oculta platos agotados o cambia descripciones al instante."
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Para todos los dispositivos",
    description: "Diseño optimizado para usarse en cualquier dispositivo, fluidez sin necesidad de instalar apps."
  },
  {
    icon: <PieChart className="h-6 w-6" />,
    title: "Analíticas",
    description: "Lleva la cuenta de tus platos cargados, tu gestión de promociones y también los pedidos que recibas."
  }
];

export default function Features() {
  return (
    <section id="caracteristicas" className="pt-30 pb-10 lg:pb-40 relative overflow-hidden w-full">
      <div className="w-full relative z-10">
        <div className="text-center md:text-start mb-12 md:pl-12">
          <motion.h2 initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">Ventajas de nuestro menú digital</motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base text-zinc-500"
          >
            Una herramienta potente y fácil de usar para digitalizar tu local gastronómico ahora mismo.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {featuresList.map((feature, index) => (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} key={index} className="py-4 px-4 md:p-6 md:px-6 gap-3 h-fit flex md:flex-col md:items-start rounded-xl border border-gray-300 items-start group">
              <div className="w-12 h-12 md:bg-primary-50 rounded-xl flex items-center justify-center md:mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                {feature.icon}
              </div>
              <div className="flex flex-col">
                <h4 className="text-lg font-bold text-stone-900 mb-2">{feature.title}</h4>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="gap-3 flex md:flex-col md:items-center justify-center h-36 md:h-full rounded-xl bg-primary">
            <div className="flex flex-col justify-center">
              <h4 className="text-xl text-center font-bold text-white mb-4">¿Quieres ver mas?</h4>
              <Link href="/caracteristicas-menu-digital" className="w-full md:w-fit group  cursor-pointer text-center bg-white px-6 py-3 hover:bg-gray-100 transition-all rounded-lg flex items-center justify-center gap-2 text-white hover:shadow-sm">
                <span className="text-md font-bold text-primary ">Ver Todas las Caracteristicas</span>
                <ArrowRight className="text-primary group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 