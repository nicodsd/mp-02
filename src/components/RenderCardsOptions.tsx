"use client";
import FoodsCardsOptions from "@/src/components/Index/foods_cards/FoodsCardsOptions";
import Loading from "@/src/skeleton/Loading";
type RenderCardsProps = {
  foods: any[];
  count?: number;
  context?: boolean;
  color?: string;
};
export default function RenderCardsOptions({
  foods,
  count,
  context,
  color,
}: RenderCardsProps) {
  return (
    <div className={`w-full flex justify-start overflow-x-scroll p-1 py-2 rounded-xl ${foods.length > 1 ? "bg-background-2" : ""}`}>
      {foods.length === 0 ? (
        <Loading count={count ?? 6} />
      ) : (
        foods.map((food) => (
          <div
            key={food._id}
            className={`${context ? "bg-background-2 rounded-xl" : ""}`}
          >
            <FoodsCardsOptions
              name={food.name}
              photo={food.photo}
              description={food.description}
              price={food.price}
              context={context}
            />
          </div>
        ))
      )}
    </div>
  );
}
