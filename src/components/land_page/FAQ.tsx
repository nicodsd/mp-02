"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown } from "react-icons/hi";

const faqs = [
  {
    question: "¿Qué es esta plataforma y cómo me ayuda?",
    answer: "Nuestra plataforma te permite crear tu propio menú digital en minutos. Agilizas la toma de pedidos, mejoras la experiencia de tus clientes y le das a tu negocio una imagen mucho más profesional."
  },
  {
    question: "¿Puedo personalizar el diseño de mi menú?",
    answer: "¡Totalmente! En tu panel de usuario cuentas con una sección de 'Personalización' en donde vas a poder elegir entre diferentes diseños, opciones y colores para que el menú visualmente se adapte a tu marca."
  },
  {
    question: "¿Cómo acceden mis clientes al menú?",
    answer: "Es muy sencillo. Tus clientes solo tienen que escanear un código QR que puedes poner en las mesas, o bien, puedes ingresar un link directo en tus redes sociales (Instagram, WhatsApp, etc.)."
  },
  {
    question: "¿Puedo modificar los precios o agregar promociones en cualquier momento?",
    answer: "Sí, todos los cambios que hagas en el panel (como actualizar precios, agregar nuevos platos o activar promociones temporales) se reflejan en tiempo real. ¡Olvidate de imprimir menús nuevos cada vez que cambian los precios!"
  },
  {
    question: "¿Necesito descargar alguna aplicación o tienen que hacerlo mis clientes?",
    answer: "No, la plataforma es 100% web. Tanto tú como tus clientes acceden directamente desde el navegador de cualquier celular, tablet o computadora sin instalar nada."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full py-5 md:py-14 md:mt-10 relative overflow-hidden flex flex-col items-center justify-center bg-background">

      <div className="text-start w-full mx-auto relative z-10 px-2">
        <div className="text-center md:text-start mb-10 md:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-stone-900 mb-4"
          >
            Preguntas Frecuentes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-stone-600 text-base md:text-lg mx-auto"
          >
            Resolvemos tus dudas más comunes de forma rápida y sencilla para que empieces a digitalizar tu menú de inmediato.
          </motion.p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              key={index}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${activeIndex === index ? 'bg-white shadow-lg shadow-gray-200/80 border-gray-300 transform scale-[1.01]' : 'bg-background border-gray-300 hover:bg-gray-50 hover:border-gray-300'}`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
              >
                <span className="font-bold text-lg text-stone-700 pr-4">{faq.question}</span>
                <span
                  className={`shrink-0 flex border border-gray-300 items-center justify-center w-10 h-10 rounded-full transition-transform duration-300 ${activeIndex === index ? 'bg-black text-white rotate-180' : 'border-gray-500 text-gray-600'}`}
                >
                  <HiChevronDown size={22} />
                </span>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed text-[15px] sm:text-base">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
