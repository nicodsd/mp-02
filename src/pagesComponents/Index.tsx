"use client";
import React, { useState } from "react";
import foods from "@/src/data/foods-1.json";
import categoriesData from "@/src/data/categories.json";
import subCategoriesData from "@/src/data/sub_categories.json";
import Categories from "@/src/components/Categories";
import FoodsOptions from "@/src/components/Index/filters/FoodsOptions";
import PromoDay from "@/src/components/PromoDay";
import Search from "@/src/components/Index/filters/Search";
import SortPriceButton from "../components/Index/filters/SortPrice";
import promoday from "@/src/data/promoday";
import CardsFoodsByCategories from "@/src/components/Index/sections/CardsFoodsByCategories";
import SearchModal from "@/src/components/modals/SearchModal";
import RenderCardsOptions from "@/src/components/RenderCardsOptions";

type Food = {
  _id: string | number;
  photo: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sub_category: string;
};
type SubCategory = {
  _id: number;
  name: string;
};
export default function Inicio() {

  const [showModal, setShowModal] = useState(false);
  const [arrayFoods, setArrayFoods] = useState<Food[]>(foods);
  const [subCategories, setSubCategories] = useState<SubCategory[]>(subCategoriesData);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const availableCategories = categoriesData.filter((option) =>
    foods.some((food) => food.category === option.name)
  );

  // 🔹 Manejo de categorías
  function handleCategoryClick(category: string) {
    // Si vuelvo a presionar la misma categoría, reinicio todo
    if (selectedCategory === category) {
      setSelectedCategory("0"); // reinicio selección
      setArrayFoods(foods); // muestro todos los platos
      setSubCategories(subCategoriesData); // muestro todas las subcategorías
      return;
    }

    setSelectedCategory(category);

    if (category === "0") {
      // Mostrar todos los platos y todas las subcategorías
      setArrayFoods(foods);
      setSubCategories(subCategoriesData);
    } else {
      // Filtrar platos por categoría
      const filteredFoods = foods.filter((food) => food.category === category);
      setArrayFoods(filteredFoods);

      // Filtrar subcategorías en base a los platos filtrados
      const filteredSubCategories = subCategoriesData.filter((subCat) =>
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
      setArrayFoods(filteredFoods);
    } else {
      // Filtrar platos por subcategoría dentro de la categoría seleccionada
      if (selectedCategory === "0") {
        const filteredFoods = foods.filter(
          (food) => food.sub_category === subCategory
        );
        setArrayFoods(filteredFoods);
      } else {
        const filteredFoods = foods.filter(
          (food) =>
            food.sub_category === subCategory
        );
        setArrayFoods(filteredFoods);
      }
    }
  }

  function setSortOrder(order: "asc" | "desc") {
    const sorted = [...arrayFoods].sort((a, b) =>
      order === "asc" ? a.price - b.price : b.price - a.price
    );
    setArrayFoods(sorted);
  }

  function setSearch(query: string) {
    if (query.length > 1) {
      const result = foods.filter((food) =>
        food.name.toLowerCase().includes(query.toLowerCase())
      );
      setArrayFoods(result);
    } else {
      setArrayFoods(foods);
    }
  }

  return (
    <main className="w-full relative p-3 md:p-0 md:px-10 md:py-6 h-full">
      <SearchModal arrayFoods={arrayFoods} setSearch={setSearch} setShowModal={setShowModal} showModal={showModal} />
      <article className="flex min-h-[calc(90vh-100px)] flex-col gap-2 md:mx-[12vw] md:pb-8 md:pt-3 lg:mx-[27vw] -translate-y-10">
        <header className="bg-background rounded-2xl px-2 py-2 w-full shadow-md sticky top-13 z-20">
          <Search arrayFoods={arrayFoods} setSearch={setSearch} setShowModal={setShowModal} />
        </header>
        <section className="flex h-fit flex-col gap-5 md:mx-[12vw] md:pb-8 md:pt-3 pt-4 lg:mx-[27vw]">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg ml-2 font-normal text-gray-600 text-start w-full">Promociones</h2>
              <PromoDay foods={promoday} />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg ml-2 font-normal text-gray-600 text-start w-full">Categorias</h2>
              <FoodsOptions
                selectedCategory={selectedCategory}
                handleCategoryClick={handleCategoryClick}
                availableCategories={availableCategories}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg ml-2 font-normal text-gray-600 mb-1 text-start w-full">Platos</h2>
            <div className="flex justify-between items-end">
              <Categories categories={subCategories} selectCategory={handleSubCategoryClick} />
              <SortPriceButton onSortChange={setSortOrder} />
            </div>
            <div className="flex flex-col gap-10">
              <CardsFoodsByCategories arrayFoods={arrayFoods} />
              <div className="flex flex-col gap-1">
                <h2 className="text-lg ml-2 font-normal text-gray-600 text-start w-full">Bebidas</h2>
                <RenderCardsOptions foods={foods} />
              </div>
            </div>
          </div>
        </section>
      </article>
    </main>
  )
}