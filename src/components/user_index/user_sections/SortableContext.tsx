import RenderSortCards from "@/src/components/user_index/user_sections/RenderSortCards";
export default function SortableContext({ arrayFoods, color }: { arrayFoods: any, color?: any }) {
    return (
        <section className={`flex h-auto min-h-85 max-h-145 flex-col ${color?.accentColors[1]} rounded-xl`}>
            {
                arrayFoods.length === 1 ? (
                    <div className="w-full h-full flex flex-col overflow-y-auto">
                        <RenderSortCards foods={arrayFoods} count={4} context={false} color={color} />
                        <span className="text-center text-gray-400 py-20">Mas adelante tendremos mas variedad</span>
                    </div>
                ) : (
                    <RenderSortCards foods={arrayFoods} count={4} context={false} color={color} />
                )
            }
        </section>
    )
}