"use client";
import React from "react";
import allergens from "@/src/data/allergens";
interface AllergensFormProps {
  dataAllergens: string[];
  setData: React.Dispatch<React.SetStateAction<string[]>>;
}
interface AllergensData {
  allergens: string[];
}
export default function AllergensForm(props: AllergensFormProps) {
  const { dataAllergens, setData } = props;
  const handleCheckboxChange = (value: string): void => {
    setData(
      (prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value) // si ya estaba, lo quita
          : [...prev, value] // si no estaba, lo agrega
    );
  };
  const data: AllergensData = {
    allergens: dataAllergens,
  };
  return (
    <div className="flex flex-wrap gap-y-1 gap-x-px">
      {allergens.map((item: string) => (
        <label
          key={item}
          className={`cursor-pointer px-4 py-1.5 rounded-full border text-sm font-semibold transition
        ${dataAllergens.includes(item)
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
        >
          <input
            type="checkbox"
            value={item}
            checked={dataAllergens.includes(item)}
            onChange={() => handleCheckboxChange(item)}
            className="hidden"
          />
          {item}
        </label>
      ))}
    </div>
  );
}