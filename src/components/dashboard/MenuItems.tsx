"use client";
import React, { useMemo, useState } from "react";
import RenderCards from "@/src/components/RenderCardsExample";
import SearchInput from "@/src/components/Index/filters/Search";
import AddFoodBttn from "@/src/components/buttons/AddFoodBttn";
export function MenuItems({ dataFoods }: { dataFoods: any[] }) {
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
    <div className="flex flex-col gap-3 relative">
      <header className="p-3 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800">Platos</h1>
        <p className="text-gray-500 text-sm">Gestiona tus platos.</p>
      </header>
      <div className="grid grid-cols-2 gap-3">

        <div className="flex flex-col items-start p-4 rounded-xl bg-orange-100 border justify-between border-orange-300">
          <span className="text-lg text-orange-400 mb-1 font-semibold">Platos</span>
          <span className="text-[3rem] font-bold text-orange-700">
            {arrayFoods.length}
          </span>
          <span className="text-xs font-medium text-gray-600">
            Platos Activos
          </span>
        </div>

        <div className="flex flex-col items-start p-4 rounded-xl bg-[#E0F7FA] border justify-between border-teal-300/70">
          <span className=" text-[#00796B] mb-1 font-semibold leading-tight">Promociones Activas</span>
          <span className="text-[3rem] font-bold text-[#00796B]">{activePromos.length}</span>
          <span className="text-xs font-medium text-gray-600">Promociones</span>
        </div>
      </div>
      <div className="flex flex-col gap-6 w-full px-2 pt-6">
        <div className="flex items-center gap-2 w-full">
          <SearchInput arrayFoods={arrayFoods} setSearch={setSearch} />
          <AddFoodBttn state={false} />
        </div>
        <div className="flex w-full relative">
          <RenderCards foods={arrayFoods} count={4} context={true} />
        </div>
      </div>
    </div>
  );
}
export default MenuItems;
