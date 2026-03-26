import RenderCardsExample from "@/src/components/RenderCardsExample";
export default function CardsFoodsByCategories({ arrayFoods }: { arrayFoods: any }) {
    return (
        <section className="flex h-120 flex-col md:mx-[12vw] md:pb-8 md:pt-3 p-1 bg-background-2 rounded-xl lg:mx-[27vw] shadow-md">
            <RenderCardsExample foods={arrayFoods} count={4} context={false} />
        </section>
    )
}