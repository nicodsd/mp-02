"use client"
import FoodsCardsExample from "@/src/components/Index/foods_cards/FoodsCardsExample";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion"
import { FaEdit } from "react-icons/fa";
import EditFoodModal from "@/src/components/modals/EditFoodModal";
import { refreshPage } from "@/app/actions";

export default function ListCardsByCategory({ arrayFoods, example, template }: { arrayFoods: any, example: boolean, template: any }) {
    const [selectedFood, setSelectedFood] = useState<any>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const groupedFoods = useMemo(() => {
        return Array.isArray(arrayFoods)
            ? arrayFoods.reduce((acc: Record<string, any[]>, food: any) => {
                const category = food.sub_category || "Otros";
                if (!acc[category]) acc[category] = [];
                acc[category].push(food)
                acc[category].sort((a: any, b: any) => a.name.localeCompare(b.name));
                return acc;
            }, {})
            : {};
    }, [arrayFoods]);
    const handleEditClick = (food: any) => {
        setSelectedFood(food);
        setIsEditOpen(true);
    };
    return (
        <section className="flex min-h-full flex-col gap-8 md:mx-[12vw] md:pb-8 md:pt-3 lg:mx-[27vw]">
            <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-">
                    {Object.entries(groupedFoods).map(([category, foods]: [string, any], index: number) => (
                        <motion.details
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.3 }}
                            key={category} className={`group flex rounded-lg text-gray-600 flex-col border ${template?.border || "border-gray-200"} mb-1 ${template?.backgroundColor2 || "bg-white"}`}>
                            <summary className={`text-lg font-semibold p-4 uppercase cursor-pointer list-none flex justify-between items-center ${template?.textColor || "text-gray-700"}`}>
                                {category}
                                <span className="transition duration-300 group-open:-rotate-180">
                                    <ChevronDown
                                        className={`${template?.icons || "text-gray-700"}`}
                                        size={24}
                                    />
                                </span>
                            </summary>
                            <div className="flex flex-col gap-0.5">
                                {Array.isArray(foods) && foods.map((food: any, index: number) => (
                                    <div className="relative" key={index}>
                                        <FoodsCardsExample list={true} example={example} whatsapp={false} {...food} template={template} context={false} edit={handleEditClick} />
                                        {
                                            !example && (
                                                <button
                                                    onClick={() => handleEditClick(food)}
                                                    className={`
                                                    ${template?.backgroundColor2} ${template?.icons}
                                                    w-fit h-fit text-lg p-2.5 ml-2 absolute top-2 right-2 z-30 active:scale-70 active:opacity-80 transition-transform duration-300 rounded-full flex items-center justify-center`}
                                                >
                                                    <FaEdit />
                                                </button>
                                            )
                                        }
                                    </div>
                                ))}
                            </div>
                        </motion.details>
                    ))}
                </div>
            </div>
            {selectedFood && (
                <EditFoodModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    food={selectedFood}
                    onUpdate={() => refreshPage()}
                />
            )}
        </section>
    )
}