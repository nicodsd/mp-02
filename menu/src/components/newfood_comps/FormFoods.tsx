"use client";
//----------------IMPORTS----------------------------------------
import Allergens from "@/src/components/newfood_comps/Allergens";
import NavBar from "@/src/layouts/NavBar";
import Categories from "@/src/components/newfood_comps/Categories";
import Image from "next/image";
import { Button } from "@mui/material";
import { CloudUpload, DeleteOutline, PhotoCamera } from "@mui/icons-material";
import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";

//----------------CONSTANTES-------------------------------------
const postFoodNav = 1;
const nombre = "Nuevo Plato";
const imgPlaceholder = "/images/image_placeholder.png";

export default function FormFoods({
  initialCategories,
}: {
  initialCategories: any[];
}) {
  // Estados para manejar los datos de entrada
  const [img, setImage] = useState<string>(imgPlaceholder);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [price, setPrice] = useState<string>("");
  const [allergens, setAllergens] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [off, setOff] = useState<boolean>(false);

  console.log("Initial Categories:", initialCategories);

  useEffect(() => {
    return () => {
      if (img !== imgPlaceholder) {
        URL.revokeObjectURL(img);
      }
    };
  }, [img]);

  const imageCapture = async (selectedFile: File) => {
    if (!selectedFile) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!validTypes.includes(selectedFile.type)) {
      setError("Formato no permitido. Usa JPG, PNG o WEBP.");
      return;
    }

    try {
      const options = {
        maxSizeMB: 1, // tamaño máximo deseado
        maxWidthOrHeight: 1024, // redimensiona si es necesario
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(selectedFile, options);
      const imageUrl = URL.createObjectURL(compressedFile);

      setImage(imageUrl);
      setOff(true);
      setError("");

      /*       console.log(
        "Imagen comprimida:",
        compressedFile.name,
        compressedFile.size
      ); */
    } catch (err) {
      console.error("Error al comprimir la imagen:", err);
      setError("No se pudo comprimir la imagen.");
    }
  };

  // Datos del formulario
  const data = {
    Image: img,
    Name: name,
    Description: description,
    Price: price,
    Allergens: allergens || "Ninguno",
    Categories: categories || [],
  };
  const delteImage = () => {
    if (img !== imgPlaceholder) {
      URL.revokeObjectURL(img); // libera la URL temporal
    }
    setOff(false);
    setImage(imgPlaceholder);
    console.log("Imagen eliminada");
  };

  // Ejemplo de función para manejar el submit
  const postFood = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado");

    // Aquí iría la lógica para guardar el plato
    /*     const formData = new FormData();
    formData.append("image", file); // file es el comprimido
    
    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    }); */
  };

  //AREA CONSOLE LOGS
  // console.log("Data:", data);
  //console.log("Text:", input);
  //console.log("RENDER");

  return (
    <>
      <NavBar state={postFoodNav} text={nombre} />
      <form
        encType="multipart/form-data"
        method="post"
        action="/"
        onSubmit={postFood}
        className="max-w-xl mx-auto p-4 rounded-lg space-y-6"
      >
        {/* Imagen */}
        <div className="flex flex-col justify-between">
          <div className="flex justify-center w-full">
            <div className="relative h-fit my-5">
              {error && <p style={{ color: "red" }}>{error}</p>}
              <Image
                loading="eager"
                src={img}
                width={260}
                height={260}
                alt="Vista previa"
                className="object-cover rounded-md max-h-[260px] max-w-[260px]"
              />
              {img && img !== imgPlaceholder && (
                <button
                  type="button"
                  onClick={delteImage}
                  className="absolute top-0 right-0 w-fit h-9 text-[10px] px-4 text-white bg-[#ff0000] border-gray-300 rounded cursor-pointer focus:outline-none"
                >
                  <DeleteOutline /> Borrar
                </button>
              )}
          {/* <h2 className="block text-[19px] font-medium text-gray-700 mb-1">
            Elegir imagen
          </h2> */}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Button
              sx={{
                bgcolor: "black",
                borderRadius: "5px",
                paddingX: "14px",
                paddingY: "6px",
                fontSize: "10px",
              }}
              disabled={off}
              component="label"
              variant="contained"
              startIcon={<PhotoCamera />}
            >
              Subir Imagen
              <input
                type="file"
                accept="image/*"
                capture="environment"
                hidden
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) imageCapture(file);
                }}
              />
            </Button>
            <Button
              sx={{
                bgcolor: "blue",
                borderRadius: "5px",
                paddingX: "14px",
                paddingY: "6px",
                fontSize: "10px",
              }}
              disabled={off}
              component="label"
              variant="contained"
              startIcon={<CloudUpload />}
            >
              Seleccionar de la galería
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) imageCapture(file);
                }}
              />
            </Button>
          </div>
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-[19px] font-semibold text-gray-500 mb-1">
            Nombre
          </label>
          <input
            placeholder="Ej: Milanesa con papas"
            type="text"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-[19px] font-semibold text-gray-500 mb-1">
            Descripción
          </label>
          <textarea
            placeholder="Ej: Milanesa de carne vacuna acompañada de papas fritas caseras."
            name="description"
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

        {/* Precio */}
        <div>
          <label className="block text-[19px] font-semibold text-gray-500 mb-1">
            Precio
          </label>
          <input
            type="number"
            name="price"
            step="0.01"
            min="0"
            placeholder="$10.000"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400"
          />
        </div>

        {/* Categorías */}
        <fieldset>
          <legend className="text-[19px] font-semibold text-gray-500 mb-3">
            Categorias
          </legend>
          <Categories
            categoriesList={initialCategories}
            onChange={setCategories}
          />
        </fieldset>

        {/* Alergenos */}
        <fieldset>
          <legend className="text-[19px] font-semibold text-gray-500 mb-2">
            Alergenos
          </legend>
          <Allergens dataAllergens={allergens} 
          setData={setAllergens} />
        </fieldset>

        {/* Botón */}
        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Agregar Plato
          </button>
        </div>
      </form>
    </>
  );
}
