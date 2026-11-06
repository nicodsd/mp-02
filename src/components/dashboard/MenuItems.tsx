"use client";
import React, { useMemo, useState, useEffect } from "react";
import SearchInput from "@/src/components/Index/filters/Search";
import AddFoodBttn from "@/src/components/buttons/AddFoodBttn";
import RenderSortCards, { SortOption } from "../user_index/user_sections/RenderSortCards";
import { ArrowUpDown } from "lucide-react";
import { useFoodStore } from "@/src/lib/useFoodStore";
import templates from "@/src/data/templates.json";

const SORT_LABELS: Record<SortOption, string> = {
  category: "por categoría",
  category_asc: "categoría (A-Z)",
  category_desc: "categoría (Z-A)",
  price_asc: "menor precio",
  price_desc: "mayor precio",
  name_asc: "nombre (A-Z)",
  name_desc: "nombre (Z-A)",
};

export function MenuItems({
  dataFoods: initialDataFoods,
  template: initialTemplate,
  user: initialUser,
  token,
}: {
  dataFoods: any[];
  template: any;
  user: any;
  token?: string;
}) {
  const {
    foods: storeFoods,
    analytics,
    user: storeUser,
    isInitialized,
  } = useFoodStore();

  const user = storeUser && storeUser.id === initialUser?.id ? { ...initialUser, ...storeUser } : initialUser;
  const template = useMemo(
    () => templates.find((t) => t.template_id === user?.template_id) || initialTemplate,
    [user?.template_id, initialTemplate]
  );
  const dataFoods = isInitialized ? storeFoods : (storeFoods.length > 0 ? storeFoods : initialDataFoods);

  const activeDataFoods = useMemo(() => dataFoods.filter((f) => !f.is_archived), [dataFoods]);
  const archivedDataFoods = useMemo(() => dataFoods.filter((f) => f.is_archived), [dataFoods]);

  const [view, setView] = useState<"active" | "archived">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("category");

  const currentSourceFoods = view === "active" ? activeDataFoods : archivedDataFoods;

  // Categorías disponibles con su cantidad de platos según la vista actual (Activos / Archivados)
  const categoriesWithCount = useMemo(() => {
    const counts = new Map<string, number>();
    currentSourceFoods.forEach((food) => {
      const cat = food?.sub_category?.trim() || "Sin categoría";
      counts.set(cat, (counts.get(cat) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
  }, [currentSourceFoods]);

  // Resetear categoría seleccionada si al cambiar de vista ya no existe
  useEffect(() => {
    if (
      selectedCategory !== "all" &&
      !categoriesWithCount.some((c) => c.name === selectedCategory)
    ) {
      setSelectedCategory("all");
    }
  }, [categoriesWithCount, selectedCategory]);

  // Filtrado por categoría y por búsqueda (nombre o descripción)
  const arrayFoods = useMemo(() => {
    let filtered = currentSourceFoods;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (food) => (food?.sub_category?.trim() || "Sin categoría") === selectedCategory
      );
    }

    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (food) =>
          food?.name?.toLowerCase().includes(q) ||
          food?.description?.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [currentSourceFoods, selectedCategory, searchQuery]);

  const displayedCategoriesCount = useMemo(() => {
    const set = new Set(
      arrayFoods.map((f) => f?.sub_category?.trim() || "Sin categoría")
    );
    return set.size;
  }, [arrayFoods]);

  const allHaveCategory = useMemo(
    () => currentSourceFoods.length > 0 && currentSourceFoods.every((f) => Boolean(f?.sub_category?.trim())),
    [currentSourceFoods]
  );

  function setSearch(query: string) {
    setSearchQuery(query);
  }

  const activePromos = useMemo(() => activeDataFoods.filter((f) => f.is_promo), [activeDataFoods]);

  return (
    <div className="flex p-3 w-full min-w-0 flex-col gap-6 relative">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800">Platos</h1>
        <p className="text-gray-500 text-sm">Gestiona tus platos, crea, edita entre otras cosas.</p>
      </header>

      <div className="grid grid-cols-3 lg:grid-cols-3 gap-1 md:gap-2 my-4">
        <div className="flex flex-col items-start p-2 md:p-3 rounded-xl bg-orange-400 justify-between">
          <div className="flex flex-col items-start">
            <span className="text-lg text-white mb-1 font-semibold leading-tight">Platos</span>
            <span className="text-[3rem] font-bold text-white">{activeDataFoods.length}</span>
          </div>
          <span className="text-xs font-medium text-white/80">Platos activos</span>
        </div>
        {user.plan !== "free" ? (
          <div className="flex flex-col items-start p-2 md:p-3 rounded-xl bg-teal-600 justify-between">
            <div className="flex flex-col items-start">
              <span className="text-lg text-white mb-1 font-semibold leading-tight truncate">Promociones</span>
              <span className="text-[3rem] font-bold text-white">{activePromos.length}</span>
            </div>
            <span className="text-xs font-medium leading-3 text-white/80">Promociones activas</span>
          </div>
        ) : (
          <div className="relative group flex flex-col items-start gap-2 p-2 md:p-3 rounded-xl bg-gray-300 justify-between">
            <div className="flex flex-col items-start">
              <span className="text-lg text-white mb-1 font-semibold leading-tight">Promociones</span>
              <span className="md:text-[2.5rem] text-xl font-bold leading-none text-white">0</span>
            </div>
            <span className="md:text-sm text-xs font-medium leading-4 text-white">
              Con tu plan <span className="font-bold text-white">Plus+</span> puedes agregar promociones especiales.
            </span>

            {/* Tooltip */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-max bg-gray-800 text-white text-xs py-1.5 px-3 rounded-md shadow-lg z-20 pointer-events-none">
              Disponible en planes Plus o Premium
            </div>
          </div>
        )}
        {user.plan !== "free" ? (
          <div className="flex flex-col items-start p-2 md:p-3 rounded-xl bg-indigo-500 justify-between">
            <div className="flex flex-col items-start ">
              <span className="text-lg text-white mb-1 font-semibold leading-tight">Visitas</span>
              <span className="text-[3rem] font-bold text-white">{analytics.visits}</span>
            </div>
            <span className="text-xs font-medium text-white/80">Vistas al menú</span>
          </div>
        ) : (
          <div className="relative group flex flex-col items-start gap-2 p-2 md:p-3 rounded-xl bg-gray-300 justify-between">
            <div className="flex flex-col items-start">
              <span className="text-lg text-white mb-1 font-semibold leading-tight">Visitas</span>
              <span className="md:text-[2.5rem] text-xl font-bold leading-none text-white">0</span>
            </div>
            <span className="md:text-sm text-xs font-medium leading-4 text-white">
              ¿Quieres saber en tiempo real quienes entran a tu menú?
            </span>

            {/* Tooltip */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-max bg-gray-800 text-white text-xs py-1.5 px-3 rounded-md shadow-lg z-20 pointer-events-none">
              Disponible en planes Plus o Premium
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 w-full min-w-0 pt-4">
        {/* Fila superior: Tabs Activos/Archivados + Buscador y Botón Agregar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 w-full">
          <div className="flex items-center gap-2 pl-1">
            <button
              onClick={() => setView("active")}
              className={`px-4 py-2 font-semibold cursor-pointer text-sm rounded-lg transition-colors 
                ${view === "active"
                  ? "bg-orange-400 text-white"
                  : "bg-transparent text-gray-500 hover:bg-gray-100"
                }`}
            >
              Activos{" "}
              <span
                className={`ml-1 p-1 px-2 
                  ${view !== "archived"
                    ? "bg-white text-orange-400 hover:bg-gray-100"
                    : "bg-gray-200/60 text-orange-400 hover:bg-gray-100"
                  } rounded-full`}
              >
                {activeDataFoods.length}
              </span>
            </button>

            <div className="relative group flex items-center">
              <button
                disabled={user.plan === "free"}
                onClick={() => setView("archived")}
                className={`px-4 py-2 disabled:opacity-50 cursor-pointer disabled:pointer-events-none font-semibold text-sm rounded-lg transition-colors 
                  ${view === "archived"
                    ? "bg-slate-500 text-white"
                    : "bg-transparent text-gray-500 hover:bg-gray-100"
                  }`}
              >
                Archivados{" "}
                <span
                  className={`ml-1 p-1 px-2 
                    ${view !== "archived"
                      ? "bg-gray-200/60 text-gray-800 hover:bg-gray-100"
                      : "bg-white text-gray-800 hover:bg-gray-100"
                    } rounded-full`}
                >
                  {archivedDataFoods.length}
                </span>
              </button>
              {user.plan === "free" && (
                <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-max bg-gray-800 text-white text-xs py-1.5 px-3 rounded-md shadow-lg z-20 pointer-events-none">
                  Disponible en planes Plus o Premium
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 w-full md:max-w-md">
            <SearchInput
              placeholder="Buscar por nombre o descripción..."
              arrayFoods={arrayFoods}
              setSearch={setSearch}
            />
            <AddFoodBttn state={false} />
          </div>
        </div>

        {/* Filtros por categoría */}
        {categoriesWithCount.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold border transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${selectedCategory === "all"
                ? view === "active"
                  ? "border-orange-400 bg-orange-50 text-orange-600 shadow-2xs"
                  : "border-slate-500 bg-slate-100 text-slate-700 shadow-2xs"
                : "border-gray-200 bg-background text-gray-700 hover:bg-gray-100"
                }`}
            >
              <span>Todos</span>
              <span
                className={`text-xs font-bold ${selectedCategory === "all"
                  ? view === "active"
                    ? "text-orange-500"
                    : "text-slate-600"
                  : "text-gray-400"
                  }`}
              >
                {currentSourceFoods.length}
              </span>
            </button>

            {categoriesWithCount.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(isActive ? "all" : cat.name)
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold border transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${isActive
                    ? view === "active"
                      ? "border-orange-400 bg-orange-50 text-orange-600 shadow-2xs"
                      : "border-slate-500 bg-slate-100 text-slate-700 shadow-2xs"
                    : "border-gray-200 bg-background text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-xs font-bold ${isActive
                      ? view === "active"
                        ? "text-orange-500"
                        : "text-slate-600"
                      : "text-gray-400"
                      }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Resumen de platos/categorías y Selector de orden */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-gray-500">
          <span className="font-medium">
            {displayedCategoriesCount}{" "}
            {displayedCategoriesCount === 1 ? "categoría" : "categorías"}
          </span>

          <div className="flex items-center gap-1.5">
            <label htmlFor="sort-dishes-select" className="text-gray-500 font-medium">
              Orden:
            </label>
            <div className="relative inline-flex items-center">
              <select
                id="sort-dishes-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-background border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold text-xs rounded-lg pl-2.5 pr-7 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400/40 transition-colors"
              >
                {Object.entries(SORT_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <ArrowUpDown
                size={13}
                className="absolute right-2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Contenedor principal de platos con los estilos de MenuItems */}
        <div className="flex w-full min-h-130 max-h-185 relative bg-gray-200/30 md:p-3 rounded-xl overflow-y-auto">
          <RenderSortCards
            template={template}
            user={user}
            foods={arrayFoods}
            count={4}
            context={true}
            sortBy={sortBy}
            onResetSort={() => setSortBy("category")}
          />
        </div>
      </div>
    </div>
  );
}
export default MenuItems;
