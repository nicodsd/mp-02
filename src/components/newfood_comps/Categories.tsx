"use client";
import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import {
  FoodCategoryIcon,
  DEFAULT_CATEGORY_ICONS,
  FOOD_ICON_MAP,
  saveCategoryIconLocal,
} from "@/src/components/icons/foods";
import AddCategoryModal from "@/src/components/modals/AddCategoryModal";

interface Category {
  _id: string | number;
  name: string;
  icon?: string;
}

interface User {
  id: string;
}

interface CategoriesFormProps {
  categoriesList: Category[];
  value?: string;
  onChange?: (selected: string, icon?: string) => void;
  user: User;
}

export default function CategoriesForm({
  categoriesList,
  value,
  onChange,
}: CategoriesFormProps) {
  const [selected, setSelected] = useState<string | null>(value || null);
  const [customCategories, setCustomCategories] = useState<
    { name: string; icon: string }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allCategories = categoriesList ?? [];

  useEffect(() => {
    if (value !== undefined) {
      setSelected(value || null);
    }
  }, [value]);

  const resolveCategoryIcon = (cat: Category): string => {
    if (cat.icon && FOOD_ICON_MAP[cat.icon]) return cat.icon;
    return DEFAULT_CATEGORY_ICONS[cat.name] || "Utensils";
  };

  // Maneja la selección de la lista existente
  const handleSelectChange = (cat: Category): void => {
    const nextValue = selected === cat.name ? "" : cat.name;
    const iconKey = nextValue ? resolveCategoryIcon(cat) : "";
    setSelected(nextValue || null);
    onChange?.(nextValue, iconKey);
  };

  // Maneja la selección de una categoría personalizada
  const handleSelectCustom = (cat: { name: string; icon: string }): void => {
    const nextValue = selected === cat.name ? "" : cat.name;
    setSelected(nextValue || null);
    onChange?.(nextValue, nextValue ? cat.icon : "");
  };

  // Maneja agregar la categoría personalizada desde el modal
  const handleAddCategoryFromModal = (newCat: { name: string; icon: string }) => {
    saveCategoryIconLocal(newCat.name, newCat.icon);
    setCustomCategories((prev) => {
      const exists = prev.some(
        (c) => c.name.toLowerCase() === newCat.name.toLowerCase()
      );
      if (exists) {
        return prev.map((c) =>
          c.name.toLowerCase() === newCat.name.toLowerCase() ? newCat : c
        );
      }
      return [...prev, newCat];
    });
    setSelected(newCat.name);
    onChange?.(newCat.name, newCat.icon);
  };

  const deleteCustomCategory = (nameToRemove: string) => {
    setCustomCategories((prev) => prev.filter((c) => c.name !== nameToRemove));
    if (selected === nameToRemove) {
      setSelected(null);
      onChange?.("", "");
    }
  };

  return (
    <fieldset className="flex w-full flex-col gap-y-4 border-none p-0 m-0">
      <legend className="sr-only">Selección de categoría</legend>

      {/* Lista de categorías existentes */}
      {allCategories.length > 0 && (
        <div
          className="flex flex-wrap gap-1 gap-y-2"
          role="group"
          aria-label="Categorías existentes"
        >
          {allCategories.map((item) => {
            const isSelected = selected === item.name;
            const iconKey = resolveCategoryIcon(item);
            return (
              <label
                key={item._id}
                className={`cursor-pointer px-3.5 py-1.5 rounded-xl border text-sm font-semibold transition flex items-center gap-1.5
                ${isSelected
                    ? "bg-black text-white border-black shadow-md"
                    : "bg-background text-gray-600 border-gray-300 hover:border-gray-400"
                  }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={item.name}
                  checked={isSelected}
                  onChange={() => handleSelectChange(item)}
                  className="sr-only"
                />
                <FoodCategoryIcon
                  iconName={iconKey}
                  categoryName={item.name}
                  size={15}
                />
                <span>{item.name}</span>
              </label>
            );
          })}
        </div>
      )}

      {/* Contenedor para nuevas categorías personalizadas con ícono */}
      <section className="flex w-full flex-col bg-background gap-y-3 border border-gray-300 rounded-xl p-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs text-gray-500 uppercase tracking-">
            Categorías personalizadas
          </h3>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-left px-2 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            <Plus size={20} />
            Agregar categoría
          </button>
        </div>

        {customCategories.length === 0 ? (
          <p className="text-xs text-gray-500 py-1">
            ¿No encuentras la categoría que buscas? Crea una nueva y elígele un ícono.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {customCategories.map((cat) => {
              const isSelected = selected === cat.name;
              return (
                <div
                  key={cat.name}
                  onClick={() => handleSelectCustom(cat)}
                  className={`cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl border text-sm font-bold transition-all ${isSelected
                    ? "bg-black text-white border-black shadow-md"
                    : "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                    }`}
                >
                  <FoodCategoryIcon iconName={cat.icon} size={15} />
                  <span>{cat.name}</span>
                  <button
                    type="button"
                    aria-label={`Eliminar ${cat.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCustomCategory(cat.name);
                    }}
                    className={`ml-1 rounded-2xl p-0.5 transition-colors ${isSelected
                      ? "hover:bg-white/20 text-white"
                      : "hover:text-red-500 text-indigo-500"
                      }`}
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCategory={handleAddCategoryFromModal}
      />
    </fieldset>
  );
}
