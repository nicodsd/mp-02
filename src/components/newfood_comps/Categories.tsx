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
  onChange?: (selected: string) => void;
  user: User;
}

export default function CategoriesForm({
  categoriesList,
  onChange,
  user,
}: CategoriesFormProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<string>("");
  const [customCategory, setCustomCategory] = useState<string | null>(null);

  const allCategories = categoriesList ?? [];

  // Maneja la selección de la lista existente
  const handleSelectChange = (name: string): void => {
    // Si haces clic en la misma, la deseleccionas (opcional)
    const value = selected === name ? "" : name;
    setSelected(value);
    setCustomCategory(null); // Limpiamos la personalizada si elige una existente
    onChange?.(value);
  };

  // Maneja agregar la categoría personalizada
  const handleAddCategory = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    const categoryName = newCategory.trim();
    setCustomCategory(categoryName);
    setSelected(categoryName);
    setNewCategory("");
    onChange?.(categoryName);
  };

  const deleteCustomCategory = () => {
    setCustomCategory(null);
    setSelected(null);
    onChange?.("");
  };

  return (
    <fieldset className="flex w-full flex-col gap-y-4 border-none p-0 m-0">
      <legend className="sr-only">Selección de categoría</legend>

      {/* Lista de categorías existentes */}
      {allCategories.length > 0 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Categorías existentes">
          {allCategories.map((item) => (
            <label
              key={item._id}
              className={`cursor-pointer px-3 py-1.5 rounded-full border text-md font-semibold transition flex items-center
              ${selected === item.name
                  ? "bg-black text-white border-gray-200 shadow-md"
                  : "bg-gray-100 text-gray-500 border-gray-300 hover:border-gray-400"
                }`}
            >
              <input
                type="radio"
                name="category"
                value={item.name}
                checked={selected === item.name}
                onChange={() => handleSelectChange(item.name)}
                className="sr-only"
              />
              {item.name}
            </label>
          ))}
        </div>
      )}
      {/* Contenedor para nueva categoría personalizada */}
      <section className="flex w-full flex-col gap-y-4 bg-background-2 border border-gray-300 min-h-[100px] rounded-xl px-3 py-3">
        <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider">
          Agregar categoría
        </h3>

        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {customCategory && (
            <div
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-bold animate-in fade-in zoom-in duration-200"
            >
              <span>{customCategory}</span>
              <button
                type="button"
                aria-label={`Eliminar ${customCategory}`}
                onClick={deleteCustomCategory}
                className="hover:text-red-500 transition-colors"
              >
                <Close sx={{ fontSize: 18 }} />
              </button>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-300">
          <div className="flex gap-1 items-center">
            <input
              type="text"
              disabled={!!customCategory}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCategory(e as any))}
              placeholder="Ej: Bebidas"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50"
            />
            <button
              type="button"
              disabled={!newCategory.trim() || !!customCategory}
              onClick={handleAddCategory}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-md font-bold hover:bg-blue-700 active:scale-95 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Fijar
            </button>
          </div>
        </div>
      </section>
    </fieldset>
  );
}