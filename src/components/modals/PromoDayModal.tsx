"use client";
import React, { useState } from "react";
import DiscountSlider from "@/src/components/Index/filters/DiscountSlider";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

type Food = {
  _id: string | number;
  name: string;
  description: string;
  photo: string;
  price: number;
  category?: string;
  sub_category?: string;
  is_promo?: boolean;
  promo_price?: number;
};

export default function PromoPanel({
  plan,
  foods,
  openModal,
}: {
  plan: string;
  foods: Food[];
  openModal: () => void;
}) {
  const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  });
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [promoPrice, setPromoPrice] = useState<string>("");
  const [activePromos, setActivePromos] = useState<Food[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
    setPromoPrice(String(food.price));
  };


  const applyDiscount = (percent: number) => {
    if (selectedFood) {
      const discounted =
        selectedFood.price - (selectedFood.price * percent) / 100;
      setPromoPrice(String(Math.round(discounted)));
    }
  };

  const handlePublishPromo = () => {
    if (selectedFood) {
      const newPromo: Food = {
        ...selectedFood,
        price: Number(promoPrice),
        is_promo: true,
        promo_price: Number(promoPrice),
      };
      setActivePromos([...activePromos, newPromo]);
      setSelectedFood(null);
      setPromoPrice("");
    }
  };

  const removePromo = (id: string | number) => {
    setActivePromos(activePromos.filter((promo) => promo._id !== id));
  };

  const isFoodInPromo = (foodId: string | number) =>
    activePromos.some((promo) => promo._id === foodId);

  // 🔹 Obtener categorías únicas
  const categories = Array.from(new Set(foods.map((f) => f.sub_category)));

  // 🔹 Filtrar por categoría y búsqueda
  const filteredFoods = foods.filter((food) => {
    const matchesCategory =
      selectedCategory === "" || food.sub_category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      food.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 backdrop-blur bg-gray-700/40 flex items-center h-screen justify-center z-50 overflow-hidden">
      <div className="absolute animate__slideInUp animate__animated animate__faster bottom-22 bg-background z-100 w-full md:max-w-3xl px-4 py-6 flex flex-col gap-3 rounded-xl">
        <h3 className="text-xl text-gray-800">Agregar Promociones</h3>

        {plan === 'free' && <div className="bg-linear-to-r from-amber-500 to-amber-600 rounded-lg p-3 mb-2 flex items-center justify-between text-white shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <div>
              <p className="font-bold text-sm">Función de pago</p>
              <p className="text-xs opacity-90">Mejora tu plan para activar promociones en tus platos.</p>
            </div>
          </div>
        </div>}

        <div className="relative flex items-center w-full">
          <input
            type="text"
            placeholder="Buscar plato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-2 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
          <FaSearch className="absolute left-3 text-red-500" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => setSelectedCategory("")}
              className={`py-1 text-[13px] no-underline px-3 rounded-[7px] cursor-pointer font-bold ${selectedCategory === ""
                ? "bg-red-600 text-white border"
                : "text-gray-800 border border-gray-300"
                }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat!)}
                className={`py-1 text-[13px] no-underline px-2 rounded-[7px] cursor-pointer font-bold ${selectedCategory === cat
                  ? "bg-red-600 text-white border"
                  : "text-gray-800 border border-gray-300"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-0.5 h-80 md:h-100 bg-gray-100/60 p-1 rounded-xl overflow-auto relative">
            {/* Overlay para evitar interacción visualmente si se desea, o simplemente quitamos onClick */}
            {filteredFoods.map((food) => (
              <div
                onClick={() => plan !== "free" ? handleSelectFood(food) : null}
                key={food._id}
                className={`flex bg-background items-start gap-2 border-[0.3] rounded-lg p-2 transition ${plan !== "free" ? "opacity-100 cursor-pointer hover:bg-gray-200" : "grayscale opacity-50 cursor-not-allowed"} border-gray-300`}
              >
                <img
                  src={food.photo}
                  alt={food.name}
                  className="w-10 h-10 aspect-square object-cover rounded-md"
                />
                <div className="flex flex-col justify-between h-full">
                  <h3 className="text-sm tracking-thin leading-4 text-gray-800">
                    {food.name}
                  </h3>
                  <p className="text-lg font-bold text-gray-600">
                    {priceFormatter.format(food.price)}
                  </p>
                  {isFoodInPromo(food._id) && (
                    <span className="text-xs text-red-500">Ya en promo</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => openModal()}
            className="w-full py-3 text-gray-500 text-sm font-medium hover:text-gray-800"
          >
            Cancelar
          </button>
        </div>

        {selectedFood && (
          <div
            className="fixed inset-0 z-100 backdrop-blur-sm rounded-xl flex items-end sm:items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full sm:w-125 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up">
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
              </div>

              <div className="flex gap-3">
                <button onClick={() => setSelectedFood(null)} className="flex-1 cursor-pointer transition-all duration-200 ease-in-out py-4 font-bold text-gray-500 hover:text-gray-800">Cancelar</button>
                <button
                  onClick={handlePublishPromo}
                  disabled={promoPrice === String(selectedFood.price)}
                  className="flex-2 bg-red-600 text-white py-4 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 ease-in-out rounded-lg font-bold active:scale-95 disabled:bg-gray-300"
                >
                  Publicar Promo
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {activePromos.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-2">Promos activas</h2>
            <div className="flex flex-col gap-4">
              {activePromos.map((promo) => (
                <div key={promo._id} className="relative">
                  {/* <PromoDay foods={foods} template={template} /> */}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => removePromo(promo._id)}
                      className="bg-gray-200 text-red-600 px-3 py-1 rounded hover:bg-red-100"
                    >
                      ❌ Quitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
