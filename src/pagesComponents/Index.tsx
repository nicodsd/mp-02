"use client";
import React, { useState } from "react";
import foods from "@/src/data/foods-1.json";
import subCategoriesData from "@/src/data/sub_categories.json";
import categoriesData from "@/src/data/categories.json";
import FoodsOptions from "@/src/components/Index/filters/FoodsOptions";
import Categories from "@/src/components/Categories";
import PromoDay from "@/src/components/PromoDay";
import Search from "@/src/components/Index/filters/Search";
import SortPriceButton from "../components/Index/filters/SortPrice";
import RenderCards from "../components/RenderCardsExample";

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
  const [arrayFoods, setarrayFoods] = useState<Food[]>(foods);
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
      setarrayFoods(foods); // muestro todos los platos
      setSubCategories(subCategoriesData); // muestro todas las subcategorías
      return;
    }

    setSelectedCategory(category);

    if (category === "0") {
      // Mostrar todos los platos y todas las subcategorías
      setarrayFoods(foods);
      setSubCategories(subCategoriesData);
    } else {
      // Filtrar platos por categoría
      const filteredFoods = foods.filter((food) => food.category === category);
      setarrayFoods(filteredFoods);

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
      setarrayFoods(filteredFoods);
    } else {
      // Filtrar platos por subcategoría dentro de la categoría seleccionada
      const filteredFoods = foods.filter(
        (food) =>
          (selectedCategory === "0" || food.category === selectedCategory) &&
          food.sub_category === subCategory
      );
      setarrayFoods(filteredFoods);
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
    <div className="w-full p-3 md:p-0 md:px-10 bg-white md:py-6 h-full">
      <section className="flex min-h-[calc(90vh-100px)] flex-col gap-8 md:mx-[12vw] md:pb-8 md:pt-3 lg:mx-[27vw]">
        <PromoDay />
        <div className="flex flex-col gap-1">
          <Search arrayFoods={arrayFoods} setSearch={setSearch} />
          <FoodsOptions
            selectedCategory={selectedCategory}
            handleCategoryClick={handleCategoryClick}
            availableCategories={availableCategories}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <Categories categories={subCategories} selectCategory={handleSubCategoryClick} />
            <SortPriceButton onSortChange={setSortOrder} />
          </div>
          <RenderCards foods={arrayFoods} count={4} context={false} />
        </div>
      </section>
    </div>
  );
}