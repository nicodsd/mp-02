"use client";
import React, { useState } from "react";
import PromoDay from "@/src/components/PromoDay";
import FoodsOptions from "@/src/components/Index/filters/FoodsOptions";
import Categories from "@/src/components/Categories";
import SortPriceButton from "@/src/components/Index/filters/SortPrice";
import SearchInput from "@/src/components/Index/filters/Search";
import RenderCards from "@/src/components/RenderCards";
import Image from "next/image";
import plus from "@/public/images/icons-index/PLUS.svg"
type Food = {
    _id: string | number;
    photo: string;
    name: string;
    description: string;
    price: number
    category: string;
    sub_category: string;
};
export default function UserIndex({
    initialCategories,
    initialFoods,
    initialSubCategories,
    user,
    token
}: {
    initialCategories: any[];
    initialFoods: any[];
    initialSubCategories: any[];
    user: any;
    token: string;
}) {
    const [arrayFoods, setarrayFoods] = useState<Food[]>(initialFoods);
    function setCats(subCategory: string) {
        if (subCategory.length > 1) {
            const result = initialFoods.filter((food) => food.sub_category === subCategory);
            setarrayFoods(result);
        } else if (subCategory === "0") {
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
        <div className="w-full asap h-auto">
            <div className="w-full p-3 md:p-0 md:px-10 bg-white md:py-6 h-full">
                <section className="flex flex-col">
                    <SearchInput arrayFoods={arrayFoods} setSearch={setSearch} />
                </section>
                {
                    arrayFoods.length > 0 ? (
                        <section className="flex min-h-[calc(90vh-100px)] mt-4 flex-col gap-8 md:mx-[12vw] md:pb-8 md:pt-3 lg:mx-[27vw]">
                            <PromoDay />
                            {/* <FoodsOptions /> */}
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-center">
                                    <Categories categories={initialSubCategories} selectCategory={setCats} />
                                    <SortPriceButton onSortChange={setSortOrder} />
                                </div>
                                <RenderCards foods={arrayFoods} count={4} context={false} />
                            </div>
                        </section>
                    ) : (
                        user && token ? (
                            <div className="flex h-[52vh] flex-col justify-center items-center gap-5 text-gray-800">
                                <h3 className="text-xl font-bold">Sube tus platos</h3>
                                <a href="/nuevo-plato"
                                    className="cursor-pointer flex flex-col items-center justify-center h-52 w-52 bg-lime-100 border-lime-500 border rounded-full hover:bg-lime-600 transition text-md font-bold text-gray-500 hover:text-white shadow-md focus:outline-none focus:ring-2 focus:ring-lime-600 focus:ring-opacity-75 duration-200"
                                >
                                    Agregar
                                </a>
                            </div>
                        ) : (
                            <div className="flex h-[52vh] flex-col justify-center items-center gap-5 text-gray-800">
                                <h3 className="text-xl font-bold">Sube tus platos</h3>
                                <a href="/login"
                                    className="cursor-pointer flex flex-col items-center justify-center h-52 w-52 bg-lime-100 border-lime-500 border rounded-full hover:bg-lime-600 transition text-md font-bold text-gray-500 hover:text-white shadow-md focus:outline-none focus:ring-2 focus:ring-lime-600 focus:ring-opacity-75 duration-200"
                                >
                                    Iniciar Sesión
                                </a>
                            </div>
                        )
                    )
                }
            </div>
        </div>
    );
}
