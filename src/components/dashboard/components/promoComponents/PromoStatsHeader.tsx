"use client";
import React from "react";
import { FaTags, FaPercent, FaClock } from "react-icons/fa";

interface PromoStatsHeaderProps {
  activeCount: number;
  avgDiscount: number;
  timedCount: number;
}

const PromoStatsHeader = React.memo(function PromoStatsHeader({
  activeCount,
  avgDiscount,
  timedCount,
}: PromoStatsHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800">Promociones</h1>
        <p className="text-gray-500 text-sm">
          Creá promos 2x1, 3x1, descuentos por porcentaje, tiempo límite o por categoría completa.
        </p>
      </div>

      {activeCount > 0 && (
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="bg-green-600  px-2.5 sm:px-3 py-2 rounded-xl flex items-center gap-2 min-w-0">
            <FaTags className="text-white shrink-0" size={13} />
            <div className="text-xs min-w-0">
              <span className="text-white block leading-none truncate">Activas</span>
              <span className="font-bold text-white text-xs sm:text-sm whitespace-nowrap">
                {activeCount} {activeCount === 1 ? "plato" : "platos"}
              </span>
            </div>
          </div>

          <div className="bg-amber-50 px-2.5 sm:px-3 py-2 rounded-xl flex items-center gap-2 min-w-0">
            <FaPercent className="text-gray-800 shrink-0" size={12} />
            <div className="text-xs min-w-0">
              <span className="text-gray-500 block leading-none truncate">Ahorro</span>
              <span className="font-bold text-gray-800 text-xs sm:text-sm whitespace-nowrap">
                {avgDiscount}% OFF
              </span>
            </div>
          </div>

          <div className="bg-indigo-50 px-2.5 sm:px-3 py-2 rounded-xl flex items-center gap-2 min-w-0">
            <FaClock className="text-gray-800 shrink-0" size={13} />
            <div className="text-xs min-w-0">
              <span className="text-gray-800 block leading-none truncate">Con tiempo</span>
              <span className="font-bold text-gray-800 text-xs sm:text-sm whitespace-nowrap">
                {timedCount}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
});

export default PromoStatsHeader;
