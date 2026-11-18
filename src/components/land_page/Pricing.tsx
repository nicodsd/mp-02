'use client';

import React from 'react';
import { Check, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePromoCountdown } from '@/src/utils/usePromoCountdown';
import PromoCountdownDisplay from '@/src/components/common/PromoCountdownDisplay';

interface PricingPlan {
  id: "free" | "plus" | "premium" | "presupuesto";
  name: string;
  price: string;
  before?: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  color: string;
  bgClass: string;
  buttonClass: string;
  checkClass: string;
}

interface PricingProps {
  /** Muestra el título y subtítulo de la sección */
  showHeader?: boolean;
  className?: string;
}

export default function Pricing({ showHeader = true, className = "py-20 md:py-0 md:pb-30" }: PricingProps) {
  const { hours, minutes, seconds, isExpired } = usePromoCountdown();

  const plans: PricingPlan[] = [
    {
      id: "free",
      name: "Gratuito",
      price: "$0",
      period: "/mes",
      description: "Para pequeños locales o food trucks que inician.",
      features: [
        "Hasta 10 platos",
        "Código QR con tu logo",
        "Fotos básicas",
        "Pedidos por WhatsApp con envio",
      ],
      cta: "Crear Menú Gratis",
      href: "/registro-de-usuario?plan=free",
      color: "text-gray-800",
      bgClass: "bg-white border-gray-200 border shadow-sm",
      buttonClass: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300",
      checkClass: "text-gray-400",
    },
    {
      id: "plus",
      name: "Plus+",
      price: isExpired ? "$24.000" : "$12.000",
      before: isExpired ? "$29.900" : "$24.000",
      period: "/mes",
      description: "Para restaurantes que quieren destacar su marca.",
      features: [
        "Platos ilimitados",
        "Códigos QR personalizables con tu logo",
        "Fotos de alta calidad",
        "Analiticas y consulta de visitas a tu menú",
        "Menú altamente personalizable, colores, categorias, estructura, etc",
        "Pedidos por WhatsApp con envio",
        "Gestión de comandas",
        "Seccion para gestión de pedidos",
        "Botón de 'Descanso' para vacaciones",
        "Agrega promociones a tus productos",
        "Soporte prioritario"
      ],
      cta: isExpired ? "Elegir Plan Plus+" : "Aprovechar 50% OFF",
      href: "/registro-de-usuario?plan=plus",
      color: "text-primary",
      bgClass: "bg-white border-2 border-primary shadow-xl ring-2 ring-primary/20",
      buttonClass: "bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/30",
      checkClass: "text-primary",
    },
    {
      id: "premium",
      name: "Premium",
      price: "$49.000",
      before: "$59.900",
      period: "/mes",
      description: "El plan más completo para locales con gran variedad de platos y que quieren diferenciarse del resto.",
      features: [
        "Todas las características del plan Plus+",
        "Te armamos tu menú con tus platos",
        "Platos ilimitados, permanente",
        "Multi sucursal, gestiona tus locales desde un solo lugar",
        "Soporte prioritario"
      ],
      cta: "Elegir Plan Premium",
      href: "/registro-de-usuario?plan=premium",
      color: "text-black",
      bgClass: "bg-linear-to-br from-white via-gray-50 to-gray-100/50 border-black border-2 shadow-xl",
      buttonClass: "bg-black hover:bg-gray-800 text-white shadow-md",
      checkClass: "text-black",
    },
    {
      id: "presupuesto",
      name: "Quiero un presupuesto",
      price: "A cotizar",
      description: "Un plan de pago único con todas las funcionalidades premium incluidas. Ideal para menús fuera de Argentina que buscan destacar con las funcionalidades más completas.",
      features: [
        "Todas las funcionalidades Premium",
        "Ideal para negocios fuera de Argentina",
        "Soporte prioritario"
      ],
      cta: "Cotizar Plan",
      href: "/cotizar-menu",
      color: "text-blue-800",
      bgClass: "bg-linear-to-br from-white to-blue-200/40 border-blue-800 border-2 shadow-xl",
      buttonClass: "bg-black hover:bg-gray-800 text-white shadow-md",
      checkClass: "text-black",
    },
  ];

  return (
    <section id="planes" className={`w-full ${className}`}>
      <div className="w-full relative mt-10 z-10">
        {showHeader && (
          <div className="text-center md:text-start mb-12 md:mb-16 px-2 md:pl-12">
            <motion.h2
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl text-balance md:text-5xl font-bold text-stone-900 mb-4"
            >
              Tener tu Menú digital nunca fue taaan fácil
            </motion.h2>
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
        )}

        {/* Grid: 1 col móvil, 2 cols tablet, 4 cols desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 xl:gap-3 px-3">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`relative flex flex-col p-5 rounded-2xl border ${plan.bgClass} min-h-115`}
            >
              {plan.id === "plus" && (
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-primary text-white text-[11px] md:text-xs font-black uppercase px-4 py-1 rounded-full tracking-wider whitespace-nowrap shadow-md flex items-center gap-1 border border-white">
                  {isExpired ? (
                    "Recomendado"
                  ) : (
                    <>
                      <Flame className="w-3.5 h-3.5 fill-white" />
                      Recomendado • 50% OFF
                    </>
                  )}
                </div>
              )}

              {plan.id === "presupuesto" && (
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-purple-100 text-blue-800 text-[10px] md:text-xs font-extrabold uppercase px-3.5 py-1 rounded-full tracking-wider whitespace-nowrap shadow-sm">
                  Negocios internacionales
                </div>
              )}

              <div className="mb-3 mt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`text-2xl font-black ${plan.color} flex items-center gap-2`}>
                    {plan.name}
                  </h3>
                  {plan.id === "plus" && !isExpired && (
                    <span className="inline-flex items-center gap-1 bg-red-100 text-primary text-[11px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                      <Flame className="w-3 h-3 fill-primary" />
                      50% OFF
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-xs mt-1.5 min-h-8.75 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="mb-4 flex items-baseline gap-2 flex-wrap">
                <span className="text-3xl md:text-4xl font-black text-black tracking-tight">{plan.price}</span>
                {plan.before && (
                  <span className="text-gray-400 text-base line-through decoration-red-500 font-bold">
                    {plan.before}
                  </span>
                )}
                {plan.period && <span className="text-gray-500 text-xs font-semibold">{plan.period}</span>}
              </div>

              {plan.id === "plus" && !isExpired && (
                <div className="mb-4">
                  <PromoCountdownDisplay
                    hours={hours}
                    minutes={minutes}
                    seconds={seconds}
                    variant="card"
                    badgeText="Promoción 50% OFF por 12hs"
                  />
                </div>
              )}

              <div className="mb-6 grow">
                <ul className="space-y-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.checkClass}`} />
                      <span className="text-gray-600 text-xs leading-normal">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={plan.href}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${plan.buttonClass}`}
              >
                {plan.id === "plus" && !isExpired && <Flame className="w-4 h-4 fill-white" />}
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-8 px-3 text-center flex flex-col gap-1 max-w-2xl mx-auto">
        <p className="text-gray-400 text-[10px]">
          Manejo seguro de suscripciones a través de Mercado Pago.
        </p>
        <p className="text-gray-400 text-[10px]">
          En caso de dudas o para realizar la anulación de suscripción, puedes ingresar desde aquí al panel de{" "}
          <a href="https://www.mercadopago.com.ar/subscriptions#from-section=menu" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">
            Mercado Pago
          </a>
          . <br />
          Si quieres solicitar un reembolso, <Link href="/contacto" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">contactate</Link> con nosotros.
        </p>
        <p className="text-gray-400 text-[10px]">
          Leé nuestros <Link href="/terminos-y-condiciones" className="text-gray-800 hover:underline">Términos y Condiciones</Link>.
        </p>
      </div>
    </section>
  );
}
/*
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
 
        <div className="grid grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto space-y-4 md:space-y-0 gap-4 items-start px-2">
          {activePlans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col p-6 md:p-4 md:min-h-134 rounded-xl border
                ${!plan.premium && !plan.recommended && 'border-gray-200'}
                ${plan.premium && 'bg-gray-100 hover:from-white transition-all duration-500 hover:via-gray-200 hover:to-gray-600/30 border-2 border-black'}
                ${plan.recommended && 'bg-white border-primary shadow-2xl shadow-primary-900/10 md:scale-103 z-10'}`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary border-2 border-white text-white px-4 py-1 rounded-full text-xs font-black tracking-wider uppercase whitespace-nowrap shadow-md flex items-center gap-1">
                  {isExpired ? (
                    "Recomendado"
                  ) : (
                    <>
                      <Flame className="w-3.5 h-3.5 fill-white" />
                      Recomendado • 50% OFF
                    </>
                  )}
                </div>
              )}
 
              <div className="mb-2 p-3">
                <h3 className={`text-2xl font-black ${plan.recommended ? 'text-primary' : 'text-gray-900'} flex items-center flex-wrap gap-2`}>
                  {plan.name === "Plus" ? plan.name + "+" : plan.name}
                  {plan.recommended && !isExpired && (
                    <span className="inline-flex items-center gap-1 bg-red-100 text-primary text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      <Flame className="w-3.5 h-3.5 fill-primary text-primary" />
                      50% OFF
                    </span>
                  )}
                </h3>
                <p className="text-gray-500 text-xs mt-2 min-h-auto md:min-h-10 leading-relaxed">{plan.description}</p>
              </div>
 
              <div className={`${plan.usdPrice ? "mb-2" : "mb-4"} flex items-baseline gap-2 flex-wrap px-3`}>
                {plan.usdPrice && (
                  <span className="text-[11px] font-extrabold uppercase text-gray-900">
                    ARS
                  </span>
                )}
                <span className="text-3xl font-black text-black tracking-tight">{plan.price}</span>
                {plan.before && (
                  <span className="text-gray-400 text-lg md:text-xl font-bold line-through decoration-red-500">{plan.before}</span>
                )}
                <span className="text-gray-500 text-xs font-semibold">{plan.period}</span>
              </div>
              {plan.usdPrice && (
                <p className="text-xs font-semibold text-stone-600 px-3 mb-4">
                  Pagos fuera de Argentina con tarjeta:{" "}
                  <span className="font-black text-stone-900">
                    USD {plan.usdPrice} {plan.period}
                  </span>
                </p>
              )}
 
              {plan.recommended && !isExpired && (
                <div className="mx-2 mb-4">
                  <PromoCountdownDisplay
                    hours={hours}
                    minutes={minutes}
                    seconds={seconds}
                    variant="card"
                    badgeText="Promoción 50% OFF por 12hs"
                  />
                </div>
              )}
 
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
        <p className="text-gray-500 text-xs">Pagos en Argentina a través de Mercado Pago y suscripciones internacionales con tarjeta vía Paddle.</p>
        <p className="text-gray-500 text-xs text-pretty">En caso de reembolso o anulación de suscripción en Argentina, ingresá al panel de <a href="https://www.mercadopago.com.ar" className="text-blue-500 underline">Mercado Pago</a>, o <a href="/contacto" className="text-blue-500 underline">contactanos</a> si pagaste con Paddle.</p>
        <p className="text-gray-500 text-xs">Leé nuestros <a href="/terminos-y-condiciones" className="text-blue-500 underline">Términos y Condiciones</a>.</p>
      </span> 
   */
