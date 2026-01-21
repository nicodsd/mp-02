"use client";
import { JSX } from "react";
import Link from "next/link";
import Image from "next/image";
import { logotipo, logotipoColor } from "@/src/lib/const";
import { FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
interface NavBarProps {
  user: any;
  bttn: boolean;
  photo: string;
  state: number;
  cookie: string;
}
export default function NavBar({ state, bttn, cookie, photo, user }: NavBarProps) {
  const logoColor = logotipoColor
  const logo = logotipo
  const phone = user?.phone || "123456789";
  const name = user?.name || ""
  const address = user?.address || "Sgo. Del Estero, Argentina";
  const description = user?.description || "Crea tu menú con QMenu.";
  let background;
  if (bttn === true) {
    background = "/images/placeholders/back-qmenu.png"
  } else {
    background = user?.coverPhoto
  }
  const navVariants: Record<number, JSX.Element> = {
    0: (
      <div className={`flex items-center justify-between w-full px-5 md:px-10 h-full ${background ? "" : "bg-transparent"}`}>
        <div className="flex items-center flex-col w-full h-full justify-end pb-15 text-white">
          {
            cookie && user ?
              <div className={`flex flex-col items-center ${cookie && user ? "gap-4" : "gap-2"} ${background ? "drop-shadow-xl drop-shadow-black/30" : ""}`}>
                <Link className="relative" href="/panel-de-usuario">
                  <Image
                    src={photo}
                    loading="lazy"
                    alt="Logo"
                    width={100}
                    height={100}
                    className="rounded-full h-27 w-27 border-5 border-white"
                  />
                  <div className="text-black absolute -bottom-2 font-bold bg-white rounded-lg left-1/2 transform w-20 -translate-x-1/2 text-xs px-2 py-1">Editar Perfil</div>
                </Link>
                <div className="flex flex-col items-center">
                  <span className={`text-2xl uppercase font-bold pb-1 ${background ? "text-white" : "text-gray-900"}`}>{name}</span>
                  <p className={`text-sm ${background ? "text-white" : "text-gray-900"}`}>{description}</p>
                  <div className={`flex flex-col items-center ${background ? "text-gray-200" : "text-gray-900"}`}>
                    {
                      address && <p className="text-xs flex items-center gap-1 font-light"><FaMapMarkerAlt /> {address}</p>
                    }
                    {
                      phone && <p className="text-xs flex items-center gap-1 font-light"><FaPhone className="rotate-180" /> {phone}</p>
                    }
                  </div>
                </div>
              </div>
              :
              <div className={`flex flex-col items-center gap-3 ${background ? "drop-shadow-xl drop-shadow-black/30" : ""}`}>
                <div className={`relative rounded-full ${background ? "bg-white" : ""}`}>
                  <Image
                    width={100}
                    height={100}
                    src={photo ? photo : logoColor}
                    alt="Logo"
                    loading="lazy"
                    className={`rounded-full h-27 w-27 border-5 ${background ? "border-white" : "border-gray-900"}`}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className={`text-2xl uppercase font-bold pb-1 ${background ? "text-white" : "text-gray-900"}`}>{name}</span>
                  <p className={`text-sm ${background ? "text-white" : "text-gray-900"}`}>{description}</p>
                  <div className={`flex flex-col items-center ${background ? "text-gray-200" : "text-gray-900"}`}>
                    {
                      address && <p className="text-xs flex items-center gap-1 font-light"><FaMapMarkerAlt /> {address}</p>
                    }
                    {
                      phone && <p className="text-xs flex items-center gap-1 font-light"><FaPhone className="rotate-180" /> {phone}</p>
                    }
                  </div>
                </div>
              </div>
          }
        </div>
      </div>
    ),
    1: (
      <div className="flex items-center justify-between w-full px-5 py-2 md:px-10 md:py-4 h-full">
        <span className="text-[22px] font-bold text-gray-800">Agregar Plato</span>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-1.5 text-md font-bold text-gray-500 rounded-full bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancelar
          </Link>
        </div>
      </div>
    ),
    2: (
      <div className="flex items-center justify-between w-full px-5 py-2 md:px-10 md:py-4 h-full">
        <Link href="/" className="text-gray-700 text-center text-sm px-3">
          <ArrowBackIosIcon /> Inicio
        </Link>
      </div>
    ),
  };

  return (
    <>
      <div className="flex flex-col w-full items-center">
        {
          state !== 1 && state !== 2 && (
            <div className="flex w-full items-center justify-between min-h-14 px-6">
              <Image src={logo} width={100} height={100} alt="Logo" loading="lazy" className="h-12 w-15" />
              {
                !cookie && !user ?
                  <Link
                    href="/registro-de-usuario"
                    className="px-3 py-1.5 max-w-35 shadow-sm hover:shadow-md ease-in-out duration-300 bg-[#FF0004] text-center text-md font-bold text-white rounded-md transition"
                  >
                    ¡Prueba ahora!
                  </Link>
                  :
                  <></>
              }
            </div>
          )
        }
        {background ?
          <div
            style={{
              background: `url(${background}) no-repeat center center/cover`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }}
            className={`flex justify-end w-full h-80`}
          >
            <nav
              className="flex justify-between items-center w-full">
              {navVariants[state] ?? navVariants[0]}
            </nav>
          </div>
          :
          <div
            className={`flex justify-end w-full bg-radial from-transparent ${state !== 1
              &&
              state !== 2
              ?
              "via-[#fff9f4] to-[#c7c7c7] h-80"
              :
              "min-h-14"
              }`}
          >
            <nav
              className="flex justify-between items-center w-full">
              {navVariants[state] ?? navVariants[0]}
            </nav>
          </div>
        }
      </div>
    </>
  );
}