import React, { useState, useTransition } from "react";
import Categories from "@/src/components/Categories";
import SortPriceButton from "@/src/components/Index/filters/SortPrice";
import CardsFoodsByCategories from "@/src/components/Index/sections/CardsFoodsByCategories";
import RenderCardsOptions from "@/src/components/RenderCardsOptions";
import { Utensils, Martini, Dessert } from "lucide-react";

export default function FoodCatalog({ allFoods, initialSubCategories, user }: any) {
    const [displayFoods, setDisplayFoods] = useState(allFoods);
    const [isPending, startTransition] = useTransition();
    //const [selectedCategory, setSelectedCategory] = useState("");

    /*   const handleCategoryClick = (category: string) => {
          if (selectedCategory === category || category === "0") {
              setSelectedCategory("0");
              setDisplayFoods(allFoods);
              setSubCategories(initialSubCategories);
              return;
          }
  
          setSelectedCategory(category);
          const filtered = allFoods.filter((f: any) => f.category === category);
          setDisplayFoods(filtered);
  
          const nextSubCats = initialSubCategories.filter((sub: any) =>
              filtered.some((f: any) => f.sub_category === sub.name)
          );
          setSubCategories(nextSubCats);
      }; */

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
                        <div className="flex ml-2 items-center gap-1 text-gray-600">
                            <h2 className="text-xl font-normal">Bebidas</h2>
                            <Martini className="w-5 h-5" />
                        </div>
                        <RenderCardsOptions foods={allFoods.filter((f: any) => f.category === "Bebidas")} />
                    </div>
                }

                <div className="flex flex-col gap-2">
                    <div className="flex ml-2 items-center gap-2 text-gray-600">
                        <h2 className="text-xl font-normal">Platos</h2>
                        <Utensils className="w-5 h-5" />
                    </div>

                    <div className="flex justify-between items-end mb-1">
                        <Categories
                            foods={allFoods}
                            categoriesFoods={initialSubCategories}
                            selectCategory={(sub: string) => {
                                const res = sub === "0" ? allFoods : allFoods.filter((f: any) => f.sub_category === sub);
                                setDisplayFoods(res);
                            }}
                        />
                        <SortPriceButton onSortChange={handleSort} />
                    </div>

                    <CardsFoodsByCategories arrayFoods={displayFoods} />
                </div>
                {allFoods.filter((f: any) => f.category === "Postres").length > 0 &&
                    <div className="flex flex-col gap-2">
                        <div className="flex ml-2 items-center gap-1 text-gray-600">
                            <h2 className="text-xl font-normal">Postres</h2>
                            <Dessert className="w-5 h-5" />
                        </div>
                        <RenderCardsOptions foods={allFoods.filter((f: any) => f.category === "Postres")} />
                    </div>
                }
            </div>
        </section>
    );
}