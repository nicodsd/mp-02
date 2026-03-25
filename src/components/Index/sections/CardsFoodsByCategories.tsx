import RenderCardsExample from "@/src/components/RenderCardsExample";
export default function CardsFoodsByCategories({ arrayFoods }: { arrayFoods: any }) {
    return (
        <section className="flex h-120 flex-col md:mx-[12vw] md:pb-8 md:pt-3 shadow-inner rounded-xl lg:mx-[27vw]">
            <RenderCardsExample foods={arrayFoods} count={4} context={false} />
        </section>
    )
}