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

  const typeNavbar = user?.navBar || 'default';
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
          {user && (
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
          <div className={`absolute inset-0 ${canShowCover ? "bg-black/65" : ""}`} />
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
    phone: user?.phone,
    instagram: user?.instagram,
    facebook: user?.facebook,
    tiktok: user?.tiktok,
  };

  const optimizedPhoto = getOptimizedImage(photo, 200, 200);

  return (
    <div className={`flex flex-col items-center justify-center ${user?.plan === "free" ? "text-gray-700" : "text-white drop-shadow drop-shadow-gray-900/30"} w-full`}>
      <div className="relative">
        <div className={`rounded-full p-1 ${user?.plan !== "free" ? "bg-white" : "bg-gray-700"}`}>
          <Image
            priority
            src={optimizedPhoto || logo}
            width={300}
            height={300}
            className="rounded-full object-cover w-[135px] h-[135px]"
            alt="Profile"
          />
        </div>
        {user && cookie && (
          <Link
            className={`flex items-center active:scale-90 transition-all duration-100 absolute -bottom-2 right-0 mx-auto left-0 w-fit gap-1 ${user?.plan === "free" ? "bg-gray-300 text-black" : "bg-white text-black"} text-sm px-3 py-2 rounded-full shadow-md`}
            href="/panel-de-usuario"
          >
            <FaEdit size={14} /> Perfil
          </Link>
        )}
      </div>

      <h2 className="text-2xl leading-none font-bold mt-3 uppercase text-center px-4">
        {displayData.name}
      </h2>
      <p className="my-1 text-center px-6 text-sm opacity-90">
        {displayData.description}
      </p>

      <div className="flex flex-col items-center gap-1 mt-0.5">
        {(displayData.address || !user) && (
          <span className="flex text-xs items-center gap-1">
            <FaMapMarkerAlt size={14} />
            {displayData.address || "Santiago del Estero, Argentina"}
          </span>
        )}
        <div className="flex items-center gap-x-3 mt-1 text-xs flex-wrap justify-center px-4">
          {(displayData.phone || !user) && (
            <span className="flex items-center gap-1">
              <FaWhatsapp size={15} />
              {displayData.phone || "385 123 4567"}
            </span>
          )}

          {[
            { id: 'ig', val: displayData.instagram, icon: <FaInstagram size={15} /> },
            { id: 'fb', val: displayData.facebook, icon: <FaFacebook size={15} /> },
            { id: 'tk', val: displayData.tiktok, icon: <FaTiktok size={15} /> }
          ]
            .filter(social => social.val)
            .map((social) => (
              <span key={social.id} className="flex items-center gap-1 border-l border-white/50 pl-2">
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
    phone: user?.phone,
    instagram: user?.instagram,
    facebook: user?.facebook,
    tiktok: user?.tiktok,
  };

  const optimizedPhoto = getOptimizedImage(photo, 200, 200);
  return (
    <div className={`flex flex-col h-full pt-12 items-center justify-center 
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
        template?.template_id === "lavanda"
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
            className="rounded-full object-cover w-[130px] h-[130px] shadow-sm"
            alt="Profile"
          />
        </div>
        {user && cookie && (
          <Link
            className={`flex items-center active:scale-90 bg-white text-gray-800 transition-all duration-100 absolute -bottom-2 right-0 mx-auto left-0 w-fit gap-1 text-xs px-3 py-2 rounded-full shadow-md`}
            href="/panel-de-usuario"
          >
            <FaEdit size={14} /> Perfil
          </Link>
        )}
      </div>

      <div className={`w-full `}>
        <h2 className="text-2xl leading-none font-bold mt-3 uppercase text-center px-4">
          {displayData.name}
        </h2>
        <p className="my-1 text-center px-6 text-sm opacity-90">
          {displayData.description}
        </p>

        <div className="flex flex-col items-center gap-1 mt-0.5">
          {(displayData.address || !user) && (
            <span className="flex text-xs items-center gap-1">
              <FaMapMarkerAlt size={14} />
              {displayData.address || "Santiago del Estero, Argentina"}
            </span>
          )}
          <div className="flex items-center gap-x-3 mt-1 text-xs flex-wrap justify-center px-4">
            {(displayData.phone || !user) && (
              <span className="flex items-center gap-1">
                <FaWhatsapp size={15} />
                {displayData.phone || "385 123 4567"}
              </span>
            )}

            {[
              { id: 'ig', val: displayData.instagram, icon: <FaInstagram size={15} /> },
              { id: 'fb', val: displayData.facebook, icon: <FaFacebook size={15} /> },
              { id: 'tk', val: displayData.tiktok, icon: <FaTiktok size={15} /> }
            ]
              .filter(social => social.val)
              .map((social) => (
                <span key={social.id} className={`flex items-center gap-1 border-l 
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
                    template?.template_id === "lavanda"
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
  const displayData = {
    name: user?.name || (!user ? "QMENÚ" : ""),
    description: user?.description || (!user ? "Crea tu menú GRATIS con QMenú." : ""),
    address: user?.location,
    phone: user?.phone,
    instagram: user?.instagram,
    facebook: user?.facebook,
    tiktok: user?.tiktok,
  };
  const optimizedPhoto = getOptimizedImage(photo, 200, 200);

  return (
    <div className="relative h-43 flex flex-col justify-center items-center">
      <div className={`flex items-center h-18 text-white drop-shadow drop-shadow-gray-900/30 w-full`}>
        <div className="w-[30%] flex flex-col items-center justify-center">
          <div className={`rounded-full p-1 bg-white`}>
            <Image
              priority
              src={optimizedPhoto || logo}
              width={100}
              height={100}
              className="rounded-full object-cover w-[60px] h-[60px]"
              alt="Profile"
            />
          </div>
        </div>

        <div className="w-[70%] flex relative">
          <div className="w-full">
            <h2 className="text-xl leading-none w-full font-bold mt-3 uppercase text-start">
              {displayData.name}
            </h2>
            <p className="my-1 italic text-start text-sm opacity-90">
              {displayData.description}
            </p>
          </div>
          {user && cookie && (
            <Link
              className={`flex flex-col items-center absolute top-0 right-3 text-black active:scale-90 bg-white transition-all duration-100 mx-auto w-fit gap-1 text-sm px-3 py-2 rounded-xl shadow-md`}
              href="/panel-de-usuario"
            >
              <FaEdit size={14} /> Perfil
            </Link>
          )}
        </div>
      </div>
      <div className="flex items-center text-white gap-x-3 gap-y-1 mt-2 text-xs flex-wrap justify-start pr-2">
        {(displayData.phone || !user) && (
          <span className="flex items-center gap-1">
            <FaWhatsapp size={15} />
            {displayData.phone || "385 123 4567"}
          </span>
        )}

        {[
          { id: 'ig', val: displayData.instagram, icon: <FaInstagram size={15} /> },
          { id: 'fb', val: displayData.facebook, icon: <FaFacebook size={15} /> },
          { id: 'tk', val: displayData.tiktok, icon: <FaTiktok size={15} /> }
        ]
          .filter(social => social.val)
          .map((social) => (
            <span key={social.id} className="flex items-center gap-1 border-l border-white/50 pl-2">
              {social.icon}
              {social.val}
            </span>
          ))}
      </div>
    </div>
  );
}