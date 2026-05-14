"use client";
import React, { useState } from "react";
import FilterHeader from "@/src/components/Index/sections/FilterHeader";
import SearchModal from "@/src/components/modals/SearchModal";
import AdminOffers from "@/src/components/user_index/AdminOffers";
import AdminFoodCatalog from "@/src/components/user_index/AdminFoodCatalog";
import AddDishButton from "@/src/components/user_index/AddDishButton";

export default function UserIndex({ foods, user, template }: any) {
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
    <main className={`w-full relative p-3 md:p-0 md:py-6 h-full ${template?.bgMenu || "bg-background"}`}>
      <SearchModal
        template={template}
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
          template={template}
        />

        <AddDishButton template={template} />
        <AdminOffers foods={foods} template={template} />
        <section aria-label="Filtros e información" className="flex h-fit flex-col gap-2 pt-4 pb-10">

          <AdminFoodCatalog
            foods={foods}
            user={user}
            template={template}
          />
        </section>
      </article>
    </main>
  );
}