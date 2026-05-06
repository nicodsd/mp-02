"use client";
import React, { useMemo, useState } from "react";
import SearchInput from "@/src/components/Index/filters/Search";
import AddFoodBttn from "@/src/components/buttons/AddFoodBttn";
import RenderSortCards from "../user_index/user_sections/RenderSortCards";
export function MenuItems({ dataFoods, template }: { dataFoods: any[]; template: any }) {
  const activeDataFoods = useMemo(() => dataFoods.filter((f) => !f.is_archived), [dataFoods]);
  const archivedDataFoods = useMemo(() => dataFoods.filter((f) => f.is_archived), [dataFoods]);

  const [view, setView] = useState<"active" | "archived">("active");
  const [searchQuery, setSearchQuery] = useState("");

  const arrayFoods = useMemo(() => {
    const source = view === "active" ? activeDataFoods : archivedDataFoods;
    if (searchQuery.length > 1) {
      return source.filter((food) =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return source;
  }, [view, activeDataFoods, archivedDataFoods, searchQuery]);

  function setSearch(query: string) {
    setSearchQuery(query);
  }

  const activePromos = useMemo(() => activeDataFoods.filter((f) => f.is_promo), [activeDataFoods]);

  return (
    <div className="flex p-3 w-full flex-col gap-6 relative">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800">Platos</h1>
        <p className="text-gray-500 text-sm">Gestiona tus platos.</p>
      </header>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col items-start p-3 rounded-xl bg-orange-400 justify-between">
          <span className="text-lg text-white mb-1 font-semibold leading-tight">Platos</span>
          <span className="text-[3rem] font-bold text-white">{activeDataFoods.length}</span>
          <span className="text-xs font-medium text-white/80">Platos Activos</span>
        </div>
        <div className="flex flex-col items-start p-3 rounded-xl bg-teal-600 justify-between">
          <span className="text-lg text-white mb-1 font-semibold leading-tight">Promociones</span>
          <span className="text-[3rem] font-bold text-white">{activePromos.length}</span>
          <span className="text-xs font-medium text-white/80">Promociones</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full pt-4">
        <div className="flex items-center gap-2 pl-2">
          <button
            onClick={() => setView("active")}
            className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors 
              ${view === "active" ? "bg-orange-400 text-white"
                :
                "bg-transparent text-gray-500 hover:bg-gray-100"
              }`}
          >
            Activos <span className={`ml-1 p-1 px-2 
            ${view !== "archived"
                ?
                "bg-white text-orange-400 hover:bg-gray-100"
                :
                "bg-gray-200/60 text-orange-400 hover:bg-gray-100"
              }  rounded-full`}>{activeDataFoods.length}</span>
          </button>
          <button
            onClick={() => setView("archived")}
            className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors 
              ${view === "archived" ? "bg-slate-500 text-white"
                :
                "bg-transparent text-gray-500 hover:bg-gray-100"
              }`}
          >
            Archivados <span className={`ml-1 p-1 px-2 
            ${view !== "archived" ? "bg-gray-200/60 text-gray-800 hover:bg-gray-100"
                :
                "bg-white text-gray-800 hover:bg-gray-100"
              } 
              rounded-full`}>{archivedDataFoods.length}</span>
          </button>
        </div>

        <div className="flex items-center gap-1 w-full">
          <SearchInput arrayFoods={arrayFoods} setSearch={setSearch} />
          <AddFoodBttn state={false} />
        </div>
        <div className="flex w-full h-110 relative">
          {
            view === "active" ? (
              <div className="bg-orange-300/40 absolute top-10 left-1/2 -translate-x-1/2 blur-lg w-[80%] h-2/3"></div>
            ) : (
              <div className="bg-gray-800/20 absolute top-10 left-1/2 -translate-x-1/2 blur-lg w-[80%] h-2/3"></div>
            )
          }
          <RenderSortCards template={template} foods={arrayFoods} count={4} context={true} />
        </div>
      </div>
    </div >
  );
}
export default MenuItems;
