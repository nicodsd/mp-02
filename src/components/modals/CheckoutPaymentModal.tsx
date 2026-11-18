"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  CheckoutEventNames,
  initializePaddle,
  type Paddle,
  type PaddleEventData,
} from "@paddle/paddle-js";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  OFFICIAL_INTERNATIONAL_PLAN_PRICES,
  OFFICIAL_PLAN_PRICES,
  type PaidPlanId,
} from "@/src/utils/planPricing";

interface CheckoutPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: PaidPlanId | null;
  isPromoExpired: boolean;
  onSelectMercadoPago: (planId: PaidPlanId) => Promise<void> | void;
  loadingMP?: boolean;
  userEmail?: string;
  userName?: string;
  userPassword?: string;
  pwCustomerId?: string;
  source: "pagos" | "panel" | "register";
  onPaddleSuccess?: (data: { transactionId?: string; plan: PaidPlanId }) => void;
}

export default function CheckoutPaymentModal({
  isOpen,
  onClose,
  selectedPlan,
  isPromoExpired,
  onSelectMercadoPago,
  loadingMP = false,
  userEmail,
  userName,
  userPassword,
  pwCustomerId,
  source,
  onPaddleSuccess,
}: CheckoutPaymentModalProps) {
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);
  const [loadingPaddle, setLoadingPaddle] = useState(false);
  const [paddleError, setPaddleError] = useState<string | null>(null);
  const [paddleSuccessMsg, setPaddleSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || paddle) return;

    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token || token.includes("placeholder")) return;

    const isProduction = process.env.NEXT_PUBLIC_PADDLE_ENV === "production";

    initializePaddle({
      ...(isProduction ? {} : { environment: "sandbox" as const }),
      token,
      ...(pwCustomerId?.startsWith("ctm_")
        ? { pwCustomer: { id: pwCustomerId } }
        : {}),
      eventCallback: (event: PaddleEventData) => {
        if (event.name === CheckoutEventNames.CHECKOUT_COMPLETED) {
          const transactionId = event.data?.transaction_id;
          setPaddleSuccessMsg(
            "¡Pago procesado con Paddle! Tu suscripción internacional se está activando."
          );
          if (selectedPlan && onPaddleSuccess) {
            onPaddleSuccess({ transactionId, plan: selectedPlan });
          }
        }
      },
    })
      .then((paddleInstance) => {
        if (paddleInstance) {
          setPaddle(paddleInstance);
        }
      })
      .catch((err) => {
        console.warn("No se pudo cargar Paddle.js:", err);
        setPaddleError(
          "No se pudo cargar Paddle (verificá tu conexión o si un bloqueador de anuncios está bloqueando cdn.paddle.com)."
        );
      });
  }, [isOpen, paddle, selectedPlan, onPaddleSuccess, pwCustomerId]);

  useEffect(() => {
    if (isOpen) {
      setPaddleError(null);
      setPaddleSuccessMsg(null);
    }
  }, [isOpen, selectedPlan]);

  if (!isOpen || !selectedPlan) return null;

  const arsInfo = OFFICIAL_PLAN_PRICES[selectedPlan];
  const usdInfo = OFFICIAL_INTERNATIONAL_PLAN_PRICES[selectedPlan];

  const arsPrice =
    selectedPlan === "plus" && !isPromoExpired
      ? arsInfo.promo
      : arsInfo.regular;

  const usdPrice =
    selectedPlan === "plus" && !isPromoExpired
      ? usdInfo.promoUsd
      : usdInfo.regularUsd;

  const formatArs = (value: number) =>
    new Intl.NumberFormat("es-AR").format(value);

  const handleSelectPaddle = async () => {
    setPaddleError(null);
    setPaddleSuccessMsg(null);
    setLoadingPaddle(true);

    try {
      const response = await fetch("/api/paddle/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlan,
          email: userEmail || "",
          name: userName || "",
          password: userPassword || "",
          source,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPaddleError(
          data?.error ||
          "No se pudo iniciar el checkout internacional con Paddle."
        );
        return;
      }

      if (paddle) {
        if (data.transactionId) {
          paddle.Checkout.open({
            transactionId: data.transactionId,
          });
          return;
        }

        if (data.priceId) {
          paddle.Checkout.open({
            items: [{ priceId: data.priceId, quantity: 1 }],
            ...(userEmail ? { customer: { email: userEmail } } : {}),
            customData: {
              plan: selectedPlan,
              email: userEmail || "",
              name: userName || "",
              source,
            },
          });
          return;
        }
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      setPaddleError(
        "El checkout de Paddle requiere configurar NEXT_PUBLIC_PADDLE_CLIENT_TOKEN y los Price IDs en las variables de entorno."
      );
    } catch (error) {
      console.error("Error iniciando checkout con Paddle:", error);
      setPaddleError("Error de conexión al iniciar el pago con Paddle.");
    } finally {
      setLoadingPaddle(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 sm:px-8 sm:py-6 border-b border-stone-100 bg-stone-50/70">
          <div>
            <h2 className="text-2xl sm:text-[28px] font-black text-stone-900 leading-tight">
              Elegí cómo pagar tu Plan {arsInfo.name}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Seleccioná tu método de pago según tu país de facturación.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar checkout"
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts */}
        {(paddleError || paddleSuccessMsg) && (
          <div className="px-6 sm:px-10 pt-5">
            {paddleError && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{paddleError}</span>
              </div>
            )}
            {paddleSuccessMsg && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{paddleSuccessMsg}</span>
              </div>
            )}
          </div>
        )}

        {/* Stacked Payment Cards (Group 8.jpg layout) */}
        <div className="p-4 sm:px-10 sm:py-8 flex flex-col gap-3">
          {/* Card 1: Mercado Pago (Solo Argentina) */}
          <div className="relative w-full pt-1">
            <span className="absolute -top-2.5 right-6 z-10 bg-[#000b76] text-white text-xs sm:text-sm font-semibold px-5 py-1 rounded-full shadow-xs pointer-events-none">
              Argentina
            </span>
            <button
              type="button"
              disabled={loadingMP || loadingPaddle}
              onClick={() => onSelectMercadoPago(selectedPlan)}
              className="w-full flex items-center justify-between gap-3 sm:px-3 py-4 sm:py-5 rounded-lg border border-[#5bc0eb] bg-linear-to-b from-[#6fd8ff] via-[#bdf0ff] to-white hover:brightness-98 active:scale-[0.99] transition-all cursor-pointer shadow-xs disabled:opacity-60"
            >
              <div className="flex items-center min-w-0">
                <Image
                  src="/images/icons-app/MP_RGB_HANDSHAKE_color_horizontal.png"
                  alt="Mercado Pago"
                  width={190}
                  height={52}
                  className="h-13 sm:h-16 w-auto object-contain"
                />
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className="bg-white px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-lg shadow-xs flex items-baseline gap-1.5">
                  <span className="text-sm sm:text-xl font-black text-black">
                    ARS
                  </span>
                  <span className="text-xl sm:text-4xl font-black text-black tracking-tight">
                    $ {formatArs(arsPrice)}
                  </span>
                </div>
                {loadingMP ? (
                  <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-black shrink-0" />
                ) : (
                  <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.75] text-black shrink-0" />
                )}
              </div>
            </button>
          </div>

          {/* Card 2: Tarjeta Visa o Mastercard (Pagos fuera de Argentina / Paddle) */}
          <button
            type="button"
            disabled={loadingMP || loadingPaddle}
            onClick={handleSelectPaddle}
            className="w-full flex items-center justify-between gap-3 px-5 sm:px-7 py-4 sm:py-5 rounded-lg bg-black hover:bg-stone-900 active:scale-[0.99] transition-all cursor-pointer shadow-md disabled:opacity-60"
          >
            <div className="text-left min-w-0">
              <span className="text-[11px] sm:text-xs text-stone-300 font-medium block mt-0.5">
                Pagos fuera de Argentina
              </span>
              <span className="text-base sm:text-2xl font-black text-white tracking-tight block leading-tight">
                Tarjeta Visa o Mastercard
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="bg-white px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-lg flex items-baseline gap-1.5">
                <span className="text-sm sm:text-xl font-black text-black">
                  USD
                </span>
                <span className="text-xl sm:text-4xl font-black text-black tracking-tight">
                  $ {usdPrice}
                </span>
              </div>
              {loadingPaddle ? (
                <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-white shrink-0" />
              ) : (
                <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.75] text-white shrink-0" />
              )}
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 pb-6 pt-1 text-center text-[11px] sm:text-xs text-stone-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
          <span>
            Pagos en Argentina vía Mercado Pago • Pagos internacionales con
            tarjeta procesados por Paddle.
          </span>
        </div>
      </div>
    </div>
  );
}
