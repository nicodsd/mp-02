"use client";
import React, { useState } from "react";
import { Check, Flame, Clock, Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import { URI } from "@/src/lib/const";
import { usePromoCountdown } from "@/src/utils/usePromoCountdown";
import PromoCountdownDisplay from "@/src/components/common/PromoCountdownDisplay";
import { PaidPlanId, isValidPaidPlanId } from "@/src/utils/planPricing";
import { getVerifiedSubscriptionPayload } from "@/src/utils/promoServerAction";
import Link from "next/link";
import { MdChevronLeft } from "react-icons/md";

const PagosPage = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { hours, minutes, seconds, isExpired } = usePromoCountdown();

  const plusPriceFormatted = isExpired ? "$24.000" : "$12.000";
  const plusBeforeFormatted = isExpired ? "$29.900" : "$24.000";

  const handleSubscribe = async (planId: PaidPlanId) => {
    if (!isValidPaidPlanId(planId)) return;
    setLoadingPlan(planId);
    try {
      // Validamos en el servidor el precio real según el plan y la vigencia de la cookie HttpOnly
      const verified = await getVerifiedSubscriptionPayload(planId);

      const response = await fetch(`${URI}/auth/subscribe`, {
        method: "POST",
        body: JSON.stringify({
          reason: `Plan ${verified.plan.toUpperCase()} - QMENU`,
          transaction_amount: verified.transaction_amount,
          plan: verified.plan,
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
      alert("Hubo un error al procesar el pago");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <MdChevronLeft className="text-2xl mr-0.5" />
          Volver al inicio
        </Link>
      </div>

      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-black text-stone-900 mb-3 tracking-tight">
          Elige el plan ideal para tu negocio
        </h1>
        <p className="text-base md:text-lg text-stone-600 max-w-2xl mx-auto">
          Aprovechá la promoción exclusiva por tiempo limitado y empezá a potenciar tus ventas hoy mismo.
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* PLAN PLUS (PROMO 50% OFF) */}
        <div className="relative flex flex-col justify-between p-6 md:p-8 bg-white border-2 border-primary rounded-2xl shadow-xl shadow-red-500/10 md:scale-102 z-10">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary border-2 border-white text-white text-xs md:text-sm font-black uppercase px-4 py-1 rounded-full tracking-wider whitespace-nowrap shadow-md flex items-center gap-1.5">
            {isExpired ? (
              "Recomendado"
            ) : (
              <>
                <Flame className="w-4 h-4 fill-white" />
                Recomendado • 50% OFF
              </>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 mt-2">
              <h2 className="text-2xl md:text-3xl font-black text-primary flex items-center gap-2">
                Plan Plus+
              </h2>
              {!isExpired && (
                <span className="inline-flex items-center gap-1 bg-red-100 text-primary text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
                  <Flame className="w-3.5 h-3.5 fill-primary" />
                  50% OFF
                </span>
              )}
            </div>
            <p className="text-sm text-stone-600 mb-4 min-h-10">
              Para restaurantes y locales que quieren destacar su marca con platos ilimitados.
            </p>

            {/* PRECIO DESTACADO */}
            <div className="mb-4 flex items-baseline gap-2 flex-wrap">
              <span className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight">
                {plusPriceFormatted}
              </span>
              <span className="text-xl md:text-2xl text-stone-400 line-through decoration-red-500 font-bold">
                {plusBeforeFormatted}
              </span>
              <span className="text-stone-500 text-sm font-semibold">/mes</span>
            </div>

            {/* CONTADOR VISIBLE */}
            {!isExpired && (
              <div className="mb-6">
                <PromoCountdownDisplay
                  hours={hours}
                  minutes={minutes}
                  seconds={seconds}
                  variant="card"
                  badgeText="50% OFF termina en:"
                />
              </div>
            )}

            <ul className="space-y-2.5 mb-8 text-stone-700 text-sm">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 stroke-[2.5]" />
                <span className="font-semibold">Platos ilimitados, permanente</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 stroke-[2.5]" />
                <span>Códigos QR personalizables con tu logo</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 stroke-[2.5]" />
                <span>Fotos de alta calidad</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 stroke-[2.5]" />
                <span>Analíticas de visitas</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 stroke-[2.5]" />
                <span>Menú personalizable según estética</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 stroke-[2.5]" />
                <span>Compras por WhatsApp</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 stroke-[2.5]" />
                <span>Gestión de promociones</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSubscribe("plus")}
            disabled={loadingPlan !== null}
            className="w-full py-4 text-base md:text-lg font-black text-white bg-primary hover:bg-primary-600 active:scale-98 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loadingPlan === "plus" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Conectando con Mercado Pago...
              </>
            ) : isExpired ? (
              <>
                Suscribirme al Plan Plus+ <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                Aprovechar 50% OFF - Suscribirme <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* PLAN PREMIUM */}
        <div className="relative flex flex-col justify-between p-6 md:p-8 bg-stone-100 border-2 border-stone-900 rounded-2xl shadow-md">
          <div>
            <div className="flex items-center justify-between mb-2 mt-2">
              <h2 className="text-2xl md:text-3xl font-black text-stone-900">
                Plan Premium
              </h2>
            </div>
            <p className="text-sm text-stone-600 mb-4 min-h-10">
              El plan más completo con multi-sucursal, gestión de pedidos y soporte prioritario.
            </p>

            <div className="mb-4 flex items-baseline gap-2 flex-wrap">
              <span className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight">
                $34.900
              </span>
              <span className="text-xl md:text-2xl text-stone-400 line-through decoration-stone-400 font-bold">
                $39.900
              </span>
              <span className="text-stone-500 text-sm font-semibold">/mes</span>
            </div>

            <div className="mb-6 p-3 rounded-xl bg-white/60 border border-stone-200 text-xs text-stone-600">
              Ideal para locales gastronómicos de alta rotación y franquicias.
            </div>

            <ul className="space-y-2.5 mb-8 text-stone-700 text-sm">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-stone-900 shrink-0 stroke-[2.5]" />
                <span className="font-semibold">Todas las funciones de Plus+</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-stone-900 shrink-0 stroke-[2.5]" />
                <span>Sección para gestión de pedidos</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-stone-900 shrink-0 stroke-[2.5]" />
                <span>Multi sucursal</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-stone-900 shrink-0 stroke-[2.5]" />
                <span>Botón de descanso para vacaciones</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-stone-900 shrink-0 stroke-[2.5]" />
                <span>Soporte prioritario 24/7</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSubscribe("premium")}
            disabled={loadingPlan !== null}
            className="w-full py-4 text-base md:text-lg font-black text-white bg-stone-900 hover:bg-stone-800 active:scale-98 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loadingPlan === "premium" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Conectando con Mercado Pago...
              </>
            ) : (
              <>
                Elegir Plan Premium <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      <footer className="mt-12 text-center text-xs text-stone-500 flex flex-col gap-1.5 max-w-md">
        <p className="flex items-center justify-center gap-1.5 font-semibold text-stone-700">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          Procesamiento seguro a través de Mercado Pago
        </p>
        <p>Aceptamos todas las tarjetas de crédito, débito y dinero en cuenta.</p>
        <p>Podes cancelar o pausar tu suscripción en cualquier momento.</p>
      </footer>
    </div>
  );
};

export default PagosPage;
