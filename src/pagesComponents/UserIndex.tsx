"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FilterHeader from "@/src/components/Index/sections/FilterHeader";
import SearchModal from "@/src/components/modals/SearchModal";
import ShareDishModal from "@/src/components/modals/ShareDishModal";
import AdminOffers from "@/src/components/user_index/AdminOffers";
import AdminFoodCatalog from "@/src/components/user_index/AdminFoodCatalog";
import AddDishButton from "@/src/components/user_index/AddDishButton";

export default function UserIndex({ foods, user, template, initialAnimateLogin }: any) {
  const [filteredFoods, setFilteredFoods] = useState(foods);
  const [showModal, setShowModal] = useState(false);
  const [sharingFood, setSharingFood] = useState<any>(null);
  const [revealPhase, setRevealPhase] = useState<"spinner" | "expand" | "done">(() => {
    return initialAnimateLogin ? "spinner" : "done";
  });

  useEffect(() => {
    // Si viene con ?login=1, limpiamos el parámetro de la URL silenciosamente
    if (typeof window !== "undefined" && window.location.search.includes("login=1")) {
      const params = new URLSearchParams(window.location.search);
      params.delete("login");
      const newQuery = params.toString();
      window.history.replaceState(null, "", window.location.pathname + (newQuery ? `?${newQuery}` : ""));
    }

    try {
      if (sessionStorage.getItem("justLoggedIn") === "true") {
        sessionStorage.removeItem("justLoggedIn");
        setRevealPhase("spinner");
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Listen to the 'share-dish' and 'open-search-modal' events
  useEffect(() => {
    const handleShareEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      setSharingFood(customEvent.detail);
    };
    const handleOpenSearchEvent = () => {
      setShowModal(true);
    };
    document.addEventListener("share-dish", handleShareEvent);
    document.addEventListener("open-search-modal", handleOpenSearchEvent);
    return () => {
      document.removeEventListener("share-dish", handleShareEvent);
      document.removeEventListener("open-search-modal", handleOpenSearchEvent);
    };
  }, []);

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
      {revealPhase !== "done" && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-200 pointer-events-none overflow-hidden"
        >
          {revealPhase === "spinner" && (
            <div className="absolute inset-0 bg-[#fffbf8] flex items-center justify-center">
              <motion.div
                initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
                animate={{
                  rotate: 360,
                  scale: [0.8, 1.05, 1],
                  opacity: 1,
                }}
                transition={{
                  duration: 0.75,
                  ease: [0.4, 0, 0.2, 1],
                }}
                onAnimationComplete={() => setRevealPhase("expand")}
                className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-primary"
              />
            </div>
          )}

          {revealPhase === "expand" && (
            <motion.div
              initial={{ width: "3rem", height: "3rem", opacity: 1 }}
              animate={{
                width: ["3rem", "4.5rem", "250vmax"],
                height: ["3rem", "4.5rem", "250vmax"],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 1.0,
                times: [0, 0.15, 1],
                ease: ["easeOut", [0.22, 1, 0.36, 1]],
                opacity: {
                  duration: 1.0,
                  times: [0, 0.75, 1],
                  ease: "easeOut",
                },
              }}
              onAnimationComplete={() => setRevealPhase("done")}
              style={{
                boxShadow: "0 0 0 250vmax #fffbf8",
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-primary"
            />
          )}
        </div>
      )}

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
        restaurantName={user.name}
        restaurantSlug={user.name}
        template={template}
      />

      <article className="flex min-h-[calc(90vh-100px)] flex-col gap-3 sm:px-[10vw] md:px-[20vw] lg:px-[30vw] md:pb-8 md:pt-3 -translate-y-10">
        <FilterHeader
          foods={filteredFoods}
          onSearch={handleSearch}
          onOpenModal={() => setShowModal(true)}
          template={template}
        />

        <AddDishButton template={template} />
        {user.plan !== "free" && <AdminOffers foods={foods} template={template} />}
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
