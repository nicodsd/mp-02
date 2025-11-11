"use client";
import { FC, useEffect, useState } from "react";

// Tipos
type Category = {
  _id: string | number;
  name: string;
};

// Componente
export function Categories({ categories }: { categories: Category[] }) {
  //const [cat, setCat] = useState<string>("");
  const [cates, setCates] = useState<any[]>([]);

  function setCats(category: string) {
    if (!cates.includes(category)) {
      setCates([...cates, category]);
    } else {
      const filteredCategories = cates.filter((e) => e !== category);
      setCates(filteredCategories);
    }
  }

  console.log(cates);

  return (
    <section className="mt-9 text-[17px] font-medium">
      <div
        className="flex gap-10 py-2 pl-5 overflow-y-scroll"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {Array.isArray(categories) ? (
          <>
            {categories?.map((category) => (
              <a
                key={category?._id}
                href="/#"
                onClick={() => setCats(category?.name)}
                className="py-0.5 no-underline text-[#222] border-b-[3px] border-transparent font-bold hover:border-red-600 focus:border-red-600"
              >
                {category?.name}
              </a>
            ))}
          </>
        ) : (
          <p>No hay datos disponibles.</p>
        )}
      </div>
    </section>
  );
}

export default Categories;
