"use client";
import { useState } from "react";
type Category = {
  _id: string | number;
  name: string;
};
export function Categories({
  categories,
  selectCategory,
}: {
  categories: Category[];
  selectCategory: (name: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("0");
  const handleClick = (name: string) => {
    setActiveCategory(name);
    selectCategory(name);
  };
  return (
    <section className="w-[82%] h-fit text-[17px] font-medium">
      <div
        className="flex gap-1 pl-2 cursor-pointer overflow-y-scroll text-gray-700"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {
          categories?.length > 1 && <button
            key="All"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleClick("0");
            }}
            className={`py-0.5 no-underline px-3 cursor-pointer rounded-[7px] font-bold
              ${activeCategory === "0"
                ? "bg-gray-900 text-white border"
                : "text-gray-800 border border-gray-300"
              }`}
          >
            Todo
          </button>
        }
        {
          categories?.map((category: Category) => (
            <button
              key={category._id}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleClick(category.name);
              }}
              className={`py-0.5 no-underline px-3 cursor-pointer rounded-[7px] font-bold
                ${activeCategory === category.name
                  ? "bg-gray-900 text-white border"
                  : "text-gray-800 border border-gray-300"
                }`}
            >
              {category.name}
            </button>
          ))
        }
      </div>
    </section>
  );
}
export default Categories;