"use client";
import { FC, useState } from "react";

// Tipos
type Category = {
  _id: string | number;
  name: string;
};

// Componente
export function Categories({
  categories,
  selectCategory,
}: {
  categories: Category[];
  selectCategory: (name: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("0"); // "0" representa "Todo"

  const handleClick = (name: string) => {
    setActiveCategory(name);
    selectCategory(name);
  };

  return (
    <section className="mt-9 text-[17px] font-medium">
      <div
        className="flex gap-10 py-2 pl-5 overflow-y-scroll"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <a
          key="All"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleClick("0");
          }}
          className={`py-0.5 no-underline text-[#222] border-b-[3px] font-bold ${
            activeCategory === "0" ? "border-red-600" : "border-transparent"
          }`}
        >
          Todo
        </a>

        {categories?.map((category) => (
          <a
            key={category._id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleClick(category.name);
            }}
            className={`py-0.5 no-underline text-[#222] border-b-[3px] font-bold ${
              activeCategory === category.name
                ? "border-red-600"
                : "border-transparent"
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
