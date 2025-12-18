"use client";
import { useState } from "react";
import { Close } from "@mui/icons-material";
import axios from "axios";
interface Category {
  _id: string;
  name: string;
}
interface CategoriesFormProps {
  categoriesList: Category[];
  onChange?: (selected: string[]) => void;
}
export default function CategoriesForm({
  categoriesList,
  onChange,
}: CategoriesFormProps) {
  console.log(categoriesList)
  const URL = process.env.NEXT_PUBLIC_API_URL;
  const [selected, setSelected] = useState<string[]>([]);
  const [customCategories, setCustomCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");
  const [arrayNewCategory, setArrayNewCategory] = useState<string[]>([]);
  if (!categoriesList) {
    categoriesList = [];
  }
  const allCategories = [...categoriesList, ...customCategories];
  const handleCheckboxChange = (value: string): void => {
    const updated = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    setSelected(updated);
    if (onChange) onChange(updated);
  };
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    const newCat = { _id: crypto.randomUUID(), name: newCategory };
    setSelected([...selected, newCat.name]);
    setCustomCategories([...customCategories, newCat]);
    setNewCategory("");
  };
  const handlePutCategory = (category: string) => {
    axios.put(`${URL}/api/categories/${category}`);
    const updatedCustomCategories = customCategories.filter((cat) => cat.name !== category);
    setCustomCategories(updatedCustomCategories);
    setSelected((prevSelected) => prevSelected.filter((cat) => cat !== category));
  }
  const deleteNewCategory = (category: string) => {
    const updatedArrayNewCategory = arrayNewCategory.filter((cat) => cat !== category);
    setArrayNewCategory(updatedArrayNewCategory);
    setSelected((prevSelected) => prevSelected.filter((cat) => cat !== category));
  };
  return (
    <div className="space-y-4">
      {/* Lista de categorías */}
      <div className="flex flex-wrap gap-y-1 gap-x-px">
        {allCategories.map((item) => (
          <label
            key={typeof item === "string" ? item : item._id}
            className={`cursor-pointer px-4 py-1.5 rounded-full border text-sm font-semibold transition
      ${selected.includes(typeof item === "string" ? item : item.name)
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
          >
            <input
              type="checkbox"
              value={typeof item === "string" ? item : item.name}
              checked={selected.includes(typeof item === "string" ? item : item.name)}
              onChange={() =>
                handleCheckboxChange(typeof item === "string" ? item : item.name)
              }
              className="hidden"
            />
            {typeof item === "string" ? item : item.name}
            <button
              onClick={(e) => {
                e.preventDefault();
                handlePutCategory(typeof item === "string" ? item : item.name);
              }}
            >
              <Close sx={{ marginLeft: "6px" }} />
            </button>
          </label>
        ))}

      </div>
      <div className="flex flex-col gap-y-3 bg-gray-100 min-h-[170px] justify-between rounded-xl px-5 py-5">
        <h3 className="font-semibold text-gray-500 ">Agrega nuevas categorías</h3>
        <div className="flex flex-wrap gap-y-1 h-full gap-x-px w-full">
          {arrayNewCategory.map((item) => (
            <label
              key={item}
              className={`cursor-pointer px-4 py-1.5 rounded-full border text-sm font-semibold transition
              ${selected.includes(item)
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                }`}
            >
              <input
                type="checkbox"
                value={item}
                checked={selected.includes(item)}
                onChange={() => handleCheckboxChange(item)}
                className="hidden"
              />
              {item}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  deleteNewCategory(item);
                }}
              >
                <Close sx={{ marginLeft: "6px" }} />
              </button>
            </label>
          ))}
        </div>
        {/* Input para agregar categoría */}
        <div className="flex w-full justify-center">
          <div className="flex gap-2 w-full items-center">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nueva categoría"
              className="px-3 py-2 border w-full border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm hover:bg-indigo-700"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}