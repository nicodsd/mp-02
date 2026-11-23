"use client";
import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import DiscountSlider from "@/src/components/Index/filters/DiscountSlider";
import {
  FaClock,
  FaTags,
  FaLayerGroup,
  FaPercent,
  FaGift,
  FaBolt,
} from "react-icons/fa";
import {
  PromoMode,
  DurationPreset,
  RoundingOption,
  PromoMetadata,
  PromoModalTarget,
  MULTIPLIER_PRESETS,
  SECOND_UNIT_PRESETS,
  QUICK_PERCENTAGES,
  DURATION_OPTIONS,
  OCCASION_TAGS,
  priceFormatter,
  calculatePromoPrice,
  computeExpirationTimestamp,
} from "./promoUtils";

interface PromoConfigModalProps {
  target: PromoModalTarget | null;
  promoMetaMap: Record<string, PromoMetadata>;
  loading: boolean;
  onClose: () => void;
  onPublish: (params: {
    foodsToUpdate: any[];
    calcConfig: {
      mode: PromoMode;
      percent: number;
      buyQty: number;
      payQty: number;
      secondUnitPercent: number;
      fixedPriceInput: string;
      roundingStep: RoundingOption;
    };
    expiresAt: number | null;
    durationLabel: string;
    occasionTag: string;
    isCategory: boolean;
  }) => Promise<void>;
}

export default function PromoConfigModal({
  target,
  promoMetaMap,
  loading,
  onClose,
  onPublish,
}: PromoConfigModalProps) {
  const [promoMode, setPromoMode] = useState<PromoMode>("percentage");
  const [currentPercent, setCurrentPercent] = useState<number>(20);
  const [buyQty, setBuyQty] = useState<number>(2);
  const [payQty, setPayQty] = useState<number>(1);
  const [secondUnitPercent, setSecondUnitPercent] = useState<number>(50);
  const [fixedPriceInput, setFixedPriceInput] = useState<string>("");
  const [roundingStep, setRoundingStep] = useState<RoundingOption>(0);

  const [durationPreset, setDurationPreset] = useState<DurationPreset>("unlimited");
  const [customExpiresDateTime, setCustomExpiresDateTime] = useState<string>("");
  const [occasionTag, setOccasionTag] = useState<string>("");

  const [categoryIncludedIds, setCategoryIncludedIds] = useState<string[]>([]);
  const [overwriteExistingCategoryPromos, setOverwriteExistingCategoryPromos] = useState<boolean>(true);

  // Sincronizar valores iniciales cada vez que se abre el modal con un nuevo objetivo
  useEffect(() => {
    if (!target) return;

    if (target.type === "single" && target.food) {
      const existingMeta = promoMetaMap[String(target.food._id)];
      if (target.food.is_promo && existingMeta) {
        setPromoMode(existingMeta.mode);
        setCurrentPercent(existingMeta.percentOff || 20);
        setBuyQty(existingMeta.buyQty || 2);
        setPayQty(existingMeta.payQty || 1);
        setSecondUnitPercent(existingMeta.secondUnitPercent || 50);
        setFixedPriceInput(String(target.food.promo_price ?? target.food.price));
        setOccasionTag(existingMeta.occasionTag || "");
      } else {
        setPromoMode("percentage");
        setCurrentPercent(20);
        setBuyQty(2);
        setPayQty(1);
        setSecondUnitPercent(50);
        setFixedPriceInput(String(Math.round(Number(target.food.price || 0) * 0.8)));
        setDurationPreset("unlimited");
        setOccasionTag("");
      }
    } else if (target.type === "batch" && target.foods) {
      setPromoMode("percentage");
      setCurrentPercent(20);
      setBuyQty(2);
      setPayQty(1);
      setSecondUnitPercent(50);
      setFixedPriceInput(String(Math.round(Number(target.foods[0]?.price || 0) * 0.8)));
      setDurationPreset("unlimited");
      setOccasionTag("");
    } else if (target.type === "category" && target.foods) {
      setCategoryIncludedIds(target.foods.map((f) => String(f._id)));
      setOverwriteExistingCategoryPromos(true);
      setPromoMode("percentage");
      setCurrentPercent(20);
      setBuyQty(2);
      setPayQty(1);
      setSecondUnitPercent(50);
      setFixedPriceInput(String(Math.round(Number(target.foods[0]?.price || 0) * 0.8)));
      setDurationPreset("unlimited");
      setOccasionTag("");
    }
    setRoundingStep(0);
  }, [target, promoMetaMap]);

  const calcConfig = useMemo(
    () => ({
      mode: promoMode,
      percent: currentPercent,
      buyQty,
      payQty,
      secondUnitPercent,
      fixedPriceInput,
      roundingStep,
    }),
    [promoMode, currentPercent, buyQty, payQty, secondUnitPercent, fixedPriceInput, roundingStep]
  );

  const targetFoodsInModal = useMemo(() => {
    if (!target) return [];
    if (target.type === "single" && target.food) return [target.food];
    if (target.type === "batch" && target.foods) return target.foods;
    if (target.type === "category" && target.foods) {
      return target.foods.filter((f) => {
        const isChecked = categoryIncludedIds.includes(String(f._id));
        if (!isChecked) return false;
        if (!overwriteExistingCategoryPromos && f.is_promo) return false;
        return true;
      });
    }
    return [];
  }, [categoryIncludedIds, overwriteExistingCategoryPromos, target]);

  const handleConfirm = () => {
    const { expiresAt, durationLabel } = computeExpirationTimestamp(
      durationPreset,
      customExpiresDateTime
    );
    onPublish({
      foodsToUpdate: targetFoodsInModal,
      calcConfig,
      expiresAt,
      durationLabel,
      occasionTag: occasionTag.trim(),
      isCategory: target?.type === "category",
    });
  };

  return (
    <AnimatePresence>
      {target && (
        <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ duration: 0.2 }}
            className="bg-white w-full sm:max-w-xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-5"
          >
            {/* Cabecera del Modal */}
            <div className="flex justify-between items-start gap-4 border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-extrabold text-green-600 uppercase tracking-widest flex items-center gap-1.5">
                  {target.type === "category" ? (
                    <>
                      <FaLayerGroup size={12} /> Promoción por Categoría
                    </>
                  ) : target.type === "batch" ? (
                    <>
                      <FaBolt size={12} /> Promoción Múltiple ({target.foods?.length} platos)
                    </>
                  ) : (
                    target.food?.sub_category || "Producto Individual"
                  )}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-0.5">
                  {target.type === "category"
                    ? `Categoría: ${target.categoryName}`
                    : target.type === "batch"
                      ? `${target.foods?.length} productos seleccionados`
                      : target.food?.name}
                </h2>
              </div>

              {target.type === "single" && target.food?.photo && (
                <Image
                  src={target.food.photo}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-xl border border-gray-200 shrink-0"
                  alt={target.food.name}
                />
              )}
            </div>

            {/* 1. Selector de Tipo de Promoción */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                1. Tipo de Promoción
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPromoMode("percentage")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border cursor-pointer transition-all flex flex-col items-center gap-1 ${
                    promoMode === "percentage"
                      ? "bg-green-600 text-white border-green-600 shadow-xs"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <FaPercent size={14} />
                  <span>% Descuento</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPromoMode("multiplier")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border cursor-pointer transition-all flex flex-col items-center gap-1 ${
                    promoMode === "multiplier"
                      ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <FaGift size={14} />
                  <span>2x1 / 3x1 / 3x2</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPromoMode("second_unit")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border cursor-pointer transition-all flex flex-col items-center gap-1 ${
                    promoMode === "second_unit"
                      ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <FaTags size={14} />
                  <span>2da Unidad</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPromoMode("fixed")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border cursor-pointer transition-all flex flex-col items-center gap-1 ${
                    promoMode === "fixed"
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <FaBolt size={14} />
                  <span>Precio Fijo</span>
                </button>
              </div>
            </div>

            {/* 2. Controles específicos según el tipo */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col gap-3">
              {promoMode === "percentage" && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600">
                      Botones rápidos de descuento:
                    </span>
                    <span className="text-sm font-black text-green-700">{currentPercent}% OFF</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_PERCENTAGES.map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setCurrentPercent(pct)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          currentPercent === pct
                            ? "bg-green-600 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        -{pct}%
                      </button>
                    ))}
                  </div>
                  <DiscountSlider
                    externalValue={currentPercent}
                    onChange={(pct) => setCurrentPercent(pct)}
                  />
                </>
              )}

              {promoMode === "multiplier" && (
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold text-gray-600">
                    Elegí una promoción multiplicadora (Llevá más, pagá menos):
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {MULTIPLIER_PRESETS.map((preset) => {
                      const isSelected = buyQty === preset.buy && payQty === preset.pay;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setBuyQty(preset.buy);
                            setPayQty(preset.pay);
                          }}
                          className={`py-2.5 px-2 rounded-xl font-black text-base cursor-pointer border transition-all ${
                            isSelected
                              ? "bg-purple-600 text-white border-purple-600 shadow-sm scale-102"
                              : "bg-white text-gray-800 border-gray-300 hover:border-purple-400"
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white p-3 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-gray-600">Llevás:</label>
                      <input
                        type="number"
                        min={2}
                        max={12}
                        value={buyQty}
                        onChange={(e) => {
                          const val = Math.max(2, Number(e.target.value) || 2);
                          setBuyQty(val);
                          if (payQty >= val) setPayQty(val - 1);
                        }}
                        className="w-14 border border-gray-300 rounded-lg px-2 py-1 text-center font-bold text-sm"
                      />
                      <span className="font-black text-gray-400">×</span>
                      <label className="text-xs font-bold text-gray-600">Pagás:</label>
                      <input
                        type="number"
                        min={1}
                        max={Math.max(1, buyQty - 1)}
                        value={payQty}
                        onChange={(e) =>
                          setPayQty(Math.max(1, Math.min(buyQty - 1, Number(e.target.value) || 1)))
                        }
                        className="w-14 border border-gray-300 rounded-lg px-2 py-1 text-center font-bold text-sm"
                      />
                    </div>
                    <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg whitespace-nowrap">
                      Promo {buyQty}x{payQty} ({Math.round(((buyQty - payQty) / buyQty) * 100)}% ahorro)
                    </span>
                  </div>
                </div>
              )}

              {promoMode === "second_unit" && (
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold text-gray-600">
                    Descuento en la segunda unidad:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {SECOND_UNIT_PRESETS.map((preset) => {
                      const isSelected = secondUnitPercent === preset.secondPercent;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setSecondUnitPercent(preset.secondPercent)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? "bg-amber-600 text-white border-amber-600"
                              : "bg-white text-gray-800 border-gray-300 hover:border-amber-400"
                          }`}
                        >
                          <div className="font-black text-sm">{preset.label}</div>
                          <div
                            className={`text-[11px] mt-0.5 ${
                              isSelected ? "text-amber-100" : "text-gray-500"
                            }`}
                          >
                            -{preset.effectiveOff}% c/u llevando 2
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {promoMode === "fixed" && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600">
                    Definí el nuevo precio promocional fijo ($ ARS):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                      $
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={fixedPriceInput}
                      onChange={(e) => setFixedPriceInput(e.target.value)}
                      placeholder="Ej: 6500"
                      className="w-full bg-white border border-gray-300 rounded-xl pl-8 pr-4 py-2.5 font-extrabold text-lg text-gray-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              )}

              {promoMode !== "fixed" && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-200/80 gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-gray-500">
                    Redondear precios finales:
                  </span>
                  <div className="flex items-center gap-1">
                    {([0, 50, 100, 500] as RoundingOption[]).map((step) => (
                      <button
                        key={step}
                        type="button"
                        onClick={() => setRoundingStep(step)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          roundingStep === step
                            ? "bg-gray-900 text-white"
                            : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {step === 0 ? "Exacto" : `$${step}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Duración y Etiqueta */}
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <FaClock className="text-indigo-600" size={12} />
                <span>2. Tiempo de Duración y Etiqueta</span>
              </label>

              <div className="flex flex-wrap gap-1.5">
                {DURATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setDurationPreset(opt.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border transition-all ${
                      durationPreset === opt.key
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {durationPreset === "custom" && (
                <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-indigo-900">
                    Fecha y hora de finalización:
                  </label>
                  <input
                    type="datetime-local"
                    value={customExpiresDateTime}
                    onChange={(e) => setCustomExpiresDateTime(e.target.value)}
                    className="bg-white border border-indigo-300 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-800"
                  />
                </div>
              )}

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 pb-0.5">
                <span className="text-xs font-semibold text-gray-500 shrink-0 mr-1">Ocasión:</span>
                {OCCASION_TAGS.map((tag) => (
                  <button
                    key={tag || "none"}
                    type="button"
                    onClick={() => setOccasionTag(tag)}
                    className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer border transition-all ${
                      occasionTag === tag
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {tag || "Ninguna"}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Platos de la categoría */}
            {target.type === "category" && target.foods && (
              <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Platos de &ldquo;{target.categoryName}&rdquo; ({targetFoodsInModal.length}{" "}
                    incluidos)
                  </span>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={overwriteExistingCategoryPromos}
                      onChange={(e) => setOverwriteExistingCategoryPromos(e.target.checked)}
                      className="rounded accent-green-600"
                    />
                    <span>Actualizar los que ya están en promo</span>
                  </label>
                </div>

                <div className="max-h-40 overflow-y-auto bg-gray-50 border border-gray-200 rounded-xl p-2 flex flex-col gap-1.5">
                  {target.foods.map((food) => {
                    const idStr = String(food._id);
                    const isChecked = categoryIncludedIds.includes(idStr);
                    const isSkippedByOverwrite = !overwriteExistingCategoryPromos && food.is_promo;
                    const preview = calculatePromoPrice(Number(food.price || 0), calcConfig);

                    return (
                      <div
                        key={food._id}
                        onClick={() => {
                          if (isSkippedByOverwrite) return;
                          setCategoryIncludedIds((prev) =>
                            prev.includes(idStr)
                              ? prev.filter((item) => item !== idStr)
                              : [...prev, idStr]
                          );
                        }}
                        className={`flex items-center justify-between p-1.5 px-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                          isChecked && !isSkippedByOverwrite
                            ? "bg-white border border-green-200"
                            : "opacity-50 bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked && !isSkippedByOverwrite}
                            disabled={isSkippedByOverwrite}
                            onChange={() => {}}
                            className="accent-green-600"
                          />
                          <span className="font-semibold text-gray-800 truncate">{food.name}</span>
                          {food.is_promo && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.2 rounded font-bold">
                              Ya en promo
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-gray-400 line-through">
                            {priceFormatter.format(food.price)}
                          </span>
                          <span className="font-bold text-green-700">
                            {preview.promoPrice === 0
                              ? "GRATIS"
                              : priceFormatter.format(preview.promoPrice)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. Resumen / Vista Previa */}
            {target.type === "single" && target.food ? (
              (() => {
                const basePrice = Number(target.food.price || 0);
                const preview = calculatePromoPrice(basePrice, calcConfig);
                return (
                  <div className="bg-green-50/80 border border-green-200 p-4 rounded-2xl flex justify-between items-center gap-3">
                    <div>
                      <span className="inline-block bg-green-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full mb-1">
                        {preview.badge}
                      </span>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        Antes: <span className="line-through">{priceFormatter.format(basePrice)}</span>
                      </p>
                      {promoMode === "multiplier" && (
                        <p className="text-xs font-bold text-purple-700 mt-0.5">
                          Llevás {buyQty} unidades y pagás {payQty} (Total pack:{" "}
                          {priceFormatter.format(basePrice * payQty)})
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-bold uppercase text-gray-400 block">
                        Precio Promo {promoMode === "multiplier" ? "(c/u)" : ""}
                      </span>
                      <p className="text-2xl sm:text-3xl font-black text-green-700">
                        {preview.promoPrice === 0
                          ? "GRATIS"
                          : priceFormatter.format(preview.promoPrice)}
                      </p>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="bg-green-50/80 border border-green-200 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-green-800 block">
                    Se aplicará a {targetFoodsInModal.length}{" "}
                    {targetFoodsInModal.length === 1 ? "producto" : "productos"}
                  </span>
                  <span className="text-xs text-green-700">
                    {durationPreset === "unlimited"
                      ? "Duración: Sin límite de tiempo"
                      : "Duración activa con temporizador"}
                  </span>
                </div>
                <span className="bg-green-600 text-white text-sm font-black px-3 py-1 rounded-xl">
                  {calculatePromoPrice(1000, calcConfig).badge}
                </span>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 cursor-pointer transition-all py-3.5 font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading || targetFoodsInModal.length === 0}
                className="flex-2 bg-green-600 hover:bg-green-700 text-white py-3.5 px-6 disabled:cursor-not-allowed cursor-pointer transition-all rounded-xl font-bold active:scale-95 disabled:bg-gray-300 shadow-sm"
              >
                {loading
                  ? "Publicando..."
                  : target.type === "category"
                    ? `Publicar en Categoría (${targetFoodsInModal.length})`
                    : target.type === "batch"
                      ? `Publicar en ${targetFoodsInModal.length} Platos`
                      : "Publicar Promo"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
