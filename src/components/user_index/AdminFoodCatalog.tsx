import React, { useState, useTransition } from "react";
import Categories from "@/src/components/Categories";
import SortPriceButton from "@/src/components/Index/filters/SortPrice";
import RenderCardsOptions from "@/src/components/RenderCardsOptions";
import SortableContext from "@/src/components/user_index/user_sections/SortableContext";
import { Martini, Utensils } from "lucide-react";

export default function AdminFoodCatalog({ foods, initialSubCategories, user, template }: any) {
    const [displayFoods, setDisplayFoods] = useState(foods);
    const [isPending, startTransition] = useTransition();

    const handleSort = (order: "asc" | "desc") => {
        startTransition(() => {
            const sorted = [...displayFoods].sort((a, b) =>
                order === "asc" ? a.price - b.price : b.price - a.price
            );
            setDisplayFoods(sorted);
        });
    };

    const isPremium = user.plan === "premium" || user.plan === "plus";

    return (
        <section aria-label="Lista de Platos" className="flex flex-col gap-2 w-full">
            <div className="flex flex-col gap-10">
                {foods.filter((f: any) => f.sub_category === "bebidas").length > 0 &&
                    <div className="flex flex-col gap-2">
                        <div className={`flex ml-2 items-center gap-1 ${template?.textColor}`}>
                            <h2 className="text-xl font-normal">Bebidas</h2>
                            <Martini className="w-5 h-5" />
                        </div>
                        <RenderCardsOptions foods={foods} template={template} />
                    </div>
                }

                <div className="flex flex-col gap-1">
                    <div className={`flex ml-2 items-center gap-2 ${template?.textColor} mb-1`}>
                        <h2 className="text-xl font-normal">Platos</h2>
                        <Utensils className="w-5 h-5" />
                    </div>
                    {foods.length > 0 && isPremium && (
                        <div className="flex justify-between items-end mb-1">
                            <Categories
                                template={template}
                                foods={foods}
                                categoriesFoods={initialSubCategories}
                                selectCategory={(sub: string) => {
                                    const res = sub === "0" ? foods : foods.filter((f: any) => f.sub_category === sub);
                                    setDisplayFoods(res);
                                }}
                            />
                            <SortPriceButton onSortChange={handleSort} template={template} />
                        </div>
                    )}

                    {displayFoods.length > 0 ? (
                        <SortableContext arrayFoods={displayFoods} template={template} />
                    ) : (
                        <p className={`text-center ${template?.textColor} py-10`}>No hay platos que coincidan.</p>
                    )}
                </div>
                {foods.filter((f: any) => f.sub_category === "postres").length > 0 &&
                    <div className="flex flex-col gap-2">
                        <div className={`flex ml-2 items-center gap-1 ${template?.textColor}`}>
                            <h2 className="text-xl font-normal">Postres</h2>
                            <Martini className="w-5 h-5" />
                        </div>
                        <RenderCardsOptions foods={foods} template={template} />
                    </div>
                }
            </div>
        </section>
    );
}