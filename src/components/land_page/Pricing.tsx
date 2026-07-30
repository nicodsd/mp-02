"use client"
import React from 'react';
import { Check, Link } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
      "Los pedidos te llegan al WhatsApp"
    ],
    cta: "Crear Menú Gratis",
    href: "/registro-de-usuario?plan=free"
  },
  {
    name: "Plus",
    price: "$24.000", //24000
    before: "$29.900", //29.900
    period: "/mes",
    description: "Para restaurantes que quieren destacar su marca.",
    features: [
      "Platos ilimitados, permanente",
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
    price: "$34.900", //34900
    before: "$39.900", //39900
    period: "/mes",
    description: "El plan más completo para locales con gran variedad de platos y que quieren diferenciarse del resto.",
    features: [
      "Platos ilimitados, permanente",
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
  },
  {
    name: "Pago Único",
    price: "A cotizar",
    period: "",
    description: "Un plan de pago único con todas las funcionalidades premium incluidas. Ideal para menús fuera de Argentina que buscan destacar con las funcionalidades más completas.",
    features: [
      "Todas las funcionalidades Premium",
      "Ideal para negocios fuera de Argentina",
      "Te armamos tu menú (Opcional)",
      "Soporte prioritario"
    ],
    cta: "Cotizar Plan",
    href: "/cotizar-menu",
    premium: true
  }
];

export default function Pricing() {
  return (
    <section id="planes" className="py-20 md:py-0 md:pb-30 w-full">
      <div className="w-full">
        <div className="text-center md:text-start mb-8 md:mb-12 md:pl-3">
          <motion.h2 initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl text-balance md:text-5xl font-bold text-stone-900 mb-4">Tener tu Menú digital nunca fue taaan fácil</motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base text-zinc-500 text-balance"
          >
            Elegí el plan que desees, registrate y empezá a publicar lo que vendés.
          </motion.p>
        </div>

        {/* Grid: 1 col móvil, 4 cols desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 space-y-4 xl:space-y-0 gap-2 items-start px-2">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col p-6 md:p-3 md:h-130 rounded-xl border
                ${!plan.premium && !plan.recommended && 'border-gray-200'}
                ${plan.name === "Pago Único" && 'bg-linear-to-br from-white to-blue-200/40 border-blue-800 border-2 shadow-xl'}
                ${plan.premium && 'bg-gray-100 hover:from-white transition-all duration-500 hover:via-gray-200 hover:to-gray-600/30 border-2 border-black'}
                ${plan.recommended && 'bg-white border-primary shadow-2xl shadow-primary-900/10 md:scale-102 z-10'}`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary border border-primary text-white px-4 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-wide uppercase whitespace-nowrap">
                  Recomendado
                </div>
              )}

              {plan.name === "Pago Único" && <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-[10px] md:text-xs bg-purple-100 text-blue-800 px-2 py-1 rounded-full font-bold tracking-wide uppercase whitespace-nowrap">Negocios internacionales</span>}

              <div className="mb-1 p-3">
                <h3 className={`text-xl font-bold ${plan.recommended ? 'text-primary' : 'text-gray-900'} flex items-center flex-wrap gap-2`}>
                  {plan.name === "Plus" ? plan.name + "+" : plan.name}
                </h3>
                <p className="text-gray-500 text-xs mt-2 min-h-auto md:min-h-10">{plan.description}</p>
              </div>

              <div className="mb-4 flex items-baseline">
                <span className="text-3xl font-extrabold pl-3 text-black">{plan.price}</span>
                {plan.before && (
                  <span className="text-gray-500 ml-2 text-md line-through decoration-red-500">{plan.before}</span>
                )}
                <span className="text-gray-500 ml-2 text-xs">{plan.period}</span>
              </div>

              {
                !plan.premium ?
                  <ul className="space-y-1 grow pb-6 md:pb-0">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className={`h-4 w-4 mr-2 shrink-0 ${plan.recommended ? 'text-primary' : 'text-gray-400'}`} />
                        <span className="text-gray-600 text-xs leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  :
                  <ul className="space-y-1 grow pb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className={`h-4 w-4 mr-2 shrink-0 text-black`} />
                        <span className="text-gray-800 text-xs leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
              }
              {
                !plan.premium ?
                  <a href={plan.href}
                    className={`w-full text-center py-3 px-4 rounded-xl font-bold text-sm cursor-pointer transition-all 
                  ${plan.recommended
                        ? 'bg-primary hover:bg-primary-500 hover:shadow-md text-white'
                        : 'hover:bg-gray-100 text-gray-700 border border-gray-300'
                      }
                 `}
                  >
                    {plan.cta}
                  </a>
                  :
                  <a href={plan.href}
                    className={`w-full text-center py-3 px-4 rounded-xl font-bold text-sm cursor-pointer transition-all bg-black hover:bg-gray-800 hover:shadow-md text-white`}
                  >
                    {plan.cta}
                  </a>
              }
            </div>
          ))}
        </div>
      </div>
      <span className="flex text-center flex-col mt-8 justify-center items-center gap-1">
        <p className="text-gray-500 text-xs">Manejo seguro de suscripciones a través de Mercado Pago.</p>
        <p className="text-gray-500 text-xs text-pretty">En caso de reembolso o anulación de suscripción, ingresar al panel de <a href="https://www.mercadopago.com.ar" className="text-blue-500 underline">Mercado Pago</a>.</p>
        <p className="text-gray-500 text-xs">Leé nuestros <a href="/terminos-y-condiciones" className="text-blue-500 underline">Términos y Condiciones</a>.</p>
      </span>
    </section>
  );
}