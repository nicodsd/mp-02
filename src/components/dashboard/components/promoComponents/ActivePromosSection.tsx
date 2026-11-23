"use client";
import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  FaTrashAlt,
  FaClock,
  FaTags,
  FaPercent,
  FaGift,
  FaEdit,
  FaFire,
} from "react-icons/fa";
import {
  PromoMetadata,
  priceFormatter,
  formatRemainingTime,
  inferPromoMeta,
} from "./promoUtils";

interface PromoCountdownBadgeProps {
  expiresAt: number | null;
}

/**
 * Componente aislado para el temporizador: solo re-renderiza la etiqueta de tiempo
 * cada segundo sin provocar re-renders en el resto del panel.
 */
const PromoCountdownBadge = React.memo(function PromoCountdownBadge({
  expiresAt,
}: PromoCountdownBadgeProps) {
  const [nowMs, setNowMs] = useState<number | null>(null);

  useEffect(() => {
    if (expiresAt === null) return;
    setNowMs(Date.now());
    const interval = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (expiresAt === null) {
    return (
      <span className="text-[11px] text-gray-400 flex items-center gap-1 whitespace-nowrap">
        <FaClock size={10} className="shrink-0" /> Sin límite de tiempo
      </span>
    );
  }

  if (nowMs === null) {
    return null;
  }

  const remaining = formatRemainingTime(expiresAt - nowMs);
  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold whitespace-nowrap ${remaining.isUrgent
        ? "bg-red-100 text-red-700 animate-pulse"
        : "bg-indigo-50 text-indigo-700"
        }`}
    >
      <FaClock size={10} className="shrink-0" />
      <span>Termina en: {remaining.text}</span>
    </div>
  );
});

interface ActivePromosSectionProps {
  activePromos: any[];
  allFoods: any[];
  categories: string[];
  categoriesWithPromos: number;
  timedCount: number;
  promoMetaMap: Record<string, PromoMetadata>;
  removingAll: boolean;
  removingCategory: string | null;
  onEditPromo: (food: any) => void;
  onRemovePromo: (id: string | number) => void;
  onRemoveAll: () => void;
  onRemoveByCategory: (category: string) => void;
  onExtendTime: (id: string | number, hours?: number) => void;
}

const ActivePromosSection = React.memo(function ActivePromosSection({
  activePromos,
  allFoods,
  categories,
  categoriesWithPromos,
  timedCount,
  promoMetaMap,
  removingAll,
  removingCategory,
  onEditPromo,
  onRemovePromo,
  onRemoveAll,
  onRemoveByCategory,
  onExtendTime,
}: ActivePromosSectionProps) {
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>("all");
  const [activeFilterType, setActiveFilterType] = useState<string>("all");

  const priceById = useMemo(() => {
    const map = new Map<string, number>();
    for (const f of allFoods) {
      map.set(String(f._id), Number(f.price || 0));
    }
    return map;
  }, [allFoods]);

  const filteredActivePromos = useMemo(() => {
    const now = Date.now();
    return activePromos.filter((promo) => {
      const meta = inferPromoMeta(promo, promoMetaMap);
      const matchesCat =
        activeFilterCategory === "all" ||
        (promo.sub_category || "").trim() === activeFilterCategory;

      let matchesType = true;
      if (activeFilterType === "multiplier") {
        matchesType = meta.mode === "multiplier" || meta.mode === "second_unit";
      } else if (activeFilterType === "timed") {
        matchesType = typeof meta.expiresAt === "number" && meta.expiresAt > now;
      } else if (activeFilterType === "percentage") {
        matchesType = meta.mode === "percentage" || meta.mode === "fixed";
      }

      return matchesCat && matchesType;
    });
  }, [activeFilterCategory, activeFilterType, activePromos, promoMetaMap]);

  if (activePromos.length === 0) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
            <FaTags size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">No tenés promociones activas</h3>
            <p className="text-xs text-gray-500">
              Seleccioná un plato o una categoría entera abajo para lanzar una oferta 2x1, 3x1 o con descuento.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col w-full gap-3 bg-slate-100 border-2 border-green-700 rounded-2xl p-2">
      <div className="flex p-2 flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            Promociones Activas
            <span className="bg-green-200 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-extrabold">
              {activePromos.length}
            </span>
          </h3>
          <p className="text-xs text-gray-500">
            Podés editar el tipo de promo, extender su tiempo o quitarlas por categoría.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeFilterCategory !== "all" && (
            <button
              onClick={() => onRemoveByCategory(activeFilterCategory)}
              disabled={removingCategory === activeFilterCategory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              <FaTrashAlt size={11} />
              {removingCategory === activeFilterCategory
                ? "Quitando..."
                : `Quitar de "${activeFilterCategory}"`}
            </button>
          )}
          <button
            onClick={onRemoveAll}
            disabled={removingAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-primary hover:bg-red-700 cursor-pointer transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FaTrashAlt size={12} />
            {removingAll ? "Quitando..." : "Quitar todas"}
          </button>
        </div>
      </div>

      {/* Filtros de activas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-gray-200/80">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveFilterType("all")}
            className={`whitespace-nowrap shrink-0 px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${activeFilterType === "all"
              ? "bg-green-700 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
          >
            Todas ({activePromos.length})
          </button>
          <button
            onClick={() => setActiveFilterType("multiplier")}
            className={`whitespace-nowrap shrink-0 px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${activeFilterType === "multiplier"
              ? "bg-purple-600 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
          >
            <FaGift size={11} className="shrink-0" />
            <span>2x1 / 3x1</span>
          </button>
          <button
            onClick={() => setActiveFilterType("percentage")}
            className={`whitespace-nowrap shrink-0 px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${activeFilterType === "percentage"
              ? "bg-emerald-600 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
          >
            <FaPercent size={10} className="shrink-0" />
            <span>Descuento</span>
          </button>
          <button
            onClick={() => setActiveFilterType("timed")}
            className={`whitespace-nowrap shrink-0 px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${activeFilterType === "timed"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
          >
            <FaClock size={11} className="shrink-0" />
            <span>Con tiempo ({timedCount})</span>
          </button>
        </div>

        {categoriesWithPromos > 1 && (
          <select
            value={activeFilterCategory}
            onChange={(e) => setActiveFilterCategory(e.target.value)}
            className="w-full sm:w-auto text-xs font-semibold bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:border-green-600"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Lista de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 max-h-110 overflow-y-auto">
        {filteredActivePromos.map((promo) => {
          const meta = inferPromoMeta(promo, promoMetaMap);
          const originalPrice = priceById.get(String(promo._id)) ?? Number(promo.price ?? 0);
          const promoPriceNum = Number(promo.promo_price ?? 0);
          const isMultiplier = meta.mode === "multiplier" && meta.buyQty && meta.payQty;
          const isSecondUnit = meta.mode === "second_unit" && meta.secondUnitPercent;

          return (
            <div
              key={promo._id}
              className="flex flex-col p-1 sm:flex-row sm:items-center justify-between gap-2.5 shadow-xl rounded-xl bg-white border border-green-500 hover:border-green-400 transition-all"
            >
              <div className="flex items-center gap-3 px-1 min-w-0 flex-1">
                <div className="relative shrink-0">
                  <Image
                    priority
                    loading="eager"
                    src={promo.photo}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded-xl border border-gray-100"
                    alt={promo.name}
                  />
                  <span
                    className={`absolute -top-1.5 -left-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase shadow-xs text-white whitespace-nowrap ${meta.mode === "multiplier"
                      ? "bg-purple-600"
                      : meta.mode === "second_unit"
                        ? "bg-amber-600"
                        : "bg-green-600"
                      }`}
                  >
                    {meta.badge}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {promo.sub_category || "General"}
                    </span>
                    {meta.occasionTag && (
                      <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.2 rounded-md flex items-center gap-0.5 whitespace-nowrap">
                        <FaFire size={9} /> {meta.occasionTag}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-gray-800 truncate">
                    {promo.name}
                  </h4>

                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-gray-400 line-through text-xs font-semibold">
                      {priceFormatter.format(originalPrice)}
                    </span>
                    <span className="text-green-700 font-extrabold text-base">
                      {promoPriceNum === 0 ? "GRATIS" : priceFormatter.format(promoPriceNum)}
                      {isMultiplier ? " c/u" : ""}
                    </span>
                    {isMultiplier && (
                      <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-md">
                        Llevás {meta.buyQty} por{" "}
                        {priceFormatter.format(originalPrice * (meta.payQty || 1))}
                      </span>
                    )}
                    {isSecondUnit && (
                      <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
                        2 unidades por{" "}
                        {priceFormatter.format(
                          Math.round(
                            originalPrice +
                            originalPrice * (1 - (meta.secondUnitPercent || 50) / 100)
                          )
                        )}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                    <PromoCountdownBadge expiresAt={meta.expiresAt} />
                    <button
                      type="button"
                      onClick={() => onExtendTime(promo._id, 1)}
                      title="Agregar 1 hora de duración"
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded cursor-pointer transition-colors whitespace-nowrap"
                    >
                      +1h
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 shrink-0">
                <button
                  type="button"
                  onClick={() => onEditPromo(promo)}
                  className="flex-1 sm:flex-none w-full justify-center py-1.5 px-2.5 flex items-center gap-1.5 text-gray-600 bg-gray-50 sm:bg-transparent hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors text-xs font-semibold whitespace-nowrap"
                  title="Editar promoción"
                >
                  <FaEdit size={13} />
                  <span>Editar</span>
                </button>
                <button
                  type="button"
                  onClick={() => onRemovePromo(promo._id)}
                  className="flex-1 sm:flex-none w-full justify-center py-1.5 px-2.5 flex items-center gap-1.5 text-red-600 sm:text-gray-400 bg-red-50/70 sm:bg-transparent hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors text-xs font-semibold whitespace-nowrap"
                  title="Quitar promoción"
                >
                  <FaTrashAlt size={12} />
                  <span>Quitar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});

export default ActivePromosSection;
