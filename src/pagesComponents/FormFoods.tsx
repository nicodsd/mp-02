"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { URI } from "@/src/lib/const";
import Categories from "@/src/components/newfood_comps/Categories";
import { ImageUpload } from "@/src/components/newfood_comps/ImageUpload"; // El componente anterior
import { refreshPage } from "@/app/actions";
import { FaSpinner } from "react-icons/fa";

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
      const res = await fetch(`${URI}/foods/postfood/${user?.id}`, {
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
        router.push("/mi-menu");
        setError("");
      }, 1000);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={postFood} className="min-h-screen items-center pb-20 relative flex flex-col w-full">
      {error && <div className="w-[95%] mx-auto z-100 flex justify-between items-center fixed top-10 bg-primary p-4 rounded-lg border border-red-100">
        <div className="flex flex-col  items-start">
          {error.split(",").map((err: string, i: number) => (
            <p key={i} className="text-start text-white text-sm md:text-md font-semibold">- {err}</p>
          ))}
        </div>
        <button className="text-white cursor-pointer" onClick={() => {
          setError("");
          setLoading(false);
        }}>Cerrar</button>
      </div>}

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
          <InputGroup label="Nombre del Plato" id="name" maxLength={25} value={name} onChange={setName} placeholder="Ej: Hamburguesa Especial" required />
          <InputGroup label="Descripción" id="description" maxLength={30} value={description} onChange={setDescription} placeholder="Detalla ingredientes o preparación..." isTextArea />
          <InputGroup label="Precio" id="price" value={price} onChange={setPrice} maxLength={10} placeholder="0.00" type="number" isPrice />

          {/* Categorías con mejor contenedor */}
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold uppercase text-gray-500 tracking-wider ml-1">Categorías</label>
            <div className="p-2 rounded-2xl border border-gray-200">
              <Categories categoriesList={initialCategories} onChange={setSubCategories} user={user} />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full items-center h-fit md:min-h-24 md:items-center justify-end bg-background border-t border-gray-200 fixed bottom-0 left-0 right-0 z-70 flex gap-3 px-4 md:px-7 py-3">
        <div className="flex gap-2 w-auto">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 w-full active:scale-90 transition-all py-3 border cursor-pointer rounded-xl"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !name || !price || !description || !subCategories.length}
            className="w-fit active:scale-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-50 md:w-auto px-6 bg-black text-white py-3 rounded-xl flex justify-center cursor-pointer items-center gap-2"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Guardando...
              </>
            ) : (
              "Crear Plato"
            )}
          </button>
        </div>
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
        <textarea id={id} onChange={(e) => onChange(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" rows={2} {...props} />
      ) : (
        <input maxLength={props.maxLength} id={id} onChange={(e) => onChange(e.target.value)} className={`w-full border border-gray-300 rounded-lg ${isPrice ? "pl-8" : "px-4"} py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`} {...props} />
      )}
      {/*  <p className="text-xs text-gray-500 text-right absolute bottom-1 right-1">{props.maxLength - props.value.length} caracteres restantes</p> */}
    </div>
  </div>
);