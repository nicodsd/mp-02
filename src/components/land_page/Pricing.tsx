"use client"
import React from 'react';
import { Check, Link } from 'lucide-react';

interface PricingPlan {
  name: string;
  price: string;
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
    name: "Starter",
    price: "$0",
    period: "/mes",
    description: "Para pequeños locales o food trucks que inician.",
    features: [
      "Hasta 10 platos",
      "1 Código QR con tu logo",
      "Fotos básicas",
      "Actualización en tiempo real"
    ],
    cta: "Crear Menú Gratis",
    href: "/registro-de-usuario"
  },
  {
    name: "Plus",
    price: "$19.900",
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
    recommended: true
  },
  {
    name: "Premium",
    price: "$39.900",
    period: "/mes",
    description: "Para locales con gran variedad de platos y que quieren destacar su marca.",
    features: [
      "Platos ilimitados",
      "Códigos QR personalizables con tu logo",
      "Fotos de alta calidad",
      "Analíticas de visitas",
      "Menú personalizable según estética",
      "Compras por WhatsApp",
      "Gestión de promociones",
      "Menús diferenciados por zona",
      "Soporte prioritario"
    ],
    cta: "Elegir Plan Premium",
    premium: true
  }
];

export default function Pricing() {
  return (
    <section id="planes" className="py-16 md:py-14 md:mt-10 w-full">
      <div className="w-full">
        <div className="text-start mb-12 md:mb-16 px-2">
          <h2 className="text-3xl md:text-5xl font-bold text-stone-900 mb-4">Planes Transparentes</h2>
          <p className="text-stone-600 text-base md:text-lg">
            Elige la opción que mejor se adapte a tu negocio. Sin comisiones ocultas por pedido.
          </p>
        </div>

        {/* Grid: 1 col móvil, 3 cols desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 space-y-4 gap-3 items-start px-2">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col p-6 md:p-8 rounded-2xl border
                ${!plan.premium && !plan.recommended && 'border-bone-200'}
                ${plan.premium && 'bg-background-2 border-2 border-black'}
                ${plan.recommended && 'bg-white border-primary shadow-2xl shadow-primary-900/10 md:scale-102 z-10'}`}
            >
              {plan.recommended && (
                <div className="absolute btn-god-rays -top-4 left-1/2 transform -translate-x-1/2 bg-primary border border-primary text-white px-4 py-2 rounded-full text-[10px] md:text-xs font-bold tracking-wide uppercase whitespace-nowrap">
                  Recomendado
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-bold ${plan.recommended ? 'text-primary' : 'text-stone-900'}`}>{plan.name}</h3>
                <p className="text-stone-500 text-sm mt-2 min-h-auto md:min-h-[40px]">{plan.description}</p>
              </div>

              <div className="mb-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-black">{plan.price}</span>
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
                        ? 'bg-primary btn-god-rays hover:bg-primary-500 hover:shadow-md text-white'
                        : 'hover:bg-bone-100 text-stone-700 border border-bone-300'
                      }
                 `}
                  >
                    {plan.cta}
                  </a>
                  :
                  <button
                    className={`w-full btn-god-rays py-4 px-4 rounded-xl font-bold text-base cursor-pointer transition-all bg-black hover:shadow-md text-white`}
                  >
                    {plan.cta}
                  </button>
              }
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}