"use client";
import React, { useState } from "react";
import categoriesData from "@/src/data/categories.json";
import subCategoriesData from "@/src/data/sub_categories.json";
import Categories from "@/src/components/Categories";
import FoodsOptions from "@/src/components/Index/filters/FoodsOptions";
import SearchModal from "@/src/components/modals/SearchModal";
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
export default function Menu({ data }: { data: any }) {
  const [arrayFoods, setArrayFoods] = useState<Food[]>(data.foods);
  const [showModal, setShowModal] = useState(false);
  const [subCategories, setSubCategories] = useState<SubCategory[]>(
    data.categories,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const availableCategories = categoriesData.filter((option) =>
    data.foods.some(
      (food: { category: string }) =>
        food.category.toLowerCase() === option.name.toLowerCase(),
    ),
  );

  // 🔹 Manejo de categorías
  function handleCategoryClick(category: string) {
    // Si vuelvo a presionar la misma categoría, reinicio todo
    if (selectedCategory === category) {
      setSelectedCategory("0"); // reinicio selección
      setArrayFoods(data.foods); // muestro todos los platos
      setSubCategories(data.categories); // muestro todas las subcategorías
      return;
    }

    setSelectedCategory(category);

    if (category === "0") {
      // Mostrar todos los platos y todas las subcategorías
      setArrayFoods(data.foods);
      setSubCategories(data.categories);
    } else {
      // Filtrar platos por categoría
      const filteredFoods = data.foods.filter(
        (food: { category: string }) =>
          food.category.toLowerCase() === category.toLowerCase(),
      );
      setArrayFoods(filteredFoods);

      // Filtrar subcategorías en base a los platos filtrados
      const filteredSubCategories = subCategoriesData.filter((subCat) =>
        filteredFoods.some(
          (food: { sub_category: string }) => food.sub_category === subCat.name,
        ),
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
          ? data.foods.filter(
            (food: { category: string }) =>
              food.category.toLowerCase() === selectedCategory.toLowerCase(),
          )
          : data.foods;
      setArrayFoods(filteredFoods);
    } else {
      // Filtrar platos por subcategoría dentro de la categoría seleccionada
      if (selectedCategory === "0") {
        const filteredFoods = data.foods.filter(
          (food: { sub_category: string }) =>
            food.sub_category.toLowerCase() === subCategory.toLowerCase(),
        );
        setArrayFoods(filteredFoods);
      } else {
        const filteredFoods = data.foods.filter(
          (food: { sub_category: string }) =>
            food.sub_category.toLowerCase() === subCategory.toLowerCase(),
        );
        setArrayFoods(filteredFoods);
      }
    }
  }

  function setSortOrder(order: "asc" | "desc") {
    const sorted = [...arrayFoods].sort((a, b) =>
      order === "asc" ? a.price - b.price : b.price - a.price,
    );
    setArrayFoods(sorted);
  }

  function setSearch(query: string) {
    if (query.length > 1) {
      const result = data.foods.filter((food: { name: string }) =>
        food.name.toLowerCase().includes(query.toLowerCase()),
      );
      setArrayFoods(result);
    } else {
      setArrayFoods(data.foods);
    }
  }

  return (
    <main className="w-full relative p-3 md:p-0 md:px-10 md:py-6 h-full">
      <SearchModal template={data.template} arrayFoods={arrayFoods} setSearch={setSearch} setShowModal={setShowModal} showModal={showModal} />
      <section
        className={`flex min-h-[calc(90vh-100px)] flex-col ${arrayFoods.length >= 2 ? "gap-5" : "gap-4"} md:mx-[12vw] md:pb-8 md:pt-3 lg:mx-[27vw] -translate-y-10`}
      >
        <div className="bg-background rounded-2xl px-2 py-2 w-full shadow-md sticky top-13 z-20">
          <Search arrayFoods={arrayFoods} setSearch={setSearch} setShowModal={setShowModal} />
        </div>
        <div className="flex flex-col gap-3">
          {/* <div className="flex flex-col gap-1">
            {arrayFoods.length >= 2 && promoday && (
              <>
                <h2 className="text-lg ml-2 font-normal text-gray-600 text-start w-full">
                  Promociones
                </h2>
                <PromoDay promo={promoday} />
              </>
            )}
          </div> */}
          {availableCategories.length > 2 && arrayFoods.length >= 10 && (
            <div className="flex flex-col gap-1">
              <h2 className="text-lg ml-2 font-normal text-gray-600 text-start w-full">
                Categorias
              </h2>
              <FoodsOptions
                selectedCategory={selectedCategory}
                handleCategoryClick={handleCategoryClick}
                availableCategories={availableCategories}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg ml-2 font-normal text-gray-600 mb-1 text-start w-full">
            {arrayFoods.length > 1
              ? "¿Qué queres comer?"
              : `¡Hoy! Especialidad de la casa`}
          </h2>
          {arrayFoods.length > 5 ? (
            <>
              <div className="flex justify-between items-end">
                <Categories
                  foods={arrayFoods}
                  categoriesFoods={subCategories}
                  selectCategory={handleSubCategoryClick}
                />
                <SortPriceButton onSortChange={setSortOrder} />
              </div>
            </>
          ) : null}
          <div>
            <RenderCards foods={arrayFoods} count={4} context={false} />
          </div>
        </div>
      </section>
    </main>
  );
}
