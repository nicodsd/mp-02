"use client";
import Link from "next/link";
import Image from "next/image";
import { FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { User } from "lucide-react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useState, useEffect } from "react";
import { logotipo, logotipoColor } from "@/src/lib/const";
import { getOptimizedImage, getBannerImage } from "@/src/lib/cloudinary";

interface NavBarProps {
  user?: any;
  photo: string;
  state: number;
  cookie?: string;
  bttn: boolean;
}

export default function NavBar({
  state,
  cookie,
  photo,
  user,
  bttn,
}: NavBarProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isSpecialState = state === 1 || state === 2;
  const canShowCover = user && user.plan !== "free" && user.cover;
  const backgroundImage = canShowCover
    ? user.cover
    : "/images/placeholders/back-qmenu.png";
  const optimizedBackground = getBannerImage(backgroundImage);
  const inlineStyle =
    isMounted && !isSpecialState
      ? { backgroundImage: `url("${optimizedBackground}")` }
      : {};

  const renderNavContent = () => {
    switch (state) {
      case 1:
        return (
          <div className="flex items-center justify-between w-full px-5 py-4">
            <span className="text-xl font-bold text-gray-800">
              Agregar Plato
            </span>
            <Link
              href="/"
              className="px-4 py-1.5 font-bold text-gray-500 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              Cancelar
            </Link>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center px-5 py-2">
            <Link href="/" className="flex items-center text-gray-700 gap-1">
              <ArrowBackIosIcon fontSize="small" /> Inicio
            </Link>
          </div>
        );
      default:
        return (
          <DefaultNavUser
            user={user}
            photo={photo}
            isLight={!!backgroundImage}
          />
        );
    }
  };

  return (
    <header className="flex flex-col w-full">
      {!isSpecialState && (
        <div className="flex w-full items-center justify-between h-13 px-6">
          <Link href="/">
            <Image
              priority
              src={logotipo}
              width={60}
              height={60}
              alt="Logo"
              className="w-18 h-10 md:w-24 md:h-16 object-contain"
            />
          </Link>
          {user && cookie && (
            <Link
              href="/panel-de-usuario"
              className="rounded-2xl flex items-center px-4 py-1.5 border-[0.5px] font-bold"
            >
              Perfil <User className="inline-block ml-1" size={18} />
            </Link>
          )}
          {!user && (
            <Link
              href="/registro-de-usuario"
              className="bg-red-600 text-white px-4 py-1.5 rounded-md font-bold"
            >
              ¡Prueba ahora!
            </Link>
          )}
        </div>
      )}

      <div
        className={`relative w-full to-background transition-all ${isSpecialState ? "h-14" : "h-80 bg-linear-to-t from-primary/90 via-orange-300/90"} flex items-center bg-center bg-cover bg-no-repeat`}
        style={inlineStyle}
      >
        {!isSpecialState && (
          <div
            className={`absolute inset-0 ${canShowCover ? "bg-black/60" : ""}`}
          />
        )}
        <nav className="relative z-10 w-full">{renderNavContent()}</nav>
      </div>
    </header>
  );
}

function DefaultNavUser({ user, photo, isLight }: any) {
  const displayData = {
    name: user?.name || "QMenú",
    description: user?.description || "Crea tu menú con QMenu.",
    address: user?.location || "Santiago del Estero, Argentina",
    phone: user?.phone || "385 123 4567",
    background:
      !user || user.plan === "free"
        ? "/images/placeholders/back-qmenu.png"
        : user.cover,
  };
  const optimizedPhoto = getOptimizedImage(photo, 108, 108);
  return (
    <div className="flex flex-col items-center justify-center drop-shadow-2xl text-white w-full">
      <div className={`rounded-full p-1 ${isLight ? "bg-white" : "bg-black"}`}>
        <Image
          priority
          src={optimizedPhoto || logotipoColor}
          width={100}
          height={100}
          className="rounded-full"
          alt="Profile"
        />
      </div>
      <h1 className="text-2xl font-bold mt-2 uppercase">{displayData.name}</h1>
      <p className="text-sm opacity-90">{displayData.description}</p>
      <div className="flex flex-col items-center text-xs mt-1 opacity-80">
        <span className="flex items-center gap-1">
          <FaMapMarkerAlt /> {displayData.address}
        </span>
        <span className="flex items-center gap-1">
          <FaPhone className="rotate-90" /> {displayData.phone}
        </span>
      </div>
    </div>
  );
}
