"use client";
import React, { useMemo, useState } from "react";
import SearchInput from "@/src/components/Index/filters/Search";
import AddFoodBttn from "@/src/components/buttons/AddFoodBttn";
import RenderSortCards from "../user_index/user_sections/RenderSortCards";
export function MenuItems({ dataFoods, template }: { dataFoods: any[]; template: any }) {
  const [arrayFoods, setarrayFoods] = useState(dataFoods);
  function setSearch(query: string) {
    if (query.length > 1) {
      const result = dataFoods.filter((food) =>
        food.name.toLowerCase().includes(query.toLowerCase()),
      );
      setarrayFoods(result);
    } else {
      setarrayFoods(dataFoods);
    }
  }
  const activePromos = useMemo(() => dataFoods.filter((f) => f.is_promo), [dataFoods]);
  return (
    <div className="flex p-3 w-full flex-col gap-8 relative">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800">Platos</h1>
        <p className="text-gray-500 text-sm">Gestiona tus platos.</p>
      </header>

      <div className="grid grid-cols-2 gap-1">
        <div className="flex flex-col items-start p-3 rounded-xl bg-orange-400 justify-between">
          <span className="text-lg text-white mb-1 font-semibold leading-tight">Platos</span>
          <span className="text-[5rem] font-bold text-white">{arrayFoods.length}</span>
          <span className="text-xs font-medium text-white/80">Platos Activos</span>
        </div>
        <div className="flex flex-col items-start p-3 rounded-xl bg-teal-600 justify-between">
          <span className="text-lg text-white mb-1 font-semibold leading-tight">Promociones</span>
          <span className="text-[5rem] font-bold text-white">{activePromos.length}</span>
          <span className="text-xs font-medium text-white/80">Promociones</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full pt-3">
        <div className="flex items-center gap-1 w-full">
          <SearchInput arrayFoods={arrayFoods} setSearch={setSearch} />
          <AddFoodBttn state={false} />
        </div>
        <div className="flex w-full">
          <RenderSortCards template={template} foods={arrayFoods} count={4} context={true} />
        </div>
      </div>
    </div>
  );
}
export default MenuItems;
