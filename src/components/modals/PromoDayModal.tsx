"use client";
import React, { useState } from "react";
import DiscountSlider from "@/src/components/Index/filters/DiscountSlider";
import { FaSearch, FaPercent, FaGift, FaTags, FaBolt } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  PromoMode,
  MULTIPLIER_PRESETS,
  SECOND_UNIT_PRESETS,
  priceFormatter,
  calculatePromoPrice,
} from "@/src/components/dashboard/components/promoComponents/promoUtils";

type Food = {
  _id: string | number;
  name: string;
  description: string;
  photo: string;
  price: number;
  category?: string;
  sub_category?: string;
  is_promo?: boolean;
  promo_price?: number;
  promo_type?: PromoMode;
  promo_badge?: string;
};

export default function PromoPanel({
  plan,
  foods,
  openModal,
}: {
  plan: string;
  foods: Food[];
  openModal: () => void;
}) {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [promoMode, setPromoMode] = useState<PromoMode>("percentage");
  const [currentPercent, setCurrentPercent] = useState<number>(20);
  const [buyQty, setBuyQty] = useState<number>(2);
  const [payQty, setPayQty] = useState<number>(1);
  const [secondUnitPercent, setSecondUnitPercent] = useState<number>(50);
  const [fixedPriceInput, setFixedPriceInput] = useState<string>("");

  const [activePromos, setActivePromos] = useState<Food[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
    setPromoMode("percentage");
    setCurrentPercent(20);
    setBuyQty(2);
    setPayQty(1);
    setSecondUnitPercent(50);
    setFixedPriceInput(String(Math.round(Number(food.price || 0) * 0.8)));
  };

  const currentPreview = selectedFood
    ? calculatePromoPrice(selectedFood.price, {
      mode: promoMode,
      percent: currentPercent,
      buyQty,
      payQty,
      secondUnitPercent,
      fixedPriceInput,
      roundingStep: 0,
    })
    : { promoPrice: 0, effectivePercent: 0, badge: "" };

  const handlePublishPromo = () => {
    if (selectedFood) {
      const newPromo: Food = {
        ...selectedFood,
        is_promo: true,
        promo_price: currentPreview.promoPrice,
        promo_type: promoMode,
        promo_badge: currentPreview.badge,
      };
      setActivePromos((prev) => [
        ...prev.filter((p) => p._id !== selectedFood._id),
        newPromo,
      ]);
      setSelectedFood(null);
    }
  };

  const removePromo = (id: string | number) => {
    setActivePromos((prev) => prev.filter((promo) => promo._id !== id));
  };

  const getActivePromo = (foodId: string | number) =>
    activePromos.find((promo) => promo._id === foodId);

  const categories = Array.from(new Set(foods.map((f) => f.sub_category).filter(Boolean)));

  const filteredFoods = foods.filter((food) => {
    const matchesCategory =
      selectedCategory === "" || food.sub_category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      food.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getBadgeStyle = (mode?: PromoMode) => {
    if (mode === "multiplier") return "bg-purple-600 text-white";
    if (mode === "second_unit") return "bg-amber-500 text-white";
    if (mode === "fixed") return "bg-blue-600 text-white";
    return "bg-red-600 text-white";
  };

  return (
    <div className="fixed inset-0 backdrop-blur bg-gray-700/40 flex items-center h-screen justify-center z-50 overflow-hidden">
      <div className="absolute animate__slideInUp animate__animated animate__faster bottom-22 bg-background z-100 w-full md:max-w-3xl px-4 py-6 flex flex-col gap-3 rounded-xl max-h-[85vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-800">Agregar Promociones</h3>

        {plan === "free" && (
          <div className="bg-linear-to-r from-amber-500 to-amber-600 rounded-lg p-3 mb-2 flex items-center justify-between text-white shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <div>
                <p className="font-bold text-sm">Función de pago</p>
                <p className="text-xs opacity-90">
                  Mejora tu plan para activar promociones en tus platos.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="relative flex items-center w-full">
          <input
            type="text"
            placeholder="Buscar plato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-2 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
          <FaSearch className="absolute left-3 text-red-500" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedCategory("")}
              className={`whitespace-nowrap shrink-0 py-1 text-[13px] px-3 rounded-[7px] cursor-pointer font-bold ${selectedCategory === ""
                  ? "bg-red-600 text-white border"
                  : "text-gray-800 border border-gray-300"
                }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat!)}
                className={`whitespace-nowrap shrink-0 py-1 text-[13px] px-2.5 rounded-[7px] cursor-pointer font-bold ${selectedCategory === cat
                    ? "bg-red-600 text-white border"
                    : "text-gray-800 border border-gray-300"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1 h-72 md:h-96 bg-gray-100/60 p-1.5 rounded-xl overflow-auto relative">
            {filteredFoods.map((food) => {
              const activePromo = getActivePromo(food._id);
              return (
                <div
                  onClick={() => (plan !== "free" ? handleSelectFood(food) : null)}
                  key={food._id}
                  className={`flex bg-background items-center justify-between gap-2 border rounded-lg p-2 transition ${plan !== "free"
                      ? "opacity-100 cursor-pointer hover:bg-gray-100"
                      : "grayscale opacity-50 cursor-not-allowed"
                    } border-gray-300`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={food.photo}
                      alt={food.name}
                      className="w-11 h-11 aspect-square object-cover rounded-md shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">
                        {food.name}
                      </h3>
                      <p className="text-base font-bold text-gray-600">
                        {priceFormatter.format(food.price)}
                      </p>
                    </div>
                  </div>
                  {activePromo && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-black uppercase shrink-0 ${getBadgeStyle(
                        activePromo.promo_type
                      )}`}
                    >
                      {activePromo.promo_badge || "En promo"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => openModal()}
            className="w-full py-3 text-gray-500 text-sm font-medium hover:text-gray-800 cursor-pointer"
          >
            Cancelar
          </button>
        </div>

        {selectedFood && (
          <div className="fixed inset-0 z-100 backdrop-blur-sm bg-black/50 rounded-xl flex items-end sm:items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full sm:w-125 max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex justify-between items-start gap-3">
                <div>
                  <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
                    {selectedFood.sub_category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {selectedFood.name}
                  </h2>
                </div>
                <img
                  src={selectedFood.photo}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shrink-0"
                  alt={selectedFood.name}
                />
              </div>

              {/* Selector de tipo de promoción */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => setPromoMode("percentage")}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border cursor-pointer flex flex-col items-center gap-1 ${promoMode === "percentage"
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                >
                  <FaPercent size={12} />
                  <span>% OFF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPromoMode("multiplier")}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border cursor-pointer flex flex-col items-center gap-1 ${promoMode === "multiplier"
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                >
                  <FaGift size={12} />
                  <span>2x1 / 3x1</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPromoMode("second_unit")}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border cursor-pointer flex flex-col items-center gap-1 ${promoMode === "second_unit"
                      ? "bg-amber-600 text-white border-amber-600"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                >
                  <FaTags size={12} />
                  <span>2da Unidad</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPromoMode("fixed")}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border cursor-pointer flex flex-col items-center gap-1 ${promoMode === "fixed"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                >
                  <FaBolt size={12} />
                  <span>Precio Fijo</span>
                </button>
              </div>

              {promoMode === "percentage" && (
                <DiscountSlider
                  externalValue={currentPercent}
                  onChange={(pct) => setCurrentPercent(pct)}
                />
              )}

              {promoMode === "multiplier" && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {MULTIPLIER_PRESETS.map((preset) => {
                    const active = buyQty === preset.buy && payQty === preset.pay;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setBuyQty(preset.buy);
                          setPayQty(preset.pay);
                        }}
                        className={`py-2 rounded-xl font-black text-sm border cursor-pointer ${active
                            ? "bg-purple-600 text-white border-purple-600"
                            : "bg-gray-50 text-gray-800 border-gray-300"
                          }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {promoMode === "second_unit" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  {SECOND_UNIT_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setSecondUnitPercent(preset.secondPercent)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs border cursor-pointer ${secondUnitPercent === preset.secondPercent
                          ? "bg-amber-600 text-white border-amber-600"
                          : "bg-gray-50 text-gray-800 border-gray-300"
                        }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}

              {promoMode === "fixed" && (
                <input
                  type="number"
                  min={0}
                  value={fixedPriceInput}
                  onChange={(e) => setFixedPriceInput(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 font-extrabold text-lg"
                  placeholder="Precio promocional"
                />
              )}

              <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center gap-3">
                <div>
                  <span
                    className={`inline-block text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase mb-1 ${getBadgeStyle(
                      promoMode
                    )}`}
                  >
                    {currentPreview.badge}
                  </span>
                  <p className="text-gray-500 text-sm">
                    Antes: {priceFormatter.format(selectedFood.price)}
                  </p>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-gray-900">
                  {currentPreview.promoPrice === 0
                    ? "GRATIS"
                    : priceFormatter.format(currentPreview.promoPrice)}
                  {promoMode === "multiplier" ? " c/u" : ""}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedFood(null)}
                  className="flex-1 cursor-pointer transition-all py-3.5 font-bold text-gray-500 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={handlePublishPromo}
                  disabled={currentPreview.promoPrice === selectedFood.price}
                  className="flex-2 bg-red-600 text-white py-3.5 disabled:cursor-not-allowed cursor-pointer transition-all rounded-lg font-bold active:scale-95 disabled:bg-gray-300"
                >
                  Publicar Promo
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {activePromos.length > 0 && (
          <div className="border-t border-gray-200 pt-3">
            <h2 className="text-base font-bold mb-2 text-gray-800">
              Promos activas ({activePromos.length})
            </h2>
            <div className="flex flex-col gap-2">
              {activePromos.map((promo) => (
                <div
                  key={promo._id}
                  className="flex items-center justify-between gap-2 bg-white border border-gray-200 p-2 rounded-xl"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-black uppercase shrink-0 ${getBadgeStyle(
                        promo.promo_type
                      )}`}
                    >
                      {promo.promo_badge || "PROMO"}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{promo.name}</p>
                      <p className="text-xs text-gray-500">
                        <span className="line-through mr-1.5">
                          {priceFormatter.format(promo.price)}
                        </span>
                        <span className="font-bold text-green-700">
                          {promo.promo_price === 0
                            ? "GRATIS"
                            : priceFormatter.format(promo.promo_price || 0)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removePromo(promo._id)}
                    className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-100 cursor-pointer shrink-0"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
