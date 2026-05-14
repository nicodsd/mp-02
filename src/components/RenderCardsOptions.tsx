"use client";
import FoodsCardsOptions from "@/src/components/Index/foods_cards/FoodsCardsOptions";
import Loading from "@/src/skeleton/Loading";
import EditFoodModal from "@/src/components/modals/EditFoodModal";
import { refreshPage } from "@/app/actions";
import { useState } from "react";
import { FaEdit, FaArchive } from "react-icons/fa";
type RenderCardsProps = {
  foods: any[];
  count?: number;
  context?: boolean;
  template?: any;
  example?: boolean;
};

export default function RenderCardsOptions({
  foods,
  count,
  context,
  template,
  example,
}: RenderCardsProps) {
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleEditClick = (food: any) => {
    setSelectedFood(food);
    setIsEditOpen(true);
  };
  return (
    <>
      <EditFoodModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        food={selectedFood}
        onUpdate={() => refreshPage()}
      />
      <div className={`w-full flex justify-start overflow-x-auto no-scrollbar p-0.5 rounded-xl ${template?.backgroundColor2 || "bg-background-2"}`}>
        {foods.length === 0 ? (
          <Loading count={count ?? 6} template={template} />
        ) : (
          foods.map((food: any) => (
            <div
              key={food._id}
              className={`rounded-lg relative`}
            >
              {
                !example && food.is_archived && (
                  <div className={`absolute top-0 left-0 w-full h-full text-2xl px-3 py-3 rounded-lg z-20 flex-col font-bold flex items-center justify-center gap-1 ${context ? "text-gray-700" : `${template?.textColor} bg-slate-400/60`}`}>
                    <FaArchive />
                    <span className="text-sm text-center">Este plato no será visible</span>
                  </div>
                )
              }
              <FoodsCardsOptions
                template={template}
                food={food}
                context={context}
                example={example}
              />
              {
                !context && !example && (
                  <button
                    onClick={() => handleEditClick(food)}
                    className={`absolute bottom-2 right-2 z-40 w-fit h-fit text-lg p-2.5 ml-2 active:scale-70 shadow-lg active:opacity-80 transition-transform duration-300 ${template?.icons} ${template?.backgroundColor2} rounded-full flex items-center justify-center`}
                  >
                    <FaEdit />
                  </button>
                )
              }
            </div>
          ))
        )}
      </div>
    </>
  );
}
