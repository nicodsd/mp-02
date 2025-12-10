"use client";
import React, { useState } from "react";
import Categories from "@/src/components/Categories";
import MenuCard from "@/src/components/Cards";
import PromoDay from "@/src/components/PromoDay";
export default function UserIndex({
    initialCategories,
    initialFoods,
}: {
    initialCategories: any[];
    initialFoods: any[];
}) {
    let [arrayFoods, setarrayFoods] = useState<any[]>(initialFoods);
    let result;
    function setCats(category: string) {
        arrayFoods = initialFoods;
        if (category.length > 1) {
            result = initialFoods.filter((food) => food.category === category);
            setarrayFoods(result);
            return arrayFoods;
        }
        if (category === "0") {
            setarrayFoods(initialFoods);
            return arrayFoods;
        }
    }
    return (
        <>
            <div className="w-full asap h-auto">
                <div className="w-full p-3 h-full">
                    <section className="flex flex-col">
                        <PromoDay />
                    </section>
                    <section className="flex items-center justify-center h-full py-22 flex-col gap-0.5">
                        {
                            initialCategories?.length > 0 && arrayFoods?.length > 0 ? (
                                <>
                                    <Categories
                                        categories={initialCategories}
                                        selectCategory={setCats}
                                    />
                                    <MenuCard foods={arrayFoods} />
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-5 text-gray-800">
                                    <h3 className="text-xl font-bold">Sube tus platos</h3>
                                    <a href="/nuevo-plato"
                                        className="cursor-pointer flex flex-col items-center justify-center h-52 w-52 bg-lime-100 border-lime-500 border rounded-full hover:bg-lime-600 transition text-md font-bold text-gray-500 hover:text-white shadow-md focus:outline-none focus:ring-2 focus:ring-lime-600 focus:ring-opacity-75 duration-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-22 w-22" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Agregar
                                    </a>
                                </div>
                            )
                        }
                    </section>
                </div>
            </div>
        </>
    );
}