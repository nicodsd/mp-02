"use client";
import React, { useState } from "react";
import foods from "@/src/data/foods/foods-1.json";
import categoriesData from "@/src/data/categories.json";
import Categories from "@/src/components/Categories";
import MenuCard from "@/src/components/Cards";
import PromoDay from "@/src/components/PromoDay";
export default function Inicio() {
  let [arrayFoods, setarrayFoods] = useState<any[]>([]);
  let result;
  function setCats(category: string) {
    arrayFoods = foods;
    if (category.length > 1) {
      result = foods.filter((food) => food.category === category);
      setarrayFoods(result);
      return arrayFoods;
    }
    if (category === "0") {
      setarrayFoods(foods);
      return arrayFoods;
    }
  }
  return (
    <>
      <div className="w-full asap h-auto">
        <div className="w-full p-3 h-full">
          <section className="flex flex-col">
            <PromoDay />
          </section>
          <section className="flex h-full flex-col gap-0.5">
            <Categories
              categories={categoriesData}
              selectCategory={setCats}
            />
            <MenuCard foods={arrayFoods} />
          </section>
        </div>
      </div>
    </>
  );
}