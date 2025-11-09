"use client";
import { FC, useEffect, useState } from "react";

// Tipos
type Category = {
  _id: string | number;
  name: string;
};

// Componente
export function Categories({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  return (
    <section className="mt-9 text-[17px] font-medium">
      <div
        className="flex gap-10 py-2 pl-5 overflow-y-scroll"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {initialCategories?.map((category) => (
          <a
            key={category?._id}
            href="/#"
            className="py-0.5 no-underline text-[#222] border-b-[3px] border-transparent font-bold hover:border-red-600 focus:border-red-600"
          >
            {category?.name}
          </a>
        ))}
      </div>
    </section>
  );
}

export default Categories;
