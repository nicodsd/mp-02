"use client";
import React from "react";
import allergens from "@/src/data/allergens"; // importamos lista

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
    <div>
      {allergens.map((item: string) => (
        <label key={item} className="block">
          <input
            type="checkbox"
            value={item}
            checked={dataAllergens.includes(item)}
            onClick={() => handleCheckboxChange(item)}
          />
          {item}
        </label>
      ))}
    </div>
  );
}
