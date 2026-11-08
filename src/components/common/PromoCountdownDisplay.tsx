"use client";
import React from "react";
import { Clock, Flame } from "lucide-react";

interface PromoCountdownDisplayProps {
  hours: string;
  minutes: string;
  seconds: string;
  variant?: "card" | "accordion" | "banner";
  badgeText?: string;
  className?: string;
}

export default function PromoCountdownDisplay({
  hours,
  minutes,
  seconds,
  variant = "card",
  badgeText = "Oferta 50% OFF por 12hs",
  className = "",
}: PromoCountdownDisplayProps) {
  if (variant === "accordion") {
    return (
      <div
        className={`w-full mt-3 p-3 rounded-xl bg-linear-to-r from-red-50 via-orange-50 to-red-100 border-2 border-red-300 flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}
      >
        <div className="flex items-center gap-2">
          <span className="p-1.5">
            <Clock className="w-10 h-10 text-primary" />
          </span>
          <div className="flex flex-col text-left">
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              {badgeText}
            </span>
            <span className="text-[11px] text-stone-600 font-medium">
              Asegurá tu precio con descuento antes de que finalice
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 font-mono text-stone-900 shrink-0">
          <div className="flex flex-col items-center">
            <span className="bg-primary text-white font-black text-2xl px-2.5 py-1 rounded-lg shadow-sm min-w-10 text-center">              {hours}
            </span>
            <span className="text-[9px] font-bold text-stone-500 uppercase mt-0.5">hs</span>
          </div>
          <span className="text-primary font-black text-lg -mt-3">:</span>
          <div className="flex flex-col items-center">
            <span className="bg-primary text-white font-black text-2xl px-2.5 py-1 rounded-lg shadow-sm min-w-10 text-center">              {minutes}
            </span>
            <span className="text-[9px] font-bold text-stone-500 uppercase mt-0.5">min</span>
          </div>
          <span className="text-primary font-black text-lg -mt-3">:</span>
          <div className="flex flex-col items-center">
            <span className="bg-black text-white font-black text-2xl px-2.5 py-1 rounded-lg shadow-sm min-w-10 text-center">
              {seconds}
            </span>
            <span className="text-[9px] font-bold text-stone-500 uppercase mt-0.5">seg</span>
          </div>
        </div>
      </div>
    );
  }

  // Variant "card" (por defecto para Pricing, SubscriptionPanel, Pagos)
  return (
    <div
      className={`w-full p-3 md:p-3.5 rounded-xl bg-linear-to-b from-red-50 to-orange-50/70 border border-red-300 flex flex-col items-center justify-center gap-2 ${className}`}
    >
      <div className="flex items-center gap-1.5 text-xs font-black text-primary uppercase tracking-wider">
        <Clock className="w-4 h-4 animate-spin-slow shrink-0" />
        <span>{badgeText}</span>
      </div>

      <div className="flex items-center gap-1.5 font-mono text-stone-900">
        <div className="flex flex-col items-center">
          <span className="bg-primary text-white font-black text-2xl px-2.5 py-1 rounded-lg shadow-sm min-w-10 text-center">
            {hours}
          </span>
          <span className="text-[9px] font-extrabold text-primary uppercase mt-0.5">HORAS</span>
        </div>
        <span className="text-primary font-black text-xl -mt-4">:</span>
        <div className="flex flex-col items-center">
          <span className="bg-primary text-white font-black text-2xl px-2.5 py-1 rounded-lg shadow-sm min-w-10 text-center">
            {minutes}
          </span>
          <span className="text-[9px] font-extrabold text-primary uppercase mt-0.5">MIN</span>
        </div>
        <span className="text-primary font-black text-xl -mt-4">:</span>
        <div className="flex flex-col items-center">
          <span className="bg-black text-white font-black text-2xl px-2.5 py-1 rounded-lg shadow-sm min-w-10 text-center">
            {seconds}
          </span>
          <span className="text-[9px] font-extrabold text-black uppercase mt-0.5">SEG</span>
        </div>
      </div>
    </div>
  );
}

