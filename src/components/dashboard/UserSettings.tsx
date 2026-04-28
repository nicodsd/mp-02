"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { updateUserCookie, updateMenuCookie } from "@/app/actions";
import { useRouter } from "next/navigation";
import QrCode from "@/src/components/user-settings/QrCode";
import { placeholder } from "@/src/lib/const";
import { HiOutlineLogout } from "react-icons/hi";
import { OctagonX } from "lucide-react";
import {
  FaCamera,
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaTimes,
  FaUser,
  FaSpinner,
} from "react-icons/fa";
import { TbNotes } from "react-icons/tb";
import { URI } from "@/src/lib/const";

const UserSettings = ({ user, logout }: { user: any, logout: () => void }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(user?.name);
  const [previewPhoto, setPreviewPhoto] = useState<string>(user?.photo);
  const [previewBackground, setPreviewBackground] = useState<string>(user?.cover);
  const [filePhoto, setFilePhoto] = useState<File>();
  const [fileBackground, setFileBackground] = useState<File>();
  const [description, setDescription] = useState(
    user?.description || "Bar de comida.",
  );
  const [location, setLocation] = useState(user?.location || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [instagram, setInstagram] = useState(user?.instagram || "");
  const [facebook, setFacebook] = useState(user?.facebook || "");
  const [tiktok, setTiktok] = useState(user?.tiktok || "");

  const [editStates, setEditStates] = useState({
    name: false,
    description: false,
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
    setLocation(user?.location || "");
    setPhone(user?.phone || "");
    setInstagram(user?.instagram || "");
    setFacebook(user?.facebook || "");
    setTiktok(user?.tiktok || "");

    setEditStates({
      name: false,
      description: false,
      location: false,
      phone: false,
      photo: false,
      cover: false,
      instagram: false,
      facebook: false,
      tiktok: false,
    });
  }, [user]);

  const prefix = phone.slice(0, 3)
  const number = phone.slice(3)
  const phoneFormated = prefix + number

  const cancelChanges = () => {
    setName(user?.name);
    setPreviewPhoto(user?.photo || placeholder);
    setPreviewBackground(user?.cover || placeholder);
    setDescription(user?.description || "");
    setLocation(user?.location || "");
    setPhone(user?.phone || "");
    setInstagram(user?.instagram || "");
    setFacebook(user?.facebook || "");
    setTiktok(user?.tiktok || "");

    setEditStates({
      name: false,
      description: false,
      location: false,
      phone: false,
      photo: false,
      cover: false,
      instagram: false,
      facebook: false,
      tiktok: false,
    });
  }

  const toggleEdit = (field: keyof typeof editStates) => {
    setEditStates((prev) => ({ ...prev, [field]: !prev[field] }));
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
    setEditStates((prev) => ({ ...prev, background: true }));
  };

  const userUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (filePhoto) formData.append("photo", filePhoto);
    if (fileBackground) formData.append("cover", fileBackground);
    if (editStates.name) formData.append("name", name);
    if (editStates.description) formData.append("description", description);
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
      console.log(data);
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
          location: false,
          phone: false,
          photo: false,
          cover: false,
          instagram: false,
          facebook: false,
          tiktok: false,
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
    <div className="w-full overflow-x-hidden">
      <header className="p-3 w-full flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800">Perfil</h1>
        <p className="text-gray-500 text-sm">Edita la información de tu negocio.</p>
      </header>
      <form
        onSubmit={userUpdate}
        className="flex w-full mt-3 relative flex-col items-center justify-center border-b border-gray-200 pb-6"
      >
        <div className="w-full px-4 flex flex-col">
          <div className={`flex justify-center md:justify-start gap-5 md:gap-4 mb-4 pb-6`}>
            <div className="relative flex items-center justify-center gap-2 flex-col">
              <h3 className="text-lg text-gray-700">Logo</h3>
              <div className="w-30 md:w-40 h-30 md:h-40 relative rounded-full overflow-hidden">
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
              <div className="w-45 md:w-60 h-30 md:h-40 relative rounded-lg overflow-hidden">
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
                <div className="w-45 px-5 opacity-30 cursor-not-allowed flex flex-col btn-god-rays items-center border-2 border-gray-400 justify-center gap-1 md:w-60 h-30 bg-gray-200/70 md:h-40 relative rounded-lg overflow-hidden">
                  <OctagonX size={50} className="text-gray-400" />
                  <p className="text-gray-500 text-sm text-center">Función disponible en plan de pago</p>
                </div>
              </div>
            }
          </div>
          <div className="w-full flex flex-col gap-y-5">
            <h2 className="text-lg text-text">Tus datos:</h2>
            <div className="w-full">
              {editStates.name ? (
                <div className="relative">
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1">
                    <FaUser /> Nombre
                  </label>
                  <div className="relative">
                    <input
                      className="w-full border p-3 rounded-lg"
                      maxLength={15}
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
                <div className="flex justify-between items-center text-gray-500">
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold ">
                      <FaUser /> Nombre
                    </label>
                    <p className="text-lg">{name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleEdit("name")}
                    className="text-xs font-bold cursor-pointer active:text-gray-900 transition-all text-gray-500"
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>
            <div className="w-full">
              {editStates.description ? (
                <div className="relative">
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1">
                    <TbNotes /> Descripción
                  </label>
                  <div className="relative">
                    <input
                      className="w-full border p-3 rounded-lg"
                      maxLength={25}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => cancelChanges()}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center text-gray-500">
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold">
                      <TbNotes /> Descripción
                    </label>
                    <p className="text-lg line-clamp-1">{description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleEdit("description")}
                    className={`text-xs font-bold cursor-pointer ${!user?.description ? "text-blue-500" : "text-gray-500"}`}
                  >
                    {!user?.description ? "Agregar" : "Editar"}
                  </button>
                </div>
              )}
            </div>

            <div className="w-full">
              {editStates.location ? (
                <div className="relative">
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1">
                    <FaMapMarkerAlt /> Ubicación
                  </label>
                  <div className="relative">
                    <input
                      className="w-full border p-3 rounded-lg"
                      value={location}
                      maxLength={20}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => cancelChanges()}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center text-gray-500">
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold">
                      <FaMapMarkerAlt /> Ubicación
                    </label>
                    <p className="text-lg">{location}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleEdit("location")}
                    className={`text-xs font-bold cursor-pointer ${!user?.location ? "text-blue-500" : "text-gray-500"}`}
                  >
                    {!user?.location ? "Agregar" : "Editar"}
                  </button>
                </div>
              )}
            </div>
            <div className="w-full">
              {editStates.phone ? (
                <div className="relative">
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1">
                    <FaWhatsapp /> WhatsApp
                  </label>
                  <div className="relative">
                    <input
                      className="w-full border p-3 rounded-lg"
                      value={phoneFormated}
                      maxLength={10}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => cancelChanges()}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center text-gray-500">
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold ">
                      <FaWhatsapp /> WhatsApp
                    </label>
                    <p className="text-lg">{prefix} {number}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleEdit("phone")}
                    className={`text-xs font-bold cursor-pointer ${!user?.phone ? "text-blue-500" : "text-gray-500"}`}
                  >
                    {!user?.phone ? "Agregar" : "Editar"}
                  </button>
                </div>
              )}
            </div>
            <div className="w-full">
              {editStates.instagram ? (
                <div className="relative">
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1">
                    <FaInstagram /> Instagram
                  </label>
                  <div className="relative">
                    <input
                      className="w-full border p-3 rounded-lg"
                      value={instagram}
                      maxLength={15}
                      onChange={(e) => setInstagram(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => cancelChanges()}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center text-gray-500">
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold ">
                      <FaInstagram /> Instagram
                    </label>
                    <p className="text-lg">{instagram}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleEdit("instagram")}
                    className={`text-xs font-bold cursor-pointer ${!user?.instagram ? "text-blue-500" : "text-gray-500"}`}
                  >
                    {!user?.instagram ? "Agregar" : "Editar"}
                  </button>
                </div>
              )}
            </div>
            <div className="w-full">
              {editStates.facebook ? (
                <div className="relative">
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1">
                    <FaFacebook /> Facebook
                  </label>
                  <div className="relative">
                    <input
                      className="w-full border p-3 rounded-lg"
                      value={facebook}
                      maxLength={15}
                      onChange={(e) => setFacebook(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => cancelChanges()}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center text-gray-500">
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold ">
                      <FaFacebook /> Facebook
                    </label>
                    <p className="text-lg">{facebook}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleEdit("facebook")}
                    className={`text-xs font-bold cursor-pointer ${!user?.facebook ? "text-blue-500" : "text-gray-500"}`}
                  >
                    {!user?.facebook ? "Agregar" : "Editar"}
                  </button>
                </div>
              )}
            </div>
            <div className="w-full">
              {editStates.tiktok ? (
                <div className="relative">
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1">
                    <FaTiktok /> TikTok
                  </label>
                  <div className="relative">
                    <input
                      className="w-full border p-3 rounded-lg"
                      value={tiktok}
                      maxLength={10}
                      onChange={(e) => setTiktok(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => cancelChanges()}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center text-gray-500">
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold ">
                      <FaTiktok /> TikTok
                    </label>
                    <p className="text-lg">{tiktok}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleEdit("tiktok")}
                    className={`text-xs font-bold cursor-pointer ${!user?.tiktok ? "text-blue-500" : "text-gray-500"}`}
                  >
                    {!user?.tiktok ? "Agregar" : "Editar"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {isEditing && (
          <div className="w-full flex-col md:flex-row items-start h-fit min-h-24 md:items-center justify-center md:justify-end bg-background border-t border-gray-200 fixed bottom-0 left-0 right-0 z-70 flex gap-3 px-4 md:px-7 py-4">
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
          </div>
        )}
      </form>
      <div className="w-full mt-7 px-3 flex flex-col gap-y-1">
        <h2 className="text-xl font-bold text-gray-800">Personaliza y Comparte</h2>
        <span className="text-gray-500 text-sm">
          Comparte el código QR para acceder a tu menú, o tambien puedes copiar el enlace para compartir en tus redes sociales.
        </span>
        <div className="w-full flex mt-5 justify-center">
          <QrCode user={user} logoUrl={previewPhoto} />
        </div>
        <div className="w-full pl-5">
          <button
            onClick={() => { logout() }}
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