"use client";
import { useState } from "react";
import NavBar from "@/src/layouts/NavBar";
import Categories from "@/src/components/Categories";
import MenuCard from "@/src/components/Cards";
import PromoDay from "@/src/components/PromoDay";
const homeState = 0;
const nombre = "Menu App";

export default function Inicio({
  initialCategories,
  initialFoods,
  token,
}: {
  initialCategories: any[];
  initialFoods: any[];
  token: string;
}) {

  let [arrayFoods, setarrayFoods] = useState<any[]>(initialFoods);
  let result;
  token = token;
  console.log(token);

  function setCats(category: string) {
    arrayFoods = initialFoods;
    if (category.length > 1) {
      result = initialFoods.filter((food) => food.category === category);
      setarrayFoods(result);
      return arrayFoods;
    }
    if (category === "0") {
      setarrayFoods(initialFoods);
      return arrayFoods;
    }
  }

  return (
    <>
      <div className="w-full asap h-auto">
        <NavBar state={homeState} text={nombre} />
        <div className="w-full p-3 h-full">
          <section className="flex flex-col">
            <PromoDay />
          </section>
          <section className="flex h-full flex-col gap-0.5">
            <Categories
              categories={initialCategories}
              selectCategory={setCats}
            />
            <MenuCard foods={arrayFoods} categories={initialCategories} />
          </section>
        </div>
      </div>
    </>
  );
}
