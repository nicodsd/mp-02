import React, { useState } from "react";
import Image from "next/image";
import Categories from "@/src/components/Categories";
import SortPriceButton from "@/src/components/Index/filters/SortPrice";
import CardsFoodsByCategories from "@/src/components/Index/sections/CardsFoodsByCategories";
import RenderCardsOptions from "@/src/components/RenderCardsOptions";
import icons from "@/public/images/icons-index/iconExport";

export default function FoodCatalog({ allFoods, initialSubCategories }: any) {
    const [displayFoods, setDisplayFoods] = useState(allFoods);
    const [subCategories, setSubCategories] = useState(initialSubCategories);
    const [selectedCategory, setSelectedCategory] = useState("");

    const handleCategoryClick = (category: string) => {
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
    };

    const handleSort = (order: "asc" | "desc") => {
        const sorted = [...displayFoods].sort((a, b) =>
            order === "asc" ? a.price - b.price : b.price - a.price
        );
        setDisplayFoods(sorted);
    };

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <h2 className="text-xl ml-2 font-normal text-gray-600">Platos</h2>
                <Image src={icons.burga} alt="burga" width={24} height={24} className="w-6 h-6" />
            </div>

            <div className="flex justify-between items-end mb-4">
                <Categories
                    categories={subCategories}
                    selectCategory={(sub: string) => {
                        const res = sub === "0" ?
                            (selectedCategory ? allFoods.filter((f: any) => f.category === selectedCategory) : allFoods) :
                            allFoods.filter((f: any) => f.sub_category === sub);
                        setDisplayFoods(res);
                    }}
                />
                <SortPriceButton onSortChange={handleSort} />
            </div>

            <div className="flex flex-col gap-10">
                <CardsFoodsByCategories arrayFoods={displayFoods} />

                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl ml-2 font-normal text-gray-600">Bebidas</h2>
                        <Image src={icons.copa} alt="copa" width={24} height={24} className="w-6 h-6" />
                    </div>
                    <RenderCardsOptions foods={allFoods} />
                </div>
            </div>
        </div>
    );
}