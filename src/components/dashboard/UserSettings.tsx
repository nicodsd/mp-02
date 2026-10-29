"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { updateUserCookie, updateMenuCookie, logout } from "@/app/actions";
import QrCode from "@/src/components/user-settings/QrCode";
import { placeholder } from "@/src/lib/const";
import { HiOutlineLogout } from "react-icons/hi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OctagonX, Store, ArrowLeft, ChevronLeft } from "lucide-react";
import {
  FaCamera,
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaTimes,
  FaSpinner,
  FaClock,
} from "react-icons/fa";
import { TbNotes } from "react-icons/tb";
import { URI } from "@/src/lib/const";
import { motion } from "framer-motion";

const UserSettings = ({ user }: { user: any }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name);
  const [previewPhoto, setPreviewPhoto] = useState<string>(user?.photo);
  const [previewBackground, setPreviewBackground] = useState<string>(user?.cover);
  const [filePhoto, setFilePhoto] = useState<File>();
  const [fileBackground, setFileBackground] = useState<File>();
  const [description, setDescription] = useState(
    user?.description || "",
  );
  const [schedule, setSchedule] = useState(user?.schedule || "");
  const [location, setLocation] = useState(user?.location || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [instagram, setInstagram] = useState(user?.instagram || "");
  const [facebook, setFacebook] = useState(user?.facebook || "");
  const [tiktok, setTiktok] = useState(user?.tiktok || "");

  // Estado para controlar la sección de edición abierta en pantalla completa
  const [activeEditField, setActiveEditField] = useState<string | null>(null);

  const [editStates, setEditStates] = useState({
    name: false,
    description: false,
    schedule: false,
    location: false,
    phone: false,
    photo: false,
    cover: false,
    instagram: false,
    facebook: false,
    tiktok: false,
  });

  const isEditing = Object.values(editStates).some((state) => state === true);

  useEffect(() => {
    setName(user?.name);
    setPreviewPhoto(user?.photo || placeholder);
    setPreviewBackground(user?.cover || placeholder);
    setDescription(user?.description || "");
    setSchedule(user?.schedule || "");
    setLocation(user?.location || "");
    setPhone(user?.phone || "");
    setInstagram(user?.instagram || "");
    setFacebook(user?.facebook || "");
    setTiktok(user?.tiktok || "");

    setEditStates({
      name: false,
      description: false,
      schedule: false,
      location: false,
      phone: false,
      photo: false,
      cover: false,
      instagram: false,
      facebook: false,
      tiktok: false,
    });
    setActiveEditField(null);
  }, [user]);

  const prefix = phone.slice(0, 3);
  const number = phone.slice(3);
  const phoneFormated = prefix + number;

  const cancelChanges = () => {
    setName(user?.name);
    setPreviewPhoto(user?.photo || placeholder);
    setPreviewBackground(user?.cover || placeholder);
    setDescription(user?.description || "");
    setSchedule(user?.schedule || "");
    setLocation(user?.location || "");
    setPhone(user?.phone || "");
    setInstagram(user?.instagram || "");
    setFacebook(user?.facebook || "");
    setTiktok(user?.tiktok || "");

    setEditStates({
      name: false,
      description: false,
      schedule: false,
      location: false,
      phone: false,
      photo: false,
      cover: false,
      instagram: false,
      facebook: false,
      tiktok: false,
    });
    setActiveEditField(null);
  };

  const hadleLogoutUserAction = async (userId: string) => {
    try {
      const response = await fetch(`${URI}/auth/signout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      if (!response.ok) {
        throw new Error("Error al cerrar sesión");
      }
      if (response.status === 200) {
        await logout();
      }
    } catch (err) {
      console.error("Error en logout:", err);
    } finally {
      router.push("/");
      router.refresh();
    }
  };

  const openSubEdit = (field: string) => {
    setActiveEditField(field);
  };

  const closeSubEdit = () => {
    setActiveEditField(null);
  };

  const removeField = async (field: keyof typeof editStates) => {
    if (field === "name") return;
    setLoading(true);

    const formData = new FormData();
    formData.append(field, "");
    formData.append("user_id", String(user?.id));

    try {
      const res = await fetch(`${URI}/menu/update/info/${user.id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.errors) {
          alert(`Error de validación: ${data.errors.join(", ")}`);
        } else {
          alert(data.message || "Ocurrió un error inesperado");
        }
        return;
      }
      if (data.success) {
        if (data.user) {
          await updateUserCookie(data.user);
        }
        if (data.menu) {
          await updateMenuCookie(data.menu);
        }
        if (field === "description") setDescription("");
        if (field === "schedule") setSchedule("");
        if (field === "location") setLocation("");
        if (field === "phone") setPhone("");
        if (field === "instagram") setInstagram("");
        if (field === "facebook") setFacebook("");
        if (field === "tiktok") setTiktok("");
        setEditStates((prev) => ({ ...prev, [field]: false }));
        setActiveEditField(null);
        router.refresh();
      }
    } catch (error) {
      console.error("Error en la conexión:", error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const photoCapture = (selectedFile: File) => {
    if (!selectedFile) return;
    setFilePhoto(selectedFile);
    setPreviewPhoto(URL.createObjectURL(selectedFile));
    setEditStates((prev) => ({ ...prev, photo: true }));
  };

  const backgroundCapture = (selectedFile: File) => {
    if (!selectedFile) return;
    setFileBackground(selectedFile);
    setPreviewBackground(URL.createObjectURL(selectedFile));
    setEditStates((prev) => ({ ...prev, cover: true }));
  };

  const userUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (filePhoto) formData.append("photo", filePhoto);
    if (fileBackground) formData.append("cover", fileBackground);
    if (editStates.name) formData.append("name", name);
    if (editStates.description) formData.append("description", description);
    if (editStates.schedule) formData.append("schedule", schedule);
    if (editStates.location) formData.append("location", location);
    if (editStates.phone) formData.append("phone", phone);
    if (editStates.instagram) formData.append("instagram", instagram);
    if (editStates.facebook) formData.append("facebook", facebook);
    if (editStates.tiktok) formData.append("tiktok", tiktok);
    formData.append("user_id", String(user?.id));

    try {
      const res = await fetch(`${URI}/menu/update/info/${user.id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.errors) {
          alert(`Error de validación: ${data.errors.join(", ")}`);
        } else {
          alert(data.message || "Ocurrió un error inesperado");
        }
        return;
      }
      if (data.success) {
        if (data.user) {
          await updateUserCookie(data.user);
        }
        if (data.menu) {
          await updateMenuCookie(data.menu);
        }
        router.refresh();
        setEditStates({
          name: false,
          description: false,
          schedule: false,
          location: false,
          phone: false,
          photo: false,
          cover: false,
          instagram: false,
          facebook: false,
          tiktok: false,
        });
        setActiveEditField(null);
      }
    } catch (error) {
      console.error("Error en la conexión:", error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      <header className="p-3 w-full flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800">Tu local</h1>
        <p className="text-gray-500 text-sm">Edita la información de tu negocio.</p>
      </header>
      <form
        onSubmit={userUpdate}
        className="flex w-full mt-3 relative flex-col items-center justify-center border-b border-gray-200 pb-6"
      >
        <div className="w-full px-4 flex flex-col">
          <div className={`flex justify-center md:justify-start gap-5 lg:gap-10 mb-4 pb-6`}>
            <div className="relative flex items-center justify-center gap-2 flex-col">
              <h3 className="text-lg text-gray-700">Logo</h3>
              <div className="w-30 md:w-40 h-30 md:h-40 lg:w-60 lg:h-60 relative rounded-full overflow-hidden">
                <Image
                  src={previewPhoto}
                  alt="Profile"
                  width={200}
                  height={200}
                  quality={75}
                  loading="eager"
                  className="object-cover w-full h-full"
                />
                <label className="absolute top-0 w-full h-full right-1/2 text-center -translate-x-1/2 left-1/2 font-semibold text-white/70 text-xl gap-1 flex flex-col items-center justify-center active:bg-black bg-[#00000040] py-2.5 px-2 rounded-lg cursor-pointer hover:scale-110 transition">
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) photoCapture(f);
                    }}
                  />
                  <FaCamera /> Editar
                </label>
              </div>
            </div>

            {user?.plan !== "free" ? <div className="relative flex items-center justify-center gap-2 flex-col">
              <h3 className="text-lg text-gray-700">Fondo</h3>
              <div className="w-45 md:w-60 h-30 md:h-40 lg:w-80 lg:h-60 relative rounded-lg overflow-hidden">
                <Image
                  src={previewBackground || placeholder}
                  alt="background"
                  width={200}
                  height={200}
                  quality={75}
                  loading="eager"
                  className="object-cover w-full h-full"
                />
                <label className="absolute top-0 w-full h-full right-1/2 text-center -translate-x-1/2 left-1/2 font-semibold text-white/70 text-xl gap-1 flex flex-col items-center justify-center active:bg-black bg-[#00000040] py-2.5 px-2 rounded-lg cursor-pointer hover:scale-110 transition">
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) backgroundCapture(f);
                    }}
                  />
                  <FaCamera /> Editar
                </label>
              </div>
            </div>
              :
              <div className="flex items-center justify-center gap-2 flex-col">
                <h3 className="text-lg text-gray-700">Fondo</h3>
                <Link href="/panel-de-usuario?seccion=plan" className="px-5 opacity-70 cursor-pointer flex flex-col btn-god-rays items-center border-2 border-gray-400 justify-center gap-1 w-45 md:w-60 h-30 md:h-40 lg:w-80 lg:h-60 bg-gray-200/70 relative rounded-lg overflow-hidden">
                  <OctagonX size={50} className="text-gray-400" />
                  <span className="text-gray-800 text-[12px] lg:text-md text-center">Mejora tu plan para agregar un fondo</span>
                </Link>
              </div>
            }
          </div>
          <div className="w-full flex flex-col gap-y-8">
            {/* Nombre */}
            <div className="w-full">
              <div className="flex justify-between items-center text-gray-500">
                <div className="flex items-center gap-4">
                  <Store size={20} />
                  <div className="flex flex-col items-start">
                    <label className="flex items-center gap-1 text-xs font-bold ">
                      Nombre
                    </label>
                    <p className="text-lg">{name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openSubEdit("name")}
                  className="text-xs font-bold cursor-pointer active:text-gray-900 transition-all text-gray-500"
                >
                  Editar
                </button>
              </div>
            </div>

            {/* Descripción */}
            <div className="w-full">
              <div className="flex justify-between items-center text-gray-500">
                <div className="flex items-center gap-4">
                  <TbNotes size={20} />
                  <div className="flex flex-col items-start">
                    <label className="flex items-center gap-1 text-xs font-bold text-gray-500">
                      Descripción
                    </label>
                    {description ? (
                      <p className="text-lg line-clamp-1">{description}</p>
                    ) : (
                      <span className="text-sm italic text-gray-400">Sin registrar</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openSubEdit("description")}
                  className={`text-xs font-bold cursor-pointer ${!user?.description ? "text-blue-500" : "text-gray-500"}`}
                >
                  {!user?.description ? "Agregar" : "Editar"}
                </button>
              </div>
            </div>

            {/* Horarios */}
            <div className="w-full">
              <div className="flex justify-between items-center text-gray-500">
                <div className="flex items-center gap-4">
                  <FaClock size={20} />
                  <div className="flex flex-col items-start">
                    <label className="flex items-center gap-1 text-xs font-bold ">
                      Horarios de Atención
                    </label>
                    {schedule ? (
                      <p className="text-lg line-clamp-1">{schedule}</p>
                    ) : (
                      <span className="text-sm italic text-gray-400">Sin registrar</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openSubEdit("schedule")}
                  className={`text-xs font-bold cursor-pointer ${!user?.schedule ? "text-blue-500" : "text-gray-500"}`}
                >
                  {!user?.schedule ? "Agregar" : "Editar"}
                </button>
              </div>
            </div>

            {/* Ubicación */}
            <div className="w-full">
              <div className="flex justify-between items-center text-gray-500">
                <div className="flex items-center gap-4">
                  <FaMapMarkerAlt size={20} />
                  <div className="flex flex-col items-start">
                    <label className="flex items-center gap-1 text-xs font-bold ">
                      Ubicación
                    </label>
                    {location ? (
                      <p className="text-lg">{location}</p>
                    ) : (
                      <span className="text-sm italic text-gray-400">Sin registrar</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openSubEdit("location")}
                  className={`text-xs font-bold cursor-pointer ${!user?.location ? "text-blue-500" : "text-gray-500"}`}
                >
                  {!user?.location ? "Agregar" : "Editar"}
                </button>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="w-full">
              <div className="flex justify-between items-center text-gray-500">
                <div className="flex items-center gap-4">
                  <FaWhatsapp size={20} />
                  <div className="flex flex-col items-start">
                    <label className="flex items-center gap-1 text-xs font-bold ">
                      Whatsapp
                    </label>
                    {phone ? (
                      <p className="text-lg">{prefix} {number}</p>
                    ) : (
                      <span className="text-sm italic text-gray-400">Sin registrar</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openSubEdit("phone")}
                  className={`text-xs font-bold cursor-pointer ${!user?.phone ? "text-blue-500" : "text-gray-500"}`}
                >
                  {!user?.phone ? "Agregar" : "Editar"}
                </button>
              </div>
            </div>

            {/* Instagram */}
            <div className="w-full">
              <div className="flex justify-between items-center text-gray-500">
                <div className="flex items-center gap-4">
                  <FaInstagram size={20} />
                  <div className="flex flex-col items-start">
                    <label className="flex items-center gap-1 text-xs font-bold ">
                      Instagram / Nombre de Usuario
                    </label>
                    {user?.instagram ? (
                      <p className="text-lg">{user?.instagram}</p>
                    ) : (
                      <span className="text-sm italic text-gray-400">Sin registrar</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openSubEdit("instagram")}
                  className={`text-xs font-bold cursor-pointer ${!user?.instagram ? "text-blue-500" : "text-gray-500"}`}
                >
                  {!user?.instagram ? "Agregar" : "Editar"}
                </button>
              </div>
            </div>

            {/* Facebook */}
            <div className="w-full">
              <div className="flex justify-between items-center text-gray-500">
                <div className="flex items-center gap-4">
                  <FaFacebook size={20} />
                  <div className="flex flex-col items-start">
                    <label className="flex items-center gap-1 text-xs font-bold ">
                      Facebook / Nombre de Usuario
                    </label>
                    {user?.facebook ? (
                      <p className="text-lg">{user?.facebook}</p>
                    ) : (
                      <span className="text-sm italic text-gray-400">Sin registrar</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openSubEdit("facebook")}
                  className={`text-xs font-bold cursor-pointer ${!user?.facebook ? "text-blue-500" : "text-gray-500"}`}
                >
                  {!user?.facebook ? "Agregar" : "Editar"}
                </button>
              </div>
            </div>

            {/* TikTok */}
            <div className="w-full">
              <div className="flex justify-between items-center text-gray-500">
                <div className="flex items-center gap-4">
                  <FaTiktok size={20} />
                  <div className="flex flex-col items-start">
                    <label className="flex items-center gap-1 text-xs font-bold ">
                      TikTok
                    </label>
                    {user?.tiktok ? (
                      <p className="text-lg">{user?.tiktok}</p>
                    ) : (
                      <span className="text-sm italic text-gray-400">Sin registrar</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openSubEdit("tiktok")}
                  className={`text-xs font-bold cursor-pointer ${!user?.tiktok ? "text-blue-500" : "text-gray-500"}`}
                >
                  {!user?.tiktok ? "Agregar" : "Editar"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* VISTA DE EDICIÓN INDIVIDUAL EN PANTALLA COMPLETA (FIXED) */}
        {activeEditField && (
          <div className="fixed inset-0 z-50 bg-background w-full h-full flex flex-col p-4 overflow-y-auto">
            <div className="flex flex-col gap-3 mb-2 w-full md:max-w-xl mx-auto">
              <button
                type="button"
                onClick={closeSubEdit}
                className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer w-fit"
              >
                <ChevronLeft size={20} /> Volver
              </button>
              <h2 className="text-xl font-bold mt-6 text-gray-800">
                {!user?.[activeEditField]
                  ? `Agregar ${activeEditField === 'name' ? 'Nombre' :
                    activeEditField === 'description' ? 'Descripción' :
                      activeEditField === 'schedule' ? 'Horario de Atención' :
                        activeEditField === 'location' ? 'Ubicación' :
                          activeEditField === 'phone' ? 'WhatsApp' :
                            activeEditField === 'instagram' ? 'Instagram' :
                              activeEditField === 'facebook' ? 'Facebook' : 'TikTok'
                  }`
                  : `Editar ${activeEditField === 'name' ? 'Nombre' :
                    activeEditField === 'description' ? 'Descripción' :
                      activeEditField === 'schedule' ? 'Horario de Atención' :
                        activeEditField === 'location' ? 'Ubicación' :
                          activeEditField === 'phone' ? 'WhatsApp' :
                            activeEditField === 'instagram' ? 'Instagram' :
                              activeEditField === 'facebook' ? 'Facebook' : 'TikTok'
                  }`
                }
              </h2>


            </div>

            <div className="w-full md:max-w-xl mx-auto flex flex-col gap-4 flex-1">
              {activeEditField === "name" && (
                <div className="relative">
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1">
                    {/* Opcional */}
                  </label>
                  <div className="relative">
                    <input
                      className="w-full border p-3 rounded-lg"
                      maxLength={25}
                      value={name}
                      onChange={(e) => {
                        // Permite letras, números, guiones, guiones bajos y espacios
                        const sanitizedValue = e.target.value.replace(/[^a-zA-Z0-9\s-_]/g, "");
                        setName(sanitizedValue);
                        setEditStates((prev) => ({ ...prev, name: true }));
                      }}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setName("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              )}

              {activeEditField === "description" && (
                <div className="relative">
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1">
                    <TbNotes size={20} />Descripción
                  </label>
                  <div className="relative mt-2">
                    <input
                      className="w-full border p-3 rounded-lg"
                      maxLength={40}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        setEditStates((prev) => ({ ...prev, description: true }));
                      }}
                      autoFocus
                    />
                    {user?.description ? (
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => removeField("description")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : "Quitar"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDescription("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeEditField === "schedule" && (
                <div className="relative">
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1">
                    <FaClock size={20} /> Horarios de Atención
                  </label>
                  <div className="relative mt-2">
                    <input
                      className="w-full border p-3 rounded-lg"
                      maxLength={30}
                      value={schedule}
                      onChange={(e) => {
                        setSchedule(e.target.value);
                        setEditStates((prev) => ({ ...prev, schedule: true }));
                      }}
                      autoFocus
                    />
                    {user?.schedule ? (
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => removeField("schedule")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : "Quitar"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSchedule("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeEditField === "location" && (
                <div className="relative">
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1">
                    <FaMapMarkerAlt size={20} /> Ubicación
                  </label>
                  <div className="relative mt-2">
                    <input
                      className="w-full border p-3 rounded-lg"
                      value={location}
                      maxLength={40}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        setEditStates((prev) => ({ ...prev, location: true }));
                      }}
                      autoFocus
                    />
                    {user?.location ? (
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => removeField("location")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : "Quitar"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setLocation("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeEditField === "phone" && (
                <div className="relative">
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1">
                    <FaWhatsapp size={20} /> WhatsApp
                  </label>
                  <div className="relative mt-2">
                    <input
                      className="w-full border p-3 rounded-lg"
                      value={phoneFormated}
                      maxLength={10}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setEditStates((prev) => ({ ...prev, phone: true }));
                      }}
                      autoFocus
                    />
                    {user?.phone ? (
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => removeField("phone")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : "Quitar"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPhone("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeEditField === "instagram" && (
                <div className="relative">
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1">
                    <FaInstagram size={20} /> www.instagram.com/
                  </label>
                  <div className="relative mt-2">
                    <input
                      className="w-full border p-3 rounded-lg"
                      value={instagram}
                      placeholder="Nombre de Usuario"
                      maxLength={25}
                      onChange={(e) => {
                        setInstagram(e.target.value);
                        setEditStates((prev) => ({ ...prev, instagram: true }));
                      }}
                      autoFocus
                    />
                    {user?.instagram ? (
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => removeField("instagram")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : "Quitar"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setInstagram("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeEditField === "facebook" && (
                <div className="relative">
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1">
                    <FaFacebook size={20} /> Facebook
                  </label>
                  <div className="relative mt-2">
                    <input
                      className="w-full border p-3 rounded-lg"
                      value={facebook}
                      placeholder="Nombre de Usuario"
                      maxLength={25}
                      onChange={(e) => {
                        setFacebook(e.target.value);
                        setEditStates((prev) => ({ ...prev, facebook: true }));
                      }}
                      autoFocus
                    />
                    {user?.facebook ? (
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => removeField("facebook")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : "Quitar"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setFacebook("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeEditField === "tiktok" && (
                <div className="relative">
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1">
                    <FaTiktok /> TikTok
                  </label>
                  <div className="relative">
                    <input
                      className="w-full border p-3 rounded-lg"
                      value={tiktok}
                      maxLength={25}
                      onChange={(e) => {
                        setTiktok(e.target.value);
                        setEditStates((prev) => ({ ...prev, tiktok: true }));
                      }}
                      autoFocus
                    />
                    {user?.tiktok ? (
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => removeField("tiktok")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : "Quitar"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setTiktok("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {isEditing && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="w-full flex-col md:flex-row items-center h-fit min-h-24 md:items-center justify-center md:justify-end bg-background border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50 flex gap-3 px-4 md:px-7 py-4 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]"
          >
            <span className="text-gray-700 md:mr-4 text-md">¿Deseas guardar los cambios?</span>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={() =>
                  isEditing &&
                  cancelChanges()
                }
                className="px-4 py-3 border cursor-pointer rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full active:scale-90 transition-all disabled:opacity-50 min-w-50 md:w-auto px-6 bg-black text-white py-3 rounded-xl flex justify-center cursor-pointer items-center gap-2"
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
          </motion.div>
        )}
      </form>
      <div className="w-full mt-7 px-3 flex flex-col gap-y-1">
        <h2 className="text-xl font-bold text-gray-800">{user.plan !== "free" ? "Personaliza y Comparte" : "Comparte"}</h2>
        <span className="text-gray-500 text-sm">
          Comparte el código QR para acceder a tu menú, o tambien puedes copiar el enlace para compartir en tus redes sociales.
        </span>

        <div className="w-full flex mt-5 justify-center">
          <QrCode user={user} logoUrl={previewPhoto} />
        </div>
        <div className="w-full pl-5">
          <button
            onClick={() => hadleLogoutUserAction(String(user?.id))}
            className="mt-30 flex items-center active:scale-90 gap-3 text-red-500 active:text-red-900 transition-colors md:hidden font-bold cursor-pointer"
          >
            <HiOutlineLogout size={20} /> Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};
export default UserSettings;
