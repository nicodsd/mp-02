"use client";
import React, { useState, useTransition, useMemo } from "react";
import FoodsOptions from "@/src/components/Index/filters/FoodsOptions";
import CardsFoodsByCategories from "@/src/components/Index/sections/CardsFoodsByCategories";
import Search from "@/src/components/Index/filters/Search";
import categoriesData from "@/src/data/categories.json";
import Categories from "@/src/components/Categories";
import PromoDay from "@/src/components/PromoDay";
import SortPriceButton from "@/src/components/Index/filters/SortPrice";
import SearchModal from "@/src/components/modals/SearchModal";
import RenderCards from "@/src/components/RenderCardsExample";
import { FaPlus } from "react-icons/fa";
import ListCardsByCategory from "@/src/components/Index/sections/ListCardsByCategory";
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
export default function UserIndex({
  categories,
  foods,
  initialSubCategories,
  user,
  token,
}: {
  categories: any[];
  foods: any[];
  initialSubCategories: any[];
  user: any;
  token: string;
}) {
  const [arrayFoods, setarrayFoods] = useState<Food[]>(foods);
  const [showModal, setShowModal] = useState(false);
  const [subCategories, setSubCategories] =
    useState<SubCategory[]>(initialSubCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const availableCategories = useMemo(() =>
    categoriesData.filter((option) =>
      foods.some(
        (food) => food.category.toLowerCase() === option.name.toLowerCase(),
      ),
    ),
    [foods]);

  function handleCategoryClick(category: string) {
    if (selectedCategory === category) {
      startTransition(() => {
        setSelectedCategory("0");
        setarrayFoods(foods);
        setSubCategories(initialSubCategories);
      });
      return;
    }

    startTransition(() => {
      setSelectedCategory(category);

      if (category === "0") {
        setarrayFoods(foods);
        setSubCategories(initialSubCategories);
      } else {
        const filteredFoods = foods.filter(
          (food) => food.category.toLowerCase() === category.toLowerCase(),
        );
        setarrayFoods(filteredFoods);

        const filteredSubCategories = initialSubCategories.filter((subCat) =>
          filteredFoods.some((food) => food.sub_category === subCat.name),
        );
        setSubCategories(filteredSubCategories);
      }
    });
  }

  function handleSubCategoryClick(subCategory: string) {
    startTransition(() => {
      if (subCategory === "0") {
        const filteredFoods =
          selectedCategory && selectedCategory !== "0"
            ? foods.filter(
              (food) =>
                food.category.toLowerCase() === selectedCategory.toLowerCase(),
            )
            : foods;
        setarrayFoods(filteredFoods);
      } else {
        if (selectedCategory === "0") {
          const filteredFoods = foods.filter(
            (food) => food.sub_category === subCategory,
          );
          setarrayFoods(filteredFoods);
        } else {
          const filteredFoods = foods.filter(
            (food) =>
              food.sub_category.toLowerCase() === subCategory.toLowerCase(),
          );
          setarrayFoods(filteredFoods);
        }
      }
    });
  }

  function setSortOrder(order: "asc" | "desc") {
    startTransition(() => {
      const sorted = [...arrayFoods].sort((a, b) =>
        order === "asc" ? a.price - b.price : b.price - a.price,
      );
      setarrayFoods(sorted);
    });
  }

  function setSearch(query: string) {
    startTransition(() => {
      if (query.length > 1) {
        const result = foods.filter((food) =>
          food.name.toLowerCase().includes(query.toLowerCase()),
        );
        setarrayFoods(result);
      } else {
        setarrayFoods(foods);
      }
    });
  }
  return (
    <main className="w-full relative p-3 md:p-0 md:px-10 md:py-6 h-full">
      <SearchModal arrayFoods={arrayFoods} setSearch={setSearch} setShowModal={setShowModal} showModal={showModal} />
      <article className="flex min-h-[calc(90vh-100px)] flex-col gap-2 md:mx-[12vw] md:pb-8 md:pt-3 lg:mx-[27vw] -translate-y-10">
        <header className="bg-background rounded-2xl px-2 py-2 w-full shadow-md sticky top-13 z-20">
          <Search arrayFoods={arrayFoods} setSearch={setSearch} setShowModal={setShowModal} />
        </header>
        <section aria-label="Filtros e información" className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            {foods.some((food) => food.is_promo === true) &&
              <>
                <h2 className="text-lg ml-2 font-normal text-gray-600 text-start w-full">
                  Promociones
                </h2>
                <PromoDay foods={foods} />
              </>
            }
          </div>
          {availableCategories.length > 2 && arrayFoods.length >= 10 && (
            <nav aria-label="Categorías Principales" className="flex flex-col gap-1">
              <h2 className="text-lg ml-2 font-normal text-gray-600 text-start w-full">
                Categorias
              </h2>
              <FoodsOptions
                selectedCategory={selectedCategory}
                handleCategoryClick={handleCategoryClick}
                availableCategories={availableCategories}
              />
            </nav>
          )}
        </section>
        <section aria-label="Lista de Platos" className="flex flex-col gap-5">
          <div className="flex h-30 w-full flex-col justify-center items-center text-gray-800">
            <a
              href="/nuevo-plato"
              className="cursor-pointer flex flex-col items-center justify-center h-full w-full bg-lime-50 border-2 border-dashed border-lime-500 rounded-2xl hover:bg-lime-600 transition text-xl text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-lime-600 focus:ring-opacity-75 duration-200"
            >
              <FaPlus className="text-2xl mb-2" />
              Toca aquí para agregar
            </a>
          </div>
          <div className="flex flex-col gap-2 pb-20">
            <h2 className="text-lg ml-2 font-normal text-gray-600 text-start w-full">
              Tipos de platos
            </h2>
            {arrayFoods.length > 0
              && (user.plan === "premium"
                || user.plan === "plus")
              ? (
                <>
                  <div className="flex justify-between items-end">
                    <Categories
                      categories={subCategories}
                      selectCategory={handleSubCategoryClick}
                    />
                    <SortPriceButton onSortChange={setSortOrder} />
                  </div>
                </>
              ) : null}
            {arrayFoods.length > 0 ? (
              <CardsFoodsByCategories arrayFoods={arrayFoods} />
            ) : null}

          </div>
        </section>
      </article>
    </main>
  );
}