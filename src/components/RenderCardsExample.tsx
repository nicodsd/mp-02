"use client";
import React, { useState, useEffect, useRef } from "react";
import FoodsCardsExample from "@/src/components/foods_cards/FoodsCardsExample";
import Loading from "@/src/skeleton/Loading";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import EditFoodModal from "@/src/components/modals/EditFoodModal";
import { refreshPage } from "@/app/actions";
import { useFoodStore } from "@/src/lib/useFoodStore";

type RenderCardsProps = {
  foods: any[];
  count?: number;
  context?: boolean;
};

export default function RenderCards({
  foods: initialFoods,
  count,
  context,
}: RenderCardsProps) {
  const router = useRouter();
  const URI = process.env.NEXT_PUBLIC_API_URL;
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [undoToast, setUndoToast] = useState<{
    show: boolean;
    food: any;
  } | null>(null);
  const { foods, setFoods, removeFoodLocal } = useFoodStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const foodsFilteredByCategory = foods.map((food) => food.category);

  const foodsFilteredByDrinks = foods.filter(
    (food) => food.category === "Bebidas",
  );
  const foodsFilteredByEntradas = foods.filter(
    (food) => food.category === "Entradas",
  );
  const foodsFilteredByPlatos = foods.filter(
    (food) => food.category === "Comidas",
  );
  const foodsFilteredByPostres = foods.filter(
    (food) => food.category === "Postres",
  );

  const platos: any = [];
  platos.push([...foodsFilteredByEntradas, ...foodsFilteredByPlatos]);

  useEffect(() => {
    if (initialFoods) setFoods(initialFoods);
  }, [initialFoods, setFoods]);

  const handleEditClick = (food: any) => {
    setSelectedFood(food);
    setIsEditOpen(true);
  };

  const handleDelete = (food: any) => {
    removeFoodLocal(food._id);
    setUndoToast({ show: true, food });

    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${URI}foods/delete/${food._id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          await refreshPage();
          setUndoToast(null);
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }, 3000);
  };

  const handleUndo = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      setFoods([...foods, undoToast?.food]);
      setUndoToast(null);
    }
  };
  return (
    <div className="w-full flex flex-col gap-1 h-full overflow-y-scroll">
      {foods.length === 0 ? (
        <Loading count={count ?? 4} />
      ) : (
        platos[0].map((food: any) => (
          <div
            key={food._id}
            className={`flex justify-between items-center rounded-xl bg-background ${context ? "border-l border-t border-b border-gray-200 rounded-2xl overflow-hidden min-h-34 h-fit" : ""}`}
          >
            <div
              className={`w-full ${context ? "border-l border-t border-b border-gray-200 rounded-l-2xl overflow-hidden h-full" : ""}`}
            >
              <FoodsCardsExample {...food} context={context} />
            </div>

            {context && (
              <div className="flex flex-col items-center justify-center px-4 h-full border-y border-r border-gray-200 rounded-r-2xl  gap-4">
                <button
                  onClick={() => handleEditClick(food)}
                  className="flex items-center gap-2 bg-white border border-gray-300 px-2.5 py-2 rounded-lg text-xs font-bold hover:bg-gray-900 hover:text-white transition-all"
                >
                  <FaEdit size={14} /> Editar
                </button>
                <button
                  onClick={() => handleDelete(food)}
                  className="text-xs font-bold text-red-500 hover:text-red-700 px-2 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        ))
      )}
      {undoToast?.show && (
        <div className="fixed bottom-2 inset-x-0 mx-auto z-100 w-[92%] max-w-125 animate__animated animate__fadeInRight">
          <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-white/10">
            <div className="flex flex-col flex-1 min-w-0">
              <p className="text-[13px] sm:text-sm font-medium leading-tight truncate">
                Eliminaste{" "}
                <span className="font-bold text-primary">
                  {undoToast.food.name}
                </span>
              </p>
              <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
                Se borrará en 3 segundos...
              </p>
            </div>

            <button
              onClick={handleUndo}
              className="shrink-0 bg-white text-black px-4 py-2 rounded-xl text-[11px] font-black uppercase hover:bg-gray-200 transition-all active:scale-95 shadow-lg"
            >
              Deshacer
            </button>
          </div>
        </div>
      )}

      {selectedFood && (
        <EditFoodModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          food={selectedFood}
          onUpdate={() => router.refresh()}
        />
      )}
    </div>
  );
}
