import FoodsCardsExample from "@/src/components/foods_cards/FoodsCardsExample";
import FoodsData from "@/src/data/foods-1.json"

export default function GroupsFoodsByCategories({ arrayFoods }: { arrayFoods: any }) {

    console.log(FoodsData);
    // Group foods by category
    const groupedFoods = Array.isArray(FoodsData)
        ? FoodsData.reduce((acc: Record<string, any[]>, food: any) => {
            const category = food.category || "Otros";
            if (!acc[category]) acc[category] = [];
            acc[category].push(food)
            acc[category].sort((a, b) => a.name.localeCompare(b.name));
            return acc;
        }, {})
        : {};

    return (
        <section className="flex min-h-[calc(90vh-100px)] mt-4 flex-col gap-8 md:mx-[12vw] md:pb-8 md:pt-3 lg:mx-[27vw]">
            {/* <FoodsOptions /> */}
            <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-4">
                    {Object.entries(groupedFoods).map(([category, foods]: [string, any]) => (
                        <div key={category} className="flex text-gray-700 flex-col mt-">
                            <h2 className="text-lg font-bold pb-1 uppercase">{category}</h2>
                            <div className="flex flex-col gap-1">
                                {Array.isArray(foods) && foods.map((food: any, index: number) => (
                                    <FoodsCardsExample
                                        key={food.id || index}
                                        name={food.name}
                                        photo={food.photo}
                                        description={food.description}
                                        price={food.price}
                                        context={false}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                {/* <RenderCardsOptions foods={arrayFoods} count={4} context={false} /> */}
            </div>
        </section>
    )
}