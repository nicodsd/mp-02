import RenderCardsExample from "@/src/components/RenderCardsExample";
export default function CardsFoodsByCategories({ arrayFoods, template, example }: { arrayFoods: any, template: any, example: boolean }) {
    return (
        <section className={`flex h-auto min-h-85 max-h-145 flex-col p-1 py-2 ${template?.backgroundColor2 || "bg-background-2"} rounded-xl`}>
            {
                arrayFoods.length === 1 ? (
                    <div className="w-full h-full flex flex-col overflow-y-auto">
                        <RenderCardsExample example={example} template={template} foods={arrayFoods} count={4} context={false} />
                        <span className={`text-center ${template?.textColorOpacity || "text-gray-700/50"} py-20`}>Mas adelante tendremos mas variedad</span>
                    </div>
                ) : (
                    <RenderCardsExample example={example} template={template} foods={arrayFoods} count={4} context={false} />
                )
            }
        </section>
    )
}