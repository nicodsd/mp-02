"use client";
import React, { useState, useEffect, useRef } from "react";
import FoodsCardsExample from "@/src/components/Index/foods_cards/FoodsCardsExample";
import Loading from "@/src/skeleton/Loading";
import { FaEdit, FaTrash } from "react-icons/fa";
import { URI } from "@/src/lib/const";
import EditFoodModal from "@/src/components/modals/EditFoodModal";
import { refreshPage } from "@/app/actions";
import { useFoodStore } from "@/src/lib/useFoodStore";
import { useCartStore } from "@/src/lib/useCartStore";

type RenderCardsProps = {
  foods: any[];
  count?: number;
  context?: boolean;
  template?: any;
};

export default function RenderCards({ foods: initialFoods, count, context, template }: RenderCardsProps) {
  const { foods, setFoods, removeFoodLocal } = useFoodStore();

  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [undoToast, setUndoToast] = useState<{ show: boolean; food: any } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  //const platos = foods.filter(f => f.category !== "Bebidas" && f.category !== "Postres");

  useEffect(() => {
    if (initialFoods) setFoods(initialFoods);
  }, [initialFoods, setFoods]);

  useCartStore();

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
    <div className="w-full flex flex-col h-full rounded-lg overflow-y-auto">
      {foods.length === 0 ? (
        <Loading count={count ?? 4} />
      ) : (
        foods.map((food: any) => (
          <div
            key={food._id}
            className={`flex justify-between items-center rounded-xl transition-shadow
              ${template?.primaryColor} 
              ${context ? "border border-gray-200 overflow-hidden min-h-34 h-fit" : ""
              }`}
          >
            <div className="w-full h-full">
              <FoodsCardsExample {...food} />
            </div>
            {context && (
              <div className="flex flex-col items-center justify-center px-4 h-full border-l border-gray-100 bg-gray-50/50 gap-4 min-w-[100px]">
                <button
                  onClick={() => handleEditClick(food)}
                  className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded-lg text-xs font-bold hover:bg-gray-900 hover:text-white transition-all"
                >
                  <FaEdit size={14} /> Editar
                </button>
                <button
                  onClick={() => handleDelete(food)}
                  className="text-xs font-bold text-red-500 hover:text-red-700 px-2 transition-colors flex items-center gap-1"
                >
                  <FaTrash size={12} /> Eliminar
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {undoToast?.show && (
        <div className="fixed bottom-6 inset-x-0 mx-auto z-100 w-[94%] max-w-md animate__animated animate__fadeInUp">
          <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-white/10">
            <div className="flex flex-col flex-1">
              <p className="text-sm font-medium">
                Eliminaste <span className="text-yellow-400 font-bold">{undoToast.food.name}</span>
              </p>
              <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Se borrará en 3 segundos...</p>
            </div>
            <button
              onClick={handleUndo}
              className="bg-white text-black px-4 py-2 rounded-xl text-xs font-black uppercase hover:bg-gray-200 active:scale-95 transition-all"
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
          onUpdate={() => refreshPage()}
        />
      )}
    </div>
  );
}