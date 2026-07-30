"use client";
import { motion } from "framer-motion";
import { Rocket, TrendingUp, Star, HeartHandshake } from "lucide-react";

export default function EntrepreneurCommitment() {
  return (
    <section className="py-6 mt-10 md:mt-6 relative w-full rounded-3xl md:mb-30 shadow-lg bg-white">

      <div className="w-full max-w-5xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6 bg-white p-4 md:p-6 absolute -top-20 md:-top-26 left-1/2 rounded-full -translate-x-1/2"
        >
          <div className="">
            <HeartHandshake className="w-20 h-20 md:w-26 md:h-26 text-primary" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="tracking-tight text-lg md:text-3xl text-stone-500 mb-3 pt-10"
        >
          De la mano con los <span className="text-primary">emprendedores</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm md:text-md text-stone-400 max-w-4xl mx-auto text-balance"
        >
          Sabemos lo desafiante que puede ser empezar desde cero. Por eso, creamos QMenú con un propósito claro: darte las herramientas necesarias para que puedas crecer, destacarte y llevar tu negocio a las redes y <strong>facilitar la toma de pedidos</strong> sin barreras iniciales.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 pt-6 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center md:p-6"
          >
            <div className="flex items-center justify-center mb-1 text-primary">
              <Rocket className="md:w-10 md:h-10 w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-stone-400 mb-1">Empieza sin costos</h3>
            <p className="text-stone-400 text-center text-xs">Creemos que el presupuesto no debe ser un freno. Digitaliza tu menú totalmente gratis.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center md:p-6"
          >
            <div className="flex items-center justify-center mb-1 text-primary">
              <TrendingUp className="md:w-10 md:h-10 w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-stone-400 mb-1">Crece sin límites</h3>
            <p className="text-stone-400 text-center text-xs">Te acompañamos en cada paso con herramientas que escalan a medida que tu negocio crece.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col items-center md:p-6"
          >
            <div className="flex items-center justify-center mb-1 text-primary">
              <Star className="md:w-10 md:h-10 w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-stone-400 mb-1">Destácate del resto</h3>
            <p className="text-stone-400 text-center text-xs">Ofrece una experiencia moderna y profesional que enamorará a tus clientes desde el primer escaneo.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
