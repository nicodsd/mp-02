"use client";
import React, { useState } from "react";
import Image from "next/image";

const UserSettings = ({ user, token }: { user: any; token: string }) => {
  const [name, setName] = useState(user.name);
  const [img, setImage] = useState(user.photo);

  return (
    <form className="flex w-full flex-col items-center gap-6">
      <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-800 text-start">Editar Perfil</h2>
      {/* Avatar Circular con Botón de Edición */}
      <div className="relative group">
        <div className="w-40 h-40 rounded-full border-4 border-gray-100 shadow-xl overflow-hidden relative">
          <Image
            src={img || "/images/image_placeholder.png"}
            alt="Profile"
            width={200}
            height={200}
            quality={75}
            loading="lazy"
            className="object-cover w-full h-full"
          />
        </div>
        <label className="absolute bottom-0 right-1/2 w-fit -translate-x-1/2 translate-y-1/3 left-1/2 text-sm text-white bg-[#ff6600] py-1.5 px-2 rounded-xl border-2 border-white cursor-pointer hover:scale-110 transition shadow-md">
          <input type="file" className="hidden" accept="image/*" onChange={() => { }} /> Cambiar
        </label>
      </div>

      {/* Inputs de Formulario */}
      <div className="w-full space-y-4">
        <label className="font-semibold text-gray-600 dark:text-gray-800">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow shadow-sm"
        />
      </div>

      {/* Acciones */}
      <div className="w-full flex gap-3">
        <button
          type="submit"
          className="w-full md:w-[25vw] bg-[#0090d3] hover:bg-green-800 text-gray-900 dark:text-white font-bold text-lg py-3.5 rounded-xl shadow-primary/30 transform active:scale-[0.98] transition-all"
        >
          Guardar Cambios
        </button>
        <button
          type="button"
          className="px-6 py-3 border border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
export default UserSettings;