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
}: {
    initialCategories: any[];
    initialFoods: any[];
    initialSubCategories: any[];
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
        <>
            <div className="w-full asap h-auto">
                <div className="w-full p-3 md:p-0 md:px-10 md:py-6 h-full">
                    <section className="flex flex-col">
                        <PromoDay />
                    </section>
                    <section className="flex min-h-[calc(90vh-100px)] flex-col gap-0.5 md:px-8 md:pb-8 md:pt-3 md:mx-[2vh] lg:mx-[15vh] md:rounded-b-2xl">
                        {
                            initialSubCategories?.length > 0 || arrayFoods ? ( //sin 1 no hay otra
                                <>
                                    <FoodsOptions />
                                    <SearchInput arrayFoods={arrayFoods} setSearch={setSearch} />
                                    <div className="flex justify-between items-center mt-4">
                                        <Categories categories={initialSubCategories} selectCategory={setCats} />
                                        <SortPriceButton onSortChange={setSortOrder} />
                                    </div>
                                    <RenderCards foods={arrayFoods} count={4} context={false} />
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