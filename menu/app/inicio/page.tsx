'use client'
import { useState } from "react";
import NavBar from "@/src/layouts/NavBar";
import Categories from "@/src/components/Categories";
import MenuCard from "@/src/components/Cards";
import PromoDay from "@/src/components/PromoDay";
const homeState = false;
const nombre = "Menu App";

export default function Inicio({
  initialCategories,
  initialFoods,
}: {
  initialCategories: any[];
  initialFoods: any[];
}) {
  return (
    <>
      <div className="w-full asap h-auto">
        <NavBar state={homeState} text={nombre} />
        <div className="w-full p-[.6rem] h-full">
          <section className="flex flex-col">
            <PromoDay />
          </section>
          <section className="flex h-full flex-col gap-0.5">
            <Categories categories={initialCategories} />
            <MenuCard foods={initialFoods} />
          </section>
        </div>
      </div>
    </>
  );
}
