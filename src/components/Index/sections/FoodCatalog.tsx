import React, { useState } from "react";
import Categories from "@/src/components/Categories";
import SortPriceButton from "@/src/components/Index/filters/SortPrice";
import CardsFoodsByCategories from "@/src/components/Index/sections/CardsFoodsByCategories";
import RenderCardsOptions from "@/src/components/RenderCardsOptions";
import { Utensils, Martini, Dessert } from "lucide-react";

export default function FoodCatalog({ allFoods, initialSubCategories, user, template, example }: any) {
    const [displayFoods, setDisplayFoods] = useState(allFoods);

    const handleSort = (order: "asc" | "desc") => {
        const sorted = [...displayFoods].sort((a, b) =>
            order === "asc" ? a.price - b.price : b.price - a.price
        );
        setDisplayFoods(sorted);
    };
    return (
        <section aria-label="Lista de Platos" className="flex flex-col gap-1">
            <div className="flex flex-col gap-10">
                {allFoods.filter((f: any) => f.category === "Bebidas").length > 0 &&
                    <div className="flex flex-col gap-2">
                        <div className={`flex ml-2 items-center gap-1 ${template?.textColorOpacity || "text-gray-700/50"}`}>
                            <h2 className="text-xl font-normal">Bebidas</h2>
                            <Martini className="w-5 h-5" />
                        </div>
                        <RenderCardsOptions example={example} template={template} foods={allFoods.filter((f: any) => f.category === "Bebidas")} />
                    </div>
                }

                {allFoods.length > 0 ? <div className="flex flex-col gap-2">
                    <div className={`flex ml-2 items-center gap-2 ${template?.textColorOpacity || "text-gray-700/50"}`}>
                        <h2 className="text-xl font-normal">Platos</h2>
                        <Utensils className="w-5 h-5" />
                    </div>

                    <div className="flex justify-between items-end mb-1">
                        <Categories
                            template={template}
                            foods={allFoods}
                            categoriesFoods={initialSubCategories}
                            selectCategory={(sub: string) => {
                                const res = sub === "0" ? allFoods : allFoods.filter((f: any) => f.sub_category === sub);
                                setDisplayFoods(res);
                            }}
                        />
                        <SortPriceButton onSortChange={handleSort} template={template} />
                    </div>

                    <CardsFoodsByCategories example={example} template={template} arrayFoods={displayFoods} />
                </div> :
                    <>
                        <div className="flex w-full items-center pt-20 justify-center h-full">
                            <div className="text-center flex flex-col gap-y-2 h-fit opacity-40">
                                <span className="text-[8rem]">🍳</span>
                                <p className={`text-lg font-medium ${template?.textColor || "text-gray-700"}`}>Aún se está cocinando...</p>
                            </div>
                        </div>
                    </>
                }
                {allFoods.filter((f: any) => f.category === "Postres").length > 0 &&
                    <div className="flex flex-col gap-2">
                        <div className={`flex ml-2 items-center gap-1 ${template?.textColorOpacity || "text-gray-700/50"}`}>
                            <h2 className="text-xl font-normal">Postres</h2>
                            <Dessert className="w-5 h-5" />
                        </div>
                        <RenderCardsOptions example={example} template={template} foods={allFoods.filter((f: any) => f.category === "Postres")} />
                    </div>
                }
            </div>
        </section>
    );
}