"use client";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import PromoDay from "@/src/components/PromoDay";
import DiscountSlider from "@/src/components/Index/filters/DiscountSlider";

type Food = {
    _id: string | number;
    name: string;
    description: string;
    photo: string;
    price: number;
    category?: string;
};

type Promo = Food & {
    lastPrice: number;
    expiresAt?: Date;
};

export default function PromoPanel({ foods }: { foods: Food[] }) {
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [promoPrice, setPromoPrice] = useState<string>("");
    const [activePromos, setActivePromos] = useState<Promo[]>([]);
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
            const newPromo: Promo = {
                ...selectedFood,
                lastPrice: selectedFood.price,
                price: Number(promoPrice),
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
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
    const categories = Array.from(new Set(foods.map((f) => f.category)));

    // 🔹 Filtrar por categoría y búsqueda
    const filteredFoods = foods.filter((food) => {
        const matchesCategory =
            selectedCategory === "" || food.category === selectedCategory;
        const matchesSearch =
            searchTerm === "" ||
            food.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="p-6 flex flex-col gap-6">
            <h1 className="text-xl font-bold">🎉 Panel de Promociones</h1>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar plato..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border rounded p-2 w-full"
                />
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
                <button
                    onClick={() => setSelectedCategory("")}
                    className={`px-4 py-2 rounded ${selectedCategory === ""
                        ? "bg-red-600 text-white"
                        : "bg-gray-200 text-gray-700"
                        }`}
                >
                    Todas
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat!)}
                        className={`px-4 py-2 rounded ${selectedCategory === cat
                            ? "bg-red-600 text-white"
                            : "bg-gray-200 text-gray-700"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-4">
                {filteredFoods.map((food) => (
                    <div
                        key={food._id}
                        onClick={() => !isFoodInPromo(food._id) && handleSelectFood(food)}
                        className={`flex items-center gap-4 border rounded-lg p-2 transition hover:shadow-md ${isFoodInPromo(food._id)
                            ? "opacity-40 cursor-not-allowed"
                            : selectedFood?._id === food._id
                                ? "border-red-500 shadow-lg"
                                : "border-gray-300"
                            }`}
                    >
                        <img
                            src={food.photo}
                            alt={food.name}
                            className="w-24 h-24 object-cover rounded-md"
                        />
                        <div className="flex flex-col">
                            <h3 className="font-bold text-gray-800">{food.name}</h3>
                            <p className="text-sm text-gray-600">${food.price}</p>
                            {isFoodInPromo(food._id) && (
                                <span className="text-xs text-red-500">Ya en promo</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {selectedFood && (
                <div className="fixed inset-0 bg-gray-200/70 flex items-center justify-center">
                    <div className="flex flex-col h-fit justify-center bg-white z-50 w-[90%] lg:w-[50%] border shadow-lg border-gray-300 p-4 rounded-lg">
                        <button
                            onClick={() => setSelectedFood(null)}
                            className="absolute top-3 right-3"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <label className="block font-semibold">{selectedFood.name}</label>
                                <label className="block font-semibold">Antes: ${selectedFood.price}</label>
                                <span className="text-2xl font-bold">Ahora: ${promoPrice}</span>
                            </div>
                            <img
                                src={selectedFood.photo}
                                alt={selectedFood.name}
                                className="w-24 h-24 object-cover rounded-md"
                            />
                        </div>
                        <DiscountSlider onChange={(percent) => applyDiscount(percent)} />
                        <button
                            onClick={handlePublishPromo}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition mt-2 self-end"
                        >
                            Publicar promoción
                        </button>
                    </div>
                </div>
            )}

            {activePromos.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold mb-2">📋 Promos activas</h2>
                    <div className="flex flex-col gap-4">
                        {activePromos.map((promo) => (
                            <div key={promo._id} className="relative">
                                {/*     <PromoDay
                                    foods={promo.foods}
                                /> */}
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => removePromo(promo._id)}
                                        className="bg-gray-200 text-red-600 px-3 py-1 rounded hover:bg-red-100"
                                    >
                                        ❌ Quitar
                                    </button>
                                    {promo.expiresAt && (
                                        <span className="text-sm text-gray-600">
                                            Expira: {promo.expiresAt.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
            }
        </div >
    );
}