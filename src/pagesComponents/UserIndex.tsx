"use client";
import React, { useState } from "react";
import FoodsOptions from "@/src/components/Index/filters/FoodsOptions";
import CardsFoodsByCategories from "@/src/components/Index/sections/CardsFoodsByCategories";
import Search from "@/src/components/Index/filters/Search";
import categoriesData from "@/src/data/categories.json";
import Categories from "@/src/components/Categories";
import PromoDay from "@/src/components/PromoDay";
import SortPriceButton from "@/src/components/Index/filters/SortPrice";
import RenderCards from "@/src/components/RenderCardsExample";
import ListCardsByCategory from "@/src/components/Index/sections/ListCardsByCategory";
type Food = {
    _id: string | number;
    photo: string;
    name: string;
    description: string;
    price: number
    category: string;
    sub_category: string;
};
type SubCategory = {
    _id: number;
    name: string;
};
export default function UserIndex({
    categories,
    foods,
    initialSubCategories,
    user,
    token
}: {
    categories: any[];
    foods: any[];
    initialSubCategories: any[];
    user: any;
    token: string;
}) {
    const [arrayFoods, setarrayFoods] = useState<Food[]>(foods);
    const [subCategories, setSubCategories] = useState<SubCategory[]>(initialSubCategories);
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    const availableCategories = categoriesData.filter((option) =>
        foods.some((food) => food.category === option.name)
    );

    // 🔹 Manejo de categorías
    function handleCategoryClick(category: string) {
        // Si vuelvo a presionar la misma categoría, reinicio todo
        if (selectedCategory === category) {
            setSelectedCategory("0"); // reinicio selección
            setarrayFoods(foods); // muestro todos los platos
            setSubCategories(initialSubCategories); // muestro todas las subcategorías
            return;
        }

        setSelectedCategory(category);

        if (category === "0") {
            // Mostrar todos los platos y todas las subcategorías
            setarrayFoods(foods);
            setSubCategories(initialSubCategories);
        } else {
            // Filtrar platos por categoría
            const filteredFoods = foods.filter((food) => food.category === category);
            setarrayFoods(filteredFoods);

            // Filtrar subcategorías en base a los platos filtrados
            const filteredSubCategories = initialSubCategories.filter((subCat) =>
                filteredFoods.some((food) => food.sub_category === subCat.name)
            );
            setSubCategories(filteredSubCategories);
        }
    }

    // 🔹 Manejo de subcategorías
    function handleSubCategoryClick(subCategory: string) {
        if (subCategory === "0") {
            // Mostrar todos los platos de la categoría seleccionada
            const filteredFoods =
                selectedCategory && selectedCategory !== "0"
                    ? foods.filter((food) => food.category === selectedCategory)
                    : foods;
            setarrayFoods(filteredFoods);
        } else {
            // Filtrar platos por subcategoría dentro de la categoría seleccionada
            if (selectedCategory === "0") {
                const filteredFoods = foods.filter(
                    (food) => food.sub_category === subCategory
                );
                setarrayFoods(filteredFoods);
            } else {
                const filteredFoods = foods.filter(
                    (food) =>
                        food.sub_category === subCategory
                );
                setarrayFoods(filteredFoods);
            }
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
            const result = foods.filter((food) =>
                food.name.toLowerCase().includes(query.toLowerCase())
            );
            setarrayFoods(result);
        } else {
            setarrayFoods(foods);
        }
    }
    return (
        <div className="w-full p-3 md:p-0 md:px-10 md:py-6 h-full">
            <section className="flex min-h-[calc(90vh-100px)] flex-col gap-5 md:mx-[12vw] md:pb-8 md:pt-3 lg:mx-[27vw] -translate-y-10">
                <div className="bg-[#fffbf8] rounded-2xl px-2 mx-2 py-2 shadow-md">
                    <Search arrayFoods={arrayFoods} setSearch={setSearch} />
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg ml-2 font-normal text-gray-600 text-start w-full">Promociones</h2>
                        <PromoDay foods={arrayFoods} />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <h2 className="text-lg ml-2 font-normal text-gray-600 text-start w-full">Categorias</h2>
                        <FoodsOptions
                            selectedCategory={selectedCategory}
                            handleCategoryClick={handleCategoryClick}
                            availableCategories={availableCategories}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg ml-2 font-normal text-gray-600 mb-1 text-start w-full">Tipos de platos</h2>
                    <div className="flex justify-between items-end">
                        <Categories categories={subCategories} selectCategory={handleSubCategoryClick} />
                        <SortPriceButton onSortChange={setSortOrder} />
                    </div>
                    <div className="h-[calc(50vh-100px)]">
                        {
                            arrayFoods.length > 0 ? (
                                <RenderCards foods={arrayFoods} count={4} context={false} />
                                /*  <CardsFoodsByCategories initialSubCategories={subCategories} setSubCats={handleSubCategoryClick} setSortOrder={setSortOrder} arrayFoods={arrayFoods} /> */
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
                {/* <ListCardsByCategory arrayFoods={arrayFoods} /> */}
            </section>
        </div>
    );
}
