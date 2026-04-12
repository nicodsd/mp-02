import RenderSortCards from "@/src/components/user_index/user_sections/RenderSortCards";
export default function SortableContext({ arrayFoods, template }: { arrayFoods: any, template?: any }) {
    return (
        <section className={`flex h-auto min-h-85 max-h-145 flex-col ${template?.backgroundColor2} rounded-xl`}>
            {
                arrayFoods.length === 1 ? (
                    <div className="w-full h-full flex flex-col overflow-y-auto">
                        <RenderSortCards foods={arrayFoods} count={4} context={false} template={template} />
                        <span className={`text-center ${template?.textColor} py-20`}>Mas adelante tendremos mas variedad</span>
                    </div>
                ) : (
                    <RenderSortCards foods={arrayFoods} count={4} context={false} template={template} />
                )
            }
        </section>
    )
}