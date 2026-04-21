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
import { getOptimizedImage, getBannerImage } from "@/src/lib/cloudinaryOptimizeImage";
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
  let inlineStyle = {};
  if (user?.plan !== "free") {
    inlineStyle =
      isMounted && !isSpecialState
        ? { backgroundImage: `url("${optimizedBackground}")` }
        : {};
  }

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
    <header className={`flex flex-col w-full ${isSpecialState ? "" : "bg-background"}`}>
      {!isSpecialState && (
        <div className={`flex w-full z-50 
        ${!user
            ? "backdrop-blur-lg bg-linear-to-b sticky top-0 from-red-700 to-primary h-14 p-2 text-white"
            : "absolute top-2 italic"
          } items-center justify-between`}>
          {user && <Link
            className="flex w-full justify-center gap-2 items-center text-xs"
            href="/"
          >
            {user?.plan === "free" && (
              <Image
                priority
                src={logotipo}
                width={60}
                height={60}
                alt="Logo"
                className="w-13 h-13 opacity-60 md:w-24 md:h-16 object-contain"
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
        className={`relative w-full to-background transition-all ${isSpecialState ? "h-14" : "h-100 bg-linear-to-b from-white to-gray-100"} flex items-center bg-center bg-cover bg-no-repeat`}
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
    instagram: user?.instagram || !user && "QMENU",
    facebook: user?.facebook || !user && "QMENU",
    tiktok: user?.tiktok || !user && "QMENU",
  };
  const optimizedPhoto = getOptimizedImage(photo, 200, 200);
  return (
    <div className={`flex flex-col items-center justify-center ${user?.plan === "free" ? "text-gray-700" : "text-white drop-shadow drop-shadow-gray-900/30"} w-full`}>
      <div className="relative">
        <div className={`rounded-full p-1 ${user?.plan !== "free" ? "bg-white" : "bg-gray-700"}`}>
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
              className={`flex items-center active:scale-90 transition-all duration-100 absolute -bottom-2 right-0 mx-auto left-0 w-fit gap-1 ${user?.plan === "free" ? "bg-gray-300 text-black" : "bg-white text-black"} text-sm px-3 py-2 rounded-full`}
              href="/panel-de-usuario"
            >
              <FaEdit size={14} /> Perfil
            </Link>
          )
        }
      </div>

      <h2 className={`text-2xl leading-none ${user?.plan === "free" ? "text-gray-700" : "text-white"} font-bold mt-3 uppercase`}>
        {displayData?.name || (!user ? "QMENÚ" : "")}
      </h2>
      <p className="my-1 text-wrap">
        {displayData?.description || (!user ? "Crea tu menú GRATIS con QMenú." : "")}
      </p>
      <div className="flex flex-col items-center gap-1 mt-0.5">
        {(displayData?.address || !user) && (
          <span className="flex text-xs items-center gap-1">
            <FaMapMarkerAlt size={17} />
            {displayData?.address || "Santiago del Estero, Argentina"}
          </span>
        )}
        <div className="flex items-center gap-x-2 mt-1 text-xs flex-wrap justify-center">
          {(displayData?.phone || !user) && (
            <span className="flex items-center gap-1">
              <FaWhatsapp size={17} />
              {displayData?.phone || "385 123 4567"}
            </span>
          )}

          {[
            { id: 'ig', val: displayData?.instagram, icon: <FaInstagram size={17} /> },
            { id: 'fb', val: displayData?.facebook, icon: <FaFacebook size={17} /> },
            { id: 'tk', val: displayData?.tiktok, icon: <FaTiktok size={17} /> }
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
