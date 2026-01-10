"use client";
import React, { useState } from "react";
import PromoDay from "@/src/components/PromoDay";
import DiscountSlider from "@/src/components/Index/filters/DiscountSlider";
import { FaSearch } from "react-icons/fa";

type Food = {
    _id: string | number;
    name: string;
    description: string;
    photo: string;
    price: number;
    category?: string;
    sub_category?: string;
};

type Promo = Food & {
    lastPrice: number;
    expiresAt?: Date;
};

export default function PromoPanel({ foods }: { foods: Food[] }) {
    function formatearPrecio(precio: number | string) {
        const value = typeof precio === "string" ? Number(precio) : precio;
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
        }).format(value);
    }
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
        <div className="p-3 flex flex-col gap-7">
            <h1 className="text-xl font-bold">Panel de Promociones</h1>

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
                        className={`py-0.5 no-underline px-3 rounded-[7px] cursor-pointer font-bold ${selectedCategory === ""
                            ? "bg-red-600 text-white border"
                            : "text-gray-800 border border-gray-300"
                            }`}
                    >
                        Todas
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat!)}
                            className={`py-0.5 no-underline px-3 rounded-[7px] cursor-pointer font-bold ${selectedCategory === cat
                                ? "bg-red-600 text-white border"
                                : "text-gray-800 border border-gray-300"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-1">
                    {filteredFoods.map((food) => (
                        <div
                            key={food._id}
                            onClick={() => !isFoodInPromo(food._id) && handleSelectFood(food)}
                            className={`flex cursor-pointer items-start gap-2 border rounded-lg p-1.5 transition hover:shadow-lg ${isFoodInPromo(food._id)
                                ? "opacity-40 cursor-not-allowed"
                                : selectedFood?._id === food._id
                                    ? "border-red-500 shadow-lg"
                                    : "border-gray-300"
                                }`}
                        >
                            <img
                                src={food.photo}
                                alt={food.name}
                                className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className="flex flex-col">
                                <h3 className="text-xl text-gray-800">{food.name}</h3>
                                <p className="text-xl font-bold text-gray-600">{formatearPrecio(food.price)}</p>
                                {isFoodInPromo(food._id) && (
                                    <span className="text-xs text-red-500">Ya en promo</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedFood && (
                <div className="fixed inset-0 bg-gray-400/60 flex items-center justify-center">
                    <div className="flex flex-col h-fit justify-center gap-3 bg-[#fffbf8] z-50 w-[93%] lg:w-[50%] shadow-lg p-3 rounded-lg">
                        <div className="flex items-start px-2 justify-between">
                            <div className="flex flex-col gap-y-1">
                                <span className="block text-xs px-2 py-1 w-fit border text-center border-amber-300 bg-amber-300 rounded-full mt-3 font-semibold">{selectedFood.sub_category}</span>
                                <span className="block text-xl font-semibold">{selectedFood.name}</span>
                            </div>
                            <img
                                src={selectedFood.photo}
                                alt={selectedFood.name}
                                className="w-24 h-24 object-cover rounded-md"
                            />
                        </div>
                        <DiscountSlider onChange={(percent) => applyDiscount(percent)} />
                        <div className="flex flex-col justify-between">
                            <div className="px-2 flex items-center h-[100px]">
                                <div className="text-end w-full">
                                    <h2 className="font-semibold text-sm">Aplicar promoción:</h2>
                                    <span className="block line-through">Antes: ${selectedFood.price}</span>
                                    <span className="text-3xl font-bold">Ahora: ${promoPrice}</span>
                                </div>
                            </div>
                            <div className="flex gap-x-2">
                                <button
                                    onClick={() => setSelectedFood(null)}
                                    className="cursor-pointer bg-black w-1/2 text-white border-gray-300 border px-4 py-3 rounded-lg hover:bg-red-700 transition mt-2"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handlePublishPromo}
                                    className="bg-red-600 w-1/2 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition mt-2"
                                >
                                    Publicar promoción
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activePromos.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold mb-2">Promos activas</h2>
                    <div className="flex flex-col gap-4">
                        {activePromos.map((promo) => (
                            <div key={promo._id} className="relative">
                                <PromoDay
                                    promo={promo}
                                />
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