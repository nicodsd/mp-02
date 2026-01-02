"use client";
import React, { useState } from "react";
import FoodsOptions from "@/src/components/Index/filters/FoodsOptions";
import CardsFoodsByCategories from "@/src/components/Index/sections/CardsFoodsByCategories";
import SearchInput from "@/src/components/Index/filters/Search";
import ListCardsByCategory from "../components/Index/sections/ListCardsByCategory";
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

    const availableCategories = categories.filter((option) =>
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
            console.log("Mostrar todos los platos de la categoría seleccionada");
            // Mostrar todos los platos de la categoría seleccionada
            const filteredFoods =
                selectedCategory && selectedCategory !== "0"
                    ? foods.filter((food) => food.category === selectedCategory)
                    : foods;
            setarrayFoods(filteredFoods);
        } else {
            console.log("Mostrar platos de la subcategoría seleccionada");
            // Filtrar platos por subcategoría dentro de la categoría seleccionada
            if (selectedCategory === "0") {
                const filteredFoods = foods.filter(
                    (food) => food.sub_category === subCategory
                );
                setarrayFoods(filteredFoods);
                console.log("si solo si", filteredFoods);
            } else {
                const filteredFoods = foods.filter(
                    (food) =>
                        food.sub_category === subCategory
                );
                setarrayFoods(filteredFoods);
                console.log("si no es 0", filteredFoods);
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
        <div className="w-full asap h-auto">
            <div className="w-full p-3 md:p-0 md:px-10 md:py-6 h-full">
                <section className="flex flex-col">
                    <SearchInput arrayFoods={arrayFoods} setSearch={setSearch} />
                    <FoodsOptions selectedCategory={selectedCategory} handleCategoryClick={handleCategoryClick} availableCategories={availableCategories} />
                </section>
                <ListCardsByCategory arrayFoods={arrayFoods} />
                {
                    arrayFoods.length > 0 ? (
                        <CardsFoodsByCategories initialSubCategories={subCategories} setSubCats={handleSubCategoryClick} setSortOrder={setSortOrder} arrayFoods={arrayFoods} />
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
