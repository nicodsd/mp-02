"use client"
import React from 'react';
import { Check, Link } from 'lucide-react';
import { motion } from 'framer-motion';

interface PricingPlan {
  name: string;
  price: string;
  before?: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  recommended?: boolean;
  premium?: boolean;
  href?: string;
}

const plans: PricingPlan[] = [
  {
    name: "Gratuito",
    price: "$0",
    period: "/mes",
    description: "Para pequeños locales o food trucks que inician.",
    features: [
      "Hasta 10 platos",
      "Código QR con tu logo",
      "Fotos básicas",
      "Actualización en tiempo real",
      "Los pedidos te llegan al WhatsApp"
    ],
    cta: "Crear Menú Gratis",
    href: "/registro-de-usuario?plan=free"
  },
  {
    name: "Plus",
    price: "$14.900",
    before: "$19.900",
    period: "/mes",
    description: "Para restaurantes que quieren destacar su marca.",
    features: [
      "Platos ilimitados",
      "Códigos QR personalizables con tu logo",
      "Fotos de alta calidad",
      "Analíticas de visitas",
      "Menú personalizable según estética",
      "Compras por WhatsApp",
      "Gestión de promociones"
    ],
    cta: "Elegir Plan Plus",
    href: "/registro-de-usuario?plan=plus",
    recommended: true
  },
  {
    name: "Premium",
    price: "$19.900",
    before: "$24.900",
    period: "/mes",
    description: "El plan más completo para locales con gran variedad de platos y que quieren destacar su marca.",
    features: [
      "Platos ilimitados",
      "Códigos QR personalizables con tu logo",
      "Fotos de alta calidad",
      "Analíticas de visitas",
      "Menú altamente personalizable, diferenciate de la competencia",
      "Compras por WhatsApp",
      "Seccion para gestión de pedidos",
      "Multi sucursal",
      "Botón de 'Descanso' para vacaciones",
      "Agrega promociones a tus productos",
      "Menús diferenciados por zona",
      "Soporte prioritario"
    ],
    cta: "Elegir Plan Premium",
    href: "/registro-de-usuario?plan=premium",
    premium: true
  }
];

export default function Pricing() {
  return (
    <section id="planes" className="py-16 md:py-14 md:mt-20 w-full">
      <div className="w-full">
        <div className="text-center md:text-start mb-12 md:mb-16 px-2">
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">Tener tu Menú digital nunca fue taaan fácil</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-stone-600 px-3 md:px-0 text-base md:text-lg">
            Elegí el plan que desees, registrate y empezá a publicar lo que vendés.
          </motion.p>
        </div>

        {/* Grid: 1 col móvil, 3 cols desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 space-y-4 gap-3 items-start px-2">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col p-6 md:p-8 rounded-2xl border
                ${!plan.premium && !plan.recommended && 'border-gray-200'}
                ${plan.premium && 'bg-linear-to-br from-white via-gray-300/80 to-white hover:from-white transition-all duration-500 hover:via-gray-200 hover:to-gray-600/30 border-2 border-black'}
                ${plan.recommended && 'bg-white border-primary shadow-2xl shadow-primary-900/10 md:scale-102 z-10'}`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary border border-primary text-white px-4 py-2 rounded-full text-[10px] md:text-xs font-bold tracking-wide uppercase whitespace-nowrap">
                  Recomendado
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-bold ${plan.recommended ? 'text-primary' : 'text-stone-900'}`}>{plan.name === "Plus" ? plan.name + "+" : plan.name}</h3>
                <p className="text-stone-500 text-sm mt-2 min-h-auto md:min-h-[40px]">{plan.description}</p>
              </div>

              <div className="mb-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-black">{plan.price}</span>
                {plan.before && (
                  <span className="text-stone-500 ml-2 text-md line-through decoration-red-500">{plan.before}</span>
                )}
                <span className="text-stone-500 ml-2 text-sm">{plan.period}</span>
              </div>

              {
                !plan.premium ?
                  <ul className="space-y-3 md:space-y-4 mb-8 grow">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className={`h-5 w-5 mr-3 shrink-0 ${plan.recommended ? 'text-primary' : 'text-stone-400'}`} />
                        <span className="text-stone-600 text-sm leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  :
                  <ul className="space-y-3 md:space-y-4 mb-8 grow">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className={`h-5 w-5 mr-3 shrink-0 text-stone-800`} />
                        <span className="text-stone-800 text-sm leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
              }

              {
                !plan.premium ?
                  <a href={plan.href}
                    className={`w-full text-center py-4 px-4 rounded-xl font-bold text-base cursor-pointer transition-all 
                  ${plan.recommended
                        ? 'bg-primary hover:bg-primary-500 hover:shadow-md text-white'
                        : 'hover:bg-gray-100 text-stone-700 border border-gray-300'
                      }
                 `}
                  >
                    {plan.cta}
                  </a>
                  :
                  <a href={plan.href}
                    className={`w-full text-center btn-god-rays py-4 px-4 rounded-xl font-bold text-base cursor-pointer transition-all bg-black hover:bg-gray-800 hover:shadow-md text-white`}
                  >
                    {plan.cta}
                  </a>
              }
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}