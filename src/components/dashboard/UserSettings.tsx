"use client";
import React, { useState } from "react";
import Image from "next/image";

const UserSettings = ({ user, token }: { user: any; token: string }) => {
  const [name, setName] = useState(user.name);
  const [img, setImage] = useState(user.photo);

  return (
    <form className="flex flex-col items-center gap-6">
      {/* Avatar Circular con Botón de Edición */}
      <div className="relative group">
        <div className="w-32 h-32 rounded-full border-4 border-gray-100 shadow-xl overflow-hidden relative">
          <Image
            src={img || "/images/image_placeholder.png"}
            alt="Profile"
            width={100}
            height={100}
            quality={75}
            loading="lazy"
            className="object-cover w-full h-full"
          />
        </div>
        <label className="absolute bottom-1 right-1 text-sm bg-[#2bee79] p-1.5 rounded-xl border-2 border-white cursor-pointer hover:scale-110 transition shadow-md">
          <input type="file" className="hidden" accept="image/*" onChange={() => { }} /> Cambiar
        </label>
      </div>

      {/* Inputs de Formulario */}
      <div className="w-full space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Nombre del Chef</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-100 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#2bee79]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Restaurante</label>
          <input
            type="text"
            placeholder="Nombre de tu local"
            className="w-full bg-gray-100 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#2bee79]"
          />
        </div>
      </div>

      {/* Acciones */}
      <div className="w-full flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-[#2bee79] text-[#102217] font-bold py-3 rounded-xl hover:opacity-90 transition shadow-sm"
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