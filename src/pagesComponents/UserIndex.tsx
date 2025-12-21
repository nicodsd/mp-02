"use client";
import React, { useState } from "react";
import Categories from "@/src/components/Categories";
import Search from "@/src/components/Index/filters/Search";
import MenuCard from "@/src/components/Cards";
import PromoDay from "@/src/components/PromoDay";
import FoodsOptions from "../components/Index/filters/FoodsOptions";
import SortPriceButton from "../components/Index/filters/SortPrice";
import Image from "next/image";
import plus from "@/public/images/icons-index/PLUS.svg"
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
                    <section className="flex h-full flex-col gap-0.5 md:px-8 md:pb-8 md:pt-3 md:mx-[2vh] lg:mx-[15vh] md:rounded-b-2xl">
                        {
                            initialCategories?.length > 0 || arrayFoods?.length > 0 ? ( //sin 1 no hay otra
                                <>
                                    <FoodsOptions />
                                    <Search arrayFoods={arrayFoods} setSearch={setSearch} />
                                    <div className="flex justify-between items-center mt-4">
                                        <Categories categories={initialCategories} selectCategory={setCats} />
                                        <SortPriceButton onSortChange={setSortOrder} />
                                    </div>
                                    <MenuCard foods={arrayFoods} />
                                </>
                            ) : (
                                <div className="flex h-[52vh] flex-col justify-center items-center gap-5 text-gray-800">
                                    <h3 className="text-xl font-bold">Sube tus platos</h3>
                                    <a href="/nuevo-plato"
                                        className="cursor-pointer flex flex-col items-center justify-center h-52 w-52 bg-lime-100 border-lime-500 border rounded-full hover:bg-lime-600 transition text-md font-bold text-gray-500 hover:text-white shadow-md focus:outline-none focus:ring-2 focus:ring-lime-600 focus:ring-opacity-75 duration-200"
                                    >
                                        <Image src={plus} alt="icono de agregar" className="text-green-700" width={70} height={70} />
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