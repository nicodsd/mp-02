"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { FaTimes, FaChevronLeft, FaChevronRight, FaFire } from "react-icons/fa";

export interface PromoItem {
  _id: string | number;
  name: string;
  price: number;
  promo_price?: number;
  photo: string;
  description?: string;
}

interface TemplateConfig {
  backgroundColor?: string;
  backgroundColor2?: string;
  textColor?: string;
  textColorOpacity?: string;
  textColor2?: string;
  border?: string;
  icons?: string;
  accentColors?: string[];
}

interface PromosModalProps {
  promos: PromoItem[];
  template?: TemplateConfig;
}

const priceFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
});

export default function PromosModal({ promos = [], template }: PromosModalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = promos.length;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!isOpen || total <= 1) return;
    const timer = setInterval(nextSlide, 4500);
    return () => clearInterval(timer);
  }, [isOpen, total, nextSlide, current]);

  if (!isOpen || total === 0) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 40) nextSlide();
    else if (distance < -40) prevSlide();
  };

  const handleSelectPromo = (id: string | number) => {
    setIsOpen(false);
    const element = document.getElementById(`dish-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const activePromo = promos[current];
  const finalPrice = activePromo.promo_price ?? activePromo.price;
  const hasDiscount =
    typeof activePromo.promo_price === "number" &&
    activePromo.promo_price < activePromo.price;
  const discountPercent = hasDiscount
    ? Math.round(((activePromo.price - activePromo.promo_price!) / activePromo.price) * 100)
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Promociones activas"
    >
      <div
        className={`${template?.backgroundColor || "bg-white"} ${
          template?.textColor || "text-gray-800"
        } relative w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border ${
          template?.border || "border-gray-200"
        }`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-4 py-2.5 border-b ${
            template?.border || "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <FaFire className={template?.icons || "text-primary"} size={16} />
            <span className="font-bold text-sm uppercase tracking-wide">
              Promos del día
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-full hover:bg-black/10 transition-colors"
            aria-label="Cerrar promociones"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Slide */}
        <div className="relative aspect-square w-full bg-black/5 overflow-hidden">
          {activePromo.photo ? (
            <Image
              key={activePromo._id}
              src={activePromo.photo}
              alt={activePromo.name}
              fill
              sizes="(max-width: 640px) 90vw, 384px"
              quality={75}
              priority
              className="object-cover transition-opacity duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm opacity-50">
              Sin imagen
            </div>
          )}

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/85 via-black/45 to-transparent pointer-events-none" />

          {/* Discount badge */}
          <div
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-extrabold uppercase shadow-md ${
              template?.accentColors?.[1] || "bg-primary"
            } text-white`}
          >
            {discountPercent && discountPercent > 0 ? `${discountPercent}% OFF` : "PROMO"}
          </div>

          {/* Counter badge */}
          {total > 1 && (
            <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black/60 text-white">
              {current + 1} / {total}
            </div>
          )}

          {/* Arrows */}
          {total > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 transition-colors"
                aria-label="Promo anterior"
              >
                <FaChevronLeft size={14} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 transition-colors"
                aria-label="Siguiente promo"
              >
                <FaChevronRight size={14} />
              </button>
            </>
          )}

          {/* Promo Info Overlay */}
          <div
            onClick={() => handleSelectPromo(activePromo._id)}
            className="absolute inset-x-0 bottom-0 p-4 text-white cursor-pointer flex items-end justify-between gap-2"
          >
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-lg leading-tight line-clamp-2 drop-shadow-xs">
                {activePromo.name}
              </h3>
            </div>
            <div className="text-right shrink-0">
              {hasDiscount && (
                <span className="block text-xs text-gray-300 line-through">
                  {priceFormatter.format(activePromo.price)}
                </span>
              )}
              <span
                className={`inline-block text-xl font-extrabold px-2.5 py-0.5 rounded-lg shadow-sm ${
                  template?.accentColors?.[1] || "bg-primary"
                } text-white`}
              >
                {priceFormatter.format(finalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer dots & CTA */}
        <div className="px-4 py-3 flex items-center justify-between gap-2">
          {total > 1 ? (
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-[60%] py-1">
              {promos.map((promo, idx) => (
                <button
                  key={promo._id || idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === current
                      ? `${template?.accentColors?.[0] || "bg-primary"} w-6`
                      : `${template?.backgroundColor2 || "bg-gray-300"} w-2`
                  }`}
                  aria-label={`Ir a promo ${idx + 1}`}
                />
              ))}
            </div>
          ) : (
            <span className="text-xs opacity-70">¡Aprovechá hoy!</span>
          )}

          <button
            onClick={() => handleSelectPromo(activePromo._id)}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
              template?.accentColors?.[1] || "bg-primary"
            } text-white hover:opacity-90 transition-opacity ml-auto`}
          >
            Ver en el menú
          </button>
        </div>
      </div>
    </div>
  );
}

