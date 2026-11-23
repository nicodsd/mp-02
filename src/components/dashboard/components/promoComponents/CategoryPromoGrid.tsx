"use client";
import React from "react";
import Image from "next/image";
import { FaLayerGroup, FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import { CategorySummary, priceFormatter } from "./promoUtils";

interface CategoryPromoGridProps {
  categorySummaries: CategorySummary[];
  removingCategory: string | null;
  onConfigureCategory: (categoryName: string) => void;
  onRemoveCategoryPromos: (categoryName: string) => void;
}

const CategoryPromoGrid = React.memo(function CategoryPromoGrid({
  categorySummaries,
  removingCategory,
  onConfigureCategory,
  onRemoveCategoryPromos,
}: CategoryPromoGridProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <FaLayerGroup className="text-green-700 shrink-0" size={18} />
          <p className="text-xs sm:text-sm text-green-900">
            Elegí una categoría para aplicar{" "}
            <strong>2x1, 3x1, 3x2, descuento % o tiempo límite</strong> a todos sus platos en un solo clic.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categorySummaries.map((cat) => (
          <div
            key={cat.name}
            className="bg-white border border-gray-200 hover:border-green-500 rounded-2xl p-4 flex flex-col justify-between gap-4 shadow-2xs transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-lg font-extrabold text-gray-900 truncate">{cat.name}</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {cat.total} {cat.total === 1 ? "plato" : "platos"} • Precio prom.{" "}
                  <span className="font-bold text-gray-700">
                    {priceFormatter.format(cat.avgPrice)}
                  </span>
                </p>
              </div>

              {cat.samplePhotos.length > 0 && (
                <div className="flex -space-x-2 overflow-hidden shrink-0">
                  {cat.samplePhotos.map((photoUrl, idx) => (
                    <Image
                      key={idx}
                      src={photoUrl}
                      alt={cat.name}
                      width={36}
                      height={36}
                      className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-semibold">
                Libres: {cat.availableCount}
              </span>
              {cat.inPromoCount > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-green-100 text-green-800 font-bold">
                  En promo: {cat.inPromoCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => onConfigureCategory(cat.name)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <FaPlusCircle size={13} />
                <span>
                  {cat.inPromoCount > 0 ? "Configurar Promo" : "Promocionar Categoría"}
                </span>
              </button>

              {cat.inPromoCount > 0 && (
                <button
                  type="button"
                  onClick={() => onRemoveCategoryPromos(cat.name)}
                  disabled={removingCategory === cat.name}
                  title="Quitar promociones de esta categoría"
                  className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl cursor-pointer transition-colors disabled:opacity-50"
                >
                  <FaTrashAlt size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default CategoryPromoGrid;
