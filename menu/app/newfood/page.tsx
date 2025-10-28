"use client";
// Indicador para la barra de navegación
const postFoodNav = true;

//----------------IMPORTS----------------------------------------
import Allergens from "@/src/components/Allergens";
import Image from "next/image";
import NavBar from "@/src/layouts/NavBar";
import { useState, useRef } from "react";

//----------------CONSTANTES-------------------------------------
const imgPlaceholder = "/images/image_placeholder.png";
const nombre = "Nuevo Plato";

export default function NewFood() {
  // Estados para manejar los datos de entrada
  const [img, setImage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [allergens, setAllergens] = useState<string[]>([]);

  if (!img) {
    setImage(imgPlaceholder);
  }

  // Datos del formulario
  const data = {
    Image: img,
    Name: name,
    Description: description,
    Price: price,
    Allergens: allergens || "Ninguno",
  };

  
  const imageCapture = (event: any) => {
    setImage(URL.createObjectURL(event?.target.files[0]));
    console.log("Image captured");
  };
  const delteImage = () => {
    setImage("");
    console.log("Image deleted");
  };
  
  // Ejemplo de función para manejar el submit
  const postFood = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado");
    // Aquí iría la lógica para guardar el plato
  };
  
  //AREA CONSOLE LOGS
 // console.log("Data:", data);
  //console.log("Text:", input);
  //console.log("RENDER");

  return (
    <div className="w-full asap">
      <NavBar state={postFoodNav} text={nombre} />
      <form
        encType="multipart/form-data"
        method="post"
        action="/"
        onSubmit={postFood}
        className="max-w-xl mx-auto p-6 rounded-lg space-y-6"
      >
        {/* Imagen */}
        <div className="flex flex-col justify-between">
          <h2 className="block text-[16px] font-medium text-gray-700 mb-1">
            Elegir imagen
          </h2>
          <div className="flex items-center justify-around h-full w-full">
            <div className="flex flex-col items-end gap-1">
              <span className="bg-[#bec0c7] text-black border border-gray-400 font-bold text-[13px] flex items-center justify-center h-auto pl-3 rounded-lg">
                Subir Imagen
                <input
                  type="file"
                  name="image"
                  title="Subir imagen"
                  accept="image/*"
                  required
                  onChange={(e) => {
                    imageCapture(e);
                  }}
                  className="text-[0px] w-20 h-8 hover:cursor-pointer rounded-lg ml-2 bg-[#0044ff]"
                />
              </span>
              {img && img !== imgPlaceholder && (
                <button
                  type="button"
                  onClick={delteImage}
                  className="block w-24 h-8 text-[10px] px-4 text-white bg-[#ff0000] border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                >
                  Borrar imagen
                </button>
              )}
            </div>

            <Image
              loading="eager"
              src={img}
              width={250}
              height={250}
              alt={"Vista previa"}
              className=" w-min-10rem h-min-10rem object-contain rounded-md border border-gray-200"
            />
          </div>
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-large font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
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
          <label className="block text-[16px] font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
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
          <label className="block text-[16px] font-medium text-gray-700 mb-1">
            Precio
          </label>
          <input
            type="number"
            name="price"
            step="0.01"
            min="0"
            placeholder="$"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400"
          />
        </div>

        {/* Alergenos */}
        <fieldset>
          <legend className="text-[16px] font-medium text-gray-700 mb-2">
            Alergenos
          </legend>
          <Allergens dataAllergens={allergens} setData={setAllergens} />
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

      {/*  <Footer /> */}
    </div>
  );
}
