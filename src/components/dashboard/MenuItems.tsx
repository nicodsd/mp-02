"use client";
import React, { useState } from "react";
import { FaSearch, FaPlus } from 'react-icons/fa';
import RenderCards from "@/src/components/RenderCards";
import SearchInput from "@/src/components/Index/filters/Search";
export function MenuItems({ dataFoods }: { dataFoods: any[] }) {
  const [arrayFoods, setarrayFoods] = useState(dataFoods);
  function setSearch(query: string) {
    if (query.length > 1) {
      const result = dataFoods.filter((food) =>
        food.name.toLowerCase().includes(query.toLowerCase())
      );
      setarrayFoods(result);
    } else {
      setarrayFoods(dataFoods);
    }
  }
  return (
    <div className="flex flex-col gap-6 relative">
      <div className="grid grid-cols-2 gap-3 px-4">
        <div className="flex flex-col items-start p-4 rounded-xl bg-orange-100 border border-orange-300">
          <span className=" text-orange-400 mb-1">Platos</span>
          <span className="text-2xl font-bold text-orange-700">{arrayFoods.length}</span>
          <span className="text-xs font-medium text-gray-600">Platos Activos</span>
        </div>
        <div className="flex flex-col items-start p-4 rounded-xl bg-[#E0F7FA] border border-teal-100/70">
          <span className=" text-[#00796B] mb-1">Visitas</span>
          <span className="text-2xl font-bold text-[#00796B]">1.2k</span>
          <span className="text-xs font-medium text-gray-600">Vistas</span>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full px-2 border-t border-gray-200 pt-6">
        <div className="relative ">
          <SearchInput arrayFoods={arrayFoods} setSearch={setSearch} />
        </div>
        <div className="flex w-full">
          <RenderCards foods={arrayFoods} count={6} context={true} />
        </div>
      </div>

      <button className="fixed bottom-10 right-10 h-14 w-14 rounded-full bg-[#ff6600] border-white border shadow-lg flex items-center justify-center cursor-pointer hover:border-white hover:border-3 hover:opacity-80 hover:scale-105 transition-transform">
        <span className="cursor-pointer"><FaPlus className="text-white" size={20} /></span>
      </button>

    </div>
  );
}
export default MenuItems;