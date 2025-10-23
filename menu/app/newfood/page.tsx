import Allergens from "@/src/components/Allergens";
import Image from "next/image";
import NavBar from "@/src/layouts/NavBar";

const homeState = true;
const nombre = "Nuevo Plato";

let imageUrl = "";
const imageAlt = "";

export default function NewFood() {
  const myImage = imageUrl || "/images/placeholder.png";

  // Ejemplo de función para manejar el submit
  const postFood = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado");
    // Aquí iría la lógica para guardar el plato
  };

  return (
    <div className="w-full asap">
      <NavBar state={homeState} text={nombre} />
      <form
        encType="multipart/form-data"
        method="post"
        action="/"
        onSubmit={""}
        className="max-w-xl mx-auto p-6 rounded-lg space-y-6"
      >
        {/* Imagen */}
        <div className="flex flex-col justify-between">
          <h2 className="block text-[16px] font-medium text-gray-700 mb-1">
            Elegir imagen
          </h2>
          <div className="flex items-center justify-around h-full w-full">
            <div className="flex flex-col gap-1">
              <input
                type="file"
                name="image"
                accept="image/*"
                required
                className="block h-8 text-[10px] px-4 text-white bg-black border-gray-300 rounded-lg cursor-pointer focus:outline-none"
              />
              <button
                type="button"
                className="block w-24 h-8 text-[10px] px-4 text-white bg-[#ff0000] border-gray-300 rounded-lg cursor-pointer focus:outline-none"
              >
                Borrar imagen
              </button>
            </div>

            <Image
              src={myImage}
              alt={imageAlt || "Vista previa"}
              width={160}
              height={160}
              className="bg-gray-200 object-cover rounded-md border border-gray-200"
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
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400"
          />
        </div>

        {/* Alergenos */}
        <fieldset>
          <legend className="text-[16px] font-medium text-gray-700 mb-2">
            Alergenos
          </legend>
          <Allergens />
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
