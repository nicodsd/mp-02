"use client";
import Navbar from "@/src/components/land_page/Navbar";
import Footer from "@/src/components/land_page/Footer";
import { Camera, QrCode, Smartphone, CloudLightning, PieChart, Zap } from 'lucide-react';
import { motion } from "framer-motion";
import {
    HiOutlineUser,
    HiOutlineColorSwatch,
    HiOutlineTicket,
    HiOutlineLogout,
    HiMenuAlt2,
    HiX,
    HiOutlineAdjustments,
    HiOutlineClipboardList,
} from "react-icons/hi";

const featuresList = [
    {
        icon: <Zap className="h-6 w-6" />,
        title: "Ultra rápido",
        description: "Tu menú cargará en segundos, garantizando una experiencia fluida para tus clientes."
    },
    {
        icon: <HiOutlineAdjustments className="h-6 w-6" />,
        title: "Configura tu menú",
        description: "Configura tu menú para destacarte del resto, cambia el tamaño del encabezado, como se presentan los platos, entre otras configuraciones."
    },
    {
        icon: <HiOutlineColorSwatch className="h-6 w-6" />,
        title: "Colores Personalizables",
        description: "Diseña tu menú con la identidad de tu marca. Elige entre diferentes paletas de colores para que tu menú se vea único."
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
        icon: <PieChart className="h-6 w-6" />,
        title: "Analíticas",
        description: "Lleva la cuenta de tus platos cargados, tu gestión de promociones y también los pedidos que recibas."
    }
];

export default function ContactoPage() {
    return (
        <>
            <div className="flex selection:bg-primary selection:text-white relative bg-background-2 flex-col items-center w-full min-h-auto">
                <Navbar isIndex={false} />
                <main className="grow md:rounded-b-2xl md:border-x border-gray-300 bg-background w-full relative flex flex-col items-center justify-start md:max-w-7xl mx-auto px-4 border-b md:px-14 pt-20">
                    <section id="caracteristicas" className="py-16 md:py-24 lg:pb-40 relative overflow-hidden w-full">
                        <div className="w-full relative z-10">
                            <div className="text-center md:text-start mb-12 md:mb-16 px-2">
                                <motion.h1 initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 md:mb-6">Características del menú digital</motion.h1>
                                <motion.p initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-stone-600 text-base md:text-lg px-3">
                                    Una herramienta potente y fácil de usar para digitalizar tu local gastronómico ahora mismo.
                                </motion.p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8">
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