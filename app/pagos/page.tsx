"use client";
import { ArrowLeft } from 'lucide-react';
import Navbar from "@/src/components/land_page/Navbar";
import Footer from "@/src/components/land_page/Footer";
import Pricing from "@/src/components/land_page/Pricing";
import Link from 'next/link';

export default function PricingPage() {
  return (
    <>
      <div className="flex selection:bg-primary selection:text-white relative bg-background flex-col items-center w-full min-h-auto mb-20 md:mb-0">
        <Navbar isIndex={false} />
        <main className="grow pt-30 md:pt-40 pb-20 md:rounded-b-2xl bg-background w-full relative flex flex-col items-center md:max-w-7xl mx-auto px-4">
          <div className="w-full">
            <Link href="/guias" className="inline-flex items-center hover:text-orange-600 font-medium mb-3 transition-colors md:pl-12">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Guías / Cuanto cuesta crear un menú digital
            </Link>
            <Pricing className="pb-0" />
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
/* "use client";
import React, { useState } from "react";
import { Check, Flame, Loader2, ShieldCheck, ArrowRight, Globe, MapPin, CreditCard } from "lucide-react";
import { URI } from "@/src/lib/const";
import { usePromoCountdown } from "@/src/utils/usePromoCountdown";
import PromoCountdownDisplay from "@/src/components/common/PromoCountdownDisplay";
import { OFFICIAL_INTERNATIONAL_PLAN_PRICES, PaidPlanId, isValidPaidPlanId } from "@/src/utils/planPricing";
import { getVerifiedSubscriptionPayload } from "@/src/utils/promoServerAction";
import CheckoutPaymentModal from "@/src/components/modals/CheckoutPaymentModal";
import Link from "next/link";
import { MdChevronLeft } from "react-icons/md";

const PagosPage = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<PaidPlanId | null>(null);
  const [paddleNotice, setPaddleNotice] = useState<string | null>(null);
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
      <div className="w-full max-w-6xl mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <MdChevronLeft className="text-2xl mr-0.5" />
          Volver al inicio
        </Link>
      </div>

      <div className="w-full max-w-6xl text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-black text-stone-900 mb-3 tracking-tight">
          Elige el plan ideal para tu negocio
        </h1>
        <p className="text-base md:text-lg text-stone-600 max-w-2xl mx-auto">
          Aprovechá la promoción exclusiva por tiempo limitado y elegí pagar en Argentina con Mercado Pago o desde cualquier país con tarjeta vía Paddle.
        </p>
      </div>

      {paddleNotice && (
        <div className="w-full max-w-6xl mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-medium text-center">
          {paddleNotice}
        </div>
      )}

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
   
        <div className="relative flex flex-col justify-between p-6 md:p-7 bg-white border border-stone-200 rounded-2xl shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-2 mt-2">
              <h2 className="text-2xl md:text-3xl font-black text-stone-900">
                Plan Gratuito
              </h2>
            </div>
            <p className="text-sm text-stone-600 mb-4 min-h-10">
              Para pequeños locales o food trucks que inician su menú digital.
            </p>

            <div className="mb-4 flex items-baseline gap-2 flex-wrap">
              <span className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight">
                $0
              </span>
              <span className="text-stone-500 text-sm font-semibold">/mes</span>
            </div>

            <div className="mb-6 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600">
              Ideal para probar QMenú sin costo ni tarjeta requerida.
            </div>

            <ul className="space-y-2.5 mb-8 text-stone-700 text-sm">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-stone-400 shrink-0 stroke-[2.5]" />
                <span>Hasta 10 platos</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-stone-400 shrink-0 stroke-[2.5]" />
                <span>Código QR con tu logo</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-stone-400 shrink-0 stroke-[2.5]" />
                <span>Fotos básicas</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-stone-400 shrink-0 stroke-[2.5]" />
                <span>Los pedidos te llegan al WhatsApp</span>
              </li>
            </ul>
          </div>

          <Link
            href="/registro-de-usuario?plan=free"
            className="w-full py-4 text-base font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 active:scale-98 rounded-xl border border-stone-300 transition-all flex items-center justify-center gap-2"
          >
            Empezar Gratis <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

 
        <div className="relative flex flex-col justify-between p-6 md:p-7 bg-white border-2 border-primary rounded-2xl shadow-xl shadow-red-500/10 md:scale-102 z-10">
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

   
            <div className="mb-2 flex items-baseline gap-2 flex-wrap">
              <span className="text-xs font-extrabold uppercase text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
                ARS
              </span>
              <span className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight">
                {plusPriceFormatted}
              </span>
              <span className="text-xl md:text-2xl text-stone-400 line-through decoration-red-500 font-bold">
                {plusBeforeFormatted}
              </span>
              <span className="text-stone-500 text-sm font-semibold">/mes</span>
            </div>
            <p className="text-xs font-semibold text-stone-600 mb-4">
              Pagos fuera de Argentina con tarjeta:{" "}
              <span className="font-black text-stone-900">
                USD $
                {isExpired
                  ? OFFICIAL_INTERNATIONAL_PLAN_PRICES.plus.regularUsd
                  : OFFICIAL_INTERNATIONAL_PLAN_PRICES.plus.promoUsd}{" "}
                /mes
              </span>
            </p>

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
            onClick={() => setCheckoutPlan("plus")}
            disabled={loadingPlan !== null}
            className="w-full py-4 text-base md:text-lg font-black text-white bg-primary hover:bg-primary-600 active:scale-98 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loadingPlan === "plus" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Conectando...
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

        <div className="relative flex flex-col justify-between p-6 md:p-7 bg-stone-100 border-2 border-stone-900 rounded-2xl shadow-md">
          <div>
            <div className="flex items-center justify-between mb-2 mt-2">
              <h2 className="text-2xl md:text-3xl font-black text-stone-900">
                Plan Premium
              </h2>
            </div>
            <p className="text-sm text-stone-600 mb-4 min-h-10">
              El plan más completo con multi-sucursal, gestión de pedidos y soporte prioritario.
            </p>

            <div className="mb-2 flex items-baseline gap-2 flex-wrap">
              <span className="text-xs font-extrabold uppercase text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
                ARS
              </span>
              <span className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight">
                $49.000
              </span>
              <span className="text-xl md:text-2xl text-stone-400 line-through decoration-stone-400 font-bold">
                $59.900
              </span>
              <span className="text-stone-500 text-sm font-semibold">/mes</span>
            </div>
            <p className="text-xs font-semibold text-stone-600 mb-4">
              Pagos fuera de Argentina con tarjeta:{" "}
              <span className="font-black text-stone-900">
                USD ${OFFICIAL_INTERNATIONAL_PLAN_PRICES.premium.regularUsd} /mes
              </span>
            </p>

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
            onClick={() => setCheckoutPlan("premium")}
            disabled={loadingPlan !== null}
            className="w-full py-4 text-base md:text-lg font-black text-white bg-stone-900 hover:bg-stone-800 active:scale-98 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loadingPlan === "premium" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Conectando...
              </>
            ) : (
              <>
                Elegir Plan Premium <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-sky-200 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide bg-sky-100 text-sky-800 px-2.5 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5" /> Solo Argentina
            </span>
            <span className="text-xs font-bold text-sky-700">Mercado Pago (ARS)</span>
          </div>
          <h3 className="font-bold text-stone-900 text-base mt-1">
            Pagos locales dentro de Argentina
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Esta opción es únicamente para pagos dentro de Argentina. Acepta dinero en cuenta, débito y tarjetas locales.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-300 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide bg-stone-900 text-white px-2.5 py-1 rounded-full">
              <Globe className="w-3.5 h-3.5" /> Internacional
            </span>
            <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" /> Paddle (USD)
            </span>
          </div>
          <h3 className="font-bold text-stone-900 text-base mt-1">
            Suscripción internacional con tarjeta
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Para restaurantes fuera de Argentina. Suscripciones mensuales con tarjeta de crédito/débito gestionadas de forma segura por Paddle.
          </p>
        </div>
      </div>

      <footer className="mt-10 text-center text-xs text-stone-500 flex flex-col gap-1.5 max-w-lg">
        <p className="flex items-center justify-center gap-1.5 font-semibold text-stone-700">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          Procesamiento seguro a través de Mercado Pago (Argentina) y Paddle (Internacional)
        </p>
        <p>Aceptamos tarjetas de crédito, débito y dinero en cuenta según tu país.</p>
        <p>Podes cancelar o pausar tu suscripción en cualquier momento.</p>
      </footer>

      <CheckoutPaymentModal
        isOpen={checkoutPlan !== null}
        onClose={() => setCheckoutPlan(null)}
        selectedPlan={checkoutPlan}
        isPromoExpired={isExpired}
        onSelectMercadoPago={handleSubscribe}
        loadingMP={loadingPlan !== null}
        source="pagos"
        onPaddleSuccess={({ plan }) => {
          setPaddleNotice(
            `¡Suscripción internacional al Plan ${plan.toUpperCase()} iniciada con Paddle! En instantes se reflejará en tu cuenta.`
          );
        }}
      />
    </div>
  );
};

export default PagosPage;
 */
