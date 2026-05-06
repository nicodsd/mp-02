import React, { useState, useMemo } from "react";
import Categories from "@/src/components/Categories";
import SortPriceButton from "@/src/components/Index/filters/SortPrice";
import CardsFoodsByCategories from "@/src/components/Index/sections/CardsFoodsByCategories";
import RenderCardsOptions from "@/src/components/RenderCardsOptions";
import { Utensils, Martini, Dessert } from "lucide-react";

export default function FoodCatalog({ allFoods, template, example }: any) {
    const [selectedSubCategory, setSelectedSubCategory] = useState("0");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

    const processedFoods = useMemo(() => {
        let base = [...allFoods];
        if (sortOrder) {
            base.sort((a, b) =>
                sortOrder === "asc" ? a.price - b.price : b.price - a.price
            );
        }
        return base;
    }, [allFoods, sortOrder]);

    if (allFoods?.length === 0) return null;

    return (
        <section aria-label="Lista de Platos" className="flex flex-col gap-1">
            <div className="flex flex-col gap-10">

                {/* BEBIDAS */}
                {processedFoods.some(f => f.sub_category === "Bebidas") && (
                    <div className="flex flex-col gap-1">
                        <div className={`flex ml-2 items-center gap-1 ${template?.textColorOpacity || "text-gray-700/50"}`}>
                            <h2 className="text-xl font-normal">Bebidas</h2>
                            <Martini className="w-5 h-5" />
                        </div>
                        <RenderCardsOptions
                            example={example}
                            template={template}
                            context={true}
                            foods={processedFoods.filter(f => f.sub_category === "Bebidas")}
                        />
                    </div>
                )}

                {/* PLATOS PRINCIPALES */}
                <div className="flex flex-col gap-2">
                    <div className={`flex ml-2 items-center gap-2 ${template?.textColorOpacity || "text-gray-700/50"}`}>
                        <h2 className="text-xl font-normal">Platos</h2>
                        <Utensils className="w-5 h-5" />
                    </div>

                    <div className="flex justify-between items-end mb-1">
                        <Categories
                            template={template}
                            foods={allFoods}
                            selectCategory={(sub: string) => setSelectedSubCategory(sub)}
                        />
                        <SortPriceButton onSortChange={(order) => setSortOrder(order)} template={template} />
                    </div>

                    <CardsFoodsByCategories
                        example={example}
                        template={template}
                        arrayFoods={processedFoods.filter(f => {
                            const isMain = f.sub_category !== "Bebidas" && f.sub_category !== "Postres";
                            return selectedSubCategory === "0" ? isMain : (isMain && f.sub_category === selectedSubCategory);
                        })}
                    />
                </div>

                {/* POSTRES */}
                {processedFoods.some(f => f.sub_category === "Postres") && (
                    <div className="flex flex-col gap-1">
                        <div className={`flex ml-2 items-center gap-1 ${template?.textColorOpacity || "text-gray-700/50"}`}>
                            <h2 className="text-xl font-normal">Postres</h2>
                            <Dessert className="w-5 h-5" />
                        </div>
                        <RenderCardsOptions
                            example={example}
                            template={template}
                            foods={processedFoods.filter(f => f.sub_category === "Postres")}
                        />
                    </div>
                )}
            </div>
        </section>
    );
}