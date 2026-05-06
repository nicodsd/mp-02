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
  });

  useEffect(() => {
    if (food) {
      setFormData({
        name: food.name || "",
        description: food.description || "",
        price: food.price || "",
        is_archived: food.is_archived || false,
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
            <DialogPanel className={`w-full bg-white max-w-2xl rounded-xl shadow-2xl overflow-hidden`}>
              <form
                onSubmit={handleUpdate}
                className="flex flex-col md:flex-row h-full"
              >
                <div className="md:w-1/2 bg-black relative group h-fit">
                  <Image
                    width={500}
                    height={500}
                    src={preview || "/placeholder-food.png"}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                  />
                  <label className={`absolute inset-0 flex flex-col items-center justify-center bg-black/30 opacity-100 hover:bg-black/40 transition-opacity cursor-pointer text-white`}>
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
                      Descripción / Ingredientes
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
                    <div className="w-full flex items-center justify-end gap-2">
                      <label className="text-2xl text-gray-800 font-bold tracking-widest flex items-center justify-center gap-2"> <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Precio</span> $</label>
                      <input
                        type="number"
                        className="border border-gray-200 w-30 p-2 text-3xl text-center outline-none focus:border-black rounded-2xl transition-colors font-bold text-gray-800"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                      />
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

                  <button
                    disabled={loading}
                    className={`mt-4 w-full py-3 rounded-xl font-bold text-white transition-all transform active:scale-95 shadow-gray-200
                      ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-red-800 cursor-pointer"}`}
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
