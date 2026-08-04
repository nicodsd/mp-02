"use client";
import React, { useState, useEffect, Fragment } from "react";
import { URI } from "@/src/lib/const";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Plus, X } from "lucide-react";

export default function ManageSectionsModal({ isOpen, onClose, user, foods, template }: any) {
  const [topSections, setTopSections] = useState<string[]>([]);
  const [bottomSections, setBottomSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  const [selectedTop, setSelectedTop] = useState("");
  const [selectedBottom, setSelectedBottom] = useState("");

  useEffect(() => {
    if (foods) {
      const categories = Array.from(new Set(foods.map((f: any) => f.sub_category).filter(Boolean))) as string[];
      setAvailableCategories(categories);
    }
  }, [foods]);

  useEffect(() => {
    if (user) {
      setTopSections(user.top_sections || []);
      setBottomSections(user.bottom_sections || []);
    }
  }, [user]);

  const handleUpdateConfig = async () => {
    setLoading(true);
    try {
      let finalTop = [...topSections];
      if (selectedTop && !finalTop.includes(selectedTop)) {
        finalTop.push(selectedTop);
      }

      let finalBottom = [...bottomSections];
      if (selectedBottom && !finalBottom.includes(selectedBottom)) {
        finalBottom.push(selectedBottom);
      }

      const res = await fetch(`${URI}/menu/update/config/${user.id || user.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          template_id: user.template_id,
          navBar: user.navBar,
          presentation: user.presentation,
          enable_bebidas: user.enable_bebidas,
          enable_postres: user.enable_postres,
          multipleStores: user.multipleStores,
          deliveryZones: user.deliveryZones,
          delivery: user.delivery,
          paymentOptions: user.paymentOptions,
          whatsAppCart: user.whatsAppCart,
          productsVisibilityPay: user.productsVisibilityPay,
          top_sections: finalTop,
          bottom_sections: finalBottom,
        }),
      });

      if (res.ok) {
        window.location.reload();
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

  const addTopSection = () => {
    if (selectedTop && !topSections.includes(selectedTop)) {
      setTopSections([...topSections, selectedTop]);
      setSelectedTop("");
    }
  };

  const addBottomSection = () => {
    if (selectedBottom && !bottomSections.includes(selectedBottom)) {
      setBottomSections([...bottomSections, selectedBottom]);
      setSelectedBottom("");
    }
  };

  const removeTopSection = (cat: string) => {
    setTopSections(topSections.filter(c => c !== cat));
  };

  const removeBottomSection = (cat: string) => {
    setBottomSections(bottomSections.filter(c => c !== cat));
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
            <DialogPanel className={`w-full bg-background max-w-lg rounded-2xl shadow-xl overflow-hidden`}>
              <div className="px-6 py-5 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <DialogTitle className={`text-xl font-bold ${template?.textColor || "text-gray-900"}`}>
                    Administrar Secciones
                  </DialogTitle>
                  <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Top Sections */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Secciones Superiores (Antes de Platos Principales)
                    </label>
                    <div className="flex gap-2">
                      <select
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-black"
                        value={selectedTop}
                        onChange={(e) => setSelectedTop(e.target.value)}
                      >
                        <option value="">Selecciona una categoría...</option>
                        {availableCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={addTopSection}
                        disabled={!selectedTop}
                        className="bg-black text-white px-3 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-800 transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {topSections.length === 0 && <span className="text-xs text-gray-400">Sin secciones superiores</span>}
                      {topSections.map(cat => (
                        <div key={cat} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm border border-gray-200">
                          {cat}
                          <button onClick={() => removeTopSection(cat)} className="hover:text-red-500 ml-1">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  {/* Bottom Sections */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Secciones Inferiores (Después de Platos Principales)
                    </label>
                    <div className="flex gap-2">
                      <select
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-black"
                        value={selectedBottom}
                        onChange={(e) => setSelectedBottom(e.target.value)}
                      >
                        <option value="">Selecciona una categoría...</option>
                        {availableCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={addBottomSection}
                        disabled={!selectedBottom}
                        className="bg-black text-white px-3 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-800 transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {bottomSections.length === 0 && <span className="text-xs text-gray-400">Sin secciones inferiores</span>}
                      {bottomSections.map(cat => (
                        <div key={cat} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm border border-gray-200">
                          {cat}
                          <button onClick={() => removeBottomSection(cat)} className="hover:text-red-500 ml-1">
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
                    className="px-6 py-2 rounded-lg bg-primary text-white font-bold hover:bg-red-800 transition-colors disabled:bg-gray-400"
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
