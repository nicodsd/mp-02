"use client";
import React, { FC, useEffect, useState } from "react";
import axios from "axios";

// Tipos
type Category = {
  _id: string | number;
  image: string;
  name: string;
  description: string;
  price: number | string;
};

// Componente
const Categories: FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:4000/categories");
        setCategories(res.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="mt-9 text-[17px] font-medium">
      <div
        className="flex gap-10 py-2 pl-5 overflow-y-scroll"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {categories.map((category) => (
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
};

export default Categories;
