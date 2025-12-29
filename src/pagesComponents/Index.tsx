"use client";
import React, { useState } from "react";
import foods from "@/src/data/foods-1.json";
import categoriesData from "@/src/data/categories.json";
import FoodsOptions from "@/src/components/Index/filters/FoodsOptions";
import Categories from "@/src/components/Categories";
import PromoDay from "@/src/components/PromoDay";
import Search from "@/src/components/Index/filters/Search";
import SortPriceButton from "../components/Index/filters/SortPrice";
import RenderCards from "../components/RenderCards";
type Food = {
  _id: string | number;
  photo: string;
  name: string;
  description: string;
  price: number
  category: string;
};
const background = "/images/placeholders/background.png";
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
    <div className="w-full p-3 md:p-0 md:px-10 bg-white md:py-6 h-full">
      <section className="flex flex-col">
        <Search arrayFoods={arrayFoods} setSearch={setSearch} />
      </section>
      <section className="flex min-h-[calc(90vh-100px)] mt-4 flex-col gap-8 md:mx-[12vw] md:pb-8 md:pt-3 lg:mx-[27vw]">
        <PromoDay />
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <Categories categories={categoriesData} selectCategory={setCats} />
            <SortPriceButton onSortChange={setSortOrder} />
          </div>
          <RenderCards foods={arrayFoods} count={4} context={false} />
        </div>
      </section>
    </div>
  );
}