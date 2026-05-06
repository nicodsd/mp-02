import RenderCardsExample from "@/src/components/RenderCardsExample";
export default function CardsFoodsByCategories({ arrayFoods, template, example }: { arrayFoods: any, template: any, example: boolean }) {
    return (
        <section className={`flex h-auto max-h-145 flex-col`}>
            <div className={`w-full h-full flex flex-col overflow-y-auto p-0.5 rounded-xl ${template?.backgroundColor2 || "bg-background-2"}`}>
                <RenderCardsExample example={example} template={template} foods={arrayFoods} count={4} context={false} />
            </div>
        </section>
    )
}