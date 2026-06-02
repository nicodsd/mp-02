"use client";
import React, { useState, useEffect } from "react";
import SearchModal from "@/src/components/modals/SearchModal";
import FilterHeader from "@/src/components/Index/sections/FilterHeader";
import OffersSection from "@/src/components/Index/sections/OffersSection";
import FoodCatalog from "@/src/components/Index/sections/FoodCatalog";
import ShareDishModal from "@/src/components/modals/ShareDishModal";
import { URI } from "@/src/lib/const";

type Food = {
  _id: string | number;
  photo: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sub_category: string;
  is_gluten_free?: boolean;
  is_promo?: boolean;
  promo_price?: number;
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
  const [activeFoods, setActiveFoods] = useState(data.foods.filter((f: any) => f.is_archived !== true));
  const [showModal, setShowModal] = useState(false);
  const [filteredFoods, setFilteredFoods] = useState(activeFoods);
  const [sharingFood, setSharingFood] = useState<any>(null);

  // Auto-scroll and highlight shared dish
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const dishId = params.get("dish");
      if (dishId) {
        const timer = setTimeout(() => {
          const element = document.getElementById(`dish-${dishId}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            
            // Premium glowing outline effect
            const accentColor = template?.icons || "#e28743";
            element.style.outline = `3px solid ${accentColor}`;
            element.style.boxShadow = `0 0 25px ${accentColor}80`;
            element.style.transform = "scale(1.02)";
            
            setTimeout(() => {
              element.style.outline = "none";
              element.style.boxShadow = "none";
              element.style.transform = "none";
            }, 3500);
          }
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [template?.icons]);

  // Listen to the 'share-dish' event
  useEffect(() => {
    const handleShareEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      setSharingFood(customEvent.detail);
    };
    document.addEventListener("share-dish", handleShareEvent);
    return () => {
      document.removeEventListener("share-dish", handleShareEvent);
    };
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");

    if (!data._id) {
      const trackVisit = async () => {
        try {
          const response = await fetch(`${URI}/analytics/visit`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              user_id: data._id,
              user_url: data.name
            })
          });

          if (!response.ok) {
            console.error("Error al registrar visita:", await response.text());
          }
        } catch (error) {
          console.error("Error de red al registrar visita:", error);
        }
      };
      trackVisit();
    }

  }, [data._id, data.name]);

  const handleSearch = (query: string) => {
    if (query.length > 1) {
      const result = activeFoods.filter((f: any) => f.name.toLowerCase().includes(query.toLowerCase()));
      setFilteredFoods(result);
    } else {
      setFilteredFoods(activeFoods);
    }
  };

  return (
    <main className={`w-full ${template?.bgMenu || "bg-background"} relative p-3 md:p-0 md:py-6 h-full`}>
      <SearchModal
        template={template}
        arrayFoods={filteredFoods}
        setSearch={handleSearch}
        setShowModal={setShowModal}
        showModal={showModal}
      />

      <ShareDishModal
        isOpen={!!sharingFood}
        onClose={() => setSharingFood(null)}
        food={sharingFood}
        restaurantName={data.name}
        restaurantSlug={data.name}
        template={template}
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
            allFoods={activeFoods}
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
