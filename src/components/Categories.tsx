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
    <section className="w-[82%] text-[17px] font-medium">
      <div
        className="flex gap-1 py-1 pl-3 overflow-y-scroll text-gray-700"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {categories?.length > 1 && <a
          key="All"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleClick("0");
          }}
          className={`py-0.5 no-underline px-3 border-x border-b-[3px] rounded-[7px] font-bold ${activeCategory === "0" ? "border-red-500" : "border-gray-300"
            }`}
        >
          Todo
        </a>}
        {categories?.map((category: Category) => (
          <a
            key={category._id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleClick(category.name);
            }}
            className={`py-0.5 no-underline px-3 border-x border-b-[3px] rounded-[7px] font-bold ${activeCategory === category.name
              ? "border-red-500"
              : "border-gray-300"
              }`}
          >
            {category.name}
          </a>
        ))}
      </div>
    </section>
  );
}
export default Categories;