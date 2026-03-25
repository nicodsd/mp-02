"use client";
import Link from "next/link";
import Image from "next/image";
import {
  FaMapMarkerAlt,
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaTiktok,
} from "react-icons/fa";
import { User } from "lucide-react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useState, useEffect } from "react";
import { logotipo, logotipo2, logo_w, logotipoColor } from "@/src/lib/const";
import { getOptimizedImage, getBannerImage } from "@/src/lib/cloudinary";
import PinUserPlan from "@/src/components/user-plan/PinUserPlan";

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

  console.log(user)

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
        <div className="flex w-full absolute text-white top-0 z-50 bg-linear-to-b from-black/40 to-transparent items-center justify-between h-14 px-6">
          <Link className="flex w-full justify-center gap-2 items-center text-xs" href="/">By:
            {user?.plan === "free" && <Image
              priority
              src={logotipo}
              width={60}
              height={60}
              alt="Logo"
              className="w-18 h-10 md:w-24 md:h-16 object-contain"
            />}
            {user?.plan !== "free" && <Image
              priority
              src={logo_w}
              width={60}
              height={60}
              alt="Logo"
              className="w-18 h-10 md:w-24 md:h-16 object-contain"
            />}
            {
              user && cookie && <PinUserPlan plan={user?.plan} />
            }
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
              className="bg-white border-2 shadow-lg border-white text-black text-lg px-2.5 py-1 rounded-md font-bold"
            >
              ¡Prueba ahora!
            </Link>
          )}
        </div>
      )}

      <div
        className={`relative w-full to-background transition-all ${isSpecialState ? "h-14" : "h-110 bg-linear-to-t from-black/50 via-transparent to-transparent"} flex items-center bg-center bg-cover bg-no-repeat`}
        style={inlineStyle}
      >
        {!isSpecialState && (
          <div
            className={`absolute inset-0 ${canShowCover
              ? "bg-black/65"
              : ""
              }`}
          />
        )}
        <nav className="relative z-10 w-full">{renderNavContent()}</nav>
      </div>
    </header>
  );
}

function DefaultNavUser({ user, photo, isLight }: any) {
  const displayData = {
    name: user?.name,
    description: user?.description || "Es hora de probar lo bueno",
    address: user?.location,
    phone: user?.phone,
    background:
      !user || user.plan === "free"
        ? "/images/placeholders/back-qmenu.png"
        : user.cover,
    instagram: user?.instagram,
    facebook: user?.facebook,
    tiktok: user?.tiktok,
  };
  const optimizedPhoto = getOptimizedImage(photo, 108, 108);
  return (
    <div className="flex flex-col items-center justify-center drop-shadow-md text-white w-full">
      <div className={`rounded-full p-1 ${isLight ? "bg-white" : "bg-black"}`}>
        <Image
          priority
          src={optimizedPhoto || logotipoColor}
          width={110}
          height={110}
          className="rounded-full object-cover"
          alt="Profile"
        />
      </div>

      <h1 className="text-2xl font-bold mt-2 uppercase">
        {displayData?.name || (!user ? "QMENÚ" : "")}
      </h1>

      <p className="opacity-90 text-lg">
        {displayData?.description || (!user ? "Crea tu menú con QMenu." : "")}
      </p>

      <div className="flex flex-col items-center gap-1 text-sm mt-1 opacity-80">
        {(displayData?.address || !user) && (
          <span className="flex items-center gap-1">
            <FaMapMarkerAlt />
            {displayData?.address || "Santiago del Estero, Argentina"}
          </span>
        )}

        <div className="flex items-center gap-1 flex-wrap justify-center">
          {(displayData?.phone || !user) && (
            <span className="flex items-center pr-1 gap-1">
              <FaWhatsapp />
              {displayData?.phone || "385 123 4567"}
            </span>
          )}

          {displayData?.instagram && (
            <span className="border-x border-white px-2 flex items-center gap-1">
              <FaInstagram />
              {displayData.instagram}
            </span>
          )}

          {displayData?.facebook && (
            <span className="border-r border-white pr-2 flex items-center gap-1">
              <FaFacebook />
              {displayData.facebook}
            </span>
          )}

          {displayData?.tiktok && (
            <span className="flex items-center gap-1 pl-1">
              <FaTiktok />
              {displayData.tiktok}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
