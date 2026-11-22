import Link from "next/link";

export default function BotonAccion({ color, textColor }: { color: any, textColor: any }) {
  const bgClass = color === "primary" ? "bg-red-700 hover:bg-red-800" : `bg-${color}`;
  return (
    <Link
      href="/registro-de-usuario"
      prefetch={false}
      className={`
        active:scale-90
        active:opacity-80
        hover:-translate-y-1
        group
        btn-god-rays
        px-4 py-3
        ${bgClass}
        text-${textColor}
        font-black
        rounded-lg
        uppercase
        transition-all duration-300
      `}
    >
      ¡Probar Ahora!
    </Link>
  )
}