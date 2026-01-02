"use client";
import React, { useState } from "react";
import InputsUserSettings from "@/src/components/dashboard_comps/InputsUserSettings";
import Image from "next/image";

const UserSettings = ({ user, token, apiUrl }: { user: any; token: string; apiUrl: string }) => {
  const [name, setName] = useState(user.name);
  const [preview, setPreview] = useState<string>(user.photo);
  const [file, setFile] = useState<File>();
  const [description, setDescription] = useState(user.description);
  const [location, setLocation] = useState(user.location);
  const [phone, setPhone] = useState(user.phone);

  const imageCapture = (selectedFile: File) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    const imageUrl = URL.createObjectURL(selectedFile);
    setPreview(imageUrl);
  };

  const postFood = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado");

    const formData = new FormData();
    if (file) formData.append("photo", file);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("phone", phone);
    formData.append("user_id", user.id)

    try {
      const res = await fetch(apiUrl + `api/auth/update/${user.id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form className="flex w-full flex-col items-center justify-center gap-6 px-5">
      <h2 className="text-xl font-bold text-gray-600 dark:text-gray-800 text-start">Editar Perfil</h2>
      {/* Avatar Circular con Botón de Edición */}
      <div className="relative">
        <div className="w-40 h-40 rounded-full border-4 border-gray-100 shadow-xl overflow-hidden">
          <Image
            src={preview || "/images/image_placeholder.png"}
            alt="Profile"
            width={200}
            height={200}
            quality={75}
            loading="lazy"
            className="object-cover w-full h-full"
          />
        </div>
        <label className="absolute bottom-0 right-1/2 w-36 text-center -translate-x-1/2 translate-y-1/3 left-1/2 text-sm text-white bg-[#07439c] py-1.5 px-2 rounded-xl border-2 border-white cursor-pointer hover:scale-110 transition shadow-md">
          <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) imageCapture(f); }} />
          Cambiar Imagen
        </label>
      </div>

      <InputsUserSettings name={name} setName={setName} description={description} setDescription={setDescription} location={location} setLocation={setLocation} phone={phone} setPhone={setPhone} />

      {/* Acciones */}
      <div className="w-full flex gap-3">
        <button
          type="button"
          onClick={postFood}
          className="w-full md:w-[25vw] bg-[#000000] cursor-pointer hover:bg-green-800 text-gray-900 dark:text-white font-bold text-lg py-3.5 rounded-xl shadow-primary/30 transform active:scale-[0.98] transition-all"
        >
          Guardar Cambios
        </button>
        <button
          type="button"
          className="px-6 py-3 border border-gray-200 cursor-pointer text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
export default UserSettings;