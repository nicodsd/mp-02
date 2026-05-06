"use client";
import React, { useState, useMemo, useEffect } from "react";
import DiscountSlider from "@/src/components/Index/filters/DiscountSlider";
import { FaTrashAlt } from "react-icons/fa";
import { useFoodStore } from "@/src/lib/useFoodStore";
import { refreshPage } from "@/app/actions";
import Search from "@/src/components/Index/filters/Search"
import Image from "next/image";
import { URI } from "@/src/lib/const";

const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
});

export default function Sucursales() {
    /*     const { updatePromo } = useFoodStore();
        const [selectedFood, setSelectedFood] = useState<any | null>(null);
        const [promoPrice, setPromoPrice] = useState<string>("");
        const [currentPrice, setCurrentPrice] = useState<string>("");
        const [currentPercent, setCurrentPercent] = useState<number>(0);
        const [selectedCategory, setSelectedCategory] = useState<string>("");
        const [searchTerm, setSearchTerm] = useState<string>("");
        const [loading, setLoading] = useState(false);
    
        const categories = useMemo(() => Array.from(new Set(foods.map((f) => f.sub_category))), [foods]);
    
        const activePromos = useMemo(() => foods.filter((f) => f.is_promo), [foods]);
    
        const filteredFoods = useMemo(() => {
            return foods.filter((food) => {
                const matchesCategory = !selectedCategory || food.sub_category === selectedCategory;
                const matchesSearch = !searchTerm || food.name.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesCategory && matchesSearch && !food.is_promo;
            });
        }, [foods, selectedCategory, searchTerm]);
    
        const handleSelectFood = (food: any) => {
            setSelectedFood(food);
            setPromoPrice(String(food.price));
            setCurrentPrice(String(food.price));
            setCurrentPercent(0);
        };
    
        const applyDiscount = (percent: number) => {
            setCurrentPercent(percent);
            if (percent === 100) {
                setPromoPrice("0");
                setCurrentPrice("0");
            }
            if (selectedFood) {
                const discounted = selectedFood.price - (selectedFood.price * percent) / 100;
                setPromoPrice(String(Math.round(discounted)));
                return setCurrentPrice(String(Math.round(discounted)));
            }
        };
    
        const handlePublishPromo = async () => {
            if (!selectedFood) return;
            setLoading(true);
    
            try {
                const pPrice = Number(promoPrice);
                const res = await fetch(`${URI}/foods/promo/${selectedFood._id}`, {
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
                const res = await fetch(`${URI}/foods/promo/${id}`, {
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
        }; */

    return (
        <div className="p-3 flex h-full w-full flex-col gap-6">
            <header className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-800">Sucursales</h1>
                <p className="text-gray-500 text-sm">Agrega y gestiona tus menús para tus diferentes sucursales.</p>
            </header>

        </div>
    );
}