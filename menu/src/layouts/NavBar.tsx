interface NavBarProps {
  state: boolean;
  text: string;
}

let stilo = { fontSize: "12px", fontWeight: 600, color: "rgb(0,0,0)" };

export default function NavBar({ state, text }: NavBarProps) {
  return (
    <nav className="h-[54px] p-2 flex justify-between items-center w-full border-b border-gray-100 shadow-xs">
      {state ? (
        <>
          <span
            className="ml-3"
            style={{ fontSize: "1.2rem", fontWeight: "bold" }}
          >
            {text}
          </span>
          <div className="flex items-center justify-end h-full">
            <a
              style={stilo}
              className="min-w-20 w-[10vh] min-h-10 h-5 mr-2 rounded-lg"
              href="/"
            >
              CANCELAR
            </a>
            <a
              style={stilo}
              className="min-w-20 w-[10vh] min-h-8 h-3 mr-4 rounded-lg"
              href="/"
            >
              ACEPTAR
            </a>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center h-full">
            {/* Imagen */}
            <a href="/">
              <img
                src="/images/logo/OIP.webp"
                alt="Logo"
                className="rounded-full h-10 w-10 bg-black ml-1"
              />
            </a>
            {/* Texto */}
            <span
              className="ml-3"
              style={{ fontSize: "1.2rem", fontWeight: "bold" }}
            >
              {text}
            </span>
          </div>

          <a
            style={{
              fontSize: "13px",
              fontWeight: 800,
              color: "rgb(0,0,0)",
              backgroundColor: "rgb(51,255,0)",
            }}
            className="min-w-20 w-[10vh] min-h-8 h-3 mr-4 rounded-lg"
            href="/newfood"
          >
            NUEVO
          </a>
        </>
      )}
    </nav>
  );
}
