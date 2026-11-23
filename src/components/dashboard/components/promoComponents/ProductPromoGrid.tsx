"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import Search from "@/src/components/Index/filters/Search";
import { FaBolt, FaCheckSquare, FaRegSquare } from "react-icons/fa";
import { priceFormatter } from "./promoUtils";

interface ProductPromoGridProps {
  foods: any[];
  categories: string[];
  onSelectSingle: (food: any) => void;
  onSelectBatch: (selectedFoods: any[]) => void;
}

const ProductPromoGrid = React.memo(function ProductPromoGrid({
  foods,
  categories,
  onSelectSingle,
  onSelectBatch,
}: ProductPromoGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isMultiSelectMode, setIsMultiSelectMode] = useState<boolean>(false);
  const [selectedFoodIds, setSelectedFoodIds] = useState<string[]>([]);

  const filteredFoods = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return foods.filter((food) => {
      if (food.is_promo) return false;
      const matchesCategory =
        !selectedCategory || (food.sub_category || "").trim() === selectedCategory;
      const matchesSearch = !term || food.name.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [foods, selectedCategory, searchTerm]);

  const toggleFoodSelection = (foodId: string) => {
    setSelectedFoodIds((prev) =>
      prev.includes(foodId) ? prev.filter((id) => id !== foodId) : [...prev, foodId]
    );
  };

  const handleOpenBatch = () => {
    const chosen = foods.filter((f) => selectedFoodIds.includes(String(f._id)));
    if (chosen.length === 0) return;
    onSelectBatch(chosen);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search arrayFoods={foods} setSearch={setSearchTerm} />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              setIsMultiSelectMode((prev) => !prev);
              setSelectedFoodIds([]);
            }}
            className={`flex-1 sm:flex-none justify-center px-3.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer border transition-all flex items-center gap-1.5 whitespace-nowrap ${isMultiSelectMode
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
          >
            {isMultiSelectMode ? <FaCheckSquare size={13} /> : <FaRegSquare size={13} />}
            <span>Selección múltiple</span>
          </button>

          {isMultiSelectMode && selectedFoodIds.length > 0 && (
            <button
              type="button"
              onClick={handleOpenBatch}
              className="flex-1 sm:flex-none justify-center px-4 py-2.5 rounded-xl text-xs font-bold bg-green-600 hover:bg-green-700 text-white cursor-pointer transition-all shadow-sm flex items-center gap-1.5 animate-fade-in whitespace-nowrap"
            >
              <FaBolt size={12} />
              <span>Aplicar ({selectedFoodIds.length})</span>
            </button>
          )}
        </div>
      </div>
      {/* Filtro por categoría */}
      <div className="flex gap-2 px-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedCategory("")}
          className={`whitespace-nowrap shrink-0 px-4 py-1.5 cursor-pointer rounded-lg text-sm font-bold transition-all ${!selectedCategory
            ? "bg-gray-900 text-white border"
            : "text-gray-800 border border-gray-300 hover:bg-gray-100"
            }`}
        >
          Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap shrink-0 cursor-pointer px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${selectedCategory === cat
              ? "bg-gray-900 text-white border"
              : "text-gray-800 border border-gray-300 hover:bg-gray-100"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grilla de productos disponibles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto relative max-h-110 bg-gray-200/60 p-1 rounded-2xl">
        <span className="text-gray-500 sticky bg-gray-200/60 backdrop-blur-xl px-2 py-3 -top-1 text-xs">Platos disponibles: <span className="text-black font-bold bg-gray-300 p-1 rounded-full">{filteredFoods.length}</span></span>
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food) => {
            const idStr = String(food._id);
            const isSelected = selectedFoodIds.includes(idStr);

            return (
              <div
                key={food._id}
                onClick={() => {
                  if (isMultiSelectMode) {
                    toggleFoodSelection(idStr);
                  } else {
                    onSelectSingle(food);
                  }
                }}
                className={`flex items-center gap-3 p-2 rounded-xl transition-all cursor-pointer border ${isSelected
                  ? "border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20"
                  : "border-gray-200 bg-background hover:border-green-500 hover:shadow-xs"
                  }`}
              >
                {isMultiSelectMode && (
                  <div className="pl-1 text-indigo-600">
                    {isSelected ? <FaCheckSquare size={18} /> : <FaRegSquare size={18} />}
                  </div>
                )}
                <Image
                  priority
                  loading="eager"
                  src={food.photo}
                  width={64}
                  height={64}
                  className="w-13 h-13 object-cover rounded-lg shrink-0"
                  alt={food.name}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold uppercase text-gray-400 block">
                    {food.sub_category || "General"}
                  </span>
                  <h5 className="text-gray-800 truncate">{food.name}</h5>
                  <p className="text-gray-900 font-extrabold text-lg">
                    {priceFormatter.format(food.price)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-10 text-center text-gray-500 text-sm">
            No hay platos disponibles sin promoción con este filtro.
          </div>
        )}
      </div>
    </>
  );
});

export default ProductPromoGrid;
