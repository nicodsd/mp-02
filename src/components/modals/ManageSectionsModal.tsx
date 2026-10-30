"use client";
import React, { useState, useEffect, Fragment } from "react";
import { URI } from "@/src/lib/const";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { updateMenuCookie } from "@/app/actions";
import { Plus, X, ChevronDown, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ManageSectionsModal({ isOpen, onClose, user, foods, template, onUpdateSections, top = true }: any) {
  const router = useRouter();
  const [sections, setSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const sectionKey = top ? "top_sections" : "bottom_sections";

  useEffect(() => {
    if (foods) {
      const categories = Array.from(new Set(foods.map((f: any) => f.sub_category).filter(Boolean))) as string[];
      setAvailableCategories(categories);
    }
  }, [foods]);

  useEffect(() => {
    if (user) {
      setSections(top ? (user.top_sections || []) : (user.bottom_sections || []));
    }
  }, [user, top]);

  const handleUpdateConfig = async () => {
    setLoading(true);
    try {
      let finalSections = [...sections];
      if (selectedCategory && !finalSections.includes(selectedCategory)) {
        finalSections.push(selectedCategory);
      }

      const res = await fetch(`${URI}/menu/update/config/${user.id || user.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          [sectionKey]: finalSections
        }),
      });

      if (res.ok) {
        let updatedSections = finalSections;
        try {
          const data = await res.json();
          if (data?.menu?.[sectionKey]) {
            updatedSections = data.menu[sectionKey];
          } else if (data?.[sectionKey]) {
            updatedSections = data[sectionKey];
          }
        } catch (_) { }

        await updateMenuCookie({ [sectionKey]: updatedSections });
        if (onUpdateSections) {
          onUpdateSections(updatedSections);
        }
        router.refresh();
        onClose();
      } else {
        console.error("Error al actualizar la configuración");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addSection = () => {
    if (selectedCategory && !sections.includes(selectedCategory)) {
      setSections([...sections, selectedCategory]);
      setSelectedCategory("");
    }
  };

  const removeSection = async (cat: string) => {
    const updated = sections.filter(c => c !== cat);
    setSections(updated);
    try {
      const res = await fetch(`${URI}/menu/update/config/${user.id || user.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          [sectionKey]: updated,
        }),
      });
      if (res.ok) {
        let updatedSections = updated;
        try {
          const data = await res.json();
          if (data?.menu?.[sectionKey]) {
            updatedSections = data.menu[sectionKey];
          } else if (data?.[sectionKey]) {
            updatedSections = data[sectionKey];
          }
        } catch (_) { }

        await updateMenuCookie({ [sectionKey]: updatedSections });
        if (onUpdateSections) {
          onUpdateSections(updatedSections);
        }
        router.refresh();
      } else {
        console.error("Error al actualizar la configuración");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
        >
          <div className="fixed inset-0 backdrop-blur-sm bg-gray-900/40" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
          >
            <DialogPanel className={`w-full bg-background max-w-lg rounded-2xl shadow-xl`}>
              <div className="px-6 py-5 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <DialogTitle className={`text-xl font-bold ${template?.textColor || "text-gray-900"}`}>
                    {top ? "Agregar sección superior" : "Agregar sección inferior"}
                  </DialogTitle>
                  <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">

                    <div className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <Listbox value={selectedCategory} onChange={setSelectedCategory}>
                          {({ open }) => (
                            <>
                              <ListboxButton className="w-full relative flex items-center justify-between bg-gray-50/80 border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 cursor-pointer shadow-sm">
                                <span className={`block truncate ${!selectedCategory ? "text-gray-400 font-normal" : "text-gray-900"}`}>
                                  {selectedCategory || "Selecciona una categoría..."}
                                </span>
                                <ChevronDown
                                  size={18}
                                  className={`text-gray-400 transition-transform duration-200 ml-2 shrink-0 ${open ? "rotate-180 text-black" : ""}`}
                                />
                              </ListboxButton>

                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                              >
                                <ListboxOptions className="absolute z-50 mt-1.5 max-h-56 w-full overflow-auto rounded-xl bg-white p-1.5 text-sm shadow-xl ring-1 ring-black/10 focus:outline-none">
                                  {availableCategories.length === 0 ? (
                                    <div className="py-2.5 px-3 text-center text-xs text-gray-400">
                                      No hay categorías disponibles
                                    </div>
                                  ) : (
                                    availableCategories.map((cat) => (
                                      <ListboxOption
                                        key={cat}
                                        value={cat}
                                        className={({ active, selected }) =>
                                          `relative flex cursor-pointer select-none items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-gray-100 text-black" : "text-gray-700"
                                          } ${selected ? "font-semibold text-black bg-gray-50" : ""}`
                                        }
                                      >
                                        {({ selected }) => (
                                          <>
                                            <span className="block truncate">{cat}</span>
                                            {selected && (
                                              <Check size={16} className="text-black ml-2 shrink-0" />
                                            )}
                                          </>
                                        )}
                                      </ListboxOption>
                                    ))
                                  )}
                                </ListboxOptions>
                              </Transition>
                            </>
                          )}
                        </Listbox>
                      </div>
                      <button
                        type="button"
                        onClick={addSection}
                        disabled={!selectedCategory}
                        className="flex items-center justify-center p-2.5 bg-black text-white rounded-xl shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 active:scale-95 transition-all duration-150"
                        title="Agregar sección"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {sections.length === 0 && (
                        <span className="text-xs text-gray-400">
                          {top ? "Sin secciones superiores" : "Sin secciones inferiores"}
                        </span>
                      )}
                      {sections.map(cat => (
                        <div key={cat} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm border border-gray-200">
                          {cat}
                          <button onClick={() => removeSection(cat)} className="hover:text-red-500 ml-1">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleUpdateConfig}
                    disabled={loading}
                    className="px-6 py-3 rounded-lg bg-primary text-white font-bold hover:bg-red-800 transition-colors disabled:bg-gray-400"
                  >
                    {loading ? "Guardando..." : "Guardar Cambios"}
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
