"use client";
import Link from "next/link";
import Image from "next/image";
import {
  FaMapMarkerAlt,
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaEdit,
} from "react-icons/fa";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useState, useEffect } from "react";
import logo from "@/public/images/logo/logo.png"
import { logotipo, logo_w } from "@/src/lib/const";
import { getOptimizedImage, getBannerImage } from "@/src/lib/cloudinary";
import UserPlan from "@/src/components/user-plan/UserPlan";
import BotonAccion from "../components/buttons/index/BotonAction";

interface NavBarProps {
  user?: any;
  photo: string;
  state: number;
  cookie?: string;
  bttn: boolean;
  template?: any;
}

export default function NavBar({
  state,
  cookie,
  photo,
  user,
  bttn,
  template
}: NavBarProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isSpecialState = state === 1 || state === 2;
  const canShowCover = user && user.plan !== "free" && user.cover;
  const backgroundImage = canShowCover
    ? user.cover
    : "/images/placeholders/back-qmenu.webp";
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
            cookie={cookie}
          />
        );
    }
  };

  return (
    <header className={`flex flex-col w-full ${isSpecialState ? "" : "bg-linear-to-b from-primary to-primary-700"}`}>
      {!isSpecialState && (
        <div className={`flex w-full z-50 ${!user ? "backdrop-blur-lg bg-linear-to-b sticky top-0 from-primary/30 to-primary/10 h-14 p-2 text-white" : "absolute top-2 text-gray-300 italic"} items-center justify-between`}>
          {user && <Link
            className="flex w-full justify-center gap-2 items-center text-xs"
            href="/"
          >
            Por:
            {user?.plan === "free" && (
              <Image
                priority
                src={logotipo}
                width={60}
                height={60}
                alt="Logo"
                className="w-13 h-13 md:w-24 md:h-16 object-contain"
              />
            )}
            {user?.plan !== "free" && (
              <Image
                priority
                src={logo_w}
                width={60}
                height={60}
                alt="Logo"
                className="w-13 h-13 md:w-24 md:h-16 object-contain"
              />
            )}
            {user && cookie && (
              <UserPlan plan={user?.plan} />
            )}
          </Link>}
          {!user && (
            <div className="flex w-full justify-around items-center md:justify-center md:gap-10">
              <span className="text-md tracking-tight md:text-lg font-bold">Crea tu Menú ¡GRATIS!</span>
              <BotonAccion color="white" textColor="primary" />
            </div>
          )}
        </div>
      )}

      <div
        className={`relative w-full to-background transition-all ${isSpecialState ? "h-14" : "h-100 bg-linear-to-t from-black/50 via-transparent to-transparent"} flex items-center bg-center bg-cover bg-no-repeat`}
        style={inlineStyle}
      >
        {!isSpecialState && (
          <div
            className={`absolute inset-0 ${canShowCover ? "bg-black/65" : ""}`}
          />
        )}
        <nav className="relative z-10 w-full">{renderNavContent()}</nav>
      </div>
    </header>
  );
}

function DefaultNavUser({ user, photo, template, cookie }: any) {
  const displayData = {
    name: user?.name,
    description: user?.description,
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
    <div className="flex flex-col items-center justify-center drop-shadow drop-shadow-gray-900/30 text-white w-full">
      <div className="relative">
        <div className={`rounded-full p-1 ${template?.backgroundColor}`}>
          <Image
            priority
            src={optimizedPhoto || logo}
            width={135}
            height={135}
            className="rounded-full object-cover"
            alt="Profile"
          />
        </div>
        {
          user && cookie && (
            <Link
              className="flex items-center absolute -bottom-1 right-0 mx-auto left-0 w-fit gap-1 bg-white text-sm text-black px-3 py-2 rounded-full"
              href="/panel-de-usuario"
            >
              <FaEdit size={14} /> Perfil
            </Link>
          )
        }
      </div>

      <h1 className="text-2xl font-bold mt-3 uppercase">
        {displayData?.name || (!user ? "QMENÚ" : "")}
      </h1>
      {(displayData?.address || !user) && (
        <span className="flex text-xs items-center gap-1">
          <FaMapMarkerAlt />
          {displayData?.address || "Santiago del Estero, Argentina"}
        </span>
      )}
      <p className="mt-2">
        {displayData?.description || (!user ? "Crea tu menú con QMenu." : "")}
      </p>
      <div className="flex flex-col items-center gap-1 mt-0.5">
        <div className="flex items-center gap-x-2 text-xs flex-wrap justify-center">
          {(displayData?.phone || !user) && (
            <span className="flex items-center gap-1">
              <FaWhatsapp />
              {displayData?.phone || "385 123 4567"}
            </span>
          )}

          {[
            { id: 'ig', val: displayData?.instagram, icon: <FaInstagram /> },
            { id: 'fb', val: displayData?.facebook, icon: <FaFacebook /> },
            { id: 'tk', val: displayData?.tiktok, icon: <FaTiktok /> }
          ]
            .filter(social => social.val)
            .map((social) => (
              <span
                key={social.id}
                className="flex items-center gap-1 border-l border-white/50 pl-2 ml-0"
              >
                {social.icon}
                {social.val || (!user && "@QMENU")}
              </span>
            ))}
        </div>

      </div>
    </div>
  );
}
