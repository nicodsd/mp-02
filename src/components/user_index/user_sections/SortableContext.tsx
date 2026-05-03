import RenderSortCards from "@/src/components/user_index/user_sections/RenderSortCards";
export default function SortableContext({ arrayFoods, template }: { arrayFoods: any, template?: any }) {
    return (
        <section className={`flex h-auto min-h-auto max-h-145 flex-col rounded-xl`}>
            <div className={`w-full h-full flex flex-col overflow-y-auto p-0.5 rounded-xl ${template?.backgroundColor2}`}>
                <RenderSortCards foods={arrayFoods} count={4} context={false} template={template} />
            </div>
        </section>
    )
} 