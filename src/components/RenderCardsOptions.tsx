"use client";
import FoodsCardsOptions from "@/src/components/Index/foods_cards/FoodsCardsOptions";
import Loading from "@/src/skeleton/Loading";
type RenderCardsProps = {
  foods: any[];
  count?: number;
  context?: boolean;
  template?: any;
  example?: boolean;
};
export default function RenderCardsOptions({
  foods,
  count,
  context,
  template,
  example,
}: RenderCardsProps) {
  return (
    <div className={`w-full flex justify-start overflow-x-scroll p-1 py-2 rounded-xl ${foods.length > 1 ? `${template?.backgroundColor2 || "bg-background-2"}` : ""}`}>
      {foods.length === 0 ? (
        <Loading count={count ?? 6} template={template} />
      ) : (
        foods.map((food) => (
          <div
            key={food._id}
            className={`${context ? `${template?.backgroundColor2 || "bg-background-2"} rounded-xl` : ""}`}
          >
            <FoodsCardsOptions
              template={template}
              food={food}
              context={context}
              example={example}
            />
          </div>
        ))
      )}
    </div>
  );
}
