"use client";
import React, { useState } from "react";
import Categories from "@/src/components/Categories";
import Search from "@/src/components/Index/filters/Search";
import MenuCard from "@/src/components/Cards";
import PromoDay from "@/src/components/PromoDay";
import FoodsOptions from "../components/Index/filters/FoodsOptions";
import SortPriceButton from "../components/Index/filters/SortPrice";
type Food = {
    _id: string | number;
    photo: string;
    name: string;
    description: string;
    price: number
    category: string;
};
export default function UserIndex({
    initialCategories,
    initialFoods,
}: {
    initialCategories: any[];
    initialFoods: any[];
}) {
    const [arrayFoods, setarrayFoods] = useState<Food[]>(initialFoods);
    function setCats(category: string) {
        if (category.length > 1) {
            const result = initialFoods.filter((food) => food.category === category);
            setarrayFoods(result);
        } else if (category === "0") {
            setarrayFoods(initialFoods);
        }
    }
    function setSortOrder(order: "asc" | "desc") {
        const sorted = [...arrayFoods].sort((a, b) =>
            order === "asc" ? a.price - b.price : b.price - a.price
        );
        setarrayFoods(sorted);
    }
    function setSearch(query: string) {
        if (query.length > 1) {
            const result = initialFoods.filter((food) =>
                food.name.toLowerCase().includes(query.toLowerCase())
            );
            setarrayFoods(result);
        } else {
            setarrayFoods(initialFoods);
        }
    }
    return (
        <>
            <div className="w-full asap h-auto">
                <div className="w-full p-3 md:p-0 md:px-10 md:py-6 h-full">
                    <section className="flex flex-col">
                        <PromoDay />
                    </section>
                    <section className="flex h-full flex-col gap-0.5 md:px- md:pb-8 md:pt-3 md:shadow md:mx-[25vh] md:rounded-b-2xl">
                        <FoodsOptions />
                        <Search arrayFoods={arrayFoods} setSearch={setSearch} />
                        {
                            initialCategories?.length > 0 || arrayFoods?.length > 0 ? ( //sin 1 no hay otra
                                <>
                                    <div className="flex justify-between items-center mt-4">
                                        <Categories categories={initialCategories} selectCategory={setCats} />
                                        <SortPriceButton onSortChange={setSortOrder} />
                                    </div>
                                    <MenuCard foods={arrayFoods} />
                                </>
                            ) : (
                                <p>No hay platos</p>
                            )
                        }
                    </section>
                </div>
            </div>
        </>
    );
}

/*  <div className="flex flex-col items-center gap-5 text-gray-800">
                                    <h3 className="text-xl font-bold">Sube tus platos</h3>
                                    <a href="/nuevo-plato"
                                        className="cursor-pointer flex flex-col items-center justify-center h-52 w-52 bg-lime-100 border-lime-500 border rounded-full hover:bg-lime-600 transition text-md font-bold text-gray-500 hover:text-white shadow-md focus:outline-none focus:ring-2 focus:ring-lime-600 focus:ring-opacity-75 duration-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-22 w-22" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Agregar
                                    </a>
                                </div> */