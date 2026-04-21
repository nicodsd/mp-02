"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { URI } from "@/src/lib/const";
import Categories from "@/src/components/newfood_comps/Categories";
import { ImageUpload } from "@/src/components/newfood_comps/ImageUpload"; // El componente anterior
import { refreshPage } from "@/app/actions";

const imgPlaceholder = "/images/placeholders/image_placeholder.png";

export default function FormFoods({ initialCategories, user }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>(imgPlaceholder);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    return () => { if (preview !== imgPlaceholder) URL.revokeObjectURL(preview); };
  }, [preview]);

  const handleImage = (selectedFile: File) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError("");
  };

  const postFood = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (file) formData.append("photo", file);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("sub_category", subCategories.join(","));
    formData.append("category", "Comidas");
    formData.append("promo_price", "0");
    formData.append("is_promo", "false");

    try {
      const res = await fetch(`${URI}foods/postfood/${user?.id}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      refreshPage();
      setError("Plato creado exitosamente");
      setTimeout(() => {
        setError("");
      }, 1000);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={postFood} className="min-h-screen items-center relative flex flex-col w-full">
      {error &&
        <div className="flex w-[90%] mx-auto fixed top-10 z-100 bg-red-50 p-3 rounded-lg border border-red-100 justify-around items-center">
          <p className="text-center text-red-500 text-xs font-bold">{error}</p>
          <button onClick={() => setError("")}>Cerrar</button>
        </div>
      }
      <header className="p-4 mt-3 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800">Plato Nuevo</h1>
        <p className="text-gray-500 text-sm">Agrega un nuevo plato a tu menú. <br />
          Recuerda que puedes editar y cambiar el orden de presentación de los platos cuando quieras.
        </p>
      </header>
      <div className="px-5 md:w-[400px] lg:w-1/3 w-full relative mx-auto space-y-10 py-5 flex-1">

        <ImageUpload
          preview={preview}
          file={file}
          imgPlaceholder={imgPlaceholder}
          onImageChange={handleImage}
          onDelete={() => { setFile(null); setPreview(imgPlaceholder); }}
        />

        {/* Inputs con mejor feedback visual */}
        <div className="space-y-7">
          <InputGroup label="Nombre del Plato" id="name" value={name} onChange={setName} placeholder="Ej: Hamburguesa Especial" required />
          <InputGroup label="Descripción" id="description" value={description} onChange={setDescription} placeholder="Detalla ingredientes o preparación..." isTextArea />
          <InputGroup label="Precio" id="price" value={price} onChange={setPrice} placeholder="0.00" type="number" isPrice />

          {/* Categorías con mejor contenedor */}
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold uppercase text-gray-500 tracking-wider ml-1">Categorías</label>
            <div className="p-2 rounded-2xl border border-gray-200">
              <Categories categoriesList={initialCategories} onChange={setSubCategories} user={user} />
            </div>
          </div>
        </div>
      </div>

      {/* Botón de Acción Fijo/Sticky para Mobile */}
      <div className="sticky bottom-0 flex items-center md:justify-end h-16 w-full border-t bg-background border-gray-300 py-1 md:gap-3 px-5">
        <button
          type="button"
          disabled={loading}
          onClick={() => router.back()}
          className={`w-fit px-4 md:px-10 max-w-[400px] mx-auto cursor-pointer md:mx-0 block py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 bg-gray-400
          `}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`w-fit px-4 md:px-20 max-w-[400px] mx-auto cursor-pointer md:mx-0 block py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800 shadow-lg shadow-gray-200"
            }`}
        >
          {loading ? "Guardando..." : "Crear Plato"}
        </button>
      </div>
    </form>
  );
}

const InputGroup = ({ label, id, isTextArea, isPrice, onChange, ...props }: any) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-[12px] font-bold uppercase text-gray-500 tracking-wider ml-1">{label}</label>
    <div className="relative">
      {isPrice && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>}
      {isTextArea ? (
        <textarea id={id} onChange={(e) => onChange(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" rows={3} {...props} />
      ) : (
        <input id={id} onChange={(e) => onChange(e.target.value)} className={`w-full border border-gray-300 rounded-lg ${isPrice ? "pl-8" : "px-4"} py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`} {...props} />
      )}
    </div>
  </div>
);