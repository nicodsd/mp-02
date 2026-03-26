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
    e.preventDefault(); // Evitamos cualquier acción del form padre
    if (!newCategory.trim()) return;

    const categoryName = newCategory.trim();

    // 1. Actualización optimista de la UI
    const updatedSelected = [...selected, categoryName];
    setSelected(updatedSelected);
    setArrayNewCategory([...arrayNewCategory, categoryName]);
    setNewCategory("");
    onChange?.(updatedSelected);

    try {
      // 2. Enviamos como JSON (Solución al body undefined)
      const res = await fetch(`${apiUrl}categories/sub/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: categoryName,
          user_id: user.id,
        }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error en la petición");
      const data = await res.json();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
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
              className={`cursor-pointer px-4 py-1.5 rounded-full border text-sm font-semibold transition flex items-center
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
      <section className="flex w-full shadow-sm flex-col gap-y-4 bg-white border border-gray-300 min-h-[170px] rounded-xl p-5">
        <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider">
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

        {/* Input con mejor semántica */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCategory(e as any))}
              placeholder="Ej: Pizza a la piedra"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 active:scale-95 transition-all"
            >
              Agregar
            </button>
          </div>
        </div>
      </section>
    </fieldset>
  );
}