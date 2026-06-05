"use client";
import Navbar from "@/src/components/land_page/Navbar";
import Footer from "@/src/components/land_page/Footer";
import { motion } from "framer-motion";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { HiOutlineColorSwatch, HiOutlineAdjustments } from "react-icons/hi";
import { Camera, QrCode, Smartphone, CloudLightning, PieChart, Zap } from 'lucide-react';

const featuresList = [
    {
        icon: <Zap className="h-6 w-6" />,
        title: "Ultra rápido",
        description: "Tu menú cargará en segundos, garantizando una experiencia fluida para tus clientes."
    },
    {
        icon: <HiOutlineAdjustments className="h-6 w-6" />,
        title: "Configura tu menú",
        description: "Destacá del resto, cambiá el tamaño del encabezado, la presentación de los platos, entre otras configuraciones."
    },
    {
        icon: <HiOutlineColorSwatch className="h-6 w-6" />,
        title: "Colores Personalizables",
        description: "Diseñá tu menú con la identidad de tu marca. Elegí entre diferentes paletas de colores para que tu menú se vea único."
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
        icon: <QrCode className="h-6 w-6" />,
        title: "Códigos QR Personalizables",
        description: "Genera QRs únicos. Descárgalos en alta resolución listos para imprimir."
    },
    {
        icon: <Camera className="h-6 w-6" />,
        title: "Galería de Fotos HD",
        description: "Sube fotos de tus platos en alta calidad. La comida entra por los ojos y aumenta el ticket promedio."
    },
    {
        icon: <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.59 13.51 6.82 3.98m0-10.98-6.82 3.98" /></svg>,
        title: "Comparte tus platos",
        description: "Comparte tus platos con quien quieras, tambien puedes descargar la plantilla para subirla a redes."
    },
    {
        icon: <PieChart className="h-6 w-6" />,
        title: "Analíticas",
        description: "Lleva la cuenta de tus platos cargados, tu gestión de promociones y también los pedidos que recibas."
    }
];

export default function CaracteristicasPage() {
    return (
        <>
            <div className="flex selection:bg-primary selection:text-white relative bg-background-2 flex-col items-center w-full">
                <Navbar isIndex={false} />
                <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-30 grow">
                    <section id="caracteristicas" className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
                        <Link href="/guias" className="inline-flex items-center hover:text-orange-600 font-medium mb-8 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Guías / Características
                        </Link>
                        <div className="w-full relative mt-10 z-10">
                            <div className="text-center md:text-start mb-12 md:mb-16 px-2">
                                <motion.h1 initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 md:mb-6">Características del menú digital</motion.h1>
                                <motion.p initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-stone-600 text-base md:text-lg pl-1">
                                    Una herramienta potente y fácil de usar para digitalizar tu local gastronómico ahora mismo.
                                </motion.p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
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
                            </div>
                        </div>
                    </section>
                </main>
            </div>
            <Footer />
        </>
    );
}