"use client";
import React, { useState, Fragment, useMemo } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { X, Search, Check } from "lucide-react";
import { FOOD_ICONS, FoodCategoryIcon } from "@/src/components/icons/foods";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (category: { name: string; icon: string }) => void;
  initialName?: string;
  initialIcon?: string;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  onAddCategory,
  initialName = "",
  initialIcon = "Utensils",
}: AddCategoryModalProps) {
  const [categoryName, setCategoryName] = useState(initialName);
  const [selectedIcon, setSelectedIcon] = useState(initialIcon || "Utensils");
  const [searchIcon, setSearchIcon] = useState("");

  const filteredIcons = useMemo(() => {
    if (!searchIcon.trim()) return FOOD_ICONS;
    const query = searchIcon.toLowerCase().trim();
    return FOOD_ICONS.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
    );
  }, [searchIcon]);

  const handleConfirm = () => {
    const trimmed = categoryName.trim();
    if (!trimmed) return;
    onAddCategory({ name: trimmed, icon: selectedIcon });
    setCategoryName("");
    setSearchIcon("");
    setSelectedIcon("Utensils");
    onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-100" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 backdrop-blur-sm bg-gray-900/40" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-lg rounded-2xl bg-background border border-gray-200 shadow-2xl overflow-hidden">
              <div className="px-6 py-5 flex flex-col gap-5">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div>
                    <DialogTitle className="text-lg font-bold text-gray-900">
                      Nueva Categoría
                    </DialogTitle>
                    <p className="text-xs text-gray-500">
                      Escribe el nombre de la categoría y elige un ícono representativo
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                {/* Input de Nombre + Vista Previa */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="modal-category-name"
                    className="text-xs font-bold uppercase text-gray-500 tracking-wider"
                  >
                    Nombre de la categoría
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-black text-white shrink-0 shadow-sm">
                      <FoodCategoryIcon iconName={selectedIcon} size={22} />
                    </div>
                    <input
                      id="modal-category-name"
                      type="text"
                      maxLength={25}
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleConfirm();
                        }
                      }}
                      placeholder="Ej: Hamburguesas, Tragos, Pastas..."
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-base font-medium text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Selector de Íconos */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                      Elegir ícono ({FOOD_ICONS.length})
                    </label>
                    <div className="relative w-48">
                      <Search
                        size={14}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        value={searchIcon}
                        onChange={(e) => setSearchIcon(e.target.value)}
                        placeholder="Buscar ícono..."
                        className="w-full pl-8 pr-3 py-1 text-xs border border-gray-200 rounded-lg outline-none focus:border-gray-400 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-64 overflow-y-auto p-1 pr-1.5 border border-gray-100 rounded-xl bg-gray-50/60">
                    {filteredIcons.map(({ id, label, Icon }) => {
                      const isSelected = selectedIcon === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setSelectedIcon(id)}
                          className={`relative flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? "bg-black text-white border-black shadow-md scale-[1.02]"
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-100/70"
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-0.5">
                              <Check size={10} />
                            </span>
                          )}
                          <Icon size={22} />
                          <span className="text-[10px] font-semibold leading-tight line-clamp-1 w-full">
                            {label}
                          </span>
                        </button>
                      );
                    })}
                    {filteredIcons.length === 0 && (
                      <div className="col-span-full py-8 text-center text-xs text-gray-400">
                        No se encontraron íconos con "{searchIcon}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer / Acciones */}
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={!categoryName.trim()}
                    onClick={handleConfirm}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2 shadow-sm"
                  >
                    <FoodCategoryIcon iconName={selectedIcon} size={16} />
                    Guardar categoría
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
