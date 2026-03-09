"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { updateUserCookie } from "@/app/actions";
import { useRouter } from "next/navigation";
import QrCode from "@/src/components/user-settings/QrCode";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaTimes,
  FaUser,
  FaSpinner,
} from "react-icons/fa";
import { TbNotes } from "react-icons/tb";

const URI = process.env.NEXT_PUBLIC_API_URL;

const UserSettings = ({ user, token }: { user: any; token: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(user.name);
  const [preview, setPreview] = useState<string>(user.photo);
  const [file, setFile] = useState<File>();
  const [description, setDescription] = useState(
    user.description || "Bar de comida deliciosa...",
  );
  const [location, setLocation] = useState(user.location || "");
  const [phone, setPhone] = useState(user.phone || "");

  const [editStates, setEditStates] = useState({
    name: false,
    description: false,
    location: false,
    phone: false,
    photo: false,
  });

  const isEditing = Object.values(editStates).some((state) => state === true);

  useEffect(() => {
    setName(user.name);
    setPreview(user.photo);
    setDescription(user.description || "");
    setLocation(user.location || "");
    setPhone(user.phone || "");

    setEditStates({
      name: false,
      description: false,
      location: false,
      phone: false,
      photo: false,
    });
  }, [user]);

  const toggleEdit = (field: keyof typeof editStates) => {
    setEditStates((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const imageCapture = (selectedFile: File) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setEditStates((prev) => ({ ...prev, photo: true }));
  };

  const userUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (file) formData.append("photo", file);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("phone", phone);
    formData.append("user_id", user.id);

    try {
      const res = await fetch(URI + `auth/update/${user.id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          console.error("Errores de validación:", data.errors);
          alert(`Error de validación: ${data.errors.join(", ")}`);
        } else {
          alert(data.message || "Ocurrió un error inesperado");
        }
        return;
      }

      if (data.success) {
        console.log("Usuario actualizado:", data.user);
        await updateUserCookie(data.user);
        router.refresh();
        setEditStates({
          name: false,
          description: false,
          location: false,
          phone: false,
          photo: false,
        });
      }
    } catch (error) {
      console.error("Error en la conexión:", error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={userUpdate}
        className="flex w-full flex-col items-center justify-center gap-3 px-"
      >
        <h2 className="text-xl font-bold text-gray-600 dark:text-gray-800 text-start">
          Editar Perfil
        </h2>

        <div className="w-full flex items-center justify-center flex-col gap-10 px-7">
          <div className="relative">
            <div className="w-40 h-40 rounded-full border-4 border-gray-100 shadow-xl overflow-hidden">
              <Image
                src={preview || "/images/image_placeholder.png"}
                alt="Profile"
                width={200}
                height={200}
                quality={75}
                loading="eager"
                className="object-cover w-full h-full"
              />
            </div>
            <label className="absolute bottom-0 w-28 right-1/2 text-center -translate-x-1/2 translate-y-1/3 left-1/2 text-xs text-white bg-red-500 py-2.5 px-2 rounded-lg cursor-pointer hover:scale-110 transition">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) imageCapture(f);
                }}
              />
              Cambiar Imagen
            </label>
          </div>

          <div className="w-full flex flex-col gap-8">
            <div className="w-full">
              {editStates.name ? (
                <div className="relative">
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-600 mb-1">
                    <FaUser /> Nombre
                  </label>
                  <div className="relative">
                    <input
                      className="w-full border p-3 rounded-lg"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => toggleEdit("name")}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-gray-600 mb-1">
                      <FaUser /> Nombre
                    </label>
                    <p className="text-lg">{name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleEdit("name")}
                    className="text-xs font-bold text-blue-500"
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>
            <div className="w-full">
              {editStates.description ? (
                <div className="relative">
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-600 mb-1">
                    <TbNotes /> Descripción
                  </label>
                  <div className="relative">
                    <input
                      className="w-full border p-3 rounded-lg"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => toggleEdit("description")}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-gray-600 mb-1">
                      <TbNotes /> Descripción
                    </label>
                    <p className="text-lg">{description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleEdit("description")}
                    className="text-xs font-bold text-blue-500"
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>

            <div className="w-full">
              {editStates.location ? (
                <div className="relative">
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-600 mb-1">
                    <FaMapMarkerAlt /> Ubicación
                  </label>
                  <div className="relative">
                    <input
                      className="w-full border p-3 rounded-lg"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => toggleEdit("location")}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-gray-600 mb-1">
                      <FaMapMarkerAlt /> Ubicación
                    </label>
                    <p className="text-lg">{location}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleEdit("location")}
                    className="text-xs font-bold text-blue-500"
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>
            <div className="w-full">
              {editStates.phone ? (
                <div className="relative">
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-600 mb-1">
                    <FaPhone className="rotate-180" /> Teléfono
                  </label>
                  <div className="relative">
                    <input
                      className="w-full border p-3 rounded-lg"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => toggleEdit("phone")}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-gray-600 mb-1">
                      <FaPhone className="rotate-180" /> Telefono
                    </label>
                    <p className="text-lg">{phone}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleEdit("phone")}
                    className="text-xs font-bold text-blue-500"
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Acciones */}

        {isEditing && (
          <div className="w-full flex gap-3 border-t border-gray-200 px-7 pt-5">
            <button
              type="button"
              onClick={() => router.refresh()} // Al refrescar se resetean los estados desde la cookie
              className="px-6 py-3 border rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3.5 rounded-xl flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        )}
      </form>
      <QrCode
        name={name}
        url={`${process.env.NEXT_PUBLIC_BASE_URL}/menu/${user.id}`}
        logoUrl={preview}
      />
    </>
  );
};
export default UserSettings;
