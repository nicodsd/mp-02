"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaPhone, FaMapMarkerAlt, FaTimes, FaUser } from "react-icons/fa";
import { TbNotes } from "react-icons/tb";

const UserSettings = ({ user, token, apiUrl }: { user: any; token: string; apiUrl: string }) => {
  const [name, setName] = useState(user.name);
  const [preview, setPreview] = useState<string>(user.photo);
  const [file, setFile] = useState<File>();
  const [description, setDescription] = useState(user.description || "Bar de comida deliciosa, con un ambiente agradable y acogedor");
  const [location, setLocation] = useState(user.location || "Calle 123");
  const [phone, setPhone] = useState(user.phone || "1234567890");
  const [editName, setEditName] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [editLocation, setEditLocation] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [edit, setEdit] = useState(false);

  const handleEditName = () => {
    setEditName(!editName);
    setEdit(!edit);
  };

  const handleEditDescription = () => {
    setEditDescription(!editDescription);
    setEdit(!edit);
  };

  const handleEditLocation = () => {
    setEditLocation(!editLocation);
    setEdit(!edit);
  };

  const handleEditPhone = () => {
    setEditPhone(!editPhone);
    setEdit(!edit);
  };

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
    <form className="flex w-full flex-col items-center justify-center gap-3 px-">
      <h2 className="text-xl font-bold text-gray-600 dark:text-gray-800 text-start">Editar Perfil</h2>

      <div className="w-full flex items-center justify-center flex-col gap-10 px-7">
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
          <label className="absolute bottom-0 w-28 right-1/2 text-center -translate-x-1/2 translate-y-1/3 left-1/2 text-xs text-white bg-red-500 py-2.5 px-2 rounded-lg cursor-pointer hover:scale-110 transition">
            <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) imageCapture(f); }} />
            Cambiar Imagen
          </label>
        </div>

        <div className="w-full flex flex-col gap-8">
          {
            editName ?
              <div className="relative">
                <div className="flex items-center gap-1">
                  <FaUser className="text-xs" />
                  <h3 className="text-xs font-bold text-gray-600 dark:text-gray-800 text-start">Nombre</h3>
                </div>
                <div className="relative">
                  <input className="w-full bg-white border border-gray-300 mt-1 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-transparent outline-none" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                  <button onClick={(e) => { handleEditName(); e.preventDefault(); }} className="absolute top-1/2 bg-white -translate-y-1/2 px-3 right-1 text-xs font-bold text-gray-800"><FaTimes className="w-5 h-5" /></button>
                </div>
              </div>
              :
              <div className="w-full flex items-center justify-between">
                <div className="w-full flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <FaUser className="text-xs" />
                    <h3 className="text-xs font-bold text-gray-600 dark:text-gray-800 text-start">Nombre</h3>
                  </div>
                  <h3 className="text-lg text-gray-600 dark:text-gray-800 text-start">{name}</h3>
                </div>
                <button onClick={(e) => { handleEditName(); e.preventDefault(); }} className="text-xs font-bold text-gray-600 dark:text-gray-800">Editar</button>
              </div>
          }

          {
            editDescription ?
              <div className="relative">
                <div className="flex items-center gap-1">
                  <TbNotes className="text-xs" />
                  <h3 className="text-xs font-bold text-gray-600 dark:text-gray-800 text-start">Descripción</h3>
                </div>
                <div className="relative">
                  <input className="w-full bg-white border border-gray-300 mt-1 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-transparent outline-none" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                  <button onClick={(e) => { handleEditDescription(); e.preventDefault(); }} className="absolute top-1/2 px-3 bg-white -translate-y-1/2 right-1 text-xs font-bold text-gray-800 dark:text-gray-80"><FaTimes className="w-5 h-5" /></button>
                </div>
              </div>
              :
              <div className="w-full flex items-center justify-between">
                <div className="w-full flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <TbNotes className="text-xs" />
                    <h3 className="text-xs font-bold text-gray-600 dark:text-gray-800 text-start">Descripción</h3>
                  </div>
                  <h3 className="text-xs text-gray-600 dark:text-gray-800 text-start">{description}</h3>
                </div>
                <button onClick={(e) => { handleEditDescription(); e.preventDefault(); }} className="text-xs font-bold text-gray-600 dark:text-gray-800">Editar</button>
              </div>
          }
          {
            editLocation ?
              <div className="relative">
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-xs" />
                  <h3 className="text-xs font-bold text-gray-600 dark:text-gray-800 text-start">Ubicación</h3>
                </div>
                <div className="relative">
                  <input className="w-full bg-white border border-gray-300 mt-1 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-transparent outline-none" type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
                  <button onClick={(e) => { handleEditLocation(); e.preventDefault(); }} className="absolute top-1/2 px-3 bg-white -translate-y-1/2 right-1 text-xs font-bold text-gray-800 dark:text-gray-80"><FaTimes className="w-5 h-5" /></button>
                </div>
              </div>
              :
              <div className="w-full flex items-center justify-between">
                <div className="w-full flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-xs" />
                    <h3 className="text-xs font-bold text-gray-600 dark:text-gray-800 text-start">Ubicación</h3>
                  </div>
                  <h3 className="text-lg text-gray-600 dark:text-gray-800 text-start">{location}</h3>
                </div>
                <button onClick={(e) => { handleEditLocation(); e.preventDefault(); }} className="text-xs font-bold text-gray-600 dark:text-gray-800">Editar</button>
              </div>
          }
          {
            editPhone ?
              <div className="relative">
                <div className="flex items-center gap-1">
                  <FaPhone className="text-xs rotate-180" />
                  <h3 className="text-xs font-bold text-gray-600 dark:text-gray-800 text-start">Telefono</h3>
                </div>
                <div className="relative">
                  <input className="w-full bg-white border border-gray-300 mt-1 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-transparent outline-none" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <button onClick={(e) => { handleEditPhone(); e.preventDefault(); }} className="absolute top-1/2 px-3 bg-white -translate-y-1/2 right-1 text-xs font-bold text-gray-800"><FaTimes className="w-5 h-5" /></button>
                </div>
              </div>
              :
              <div className="w-full flex items-center justify-between">
                <div className="w-full flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <FaPhone className="text-xs rotate-180" />
                    <h3 className="text-xs font-bold text-gray-600 dark:text-gray-800 text-start">Telefono</h3>
                  </div>
                  <h3 className="text-lg text-gray-600 dark:text-gray-800 text-start">{phone}</h3>
                </div>
                <button onClick={(e) => { handleEditPhone(); e.preventDefault(); }} className="text-xs font-bold text-gray-600 dark:text-gray-800">Editar</button>
              </div>
          }
        </div>
      </div>

      {/* Acciones */}

      {
        edit ?
          <div className="w-full flex gap-3 border-t border-gray-200 px-7 pt-5">
            <button
              onClick={(e) => { handleEditName(); e.preventDefault(); }}
              type="button"
              className="px-6 py-3 border border-gray-200 cursor-pointer text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={postFood}
              className="w-full md:w-[25vw] bg-[#000000] cursor-pointer hover:bg-green-800 text-gray-900 dark:text-white font-bold text-lg py-3.5 rounded-xl shadow-primary/30 transform active:scale-[0.98] transition-all"
            >
              Guardar Cambios
            </button>
          </div>
          :
          null
      }
    </form>
  );
};
export default UserSettings;