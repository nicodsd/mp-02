"use client";
import React, { useState } from "react";
import foodsData from "@/src/data/foods-1.json";
import subCategoriesData from "@/src/data/sub_categories.json";
import FilterHeader from "@/src/components/Index/sections/FilterHeader";
import OffersSection from "@/src/components/Index/sections/OffersSection";
import FoodCatalog from "@/src/components/Index/sections/FoodCatalog";
import SearchModal from "@/src/components/modals/SearchModal";

export default function Inicio() {
  const [showModal, setShowModal] = useState(false);
  const [filteredFoods, setFilteredFoods] = useState(foodsData);
  const user = {}

  const handleSearch = (query: string) => {
    if (query.length > 1) {
      const result = foodsData.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));
      setFilteredFoods(result);
    } else {
      setFilteredFoods(foodsData);
    }
  };

  return (
    <main className="w-full relative p-3 md:p-0 md:py-6 h-full">
      <SearchModal
        arrayFoods={filteredFoods}
        setSearch={handleSearch}
        setShowModal={setShowModal}
        showModal={showModal}
      />

      <article className="flex min-h-[calc(90vh-100px)] flex-col gap-3 sm:px-[10vw] md:px-[20vw] lg:px-[30vw] md:pb-8 md:pt-3 -translate-y-10">

        <FilterHeader
          foods={filteredFoods}
          onSearch={handleSearch}
          onOpenModal={() => setShowModal(true)}
        />

        <section aria-label="Filtros e información" className="flex h-fit flex-col gap-8 pt-4">
          <OffersSection foods={foodsData} />

          <FoodCatalog
            allFoods={foodsData}
            initialSubCategories={subCategoriesData}
            user={user}
          />
        </section>

      </article>
    </main>
  );
}