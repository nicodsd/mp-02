"use client";
import React, { useState } from "react";
import SearchModal from "@/src/components/modals/SearchModal";
import FilterHeader from "@/src/components/Index/sections/FilterHeader";
import OffersSection from "@/src/components/Index/sections/OffersSection";
import FoodCatalog from "@/src/components/Index/sections/FoodCatalog";

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

type MenuProps = {
  _id: string | number;
  facebook: string;
  instagram: string;
  tiktok: string;
  phone: string;
  name: string;
  plan: string;
  description: string;
  template_id: string;
  foods: Food[];
  categories: SubCategory[];
};

export default function Menu({ data, template }: { data: MenuProps, template: any }) {
  const [showModal, setShowModal] = useState(false);
  const [filteredFoods, setFilteredFoods] = useState(data.foods);

  const handleSearch = (query: string) => {
    if (query.length > 1) {
      const result = data.foods.filter((f: any) => f.name.toLowerCase().includes(query.toLowerCase()));
      setFilteredFoods(result);
    } else {
      setFilteredFoods(data.foods);
    }
  };

  return (
    <main className={`w-full ${template?.backgroundColor || "bg-background"} relative p-3 md:p-0 md:py-6 h-full`}>
      <SearchModal
        template={template}
        arrayFoods={filteredFoods}
        setSearch={handleSearch}
        setShowModal={setShowModal}
        showModal={showModal}
      />

      <article className="flex min-h-[calc(90vh-100px)] flex-col gap-3 sm:px-[10vw] md:px-[20vw] lg:px-[30vw] md:pb-8 md:pt-3 -translate-y-10">
        <FilterHeader
          template={template}
          foods={filteredFoods}
          onSearch={handleSearch}
          onOpenModal={() => setShowModal(true)}
        />

        <OffersSection foods={data.foods} template={template} />

        <section aria-label="Filtros e información" className="flex h-fit flex-col gap-2 pt-4 pb-10">
          <FoodCatalog
            example={false}
            template={template}
            allFoods={data.foods}
            initialSubCategories={data.categories}
            user={data}
          />
        </section>

      </article>
    </main>
  );
}



{/* <h2 className="text-lg ml-2 font-normal text-gray-600 mb-1 text-start w-full">
  {arrayFoods.length > 1
    ? "¿Qué queres comer?"
    : `¡Hoy! Especialidad de la casa`}
</h2> */}
