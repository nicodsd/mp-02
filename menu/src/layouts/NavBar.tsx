import { Add } from "@mui/icons-material";

interface NavBarProps {
  state: number;
  text: string;
}

export default function NavBar({ state, text }: NavBarProps) {
  const navVariants: Record<number, JSX.Element> = {
    0: (
      <>
        <div className="flex items-center gap-3">
          <a href="/user-panel">
            <img
              src="/images/logo/OIP.webp"
              alt="Logo"
              className="rounded-full h-10 w-10 bg-black"
            />
          </a>
          <span className="text-xl font-bold text-gray-800 tracking-wide">
            {text}
          </span>
        </div>
        <a
          href="/newfood"
          className="px-4 py-1.5 text-sm font-bold text-white bg-lime-500 rounded-md hover:bg-lime-600 transition"
        >
          Agregar plato <Add />
        </a>
      </>
    ),
    1: (
      <>
        <span className="ml-2 text-xl font-bold text-gray-800 tracking-wide">
          {text}
        </span>
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="px-4 py-1.5 text-sm font-bold text-red-600 rounded-md hover:bg-gray-200 transition"
          >
            Cancelar
          </a>
          <a
            href="/"
            className="px-4 py-1.5 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition"
          >
            Aceptar
          </a>
        </div>
      </>
    ),
    2: (
      <>
        <div className="flex items-center gap-3">
          <a href="/">
            <img
              src="/images/logo/OIP.webp"
              alt="Logo"
              className="rounded-full h-10 w-10 bg-black"
            />
          </a>
          <span className="text-xl font-bold text-gray-800 tracking-wide">
            {text}
          </span>
        </div>
        <a
          href="/newfood"
          className="px-4 py-1.5 text-sm font-bold text-white bg-lime-500 rounded-md hover:bg-lime-600 transition"
        >
          Agregar <Add />
        </a>
      </>
    ),
  };

  return (
    <nav className="h-[55px] px-4 flex justify-between items-center w-full bg-[#f3f0e4] shadow-md ">
      {navVariants[state] ?? navVariants[0]}
    </nav>
  );
}