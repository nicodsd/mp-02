"use client";
import React, { FormHTMLAttributes, useState, useEffect } from "react";
import Categories from "@/src/components/Categories";
import MenuCard from "@/src/components/Cards";
import PromoDay from "@/src/components/PromoDay";
export default function Inicio({
  initialCategories,
  initialFoods,
  buttonRefresh
}: {
  initialCategories: any[];
  initialFoods: any[];
  buttonRefresh: FormHTMLAttributes<HTMLFormElement>['action'];
}) {
  let [arrayFoods, setarrayFoods] = useState<any[]>(initialFoods);
  let result;
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
  useEffect(() => {
    if (buttonRefresh) {
      buttonRefresh();
    }
  }, [buttonRefresh]);
  return (
    <>
      <div className="w-full asap h-auto">
        <div className="w-full p-3 h-full">
          <section className="flex flex-col">
            <PromoDay />
          </section>
          <section className="flex h-full flex-col gap-0.5">
            <Categories
              categories={initialCategories}
              selectCategory={setCats}
            />
            <MenuCard foods={arrayFoods} />
          </section>
        </div>
      </div>
    </>
  );
}