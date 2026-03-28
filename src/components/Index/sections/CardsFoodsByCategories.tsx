import RenderCardsExample from "@/src/components/RenderCardsExample";
export default function CardsFoodsByCategories({ arrayFoods }: { arrayFoods: any }) {
    return (
        <section className="flex h-auto min-h-100 max-h-145 flex-col p-1 py-2 bg-background-2 rounded-xl">
            {
                arrayFoods.length === 1 ? (
                    <div className="w-full h-full flex flex-col overflow-y-auto">
                        <RenderCardsExample foods={arrayFoods} count={4} context={false} />
                        <span className="text-center text-gray-400 py-20">Mas adelante tendremos mas variedad</span>
                    </div>
                ) : (
                    <RenderCardsExample foods={arrayFoods} count={4} context={false} />
                )
            }
        </section>
    )
}