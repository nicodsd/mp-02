"use client";
import React, { useState } from "react";
import FilterHeader from "@/src/components/Index/sections/FilterHeader";
import SearchModal from "@/src/components/modals/SearchModal";
import AdminOffers from "@/src/components/user_index/AdminOffers";
import AdminFoodCatalog from "@/src/components/user_index/AdminFoodCatalog";
import AddDishButton from "@/src/components/user_index/AddDishButton";

export default function UserIndex({ foods, initialSubCategories, user }: any) {
  const [filteredFoods, setFilteredFoods] = useState(foods);
  const [showModal, setShowModal] = useState(false);

  const handleSearch = (query: string) => {
    if (query.length > 1) {
      const result = foods.filter((f: any) =>
        f.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFoods(result);
    } else {
      setFilteredFoods(foods);
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

        <section className="flex flex-col gap-3">
          <AdminOffers foods={foods} />
        </section>

        <section className="flex h-fit flex-col gap-2 pt-4 pb-10">

          <AdminFoodCatalog
            foods={foods}
            initialSubCategories={initialSubCategories}
            user={user}
          />
          <AddDishButton />
        </section>
      </article>
    </main>
  );
}