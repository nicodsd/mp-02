"use client";
import FoodsCardsOptions from "@/src/components/foods_cards/FoodsCardsOptions";
import Loading from "@/src/skeleton/Loading";
type RenderCardsProps = {
    foods: any[];
    count?: number;
    context?: boolean;
};
export default function RenderCardsOptions({ foods, count, context }: RenderCardsProps) {
    return (
        <div className="w-full flex justify-center gap-1">
            {
                foods.length < 0 ? (
                    <Loading count={count ?? 6} />
                ) : (
                    foods.map((food) => (
                        <div key={food._id} className={`flex justify-between items-center ${context ? "bg-[#f0f0f093] rounded-xl" : ""}`}>
                            <FoodsCardsOptions name={food.name} photo={food.photo} description={food.description} price={food.price} context={context} />
                        </div>
                    ))
                )
            }
        </div>
    );
}