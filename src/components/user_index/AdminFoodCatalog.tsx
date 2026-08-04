import React, { useState, useTransition, useMemo } from "react";
import Categories from "@/src/components/Categories";
import SortPriceButton from "@/src/components/Index/filters/SortPrice";
import RenderCardsOptions from "@/src/components/RenderCardsOptions";
import ListCardsByCategory from "@/src/components/Index/sections/ListCardsByCategory";
import SortableContext from "@/src/components/user_index/user_sections/SortableContext";
//import DownloadMenuModal from "@/src/components/pdf/DownloadMenuModal";
import AddSectionCardsFoods from "./user_sections/AddSectionCardsFoods";
import { Dessert, Martini, Utensils } from "lucide-react";

export default function AdminFoodCatalog({ foods, user, template }: any) {
    const [selectedSubCategory, setSelectedSubCategory] = useState("0");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

    const processedFoods = useMemo(() => {
        let base = [...foods];
        if (sortOrder) {
            base.sort((a, b) =>
                sortOrder === "asc" ? a.price - b.price : b.price - a.price
            );
        }
        return base;
    }, [foods, sortOrder]);

    if (foods?.length === 0) return null;

    const isPremium = (user.plan === "premium" && user.mp_preapproval_id !== null) || (user.plan === "plus" && user.mp_preapproval_id !== null);
    let enabledDrinks;
    let enabledDesserts;

    if (!isPremium) {
        enabledDrinks = false
        enabledDesserts = false
    } else {
        enabledDrinks = true
        enabledDesserts = true
    }
    // Secciones para mapear, con fallback de migración para premium
    const topSections = user?.top_sections?.length > 0 ? user.top_sections : (isPremium && user?.enable_bebidas !== false ? ["Bebidas"] : []);
    const bottomSections = user?.bottom_sections?.length > 0 ? user.bottom_sections : (isPremium && user?.enable_postres !== false ? ["Postres"] : []);

    return (
        <section aria-label="Lista de Platos" className="flex flex-col gap-2 w-full">
            <div className="flex flex-col gap-10">
                {/* {isPremium &&
                    <AddSectionCardsFoods template={template} user={user} foods={foods} />
                } */}
                {topSections.map((sectionName: string) => {
                    const sectionFoods = foods.filter((f: any) => f.sub_category === sectionName);
                    if (sectionFoods.length === 0) return null;
                    return (
                        <div key={sectionName} className="flex flex-col gap-1">
                            <div className={`flex ml-2 items-center gap-1 ${template?.textColorOpacity || "text-gray-700/50"}`}>
                                <h2 className="text-xl font-normal">{sectionName}</h2>
                            </div>
                            <RenderCardsOptions
                                user={user}
                                foods={sectionFoods}
                                template={template}
                                context={false}
                            />
                        </div>
                    );
                })}
                {processedFoods.length > 0 ? (
                    <div className="flex flex-col gap-1 min-h-80">
                        <div className={`flex ml-2 items-center gap-1 ${template?.textColorOpacity || "text-gray-700/50"}`}>
                            <h2 className="text-xl font-normal">Platos</h2>
                            <Utensils className="w-5 h-5" />
                        </div>
                        {/*  <div className="flex justify-between items-center pr-2">
                            <div className={`flex ml-2 items-center gap-1 ${template?.textColorOpacity || "text-gray-700/50"}`}>
                                <h2 className="text-xl font-normal">Platos</h2>
                                <Utensils className="w-5 h-5" />
                            </div>
                            <DownloadMenuModal foods={foods} restaurantName={user?.name || "Menú"} template={template} />
                        </div> */}
                        {foods.length > 0 && (
                            <div className="flex justify-between h-10 max-h-10 items-end mb-1">
                                <Categories
                                    template={template}
                                    foods={foods.filter((f: any) => !topSections.includes(f.sub_category) && !bottomSections.includes(f.sub_category))}
                                    selectCategory={(sub: string) => setSelectedSubCategory(sub)}
                                />
                                <SortPriceButton onSortChange={setSortOrder} template={template} />
                            </div>
                        )}
                        {user?.presentation === "default" ? (<SortableContext
                            user={user}
                            arrayFoods={processedFoods.filter(f => {
                                let isMain = !topSections.includes(f.sub_category) && !bottomSections.includes(f.sub_category);
                                return selectedSubCategory === "0" ? isMain : (isMain && f.sub_category === selectedSubCategory);
                            })}
                            template={template}
                        />) : (
                            <ListCardsByCategory
                                Ath={true}
                                user={user}
                                arrayFoods={processedFoods.filter(f => {
                                    let isMain = !topSections.includes(f.sub_category) && !bottomSections.includes(f.sub_category);
                                    return selectedSubCategory === "0" ? isMain : (isMain && f.sub_category === selectedSubCategory);
                                })}
                                example={false}
                                template={template}
                            />)}
                    </div>
                ) : (
                    null
                )}
                {bottomSections.map((sectionName: string) => {
                    const sectionFoods = foods.filter((f: any) => f.sub_category === sectionName);
                    if (sectionFoods.length === 0) return null;
                    return (
                        <div key={sectionName} className="flex flex-col gap-1">
                            <div className={`flex ml-2 items-center gap-1 ${template?.textColorOpacity || "text-gray-700/50"}`}>
                                <h2 className="text-xl font-normal">{sectionName}</h2>
                            </div>
                            <RenderCardsOptions user={user} foods={sectionFoods} template={template} />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}