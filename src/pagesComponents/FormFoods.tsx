"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { URI } from "@/src/lib/const";
import Categories from "@/src/components/newfood_comps/Categories";
import { ImageUpload } from "@/src/components/newfood_comps/ImageUpload";
import { refreshPage } from "@/app/actions";
import { FaSpinner, FaTrash, FaTimes, FaList, FaCheckCircle } from "react-icons/fa";
// 1. IMPORTAR FRAMER MOTION
import { motion, AnimatePresence } from "framer-motion";

const imgPlaceholder = "/images/placeholders/image_placeholder.png";

interface LocalFood {
  id: string;
  name: string;
  description: string;
  price: string;
  subCategories: string;
  file: File | null;
  preview: string;
  isGlutenFree: boolean; // Propiedad añadida al tipado
}

export default function FormFoods({ initialCategories, user }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // --- ESTADO PARA LA LISTA ACUMULADORA ---
  const [foodList, setFoodList] = useState<LocalFood[]>([]);

  // --- ESTADO PARA LOS PLATOS YA SUBIDOS EXITOSAMENTE (Para el Popup) ---
  const [uploadedFoods, setUploadedFoods] = useState<LocalFood[]>([]);

  // --- ESTADO PARA CONTROLAR EL SIDEBAR EN MÓVIL ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- ESTADOS DEL FORMULARIO ACTUAL ---
  const [preview, setPreview] = useState<string>(imgPlaceholder);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subCategories, setSubCategories] = useState<string>("");
  const [price, setPrice] = useState("");
  const [isGlutenFree, setIsGlutenFree] = useState(false); // Estado para el Switch TACC

  useEffect(() => {
    return () => { if (preview !== imgPlaceholder) URL.revokeObjectURL(preview); };
  }, [preview]);

  const handleImage = (selectedFile: File) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError("");
  };

  const resetFormFields = () => {
    setName("");
    setDescription("");
    setPrice("");
    setSubCategories("");
    setFile(null);
    setPreview(imgPlaceholder);
    setIsGlutenFree(false); // Resetear el switch
  };

  const handleAddFoodToList = (e: React.FormEvent) => {
    e.preventDefault();

    if (foodList.length >= 10) {
      setError("No puedes cargar más de 10 platos a la vez.");
      return;
    }

    const newFood: LocalFood = {
      id: crypto.randomUUID(),
      name,
      description,
      price,
      subCategories,
      file,
      preview,
      isGlutenFree // Guardamos la propiedad en el objeto
    };

    setFoodList([...foodList, newFood]);
    resetFormFields();
  };

  const handleClearFoodList = () => {
    setFoodList([]);
  };

  const handleRemoveFromList = (id: string, currentPreview: string) => {
    if (currentPreview !== imgPlaceholder) URL.revokeObjectURL(currentPreview);
    setFoodList(foodList.filter(item => item.id !== id));
  };

  const handlePostAllFoods = async () => {
    if (foodList.length === 0) return;
    setLoading(true);
    setError("");
    setSuccessMessage("");
    setUploadedFoods([]);
    setIsSidebarOpen(false);

    const foodsToUpload = [...foodList];

    try {
      const uploadPromises = foodsToUpload.map(async (food) => {
        const formData = new FormData();
        if (food.file) formData.append("photo", food.file);
        formData.append("name", food.name);
        formData.append("description", food.description);
        formData.append("price", food.price);
        formData.append("sub_category", food.subCategories);
        formData.append("category", "Comidas");
        formData.append("promo_price", "0");
        formData.append("is_promo", "false");
        formData.append("is_gluten_free", String(food.isGlutenFree)); // Enviado a la API

        const res = await fetch(`${URI}/foods/postfood/${user?.id}`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || `Error al subir el plato: ${food.name}`);
        }
        return res.json();
      });

      await Promise.all(uploadPromises);

      refreshPage();

      setUploadedFoods(foodsToUpload);
      setSuccessMessage("¡Todos los platos se han cargado exitosamente!");
      setFoodList([]);

      setTimeout(() => {
        router.push("/mi-menu");
        setSuccessMessage("");
        setUploadedFoods([]);
      }, 5000);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al enviar los platos.");
    } finally {
      setLoading(false);
    }
  };

  const closeToast = () => {
    setError("");
    setSuccessMessage("");
    setUploadedFoods([]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen pb-24 relative w-full flex flex-col items-center bg-background-2">

      <AnimatePresence>
        {(error || successMessage) && (
          <div className="w-full fixed top-5 left-0 right-0 z-100 flex justify-center items-center pointer-events-none px-4">
            <motion.div
              initial={{ opacity: 0, y: -100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`pointer-events-auto w-full max-w-md mx-auto flex flex-col rounded-2xl border shadow-2xl p-4 overflow-hidden ${error ? "bg-red-50 border-red-200" : "bg-white border-green-200"
                }`}
            >
              <div className="flex justify-between items-start gap-3 w-full">
                <div className="flex flex-col items-start flex-1">
                  <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${error ? "text-red-500" : "text-green-600"}`}>
                    {error ? "Hubo un problema" : "Operación Exitosa"}
                  </span>
                  {(error || successMessage).split(",").map((msg: string, i: number) => (
                    <p key={i} className="text-start text-gray-900 text-sm font-semibold">{msg}</p>
                  ))}
                </div>
                <button
                  className={`cursor-pointer font-bold text-xs px-3 py-1.5 rounded-lg transition-colors ${error ? "bg-red-200 text-red-800 hover:bg-red-300" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  onClick={closeToast}
                >
                  Cerrar
                </button>
              </div>

              {successMessage && uploadedFoods.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100 w-full">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <FaCheckCircle className="text-green-500" /> Platos guardados en la Base de Datos:
                  </p>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {uploadedFoods.map((food) => (
                      <div key={food.id} className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-800 text-md truncate">{food.name}</h4>
                            {food.isGlutenFree && (
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border border-amber-200">Sin TACC</span>
                            )}
                          </div>
                          <span className="text-xs font-semibold ">${food.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BOTÓN FLOTANTE MÓVIL */}
      <button
        aria-label="Abrir lista de platos"
        type="button"
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-5 right-4 z-40 bg-background ring-7 ring-background text-gray-800 border-gray-800 border p-4 rounded-full active:scale-90 transition-all"
      >
        <div className="relative">
          <FaList size={28} />
          {foodList.length > 0 && (
            <span className="absolute -top-6 -right-2 bg-red-500 text-white text-sm font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {foodList.length}
            </span>
          )}
        </div>
      </button>

      {/* Header General */}
      <header className="p-4 bg-background mt-3 flex flex-col gap-2 text-center md:text-left w-[90%] max-w-6xl border border-gray-300 rounded-2xl">
        <h1 className="text-2xl font-bold text-gray-800">Carga de Platos</h1>
        <p className="text-gray-500 text-sm">
          Completa los datos, agrega los platos a tu lista temporal y luego cárgalos al menú.
        </p>
      </header>

      {/* --- CONTENEDOR PRINCIPAL --- */}
      <div className="flex flex-col lg:flex-row gap-4 pb-10 w-full max-w-6xl md:px-4 mt-5 flex-1 items-start">

        {/* COLUMNA 1: Formulario Inmóvil de Carga */}
        <form onSubmit={handleAddFoodToList} className="w-full lg:w-1/2 md:bg-background p-3 md:rounded-2xl md:border md:border-gray-100 space-y-6 md:shadow-sm">
          <h2 className="text-lg font-bold text-gray-700 pb-2">Datos del Plato</h2>

          <ImageUpload
            preview={preview}
            file={file}
            imgPlaceholder={imgPlaceholder}
            onImageChange={handleImage}
            onDelete={() => { setFile(null); setPreview(imgPlaceholder); }}
          />

          <div className="space-y-8">
            <InputGroup label="Nombre" id="name" maxLength={25} value={name} onChange={setName} placeholder="Ej: Hamburguesa Especial" required />
            <InputGroup label="Descripción" id="description" maxLength={30} value={description} onChange={setDescription} placeholder="Detalla ingredientes o preparación..." isTextArea />

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold uppercase text-gray-500 tracking-wider ml-1">Precio</label>
              <div className="relative">
                <input
                  className="w-full border bg-background border-gray-300 rounded-lg px-10 text-[2.5rem] font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  id="price"
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  maxLength={10}
                  placeholder="0.00"
                  type="number"
                  required
                />
                <span className="absolute top-0 text-2xl left-0 flex items-center h-full px-3 text-gray-500">$</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold uppercase text-gray-500 tracking-wider ml-1">Categorías</label>
              <div className="p-3 rounded-2xl bg-background border border-gray-200">
                <Categories categoriesList={initialCategories} onChange={setSubCategories} user={user} />
              </div>
            </div>
            {/* INTERFAZ DEL SWITCH: APTOS LIBRE DE TACC */}
            <div className="flex items-center justify-between p-3 bg-background border border-gray-300 rounded-xl">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-700">Libre de TACC / Sin Gluten</span>
                <span className="text-xs text-gray-400">Activa esta casilla si el plato es apto para celíacos</span>
              </div>
              <button
                type="button"
                onClick={() => setIsGlutenFree(!isGlutenFree)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 focus:outline-none ${isGlutenFree ? "bg-amber-500" : "bg-gray-300"
                  }`}
              >
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="bg-white w-4 h-4 rounded-full shadow-md"
                  animate={{ x: isGlutenFree ? 24 : 0 }}
                />
              </button>
            </div>
            <button
              type="submit"
              disabled={!name || !price || !description || !subCategories.length}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              + Agregar a la lista ({foodList.length}/10)
            </button>
          </div>
        </form>

        {/* --- CONTENEDOR 2: DUAL (Sidebar en Móvil / Panel fijo en Escritorio) --- */}
        <>
          {isSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-50 transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <div className={`
            fixed top-0 right-0 h-full w-full sm:w-[450px] bg-background z-50 md:p-6 p-4 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform
            ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
            lg:static lg:translate-x-0 lg:w-1/2 lg:bg-gray-50 lg:p-6 lg:rounded-2xl lg:border lg:border-gray-200 lg:shadow-none lg:min-h-[400px]
          `}>
            <div className="flex items-center justify-between pb-3 mb-4">
              <h2 className="text-lg font-bold text-gray-700">
                Lista de Espera ({foodList.length})
              </h2>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {foodList.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2 py-12">
                <p className="text-sm">No has agregado platos a la lista todavía.</p>
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto pr-1 flex-1 max-h-[calc(100vh-160px)] lg:max-h-[500px]">
                {foodList.map((food) => (
                  <div key={food.id} className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={food.preview}
                        alt={food.name}
                        className="w-13 h-13 rounded-lg object-cover bg-gray-100"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-gray-800 text-sm">{food.name}</h4>
                          {food.isGlutenFree && (
                            <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1 rounded border border-amber-200">Sin TACC</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1">{food.description}</p>
                        <span className="text-xs font-semibold text-green-600">${food.price}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFromList(food.id, food.preview)}
                      className="p-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            )}

            {foodList.length > 0 && (
              <div className="flex gap-2 w-full">
                <button
                  type="button"
                  onClick={handleClearFoodList}
                  disabled={loading}
                  className="lg:hidden mt-4 w-1/2 text-gray-900 py-3 font-semibold flex justify-center items-center gap-2"
                >
                  Quitar Todo
                </button>
                <button
                  type="button"
                  onClick={handlePostAllFoods}
                  disabled={loading}
                  className="lg:hidden mt-4 w-full bg-black text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : `Confirmar y Cargar (${foodList.length})`}
                </button>
              </div>
            )}
          </div>
        </>
      </div>

      {/* --- FOOTER FIJO PRINCIPAL --- */}
      <div className="w-full items-center h-fit md:min-h-24 justify-end bg-background border-t border-gray-200 fixed bottom-0 left-0 right-0 z-40 flex gap-3 px-4 md:px-7 py-3">
        <button
          type="button"
          onClick={() => router.replace("/mi-menu")}
          className="text-gray-700 cursor-pointer bg-background border border-gray-400 inline-flex active:scale-95 transition-all items-center px-8 py-3 text-md font-bold rounded-lg"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handlePostAllFoods}
          disabled={loading || foodList.length === 0}
          className="inline-flex active:scale-90 transition-all cursor-pointer items-center w-full min-w-40 max-w-50 justify-center px-8 py-3 text-md font-bold text-white bg-black hover:bg-[#0009] rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> Guardando ({foodList && foodList.length})...
            </>
          ) : (
            `Cargar Platos ${foodList.length > 0 ? foodList.length : ''}`
          )}
        </button>
      </div>
    </div>
  );
}

const InputGroup = ({ label, id, isTextArea, isPrice, onChange, ...props }: any) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-[12px] font-bold uppercase text-gray-500 tracking-wider ml-1">{label}</label>
    <div className="relative">
      {isTextArea ? (
        <textarea id={id} value={props.value} onChange={(e) => onChange(e.target.value)} className="w-full bg-background border border-gray-300 text-xl rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" rows={2} {...props} />
      ) : (
        <input maxLength={props.maxLength} id={id} value={props.value} onChange={(e) => onChange(e.target.value)} className={`w-full bg-background border text-xl border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`} {...props} />
      )}
    </div>
  </div>
);