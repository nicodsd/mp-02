"use client";
import { JSX } from "react";
import Link from "next/link";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Image from "next/image";
interface NavBarProps {
  state: number;
  text: string;
  cookie: string;
  photo: string;
  user: any;
  description?: string;
}
export default function NavBar({ state, text, cookie, photo, user, description }: NavBarProps) {
  const name = text || "QMenu";
  const logo = photo ? photo : "/images/logo/LOGO2.svg";
  const descrip = description || "Comida al paso.";
  const logoColor = "/images/logo/logo-color.png"
  const background = "/images/placeholders/background.png";
  const navVariants: Record<number, JSX.Element> = {
    0: (
      <div className="flex items-center justify-between w-full px-5 md:px-10 h-full bg-[#000000a1]">
        <div className="flex items-center flex-col w-full h-full justify-end pb-5 text-white">
          {
            cookie && user ?
              <div className={`flex flex-col items-center ${cookie && user ? "gap-4" : "gap-2"} drop-shadow-xl drop-shadow-black/50`}>
                <Link className="relative" href="/panel-de-usuario">
                  <Image
                    src={logo}
                    loading="lazy"
                    alt="Logo"
                    width={50}
                    height={50}
                    className="rounded-full h-27 w-27 border-5 border-white"
                  />
                  <button className="text-black absolute -bottom-2 font-bold bg-white rounded-lg left-1/2 transform w-20 -translate-x-1/2 text-xs px-2 py-1">Editar Perfil</button>
                </Link>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl uppercase font-bold text-white">{name}</span>
                  <p className="text-white text-sm">{descrip}</p>
                  <div className="flex items-center gap-3 text-gray-300">
                    <p className="text-xs font-light">Salta 1488, Sgo. del Estero, Argentina.</p>
                    <span className="border border-white w-1 h-1 rounded-full"></span>
                    <p className="text-xs font-light">Tel: 3864-4567.</p>
                  </div>
                </div>
              </div> :
              <div className="flex flex-col items-center gap-2 drop-shadow-xl drop-shadow-black/50">
                <Image
                  width={100}
                  height={100}
                  src={logoColor}
                  alt="Logo"
                  loading="lazy"
                  className="rounded-full h-25 w-25"
                />
                <div className="flex flex-col items-center">
                  <span className="text-2xl uppercase font-bold text-white">{name}</span>
                  <p className="text-white text-sm">Tu Menú En Tu Mano.</p>
                  <div className="flex items-center gap-2 text-gray-300">
                    <p className="text-xs font-light">Salta 1488, Sgo. del Estero, Argentina.</p>
                    <span className="border border-white w-1 h-1 rounded-full"></span>
                    <p className="text-xs font-light">Tel: 3864-4567.</p>
                  </div>
                </div>
              </div>
          }
        </div>
      </div>
    ),
    1: (
      <div className="flex items-center justify-between w-full px-5 py-2 md:px-10 md:py-4 h-full">
        <span className="text-[22px] font-bold text-gray-800">{name}</span>
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
      {
        state === 0 ? (
          <div
            style={{ background: `url(${background}) no-repeat center center/cover`, backgroundSize: "cover" }}
            className={`flex relative justify-end w-full ${cookie && user ? "h-80" : "h-90"}`}
          >
            <div className="flex items-center absolute top-2 z-20 w-full justify-between">
              {
                !cookie && !user ?
                  <div className="flex items-center w-full justify-between mx-1 rounded-xl px-3 py-3 bg-[#000000cc] border border-[#555555]">
                    <span className="text-white text-xs">Hecho para tí, un menú rápido y sin vueltas.</span>
                    <Link
                      href="/registro-de-usuario"
                      className="px-4 py-1.5 max-w-35 min-w-35 shadow-sm hover:shadow-md ease-in-out duration-300 shadow-amber-500/70 text-center text-md font-bold newfood border border-[#fff1a2] text-white rounded-md transition"
                    >
                      Prueba ahora!
                    </Link>
                  </div> :
                  <></>
              }
            </div>
            <nav
              className="flex justify-between items-center w-full shadow-sm">
              {navVariants[state] ?? navVariants[0]}
            </nav>
          </div>
        ) : (
          <nav
            className="flex justify-between items-center w-full border-b border-gray-200">
            {navVariants[state] ?? navVariants[0]}
          </nav>
        )
      }
    </>
  );
}