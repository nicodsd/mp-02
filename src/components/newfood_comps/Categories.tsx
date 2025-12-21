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
  const [selected, setSelected] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");
  const [arrayNewCategory, setArrayNewCategory] = useState<string[]>([]);
  if (!categoriesList) {
    categoriesList = [];
  }
  const allCategories = categoriesList;

  const handleCheckboxChange = (name: string): void => {
    if (!selected.includes(name)) {
      const updated = [...selected, name];
      setSelected(updated);
      onChange?.(updated);
    }
    else {
      const updated = selected.filter((item) => item !== name);
      setSelected(updated);
      onChange?.(updated);
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    const newCat = { _id: crypto.randomUUID(), name: newCategory };
    setSelected([...selected, newCat.name]);
    setArrayNewCategory([...arrayNewCategory, newCat.name]);
    setNewCategory("");
    handleCheckboxChange(newCat.name);
  };

  const deleteNewCategory = (category: string) => {
    const updatedArrayNewCategory = arrayNewCategory.filter((cat) => cat !== category);
    setArrayNewCategory(updatedArrayNewCategory);
    setSelected((prevSelected) => prevSelected.filter((cat) => cat !== category));
  };
  return (
    <div className="flex flex-col gap-y-2">
      {/* Lista de categorías */}
      {allCategories?.length > 0 && (
        <div className="flex flex-wrap gap-y-1 gap-x-px">
          {allCategories.map((item) => (
            <label
              key={item._id}
              className={`cursor-pointer px-4 py-1.5 rounded-full border text-sm font-semibold transition
            ${selected.includes(item.name)
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200"
                }`}
            >
              <input
                type="checkbox"
                value={item.name}
                checked={selected.includes(item.name)}
                onChange={() => handleCheckboxChange(item.name)}
                className="hidden"
              />
              {item.name}
            </label>
          ))}
        </div>
      )}

      {/* Bloque para nuevas categorías */}
      <div className="flex flex-col gap-y-2 bg-white border border-gray-300 min-h-[170px] justify-between rounded-xl px-5 py-5">
        <h3 className="font-semibold text-sm text-gray-500">Agrega nuevas categorías</h3>
        <div className="flex flex-wrap gap-y-1 h-full gap-x-1 w-full">
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
          <div className="flex gap-1 w-full items-center">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Ej: Pizza"
              className="px-3 py-2 border w-full text-gray-400 placeholder-gray-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-indigo-700"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
