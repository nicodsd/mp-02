"use client";
import Link from "next/link";
import FloatingSocialButtons from "@/src/components/buttons/FloatingSocialButtons";
import Image from "next/image";
import {
  FaMapMarkerAlt,
  FaWhatsapp,
  FaEdit,
  FaClock,
  FaSearch,
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 380);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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

  const displayData = {
    name: user?.name || (!user ? "QMENÚ" : ""),
    description: user?.description || (!user ? "Crea tu menú GRATIS con QMenú." : ""),
  };

  const optimizedPhoto = getOptimizedImage(photo, 100, 100);

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
        return "h-110";
    }
  };
  const navHeightClass = getNavbarHeight();

  return (
    <>
      {/* Navbar compacto flotante */}
      {!isSpecialState && (
        <div
          className={`fixed -top-1 left-0 right-0 z-50 backdrop-blur-sm ${template?.bgMenu} shadow-md transition-all duration-300 transform ${isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
            } py-3 px-4 flex items-center justify-between`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="shrink-0">
              <Image
                src={optimizedPhoto || logo}
                width={40}
                height={40}
                className="rounded-full object-cover w-10 h-10 border border-gray-200"
                alt="Logo compacto"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-sm font-bold uppercase ${template?.textColor || "text-primary"} truncate`}>
                {displayData.name}
              </span>
              <span className={`text-xs ${template?.textColor || "text-primary"} truncate`}>
                {displayData.description}
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Buscar platos"
            onClick={() => document.dispatchEvent(new CustomEvent("open-search-modal"))}
            className={`p-2.5 ${template?.backgroundColor || "bg-background"} hover:opacity-80 active:scale-95 transition shrink-0 cursor-pointer flex items-center justify-center`}
          >
            <FaSearch className={`${template?.icons || "text-primary"}`} size={20} />
          </button>
        </div>
      )}

      <header className={`flex flex-col w-full ${isSpecialState ? "" : "bg-background"}`}>
        {!isSpecialState && (
          <div className={`flex w-full z-40 
          ${!user
              ? "backdrop-blur-lg bg-linear-to-b sticky top-0 from-red-700 to-primary h-14 p-2 text-white"
              : "absolute top-2 italic"
            } items-center justify-between`}>
            {user && typeNavbar !== "horizontal" && (
              <Link className="flex w-full justify-center gap-2 items-center text-xs" href="/mi-menu">
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
    </>
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
        <div className={`rounded-full p-1 ${user?.plan !== "free" ? `bg-white` : "bg-gray-700"}`}>
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
            <FaEdit size={14} /> Panel
          </Link>
        )}
      </div>

      <div className={`w-full`}>
        <h2 className="text-2xl leading-none font-bold mt-2 uppercase text-center px-4">
          {displayData.name}
        </h2>
        <p className="my-1 text-center px-6 text-sm">
          {displayData.description}
        </p>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-x-2">
            {displayData.schedule && (
              <span className="flex text-[14px] items-center gap-1">
                <FaClock size={20} className={`${template?.icons}`} />
                {displayData.schedule}
              </span>
            )}
            {(displayData.address || !user) && (
              <span className="flex text-[14px] items-center gap-1">
                <FaMapMarkerAlt size={20} className={`${template?.icons}`} />
                {displayData.address || "Santiago del Estero, Argentina"}
              </span>
            )}
          </div>
          <div className="flex justify-center mt-1 w-full">
            <FloatingSocialButtons user={user} />
          </div>
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
        ||
        template?.template_id === "royal"
        ? `${template?.textColor}` : "text-white"} w-full`}>
      <div className="relative">
        <div className={`rounded-full p-1 ${user?.plan !== "free" ? `${template?.backgroundColor2}` : "bg-gray-700"}`}>
          <Image
            priority
            src={optimizedPhoto || logo}
            width={300}
            height={300}
            className="rounded-full object-cover w-33.75 h-33.75"
            alt="Profile"
          />
        </div>
        {user && cookie ? (
          <Link
            className={`flex items-center active:scale-90 ${template?.backgroundColor2 || "bg-white"} ${template?.textColor || "text-gray-800"} transition-all duration-100 absolute -bottom-1 right-0 mx-auto left-0 w-fit gap-1 text-xs px-3 hover:opacity-80 py-2 rounded-full shadow-md`}
            href="/panel-de-usuario"
          >
            <FaEdit size={14} /> Panel
          </Link>
        ) : (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-100">
            <FloatingSocialButtons user={user} isDropdown={true} />
          </div>
        )}
      </div>

      <div className={`w-full `}>
        <h2 className="text-2xl leading-none font-bold mt-2 uppercase text-center px-4">
          {displayData.name}
        </h2>
        <p className="my-1 text-center px-6 text-sm">
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
        </div>
      </div>
    </div>
  );
}

function HorizontalNavUser({ user, photo, cookie, template }: any) {
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

      <div className="absolute top-2 right-2 z-100">
        <FloatingSocialButtons user={user} isDropdown={true} />
      </div>

      <div className="flex items-center justify-between gap-3 w-full max-w-3xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
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

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="text-lg sm:text-lg md:text-xl font-bold uppercase truncate leading-tight">
            {displayData.name}
          </h3>
          <p className="text-xs md:text-sm truncate my-0.5">
            {displayData.description}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[13px] sm:text-xs">
            {(displayData.address || !user) && (
              <span className="flex items-center gap-1 truncate max-w-45 sm:max-w-xs">
                <FaMapMarkerAlt size={15} className="shrink-0" />
                <span className="truncate">
                  {displayData.address || "Santiago del Estero, Argentina"}
                </span>
              </span>
            )}
            {(displayData.schedule || !user) && (
              <span className="flex items-center gap-1 shrink-0">
                <FaClock size={15} className="shrink-0" />
                {displayData.schedule}
              </span>
            )}
          </div>
        </div>

        {user && cookie && (
          <div className="shrink-0 absolute right-0 md:relative">
            <Link
              className={`flex items-center justify-center ${template?.backgroundColor2 || "bg-white"} ${template?.textColor || "text-gray-800"} active:scale-95 transition-all text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md hover:opacity-80 whitespace-nowrap`}
              href="/panel-de-usuario"
            >
              Panel
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
