import FoodsCardsExample from "@/src/components/Index/foods_cards/FoodsCardsExample";
import FoodsData from "@/src/data/foods-1.json"
import { useMemo } from "react";

export default function GroupsFoodsByCategories({ arrayFoods }: { arrayFoods: any }) {
    // Group foods by category
    const groupedFoods = useMemo(() => {
        return Array.isArray(arrayFoods)
            ? arrayFoods.reduce((acc: Record<string, any[]>, food: any) => {
                const category = food.sub_category || "Otros";
                if (!acc[category]) acc[category] = [];
                acc[category].push(food)
                acc[category].sort((a, b) => a.name.localeCompare(b.name));
                return acc;
            }, {})
            : {};
    }, [arrayFoods]);

    return (
        <section className="flex min-h-full flex-col gap-8 md:mx-[12vw] md:pb-8 md:pt-3 lg:mx-[27vw]">
            {/* <FoodsOptions /> */}
            <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-">
                    {Object.entries(groupedFoods).map(([category, foods]: [string, any]) => (
                        <details key={category} className="group flex rounded-md px-2 text-gray-600 flex-col border border-gray-300 pb-2 py-8 mb-1">
                            <summary className="text-xl px-3 uppercase cursor-pointer list-none flex justify-between items-center">
                                {category}
                                <span className="transition duration-300 group-open:-rotate-180">
                                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                                        <path d="M6 9l6 6 6-6"></path>
                                    </svg>
                                </span>
                            </summary>
                            <div className="flex flex-col gap-4 mt-4">
                                {/*   {Array.isArray(foods) && foods.map((food: any, index: number) => (
                                    <FoodsCardsExample
                                        key={food.id || index}
                                        name={food.name}
                                        photo={food.photo}
                                        description={food.description}
                                        price={food.price}
                                        context={false}
                                    />
                                ))} */}
                            </div>
                        </details>
                    ))}
                </div>
                {/* <RenderCardsOptions foods={arrayFoods} count={4} context={false} /> */}
            </div>
        </section>
    )
}