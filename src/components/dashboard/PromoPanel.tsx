"use client";
import React, { useState, useMemo } from "react";
import DiscountSlider from "@/src/components/Index/filters/DiscountSlider";
import { FaSearch, FaTrashAlt } from "react-icons/fa";
import { useFoodStore } from "@/src/lib/useFoodStore";
import { refreshPage } from "@/app/actions";
import Image from "next/image";

const URI = process.env.NEXT_PUBLIC_API_URL;

const priceFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
});

export default function PromoPanel() {
  const { foods, updatePromo } = useFoodStore();
  const [selectedFood, setSelectedFood] = useState<any | null>(null);
  const [promoPrice, setPromoPrice] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const categories = useMemo(() => Array.from(new Set(foods.map((f) => f.sub_category))), [foods]);

  // CAMBIO LÓGICO: activePromos ahora es independiente de los filtros de búsqueda
  const activePromos = useMemo(() => foods.filter((f) => f.is_promo), [foods]);

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesCategory = !selectedCategory || food.sub_category === selectedCategory;
      const matchesSearch = !searchTerm || food.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [foods, selectedCategory, searchTerm]);

  const handleSelectFood = (food: any) => {
    setSelectedFood(food);
    setPromoPrice(String(food.price));
  };

  const applyDiscount = (percent: number) => {
    if (selectedFood) {
      const discounted = selectedFood.price - (selectedFood.price * percent) / 100;
      setPromoPrice(String(Math.round(discounted)));
    }
  };

  const handlePublishPromo = async () => {
    if (!selectedFood) return;
    setLoading(true);

    try {
      const pPrice = Number(promoPrice);
      const res = await fetch(`${URI}foods/promo/${selectedFood._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ is_promo: true, promo_price: pPrice }),
      });

      if (res.ok) {
        updatePromo(selectedFood._id, true, pPrice);
        await refreshPage();
        setSelectedFood(null);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const removePromo = async (id: string | number) => {
    try {
      const res = await fetch(`${URI}foods/promo/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ is_promo: false, promo_price: 0 }),
      });

      if (res.ok) {
        updatePromo(id, false, 0);
        await refreshPage();
      }
    } catch (error) {
      console.error("Error al quitar promo:", error);
    }
  };

  return (
    <div className="p-3 flex h-full w-full flex-col gap-6 pb-24">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800">Promociones</h1>
        <p className="text-gray-500 text-sm">Gestiona los descuentos destacados de hoy.</p>
      </header>

      {activePromos.length > 0 ? (
        <section className="flex flex-col w-full gap-3 max-h-120 overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            Activas: <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">{activePromos.length}</span>
          </h3>
          <div className="flex flex-col gap-2">
            {activePromos.map((promo) => (
              <div key={promo._id} className="flex items-center h-fit bg-red-50/30 border border-red-200 p-2 rounded-2xl justify-between animate-fade-in">
                <div className="flex items-center gap-2">
                  <Image priority loading="eager" src={promo.photo} width={64} height={64} className="w-16 h-16 object-cover rounded-lg" alt={promo.name} />
                  <div>
                    <h4 className="font-bold text-xl text-gray-800 line-clamp-1">{promo.name}</h4>
                    <div className="flex flex-col items-start">
                      <p className="text-gray-400 leading-none text-sm font-semibold">
                        Antes: $ {foods.find((f) => f._id === promo._id)?.price}
                      </p>
                      <p className="text-red-600 font-bold text-lg">Ahora: {
                        promo.promo_price === 0 ? "GRATIS" : priceFormatter.format(promo.promo_price || 0)}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => removePromo(promo._id)} className="p-1 flex items-center gap-1 flex-col text-gray-400 hover:text-red-500 transition-colors">
                  <FaTrashAlt size={18} />
                  <span className="text-xs">Eliminar</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          Activas: <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">{activePromos.length}</span>
        </h3>
      )}

      <div className="flex flex-col gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar plato para promocionar..."
            className="pl-10 pr-2 py-3 border z-100 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <button
            onClick={() => setSelectedCategory("")}
            className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-sm font-bold transition-all 
                ${!selectedCategory
                ? "bg-gray-900 text-white border"
                : "text-gray-800 border border-gray-300"
              }`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat!)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-sm font-bold transition-all 
                  ${selectedCategory === cat
                  ? "bg-gray-900 text-white border"
                  : "text-gray-800 border border-gray-300"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 overflow-y-auto max-h-120">
          {filteredFoods.map((food) => {
            const inPromo = activePromos.some(p => p._id === food._id);
            return (
              <div
                key={food._id}
                onClick={() => !inPromo && handleSelectFood(food)}
                className={`flex items-center gap-2 p-2 rounded-lg transition-all ${inPromo ? "opacity-40 grayscale cursor-not-allowed border-transparent bg-gray-50" :
                  selectedFood?._id === food._id ? "border-red-500 bg-red-50/30 border" : "border border-gray-300"
                  }`}
              >
                <Image priority loading="eager" src={food.photo} width={64} height={64} className="w-16 h-16 object-cover rounded-lg" alt={food.name} />
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-800 line-clamp-1">{food.name}</h5>
                  <p className="text-gray-500 font-bold text-xl">{priceFormatter.format(food.price)}</p>
                  {inPromo && <span className="text-[10px] font-black uppercase text-red-500">En promoción</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>


      {selectedFood && (
        <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:w-[500px] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-bold text-red-600 uppercase tracking-widest">{selectedFood.sub_category}</span>
                <h2 className="text-2xl font-bold text-gray-900">{selectedFood.name}</h2>
              </div>
              <img src={selectedFood.photo} className="w-20 h-20 object-cover rounded-xl" alt="" />
            </div>

            <DiscountSlider onChange={applyDiscount} />

            <div className="bg-gray-50 p-4 rounded-2xl my-6 flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Antes: {priceFormatter.format(selectedFood.price)}</p>
                <p className="text-3xl font-black text-gray-900"> {priceFormatter.format(Number(promoPrice))}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-green-600">AHORRO</p>
                <p className="text-lg font-bold text-green-600">{priceFormatter.format(selectedFood.price - Number(promoPrice))}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSelectedFood(null)} className="flex-1 py-4 font-bold text-gray-500 hover:text-gray-800 transition-colors">Cancelar</button>
              <button
                onClick={handlePublishPromo}
                disabled={loading || promoPrice == selectedFood.price}
                className="flex-2 bg-red-600 text-white py-4 rounded-lg font-bold active:scale-95 transition-all disabled:bg-gray-300"
              >
                {loading ? "Publicando..." : "Publicar Promo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}