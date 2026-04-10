"use client";
import { useState, useMemo } from "react";

type Category = {
  _id: string | number;
  name: string;
};

export function Categories({
  foods,
  categoriesFoods,
  selectCategory,
  color,
  template,
}: {
  foods: any[];
  color?: any;
  categoriesFoods: Category[];
  selectCategory: (name: string) => void;
  template?: any;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("0");

  const platos = foods.filter(f => f.category !== "Bebidas" && f.category !== "Postres");

  const orderedCats = useMemo(() => {
    if (!categoriesFoods) return [];

    const activeSubCatNames = new Set(platos.map((f) => f.sub_category));

    return categoriesFoods.filter((cat) => activeSubCatNames.has(cat.name));
  }, [foods, categoriesFoods]);

  const handleClick = (name: string) => {
    setActiveCategory(name);
    selectCategory(name);
  };

  return (
    <section className="w-[82%] h-fit text-[17px] font-medium">
      <div
        className={`flex gap-1 pl-2 overflow-x-auto ${color?.textColor}`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {orderedCats.length > 0 && (
          <button
            key="All"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleClick("0");
            }}
            className={`py-0.5 no-underline px-3 cursor-pointer rounded-[7px] font-bold
              ${activeCategory === "0"
                ? `${color?.accentColors[1]} ${color?.textColor2} border`
                : `${color?.accentColors[2]} ${color?.textColor} border`
              }`}
          >
            Todo
          </button>
        )}

        {orderedCats.map((category: Category) => (
          <button
            key={category._id}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleClick(category.name);
            }}
            className={`py-0.5 no-underline px-3 cursor-pointer rounded-[7px] font-bold
                ${activeCategory === category.name
                ? `${color?.accentColors[1]} ${color?.textColor2} border`
                : `${color?.accentColors[2]} ${color?.textColor} border`
              }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </section>
  );
}

export default Categories;