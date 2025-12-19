import { JSX } from "react";
import Link from "next/link";
interface NavBarProps {
  state: number;
  text: string;
  cookie: string;
  photo: string;
  user: any;
}
export default function NavBar({ state, text, cookie, photo, user }: NavBarProps) {
  const name = text || "";
  const logo = photo ? photo : "/images/logo/LOGO2.svg";
  const navVariants: Record<number, JSX.Element> = {
    0: (
      <>
        <div className="flex items-center gap-2">
          {
            cookie && user ? <Link href="/panel-de-usuario">
              <img
                src={logo}
                alt="Logo"
                className="rounded-full h-10 w-10 text-black"
              />
            </Link> :
              <img
                src={logo}
                alt="Logo"
                className="rounded-full h-20 w-20"
              />
          }
          <span className="text-[22px] font-bold text-gray-800">{name}</span>
        </div>
        {
          cookie && user ?
            <Link href="/nuevo-plato"
              className="px-4 py-1.5 text-md font-bold text-white bg-lime-500 rounded-md hover:bg-lime-600 transition"
            >
              Agregar plato
            </Link> :
            <Link
              href="/registro-de-usuario"
              className="px-4 py-1.5 text-md font-bold newfood border border-yellow-200 text-white rounded-md transition"
            >
              Prueba ahora!
            </Link>
        }
      </>
    ),
    1: (
      <>
        <span className="text-[22px] font-bold text-gray-800">{name}</span>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-1.5 text-md font-bold text-gray-500 rounded-full bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancelar
          </Link>
        </div>
      </>
    ),
    2: (
      <>
        <div className="flex items-center gap-2">
          <Link href="/">
            <img
              src={logo}
              alt="Logo"
              className="rounded-full h-10 w-10 bg-black"
            />
          </Link>
          <span className="text-[22px] font-bold text-gray-800 ">{name}</span>
        </div>
      </>
    ),
  };

  return (
    <nav className="h-[55px] px-5 md:px-10 flex justify-between items-center w-full shadow-sm">
      {navVariants[state] ?? navVariants[0]}
    </nav>
  );
}