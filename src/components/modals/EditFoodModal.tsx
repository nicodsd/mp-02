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
  onUpdate,
}: EditFoodModalProps) {

  const [loading, setLoading] = useState(false);
  const updateFoodInStore = useFoodStore((state) => state.updateFood); // HOOK AFUERA

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    if (food) {
      setFormData({
        name: food.name || "",
        description: food.description || "",
        price: food.price || ""
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

    try {
      const res = await fetch(
        `${URI}foods/update/${food._id}`,
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
            <DialogPanel className="bg-background w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden">
              <form
                onSubmit={handleUpdate}
                className="flex flex-col md:flex-row h-full"
              >
                <div className="md:w-1/2 bg-black relative group min-h-60">
                  <Image
                    width={500}
                    height={500}
                    src={preview || "/placeholder-food.png"}
                    alt="Preview"
                    className="w-full h-60 object-cover"
                  />
                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
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

                <div className="md:w-1/2 px-5 pb-8 pt-5 flex flex-col gap-3">
                  <div className="flex justify-between items-center mb-2">
                    <DialogTitle className="text-xl font-bold text-gray-900 uppercase">
                      Editar
                    </DialogTitle>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Nombre
                    </label>
                    <input
                      className="border border-gray-200 p-2 outline-none text-lg focus:border-black rounded-lg transition-colors font-medium text-gray-800"
                      placeholder="Ej: Hamburguesa Triple"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Descripción / Ingredientes
                    </label>
                    <textarea
                      className="border border-gray-200 p-2 outline-none text-lg focus:border-black rounded-lg transition-colors font-medium text-gray-800 leading-relaxed"
                      placeholder="Describe los ingredientes..."
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
                      <label className="text-xl">Precio ($):</label>
                      <input
                        type="number"
                        className="border border-gray-200 w-20 p-2 text-xl text-center outline-none focus:border-black rounded-lg transition-colors font-bold text-gray-800"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                      />
                    </div>
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
