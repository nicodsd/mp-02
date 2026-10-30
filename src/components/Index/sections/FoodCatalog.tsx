import React, { useState, useMemo } from "react";
import Categories from "@/src/components/Categories";
import SortPriceButton from "@/src/components/Index/filters/SortPrice";
import CardsFoodsByCategories from "@/src/components/Index/sections/CardsFoodsByCategories";
import RenderCardsOptions from "@/src/components/RenderCardsOptions";
import ListCardsByCategory from "./ListCardsByCategory";
import { Utensils, Martini, Dessert } from "lucide-react";

export default function FoodCatalog({ allFoods, template, example, user }: any) {
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

    const isPremium = (user?.plan === "premium" && user?.mp_preapproval_id !== null) || (user?.plan === "plus" && user?.mp_preapproval_id !== null);

    // Secciones para mapear según el plan
    const customTopSections: string[] = user?.top_sections?.length > 0 ? user.top_sections : [];
    const customBottomSections: string[] = user?.bottom_sections?.length > 0 ? user.bottom_sections : [];

    const activeTopSections = isPremium ? customTopSections : ["Bebidas"];
    const activeBottomSections = isPremium ? customBottomSections : ["Postres"];

    return (
        <section aria-label="Lista de Platos" className="flex flex-col gap-1">
            <div className="flex flex-col gap-10">
                {activeTopSections.map((sectionName: string) => {
                    const sectionFoods = processedFoods.filter((f: any) => f.sub_category === sectionName);
                    if (sectionFoods.length === 0) return null;
                    return (
                        <div key={sectionName} className="flex flex-col gap-1">
                            <div className={`flex ml-2 items-center gap-1 ${template?.textColorOpacity || "text-gray-700/50"}`}>
                                <h2 className="text-xl font-normal">{sectionName}</h2>
                                <Martini className="w-5 h-5" />
                            </div>
                            <RenderCardsOptions
                                user={user}
                                example={example}
                                template={template}
                                context={true}
                                whatsapp={user?.whatsAppCart}
                                foods={sectionFoods}
                            />
                        </div>
                    );
                })}

                {/* PLATOS PRINCIPALES */}
                <div className="flex flex-col gap-2">
                    <div className={`flex ml-2 items-center gap-2 ${template?.textColorOpacity || "text-gray-700/50"}`}>
                        <h2 className="text-xl font-normal">Platos</h2>
                        <Utensils className="w-5 h-5" />
                    </div>

                    <div className="flex justify-between h-9 max-h-9 items-end mb-1">
                        <Categories
                            template={template}
                            foods={allFoods.filter((f: any) => !activeTopSections.includes(f.sub_category) && !activeBottomSections.includes(f.sub_category))}
                            selectCategory={(sub: string) => setSelectedSubCategory(sub)}
                        />
                        <SortPriceButton onSortChange={(order) => setSortOrder(order)} template={template} />
                    </div>

                    {example || user?.presentation === "default" ? (<CardsFoodsByCategories
                        user={user}
                        arrayFoods={processedFoods.filter(f => {
                            let isMain = !activeTopSections.includes(f.sub_category) && !activeBottomSections.includes(f.sub_category);
                            return selectedSubCategory === "0" ? isMain : (isMain && f.sub_category === selectedSubCategory);
                        })}
                        example={example}
                        whatsapp={user?.whatsAppCart}
                        template={template}
                    />) : (
                        <ListCardsByCategory
                            Ath={false}
                            user={user}
                            arrayFoods={processedFoods.filter(f => {
                                let isMain = !activeTopSections.includes(f.sub_category) && !activeBottomSections.includes(f.sub_category);
                                return selectedSubCategory === "0" ? isMain : (isMain && f.sub_category === selectedSubCategory);
                            })}
                            example={example}
                            template={template}
                            whatsapp={user?.whatsAppCart}
                        />)}

                </div>

                {/* POSTRES / SECCIONES INFERIORES */}
                {activeBottomSections.map((sectionName: string) => {
                    const sectionFoods = processedFoods.filter((f: any) => f.sub_category === sectionName);
                    if (sectionFoods.length === 0) return null;
                    return (
                        <div key={sectionName} className="flex flex-col gap-1">
                            <div className={`flex ml-2 items-center gap-1 ${template?.textColorOpacity || "text-gray-700/50"}`}>
                                <h2 className="text-xl font-normal">{sectionName}</h2>
                                <Dessert className="w-5 h-5" />
                            </div>
                            <RenderCardsOptions
                                user={user}
                                example={example}
                                whatsapp={user?.whatsAppCart}
                                template={template}
                                context={true}
                                foods={sectionFoods}
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
