/* import { Add } from "@mui/icons-material"; */
import { JSX } from "react";
interface NavBarProps {
  state: number;
  text: string;
  cookie: string;
}
export default function NavBar({ state, text, cookie }: NavBarProps) {
  const navVariants: Record<number, JSX.Element> = {
    0: (
      <>
        <div className="flex items-center gap-2">
          {
            cookie ? <a href="/panel-de-usuario">
              <img
                src="/images/logo/OIP.webp"
                alt="Logo"
                className="rounded-full h-10 w-10 bg-black"
              />
            </a> : <a href="/">
              <img
                src="/images/logo/OIP.webp"
                alt="Logo"
                className="rounded-full h-10 w-10 bg-black"
              />
            </a>
          }
          <span className="text-[22px] font-bold text-gray-800">{text}</span>
        </div>
        {
          cookie != "No encontrada" ?
            <a
              href="/newfood"
              className="px-4 py-1.5 text-md font-bold text-white bg-lime-500 rounded-md hover:bg-lime-600 transition"
            >
              Agregar plato {/* <Add /> */}
            </a> :
            <a
              href="/registro-de-usuario"
              className="px-4 py-1.5 text-md font-bold text-white rounded-md bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 hover:from-red-600 hover:via-yellow-600 hover:to-blue-600 transition"
            >
              Prueba ahora!
            </a>
        }
      </>
    ),
    1: (
      <>
        <span className="text-[22px] font-bold text-gray-800">{text}</span>
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="px-2 py-1.5 text-md font-bold text-red-700 rounded-md hover:bg-gray-200 transition"
          >
            Cancelar
          </a>
          <a
            href="/"
            className="px-4 py-1.5 text-md font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition"
          >
            Aceptar
          </a>
        </div>
      </>
    ),
    2: (
      <>
        <div className="flex items-center gap-2">
          <a href="/">
            <img
              src="/images/logo/OIP.webp"
              alt="Logo"
              className="rounded-full h-10 w-10 bg-black"
            />
          </a>
          <span className="text-[22px] font-bold text-gray-800 ">{text}</span>
        </div>
      </>
    ),
  };

  return (
    <nav className="h-[55px] px-4 flex justify-between items-center w-full shadow-sm ">
      {navVariants[state] ?? navVariants[0]}
    </nav>
  );
}