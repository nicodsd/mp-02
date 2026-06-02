"use client";
import React, { useMemo, useState } from "react";
import SearchInput from "@/src/components/Index/filters/Search";
import AddFoodBttn from "@/src/components/buttons/AddFoodBttn";
import RenderSortCards from "../user_index/user_sections/RenderSortCards";
import { URI } from "@/src/lib/const";
import { useEffect } from "react";
export function MenuItems({ dataFoods, template, user, token }: { dataFoods: any[]; template: any; user: any; token?: string }) {
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

  const [analytics, setAnalytics] = useState<{ visits: number, topDishes: string[] }>({ visits: 0, topDishes: [] });

  useEffect(() => {
    async function fetchAnalytics() {
      if (!token) return;
      try {
        const res = await fetch(`${URI}/analytics`, {
          credentials: "include"
        });
        if (!res.ok) {
          console.error("Analytics fetch failed with status:", res.status);
          return;
        }
        const data = await res.json();
        if (data.success && data.analytics) {
          setAnalytics(data.analytics);
          console.log("Analytics fetched successfully:", data.analytics);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    }
    fetchAnalytics();
  }, [token]);

  return (
    <div className="flex p-3 w-full flex-col gap-6 relative">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800">Platos</h1>
        <p className="text-gray-500 text-sm">Gestiona tus platos, crea, edita entre otras cosas.</p>
      </header>

      <div className="grid grid-cols-3 lg:grid-cols-3 gap-2">
        <div className="flex flex-col items-start p-3 rounded-xl bg-orange-400 justify-between">
          <div className="flex flex-col items-start ">
            <span className="text-lg text-white mb-1 font-semibold leading-tight">Platos</span>
            <span className="text-[3rem] font-bold text-white">{activeDataFoods.length}</span>
          </div>
          <span className="text-xs font-medium text-white/80">Platos activos</span>
        </div>
        <div className="flex flex-col items-start p-3 rounded-xl bg-teal-600 justify-between">
          <div className="flex flex-col items-start ">
            <span className="text-lg text-white mb-1 font-semibold leading-tight">Promos</span>
            <span className="text-[3rem] font-bold text-white">{activePromos.length}</span>
          </div>
          <span className="text-xs font-medium leading-3 text-white/80">Promociones activas</span>
        </div>
        {
          user.plan !== "free" ?
            <div className="flex flex-col items-start p-3 rounded-xl bg-indigo-500 justify-between">
              <div className="flex flex-col items-start ">
                <span className="text-lg text-white mb-1 font-semibold leading-tight">Visitas</span>
                <span className="text-[3rem] font-bold text-white">{analytics.visits}</span>
              </div>
              <span className="text-xs font-medium text-white/80">Vistas al menú</span>
            </div>
            :
            <div className="flex flex-col items-start gap-2 p-3 rounded-xl bg-indigo-500 justify-between">
              <div className="flex flex-col items-start">
                <span className="text-lg text-white mb-1 font-semibold leading-tight">Visitas</span>
                <span className="md:text-[1.8rem] text-xl font-bold leading-none text-white">Función paga</span>
              </div>
              <span className="md:text-sm text-xs font-medium leading-3 text-white/80">Mejora tu plan para ver en tiempo real quienes entran a tu menú </span>
            </div>
        }
      </div>
      <div className="flex flex-col gap-3 w-full pt-4">

        <div className="flex items-center gap-2 pl-2">
          <button
            onClick={() => setView("active")}
            className={`px-4 py-2 font-semibold cursor-pointer text-sm rounded-lg transition-colors 
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
            disabled={(user.plan === "free")}
            onClick={() => setView("archived")}
            className={`px-4 py-2 disabled:opacity-50 cursor-pointer disabled:pointer-events-none font-semibold text-sm rounded-lg transition-colors 
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
        <div className="flex w-full h-130 relative bg-gray-200/60 md:p-1 rounded-xl">
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
