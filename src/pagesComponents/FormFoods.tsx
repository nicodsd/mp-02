"use client";
import Allergens from "@/src/components/newfood_comps/Allergens";
import Categories from "@/src/components/newfood_comps/Categories";
import Image from "next/image";
import { Button } from "@mui/material";
import { PhotoCamera, CloudUpload, DeleteOutline } from '@mui/icons-material';
import { useState, useEffect } from "react";

const imgPlaceholder = "/images/image_placeholder.png";

export default function FormFoods({
  initialCategories,
  user,
}: {
  initialCategories: any;
  user: any;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
  const [preview, setPreview] = useState<string>(imgPlaceholder); // URL para mostrar en <Image />
  const [file, setFile] = useState<File | null>(null); // archivo real
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categories, setCategories] = useState<any[]>(initialCategories || []);
  const [price, setPrice] = useState<string>("");
  //const [allergens, setAllergens] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  // liberar URL temporal al desmontar
  useEffect(() => {
    return () => {
      if (preview !== imgPlaceholder) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const imageCapture = (selectedFile: File) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    const imageUrl = URL.createObjectURL(selectedFile);
    setPreview(imageUrl);
    setError("");
  };

  const deleteImage = () => {
    if (preview !== imgPlaceholder) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(imgPlaceholder);
    console.log("Imagen eliminada");
  };

  const postFood = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado");

    const formData = new FormData();
    if (file) formData.append("photo", file);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", JSON.stringify(categories));
    formData.append("user_id", user.id);
    //formData.append("allergens", JSON.stringify(allergens));

    try {
      const res = await fetch(apiUrl + `api/foods/postfood`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
      setError("No se pudo crear el plato.");
    }
  };

  return (
    <form
      encType="multipart/form-data"
      onSubmit={postFood}
      className="min-h-screen flex flex-col bg-background-light relative dark:bg-background-dark text-gray-900 dark:text-gray-100 font-sans antialiased"
    >
      <div className="px-5 md:w-[25vw] mx-auto space-y-8 flex flex-col justify-center flex-1 py-10">

        {/* Sección de Imagen */}
        <div className="flex flex-col items-center gap-4 relative">
          <div className="w-48 h-48 rounded-3xl flex items-center justify-center shadow-inner border border-gray-400 relative overflow-hidden group">
            {preview ? (
              <Image
                src={preview}
                fill
                alt="Vista previa"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <PhotoCamera className="text-6xl text-gray-400 dark:text-gray-500" />
            )}

            {file && (
              <button
                type="button"
                onClick={deleteImage}
                className="absolute top-2 right-2 z-10 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              >
                <DeleteOutline fontSize="small" />
              </button>
            )}
          </div>

          <div className="flex flex-row gap-3 w-full justify-center">
            <label className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wide hover:opacity-90 transition-opacity shadow-sm cursor-pointer">
              <PhotoCamera sx={{ fontSize: 16 }} />
              Subir Imagen
              <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) imageCapture(f); }} />
            </label>

            <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wide hover:bg-blue-700 transition-colors shadow-sm cursor-pointer">
              <CloudUpload sx={{ fontSize: 16 }} />
              Galería
              <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) imageCapture(f); }} />
            </label>
          </div>
          {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
        </div>

        {/* Inputs de Texto */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-600 dark:text-gray-800 ml-1" htmlFor="name">Nombre</label>
            <input
              id="name"
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow shadow-sm"
              placeholder="Ej: Milanesa con papas"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-600 dark:text-gray-800 ml-1" htmlFor="description">Descripción</label>
            <textarea
              id="description"
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow shadow-sm resize-none"
              placeholder="Ej: Milanesa de carne vacuna acompañada de papas fritas caseras."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-600 dark:text-gray-800 ml-1" htmlFor="price">Precio</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input
                id="price"
                className="w-full bg-white border border-gray-300 rounded-lg pl-8 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow shadow-sm"
                placeholder="10.000"
                type="number"
                min="0"
                max="9999999"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Categorías */}
          <div className="flex flex-col w-full gap-1 min-h-[10vh]">
            <label className="font-semibold text-gray-600 dark:text-gray-800 ml-1">Categorías</label>
            <div className="w-full rounded-2xl">
              {initialCategories?.length > 0 ? (
                <Categories categoriesList={initialCategories} onChange={setCategories} />
              ) : (
                <p className="text-sm text-gray-400 italic p-2">Cargando categorías...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Botón Flotante de Acción */}
      <div className="w-full flex justify-center px-5 pb-15 pt-5 border-t border-gray-300">
        <button
          type="submit"
          className="w-full md:w-[25vw] bg-[#8400ff] hover:bg-green-800 text-gray-900 dark:text-white font-bold text-lg py-3.5 rounded-xl shadow-lg shadow-primary/30 transform active:scale-[0.98] transition-all"
        >
          Agregar Plato
        </button>
      </div>
    </form>
  );
}