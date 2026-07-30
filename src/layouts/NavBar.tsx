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
  FaClock,
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
  template?: any;
  bttn: boolean;
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

  let typeNavbar = 'default';
  if (user?.plan !== "free") {
    typeNavbar = user?.navBar || 'default';
  } else {
    typeNavbar = 'default';
  }
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
            <span className="text-xl font-bold text-gray-800">Agregar Plato</span>
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
        switch (typeNavbar) {
          case 'horizontal':
            return (
              <HorizontalNavUser
                user={user}
                photo={photo}
                isLight={!!backgroundImage}
                template={template}
                cookie={cookie}
              />
            );
          case 'recortado':
            return (
              <RecortadoNavUser
                user={user}
                photo={photo}
                isLight={!!backgroundImage}
                template={template}
                cookie={cookie}
              />
            );
          default:
            return (
              <DefaultNavUser
                user={user}
                photo={photo}
                isLight={!!backgroundImage}
                template={template}
                cookie={cookie}
              />
            );
        }
    }
  };

  const getNavbarHeight = () => {
    if (isSpecialState) return "h-14";

    switch (typeNavbar) {
      case 'horizontal':
        return "h-fit";
      case 'recortado':
        return "h-90";
      default:
        return "h-100"; // Caso por defecto o si no existe typeNavbar
    }
  };
  const navHeightClass = getNavbarHeight();

  return (
    <header className={`flex flex-col w-full ${isSpecialState ? "" : "bg-background"}`}>
      {!isSpecialState && (
        <div className={`flex w-full z-50 
        ${!user
            ? "backdrop-blur-lg bg-linear-to-b sticky top-0 from-red-700 to-primary h-14 p-2 text-white"
            : "absolute top-2 italic"
          } items-center justify-between`}>
          {user && typeNavbar !== "horizontal" && (
            <Link className="flex w-full justify-center gap-2 items-center text-xs" href="/">
              {user?.plan === "free" ? (
                <Image priority src={logotipo} width={60} height={60} alt="Logo" className="w-13 h-13 opacity-60 md:w-24 md:h-16 object-contain" />
              ) : (
                <Image priority src={logo_w} width={60} height={60} alt="Logo" className="w-13 h-13 md:w-24 md:h-16 object-contain" />
              )}
              {cookie && <UserPlan plan={user?.plan} />}
            </Link>
          )}
          {!user && (
            <div className="flex w-full justify-around items-center md:justify-center md:gap-10">
              <span className="text-md tracking-tight md:text-lg font-bold">Crea tu Menú ¡GRATIS!</span>
              <BotonAccion color="white" textColor="primary" />
            </div>
          )}
        </div>
      )}

      <div
        className={`relative w-full transition-all flex items-center bg-center bg-cover bg-no-repeat bg-linear-to-b from-white to-background ${navHeightClass}`}
        style={inlineStyle}
      >
        {!isSpecialState && (
          <div className={`absolute inset-0 ${canShowCover ? "bg-black/35" : ""}`} />
        )}
        <nav className="relative z-10 w-full">
          {renderNavContent()}
        </nav>
      </div>
    </header>
  );
}

function DefaultNavUser({ user, photo, cookie, template }: any) {
  const displayData = {
    name: user?.name || (!user ? "QMENÚ" : ""),
    description: user?.description || (!user ? "Crea tu menú GRATIS con QMenú." : ""),
    address: user?.location,
    schedule: user?.schedule || (!user ? "Horario 24/7" : ""),
    phone: user?.phone || "",
    instagram: user?.instagram || (!user ? "@qmenu_digital" : ""),
    facebook: user?.facebook || (!user ? "@qmenu" : ""),
    tiktok: user?.tiktok || (!user ? "@qmenu" : ""),
  };

  const optimizedPhoto = getOptimizedImage(photo, 200, 200);

  return (
    <div className={`flex flex-col pt-8 items-center justify-center ${user?.plan === "free" ? "text-gray-700" : "text-white drop-shadow drop-shadow-gray-900/30"} w-full`}>
      <div className="relative">
        <div className={`rounded-full p-1 ${user?.plan !== "free" ? "bg-white" : "bg-gray-700"}`}>
          <Image
            priority
            src={optimizedPhoto || logo}
            width={300}
            height={300}
            className="rounded-full object-cover w-33.75 h-33.75"
            alt="Profile"
          />
        </div>
        {user && cookie && (
          <Link
            className={`flex items-center active:scale-90 transition-all duration-100 absolute -bottom-2 right-0 mx-auto left-0 w-fit gap-1 ${user?.plan === "free" ? "bg-gray-100 text-black" : "bg-white text-black"} text-sm px-3 py-2 rounded-full shadow-md`}
            href="/panel-de-usuario"
          >
            <FaEdit size={14} /> Perfil
          </Link>
        )}
      </div>

      <h2 className="text-2xl leading-none font-bold mt-6 uppercase text-center px-4">
        {displayData.name}
      </h2>
      <p className="my-1 text-center px-6 text-sm">
        {displayData.description}
      </p>

      <div className="flex flex-col items-center mt-0.5">
        {displayData.schedule && (
          <span className="flex text-[13px] items-center gap-2">
            <FaClock size={16} />
            {displayData.schedule}
          </span>
        )}
        {(displayData.address || !user) && (
          <span className="flex text-[13px] items-center gap-2">
            <FaMapMarkerAlt size={16} />
            {displayData.address || "Santiago del Estero, Argentina"}
          </span>
        )}
        <div className="flex items-center gap-x-3 mt-1 text-xs flex-wrap justify-center px-4">
          {(displayData.phone || !user) && (
            <span className="flex items-center gap-1">
              <FaWhatsapp size={16} />
              {displayData.phone || "385 123 4567"}
            </span>
          )}

          {[
            { id: 'ig', val: displayData.instagram, icon: <FaInstagram size={16} /> },
            { id: 'fb', val: displayData.facebook, icon: <FaFacebook size={16} /> },
            { id: 'tk', val: displayData.tiktok, icon: <FaTiktok size={16} /> }
          ]
            .filter(social => social.val)
            .map((social) => (
              <span key={social.id} className={`flex items-center gap-1 ${user?.plan === "free" ? "border-gray-700" : "border-white/50"} pl-2`}>
                {social.icon}
                {social.val}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
function RecortadoNavUser({ user, photo, cookie, template }: any) {
  const displayData = {
    name: user?.name || (!user ? "QMENÚ" : ""),
    description: user?.description || (!user ? "Crea tu menú GRATIS con QMenú." : ""),
    address: user?.location,
    schedule: user?.schedule,
    phone: user?.phone,
    instagram: user?.instagram,
    facebook: user?.facebook,
    tiktok: user?.tiktok,
  };

  console.log(template)

  const optimizedPhoto = getOptimizedImage(photo, 200, 200);
  return (
    <div className={`flex flex-col h-full pt-8 items-center justify-center 
    ${template?.template_id === "default"
        ||
        template?.template_id === "gold"
        ||
        template?.template_id === "lemon"
        ||
        template?.template_id === "cherry"
        ||
        template?.template_id === "mint"
        ||
        template?.template_id === "lavender"
        ||
        template?.template_id === "sakura"
        ? `${template?.textColor}` : "text-white"} w-full`}>
      <div className="relative">
        <div className={`rounded-full p-1.5 ${template?.backgroundColor}`}>
          <Image
            priority
            src={optimizedPhoto || logo}
            width={200}
            height={200}
            className="rounded-full object-cover w-32.5 h-32.5 shadow-sm"
            alt="Profile"
          />
        </div>
        {user && cookie && (
          <Link
            className={`flex items-center active:scale-90 bg-white text-gray-800 transition-all duration-100 absolute bottom-0 right-0 mx-auto left-0 w-fit gap-1 text-xs px-3 py-2 rounded-full shadow-md`}
            href="/panel-de-usuario"
          >
            <FaEdit size={14} /> Perfil
          </Link>
        )}
      </div>

      <div className={`w-full `}>
        <h2 className="text-2xl leading-none font-bold mt-2 uppercase text-center px-4">
          {displayData.name}
        </h2>
        <p className="my-1 text-center px-6 text-sm opacity-90">
          {displayData.description}
        </p>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-x-2">
            {displayData.schedule && (
              <span className="flex text-[12px] items-center gap-1">
                <FaClock size={15} className={`${template?.icons}`} />
                {displayData.schedule}
              </span>
            )}
            {(displayData.address || !user) && (
              <span className="flex text-[12px] items-center gap-1">
                <FaMapMarkerAlt size={15} className={`${template?.icons}`} />
                {displayData.address || "Santiago del Estero, Argentina"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-x-3 text-[12px] flex-wrap justify-center px-4">
            {(displayData.phone || !user) && (
              <span className="flex items-center gap-1">
                <FaWhatsapp size={16} />
                {displayData.phone || "385 123 4567"}
              </span>
            )}

            {[
              { id: 'ig', val: displayData.instagram, icon: <FaInstagram size={16} /> },
              { id: 'fb', val: displayData.facebook, icon: <FaFacebook size={16} /> },
              { id: 'tk', val: displayData.tiktok, icon: <FaTiktok size={16} /> }
            ]
              .filter(social => social.val)
              .map((social) => (
                <span key={social.id} className={`flex items-center gap-1
                ${template?.template_id === "default"
                    ||
                    template?.template_id === "lavender"
                    ||
                    template?.template_id === "gold"
                    ||
                    template?.template_id === "lemon"
                    ||
                    template?.template_id === "cherry"
                    ||
                    template?.template_id === "mint"
                    ||
                    template?.template_id === "sakura"
                    ? "border-gray-600" : "border-white/50"} pl-2`}>
                  {social.icon}
                  {social.val}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
function HorizontalNavUser({ user, photo, cookie, template }: any) {
  console.log(user)
  const displayData = {
    name: user?.name || (!user ? "QMENÚ" : ""),
    description: user?.description || (!user ? "Crea tu menú GRATIS con QMenú." : ""),
    address: user?.location,
    schedule: user?.schedule,
    phone: user?.phone,
    instagram: user?.instagram,
    facebook: user?.facebook,
    tiktok: user?.tiktok,
  };

  const optimizedPhoto = getOptimizedImage(photo, 200, 200);

  const socialLinks = [
    { id: "ig", val: displayData.instagram, icon: <FaInstagram size={15} /> },
    { id: "fb", val: displayData.facebook, icon: <FaFacebook size={15} /> },
    { id: "tk", val: displayData.tiktok, icon: <FaTiktok size={15} /> },
  ].filter((s) => s.val);

  return (
    <div className="relative w-full min-h-44 md:h-52 md:pt-8 flex flex-col justify-center items-center px-4 overflow-hidden">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
        <Link className="flex items-center text-xs" href="/">
          <Image
            priority
            src={user?.plan === "free" ? logotipo : logo_w}
            width={80}
            height={50}
            alt="Logo"
            className={`h-6 md:h-12 w-auto object-contain ${user?.plan === "free" ? "opacity-60" : ""
              }`}
          />
        </Link>
      </div>

      {/* Fila Principal Horizontal */}
      <div className="flex items-center justify-between gap-3 w-full max-w-3xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">

        {/* Foto de Perfil */}
        <div className="shrink-0">
          <div className="rounded-full p-0.5 bg-white shadow-md">
            <Image
              priority
              src={optimizedPhoto || logo}
              width={60}
              height={60}
              className="rounded-full object-cover w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20"
              alt="Profile"
            />
          </div>
        </div>

        {/* Información Principal del Negocio */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="text-base sm:text-lg md:text-xl font-bold uppercase truncate leading-tight">
            {displayData.name}
          </h3>
          <p className="text-xs md:text-sm opacity-90 truncate my-0.5">
            {displayData.description}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[13px] sm:text-xs opacity-90">
            {(displayData.address || !user) && (
              <span className="flex items-center gap-1 truncate max-w-45 sm:max-w-xs">
                <FaMapMarkerAlt size={12} className="shrink-0" />
                <span className="truncate">
                  {displayData.address || "Santiago del Estero, Argentina"}
                </span>
              </span>
            )}
            {(displayData.schedule || !user) && (
              <span className="flex items-center gap-1 shrink-0">
                <FaClock size={12} className="shrink-0" />
                {displayData.schedule}
              </span>
            )}
          </div>
        </div>

        {/* Botón de Perfil */}
        {user && cookie && (
          <div className="shrink-0 absolute right-0 md:relative">
            <Link
              className="flex items-center justify-center text-black active:scale-95 bg-white hover:bg-gray-100 transition-all text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md whitespace-nowrap"
              href="/panel-de-usuario"
            >
              Perfil
            </Link>
          </div>
        )}
      </div>

      {/* Fila Inferior Horizontal: Teléfono y Redes Sociales */}
      <div className="flex items-center justify-center text-white gap-x-3 gap-y-1 mt-2 text-xs flex-wrap w-full max-w-4xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
        {(displayData.phone || !user) && (
          <span className="flex items-center gap-1 font-medium shrink-0">
            <FaWhatsapp size={14} className="shrink-0" />
            {displayData.phone || "385 123 4567"}
          </span>
        )}

        {socialLinks.map((social) => (
          <span
            key={social.id}
            className="flex items-center gap-1 pl-2 shrink-0"
          >
            {social.icon}
            <span className="truncate max-w-25">{social.val}</span>
          </span>
        ))}
      </div>

    </div>
  );
}