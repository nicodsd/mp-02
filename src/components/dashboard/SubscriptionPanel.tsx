"use client";
import React, { useState } from "react";
import { Check, Loader2, CreditCard, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { URI } from "@/src/lib/const";

interface PlanFeature {
  text: string;
}

interface Plan {
  id: "free" | "plus" | "premium";
  name: string;
  price: string;
  before?: string;
  description: string;
  features: string[];
  color: string;
  bgClass: string;
  buttonClass: string;
}

export default function SubscriptionPanel({ user }: { user: any }) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: "free",
      name: "Gratuito",
      price: "$0",
      description: "Para pequeños locales o food trucks que inician.",
      features: [
        "Hasta 10 platos",
        "Código QR con tu logo",
        "Fotos básicas",
        "Actualización en tiempo real",
        "Los pedidos te llegan al WhatsApp"
      ],
      color: "text-gray-600",
      bgClass: "bg-white border-gray-200",
      buttonClass: "bg-gray-100 hover:bg-gray-200 text-gray-800",
    },
    {
      id: "plus",
      name: "Plus",
      price: "$100",
      before: "$19.900",
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
      color: "text-primary",
      bgClass: "bg-white border-primary shadow-lg ring-1 ring-primary/20",
      buttonClass: "bg-primary hover:bg-primary/90 text-white",
    },
    {
      id: "premium",
      name: "Premium",
      price: "$19.900",
      before: "$24.900",
      description: "Gestión avanzada con multi sucursal y pedidos en línea.",
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
      color: "text-black",
      bgClass: "bg-gradient-to-br from-white via-gray-50 to-gray-100/50 border-black border-2 shadow-xl",
      buttonClass: "bg-black hover:bg-gray-800 text-white shadow-md",
    },
  ];

  const handleSubscribe = async (planId: "plus" | "premium", amount: number) => {
    setLoadingPlan(planId);
    localStorage.setItem("plan", planId);
    try {
      const response = await fetch(`${URI}/auth/subscribe`, {
        method: "POST",
        body: JSON.stringify({
          reason: `Plan ${planId.toUpperCase()} - QMENU`,
          transaction_amount: amount,
          plan: planId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("No se pudo iniciar el proceso de pago.");
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("Hubo un error al procesar el pago");
    } finally {
      setLoadingPlan(null);
    }
  };

  const getAmountFromPrice = (priceStr: string) => {
    return parseInt(priceStr.replace("$", "").replace(".", ""), 10);
  };

  return (
    <div className="w-full pb-10">
      <header className="p-3 w-full flex flex-col mb-6">
        <div className="flex items-center gap-2 text-gray-800 mb-1">
          <h1 className="text-2xl font-bold">Mi Suscripción</h1>
        </div>
        <p className="text-gray-500 text-sm">
          Administra tu plan de facturación y descubre características prémium para potenciar tu menú digital.
        </p>
      </header>

      {/* Plan actual info widget */}
      <div className={`mx-3 mb-8 p-5 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${user?.plan === "premium" ? "bg-black" : "bg-linear-to-r from-gray-50 to-gray-100"}`
      }>
        <div>
          <span className={`text-xs uppercase font-bold tracking-wider ${user?.plan === "premium" ? "text-gray-200" : "text-gray-400"}`}>Plan Activo</span>
          <div className="flex items-center gap-2 mt-1">
            <h2 className={`text-xl font-bold capitalize ${user?.plan === "premium" ? "text-white" : "text-gray-800"}`}>
              {user?.plan === "free" ? "Gratuito" : user?.plan}
            </h2>
            {user?.plan !== "free" && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 
                ${user?.plan === "premium" ? "bg-white text-black" : "bg-green-100 text-green-700"}`
              }>
                <ShieldCheck className="w-3.5 h-3.5" /> Activo
              </span>
            )}
          </div>
          <p className={`text-xs mt-1 ${user?.plan === "premium" ? "text-gray-300" : "text-gray-500"}`}>
            {user?.plan === "free"
              ? "Tienes acceso a las herramientas básicas para iniciar tu menú digital."
              : "Disfrutas de todas las ventajas de tu plan. Los pagos se administran en Mercado Pago."}
          </p>
        </div>

        {user?.plan !== "premium" && (
          <div className="flex items-center gap-1 bg-yellow-50 text-yellow-800 text-xs font-semibold px-3 py-2 rounded-xl border border-yellow-200">
            <Sparkles className="w-4 h-4 text-yellow-600 animate-pulse" />
            <span>¡Impulsa tus ventas actualizando tu plan hoy!</span>
          </div>
        )}
      </div>

      {/* Cards list */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-3">
        {plans.map((plan) => {
          const isActive = user?.plan === plan.id;
          const isDowngrade =
            (user?.plan === "premium" && (plan.id === "free" || plan.id === "plus")) ||
            (user?.plan === "plus" && plan.id === "free");

          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`relative flex flex-col p-6 rounded-2xl border ${plan.bgClass} min-h-[460px]`}
            >
              {plan.id === "plus" && (
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-primary text-white text-[10px] md:text-xs font-extrabold uppercase px-3.5 py-1 rounded-full tracking-wider whitespace-nowrap shadow-sm">
                  Recomendado
                </div>
              )}
              {plan.id === "premium" && (
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-black text-white text-[10px] md:text-xs font-extrabold uppercase px-3.5 py-1 rounded-full tracking-wider whitespace-nowrap shadow-sm">
                  El más completo
                </div>
              )}

              <div className="mb-4">
                <h3 className={`text-xl font-bold ${plan.color}`}>{plan.name}</h3>
                <p className="text-gray-500 text-xs mt-1.5 min-h-[35px] leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="mb-5 flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-black">{plan.price}</span>
                {plan.before && (
                  <span className="text-gray-400 text-sm line-through decoration-red-400">
                    {plan.before}
                  </span>
                )}
                <span className="text-gray-500 text-xs">/mes</span>
              </div>

              <div className="mb-6 grow">
                <ul className="space-y-2.5">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.id === "free" ? "text-gray-400" : plan.id === "plus" ? "text-primary" : "text-black"}`} />
                      <span className="text-gray-600 text-xs leading-normal">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {isActive ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-400 border border-gray-200 cursor-default flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-green-500" /> Plan Activo
                </button>
              ) : isDowngrade ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl font-bold text-xs bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed"
                >
                  Ya tienes un plan superior
                </button>
              ) : plan.id === "free" ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl font-bold text-xs bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed"
                >
                  Plan Gratuito
                </button>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.id as "plus" | "premium", getAmountFromPrice(plan.price))}
                  disabled={loadingPlan !== null}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${plan.buttonClass}`}
                >
                  {loadingPlan === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Conectando...
                    </>
                  ) : (
                    `Actualizar a ${plan.name}`
                  )}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      <footer className="mt-8 px-3 text-center flex flex-col gap-1 max-w-2xl mx-auto">
        <p className="text-gray-400 text-[10px]">
          Manejo seguro de suscripciones a través de Mercado Pago.
        </p>
        <p className="text-gray-400 text-[10px]">
          En caso de dudas, reembolsos o anulación de suscripción, puedes ingresar al panel de{" "}
          <a href="https://www.mercadopago.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            Mercado Pago
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
