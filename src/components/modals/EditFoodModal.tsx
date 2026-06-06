"use client";
import React, { useState, Fragment, useEffect } from "react";
import Image from "next/image";
import { refreshPage } from "@/app/actions";
import { useFoodStore } from "@/src/lib/useFoodStore";
import { URI } from '@/src/lib/const';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { FaCloudUploadAlt } from "react-icons/fa";

interface EditFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: any;
  onUpdate: () => void;
}

export default function EditFoodModal({
  isOpen,
  onClose,
  food,
  onUpdate
}: EditFoodModalProps) {

  const [loading, setLoading] = useState(false);
  const updateFoodInStore = useFoodStore((state) => state.updateFood); // HOOK AFUERA

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    is_archived: false,
    menus: [] as string[],
  });

  const [userMenus, setUserMenus] = useState<any[]>([]);

  useEffect(() => {
    const foodUserId = food?.user_id || food?.user;
    if (foodUserId) {
      fetch(`${URI}/menu/get-menus/${foodUserId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.menus) {
            setUserMenus(data.menus);
          }
        })
        .catch(err => console.error("Error fetching menus:", err));
    }
  }, [food]);

  useEffect(() => {
    if (food) {
      setFormData({
        name: food.name || "",
        description: food.description || "",
        price: food.price || "",
        is_archived: food.is_archived || false,
        menus: food.menus || [],
      });
      setPreview(food.photo || null);
    }
  }, [food]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = new FormData();
    if (file) dataToSend.append("photo", file);
    dataToSend.append("name", formData.name);
    dataToSend.append("description", formData.description);
    dataToSend.append("price", formData.price);
    dataToSend.append("is_archived", String(formData.is_archived));
    if (formData.menus && formData.menus.length > 0) {
      dataToSend.append("menus", JSON.stringify(formData.menus));
    }

    try {
      const res = await fetch(
        `${URI}/foods/update/${food._id}`,
        {
          method: "PUT",
          body: dataToSend,
          credentials: "include",
        },
      );

      if (res.ok) {
        const data = await res.json();

        const updatedObj = data.food || {
          ...food,
          ...formData,
          photo: preview,
        };
        updateFoodInStore(updatedObj);

        await refreshPage();
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-100" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
        >
          <div className="fixed inset-0 backdrop-blur-md bg-gray-500/30" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
          >
            <DialogPanel className={`w-full bg-background max-w-2xl rounded-xl shadow-2xl overflow-hidden`}>
              <form
                onSubmit={handleUpdate}
                className="flex flex-col md:flex-row h-full"
              >
                <div className="md:w-1/2 md:h-80 bg-black relative group h-fit rounded-br-2xl">
                  <Image
                    width={500}
                    height={500}
                    src={preview || "/placeholder-food.png"}
                    alt="Preview"
                    className="w-full md:h-full h-40 object-cover rounded-br-2xl"
                  />
                  <label className={`absolute inset-0 flex flex-col rounded-br-2xl items-center justify-center bg-black/30 opacity-100 hover:bg-black/40 transition-opacity cursor-pointer text-white`}>
                    <FaCloudUploadAlt size={30} />
                    <span className="font-bold text-xs mt-2 text-center px-4">
                      Click para cambiar imagen
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setFile(f);
                          setPreview(URL.createObjectURL(f));
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="md:w-1/2 px-4 pb-8 pt-5 flex flex-col gap-3">
                  <div className="flex justify-between items-center mb-2">
                    <DialogTitle className="text-lg font-semibold text-gray-900 uppercase">
                      Editar
                    </DialogTitle>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={`text-[10px] font-bold text-gray-700 uppercase tracking-widest ml-1`}>
                      Nombre
                    </label>
                    <input
                      className={`border border-gray-200 p-2 outline-none text-lg focus:border-black rounded-lg transition-colors font-medium text-gray-800`}
                      placeholder="Ej: Hamburguesa Triple"
                      maxLength={30}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                      Descripción o Ingredientes
                    </label>
                    <textarea
                      className="border border-gray-200 p-2 outline-none text-lg focus:border-black rounded-lg transition-colors font-medium text-gray-700 leading-relaxed"
                      placeholder="Describe los ingredientes..."
                      maxLength={50}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Campo Precio */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest ml-1">Precio</label>
                    <div className="relative">
                      <input
                        className="w-full border border-gray-300 rounded-lg px-10 text-[2rem] font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"

                        id="price"
                        name="price"
                        maxLength={10}
                        placeholder="0.00"
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                      />
                      <span className="absolute top-0 text-2xl left-0 flex items-center h-full px-3 text-gray-500">$</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-gray-100">
                    <div className="flex flex-col w-[65%]">
                      <label
                        htmlFor="archive-checkbox"
                        className="text-[10px] font-bold text-gray-700 uppercase tracking-widest cursor-pointer"
                        onClick={() =>
                          setFormData({ ...formData, is_archived: !formData.is_archived })
                        }
                      >
                        Archivar plato
                      </label>
                      <span className="text-xs text-gray-500 leading-tight">
                        Se ocultará del menú principal de tus clientes.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, is_archived: !formData.is_archived })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.is_archived ? "bg-gray-800" : "bg-gray-300"
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.is_archived ? "translate-x-6" : "translate-x-1"
                          }`}
                      />
                    </button>

                  </div>

                  {/* Menús */}
                  <div className="flex flex-col gap-1 mt-2">
                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Mostrar en los siguientes Menús:</label>
                    <div className="flex flex-wrap gap-2 p-1">
                      {userMenus.length === 0 ? (
                        <p className="text-[10px] text-gray-400">No se encontraron menús. Se mostrará en todos por defecto.</p>
                      ) : (
                        userMenus.map(m => {
                          const isSelected = formData.menus.includes(m._id);
                          return (
                            <button
                              type="button"
                              key={m._id}
                              onClick={() => {
                                if (isSelected) {
                                  setFormData({ ...formData, menus: formData.menus.filter(id => id !== m._id) });
                                } else {
                                  setFormData({ ...formData, menus: [...formData.menus, m._id] });
                                }
                              }}
                              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border ${isSelected
                                ? "bg-black text-white border-black shadow-sm"
                                : "bg-background border-gray-300 text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                              {m.location || 'Menú Principal'}
                            </button>
                          )
                        })
                      )}
                    </div>
                  </div>

                  <button
                    disabled={
                      loading ||
                      (
                        formData.name === (food?.name || "") &&
                        formData.description === (food?.description || "") &&
                        String(formData.price) === String(food?.price || "") &&
                        formData.is_archived === (food?.is_archived || false) &&
                        formData.menus.length === (food?.menus || []).length &&
                        formData.menus.every(id => (food?.menus || []).includes(id)) &&
                        file === null
                      )
                    }
                    className={`mt-4 w-full py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 shadow-gray-200
                      ${loading ||
                        (
                          formData.name === (food?.name || "") &&
                          formData.description === (food?.description || "") &&
                          String(formData.price) === String(food?.price || "") &&
                          formData.is_archived === (food?.is_archived || false) &&
                          formData.menus.length === (food?.menus || []).length &&
                          formData.menus.every(id => (food?.menus || []).includes(id)) &&
                          file === null
                        )
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary hover:bg-red-800 cursor-pointer"
                      }`}
                  >
                    {loading ? "Sincronizando..." : "Guardar Cambios"}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                  >
                    Cancelar
                  </button>

                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
