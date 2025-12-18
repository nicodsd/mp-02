"use client";
import React, { useState } from "react";
import foods from "@/src/data/foods-1.json";
import categoriesData from "@/src/data/categories.json";
import FoodsOptions from "@/src/components/Index/filters/FoodsOptions";
import Categories from "@/src/components/Categories";
import MenuCard from "@/src/components/Cards";
import PromoDay from "@/src/components/PromoDay";
import Search from "@/src/components/Index/filters/Search";
import SortPriceButton from "../components/Index/filters/SortPrice";
type Food = {
  _id: string | number;
  photo: string;
  name: string;
  description: string;
  price: number
  category: string;
};
export default function Inicio() {
  const [arrayFoods, setarrayFoods] = useState<Food[]>(foods);
  function setCats(category: string) {
    if (category.length > 1) {
      const result = foods.filter((food) => food.category === category);
      setarrayFoods(result);
    } else if (category === "0") {
      setarrayFoods(foods);
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
          <PromoDay />
        </section>
        <section className="flex h-full flex-col gap-0.5 md:px- md:pb-8 md:pt-3 md:shadow md:mx-[25vh] md:rounded-b-2xl">
          <FoodsOptions />
          <Search arrayFoods={arrayFoods} setSearch={setSearch} />
          <div className="flex justify-between items-center mt-4">
            <Categories categories={categoriesData} selectCategory={setCats} />
            <SortPriceButton onSortChange={setSortOrder} />
          </div>
          <MenuCard foods={arrayFoods} />
        </section>
      </div>
    </div>
  );
}