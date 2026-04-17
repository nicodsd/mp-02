"use client";
import { useState } from "react";
import { Close } from "@mui/icons-material";

interface Category {
  _id: string;
  name: string;
}

interface User {
  id: string;
}

interface CategoriesFormProps {
  categoriesList: Category[];
  onChange?: (selected: string[]) => void;
  user: User;
}

export default function CategoriesForm({
  categoriesList,
  onChange,
  user,
}: CategoriesFormProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
  const [selected, setSelected] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");
  const [arrayNewCategory, setArrayNewCategory] = useState<string[]>([]);

  const allCategories = categoriesList ?? [];

  const handleCheckboxChange = (name: string): void => {
    let updated: string[];
    if (!selected.includes(name)) {
      updated = [...selected, name];
    } else {
      updated = selected.filter((item) => item !== name);
    }
    setSelected(updated);
    onChange?.(updated);
  };

  const handleAddCategory = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    const categoryName = newCategory.trim();
    const updatedSelected = [...selected, categoryName];
    setSelected(updatedSelected);
    setArrayNewCategory([...arrayNewCategory, categoryName]);
    setNewCategory("");
    onChange?.(updatedSelected);
  };

  const deleteNewCategory = (category: string) => {
    const updatedArray = arrayNewCategory.filter((cat) => cat !== category);
    const updatedSelected = selected.filter((cat) => cat !== category);
    setArrayNewCategory(updatedArray);
    setSelected(updatedSelected);
    onChange?.(updatedSelected);
  };

  return (
    <fieldset className="flex w-full flex-col gap-y-4 border-none p-0 m-0">
      <legend className="sr-only">Selección de categorías</legend>

      {/* Lista de categorías existentes */}
      {allCategories.length > 0 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Categorías existentes">
          {allCategories.map((item) => (
            <label
              key={item._id}
              className={`cursor-pointer px-3 py-1.5 rounded-full border text-sm font-semibold transition flex items-center
              ${selected.includes(item.name)
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : "bg-gray-100 text-gray-500 border-gray-300 hover:border-gray-400"
                }`}
            >
              <input
                type="checkbox"
                value={item.name}
                checked={selected.includes(item.name)}
                onChange={() => handleCheckboxChange(item.name)}
                className="sr-only" // Mejor que hidden para accesibilidad
              />
              {item.name}
            </label>
          ))}
        </div>
      )}

      {/* Contenedor para nuevas categorías */}
      <section className="flex w-full flex-col gap-y-4 bg-white border border-gray-300 min-h-[100px] rounded-xl px-3 py-3">
        <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider">
          Nuevas categorías personalizadas
        </h3>

        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {arrayNewCategory.map((item) => (
            <div
              key={item}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-bold animate-in fade-in zoom-in duration-200"
            >
              <span>{item}</span>
              <button
                type="button"
                aria-label={`Eliminar ${item}`}
                onClick={() => deleteNewCategory(item)}
                className="hover:text-red-500 transition-colors"
              >
                <Close sx={{ fontSize: 18 }} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex gap-1 items-center">
            <input
              type="text"
              disabled={arrayNewCategory.length >= 1}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCategory(e as any))}
              placeholder="Ej: Bebidas"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
            <button
              type="button"
              disabled={!newCategory.trim()}
              onClick={handleAddCategory}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 active:scale-95 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Agregar
            </button>
          </div>
        </div>
      </section>
    </fieldset>
  );
}