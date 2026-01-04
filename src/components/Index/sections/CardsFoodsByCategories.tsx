import PromoDay from "@/src/components/PromoDay";
import FoodsOptions from "@/src/components/Index/filters/FoodsOptions";
import Categories from "@/src/components/Categories";
import SortPriceButton from "@/src/components/Index/filters/SortPrice";
import RenderCardsExample from "@/src/components/RenderCardsExample";
import RenderCardsOptions from "@/src/components/RenderCardsOptions";
export default function GroupsFoodsByCategories({ initialSubCategories, setSubCats, setSortOrder, arrayFoods }: { initialSubCategories: any, setSubCats: any, setSortOrder: any, arrayFoods: any }) {
    return (
        <section className="flex min-h-[calc(90vh-100px)] mt-4 flex-col gap-8 md:mx-[12vw] md:pb-8 md:pt-3 lg:mx-[27vw]">
            {/* <PromoDay /> */}
            {/* <FoodsOptions /> */}
            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                    <Categories categories={initialSubCategories} selectCategory={setSubCats} />
                    <SortPriceButton onSortChange={setSortOrder} />
                </div>
                <RenderCardsExample foods={arrayFoods} count={4} context={false} />
                {/* <RenderCardsOptions foods={arrayFoods} count={4} context={false} /> */}
            </div>
        </section>
    )
}