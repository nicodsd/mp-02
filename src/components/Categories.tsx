"use client";
import { useState, useMemo } from "react";

export function Categories({
  foods,
  selectCategory,
  color,
  template,
}: {
  foods: any[];
  color?: any;
  selectCategory: (name: string) => void;
  template?: any;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("0");
  const platos = foods.filter((f: any) => f.category !== "Bebidas" && f.category !== "Postres");
  const orderedCats = useMemo(() => {
    const activeSubCatNames = platos.map((f: any) => f.sub_category);
    return [...new Set(activeSubCatNames)]
  }, [foods]);

  const handleClick = (name: string) => {
    setActiveCategory(name);
    selectCategory(name);
  };

  return (
    <section className="w-[82%] h-full text-[16px]">
      <div
        className={`flex gap-1 pl-2 overflow-x-auto`}
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
            className={`py-1 no-underline px-3 cursor-pointer rounded-[7px] font-semibold
              ${activeCategory === "0"
                ? `${template?.backgroundColor2 || "bg-gray-900"} ${template?.textColor || "text-white"} border ${template?.border || "border-gray-300"}`
                : `${template?.backgroundColor || "bg-background"} ${template?.textColor || "text-gray-700"} hover:${template?.backgroundColor2 || "bg-gray-100"} border ${template?.border || "border-gray-300"}`
              }`}
          >
            Todo
          </button>
        )}

        {orderedCats.length > 0 && orderedCats.map((category: any) => (
          <button
            key={category}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleClick(category);
            }}
            className={`py-1 no-underline px-3 text-center cursor-pointer leading-none md:text-xs rounded-[7px] font-semibold
                ${activeCategory === category
                ? `${template?.backgroundColor2 || "bg-gray-900"} ${template?.textColor || "text-white"} border ${template?.border || "border-gray-300"}`
                : `${template?.backgroundColor || "bg-background"} ${template?.textColor || "text-gray-700"} hover:${template?.backgroundColor2 || "bg-gray-100"} border ${template?.border || "border-gray-300"}`
              }`}
          >
            {category} especiales
          </button>
        ))}
      </div>
    </section>
  );
}

export default Categories;