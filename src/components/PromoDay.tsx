"use client";
import "animate.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaClock, FaFire } from "react-icons/fa";
import {
  PromoMetadata,
  formatRemainingTime,
} from "@/src/components/dashboard/components/promoComponents/promoUtils";

const priceFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
});

export default function PromoDayCard({
  foods,
  template,
  promoMeta,
}: {
  foods: any;
  template: any;
  promoMeta?: PromoMetadata;
}) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [nowMs, setNowMs] = useState<number | null>(null);

  const expiresAt = promoMeta?.expiresAt ?? null;
  useEffect(() => {
    if (!expiresAt) return;
    setNowMs(Date.now());
    const interval = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const basePrice = Number(foods.price || 0);
  const promoPrice = Number(foods.promo_price ?? basePrice);
  const fallbackPercent =
    basePrice > 0 ? Math.max(0, Math.round(((basePrice - promoPrice) / basePrice) * 100)) : 0;

  const badgeText =
    promoMeta?.badge ||
    foods.promo_badge ||
    (promoPrice === 0 ? "GRATIS" : fallbackPercent > 0 ? `${fallbackPercent}% OFF` : "PROMO");

  const mode = promoMeta?.mode || foods.promo_type || "percentage";
  const occasionTag = promoMeta?.occasionTag || foods.occasion_tag;

  const badgeBgClass =
    mode === "multiplier"
      ? `${template?.accentColors?.[2]}  ${template?.icons}`
      : mode === "second_unit"
        ? `${template?.accentColors?.[2]}  ${template?.icons}`
        : mode === "fixed"
          ? "bg-blue-600 text-white"
          : "bg-emerald-600 text-white";

  const remaining = expiresAt && nowMs !== null ? formatRemainingTime(expiresAt - nowMs) : null;

  return (
    <div
      className={`relative border-2 ${template?.icons || "border-gray-200"} flex min-h-30 w-full overflow-hidden rounded-2xl p-2 md:h-52 md:p-3`}
    >
      <div className="absolute inset-0 z-20 bg-linear-to-r from-black/20 via-[#000000] to-[#000000]" />

      {!isImageLoaded && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 z-10 skeleton-shimmer ${template?.backgroundColor2 || "bg-gray-800"}`}
        />
      )}
      <Image
        loading="eager"
        priority
        fetchPriority="high"
        src={foods.photo}
        alt={foods.name}
        width={300}
        height={300}
        onLoad={() => setIsImageLoaded(true)}
        onError={() => setIsImageLoaded(true)}
        className={`absolute -left-5 w-50 md:w-100 top-0 my-auto inset-0 z-10 object-contain transition-opacity duration-300 ${isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
      />

      <div className="z-20 relative w-full flex flex-1 flex-col justify-between text-white">
        <div className="flex flex-col gap-1">
          {/* Etiquetas de tipo de promoción, ocasión y tiempo */}
          <div className="flex items-center justify-start absolute top-0 right-0 sm:justify-start gap-1.5 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[14px] md:text-xs font-black uppercase tracking-wide shadow-md ${badgeBgClass || "text-yellow-300 bg-primary"}`}
            >
              {badgeText}
            </span>

            {occasionTag && (
              <span className="px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold bg-orange-500/90 text-white flex items-center gap-1 shadow-sm">
                <FaFire size={10} />
                {occasionTag}
              </span>
            )}
          </div>

          <div className="w-75 md:w-full">
            <h3 className="line-clamp-1 text-start text-lg font-bold uppercase leading-tight md:text-2xl">
              {foods.name.length > 20 ? foods.name.slice(0, 24) + "..." : foods.name}
            </h3>
            <p className="text-start text-sm font-normal opacity-80 leading-tight md:text-xl line-clamp-1">
              {foods?.description}
            </p>
          </div>
        </div>

        <div className="justify-center items-end flex flex-col relative">
          {remaining && !remaining.isExpired && (
            <span
              className={`px-2 py-0.5 absolute  bottom-0 left-0 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1 shadow-sm ${remaining.isUrgent
                ? "bg-red-600 text-white animate-pulse"
                : "bg-indigo-600/90 text-white"
                }`}
            >
              <FaClock size={10} />
              {remaining.text}
            </span>
          )}
          <span className="text-[13px] text-gray-300 line-through decoration-primary md:text-sm">
            Antes {priceFormatter.format(basePrice)}
          </span>

          <span
            className={`text-2xl font-extrabold drop-shadow-md px-2 md:p-3 py-1 rounded-md ${template?.accentColors?.[1] || "text-yellow-300 bg-primary"
              } leading-none md:text-3xl`}
          >
            {promoPrice === 0
              ? "¡GRATIS!"
              : `¡Hoy ${priceFormatter.format(promoPrice)}${mode === "multiplier" ? " c/u" : ""}!`}
          </span>
        </div>
      </div>
    </div>
  );
}
