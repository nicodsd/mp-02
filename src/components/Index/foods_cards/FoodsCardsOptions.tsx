"use client";
import Image from "next/image";
export default function Cards({
  name,
  photo,
  description,
  price,
  context,
  template,
}: {
  name: string;
  photo: string;
  description: string;
  price: number | string;
  context?: boolean;
  template?: any;
}) {
  function formatearPrecio(precio: number | string) {
    const value = typeof precio === "string" ? Number(precio) : precio;
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(value);
  }
  return (
    <div className="flex w-38 items-center bg-background border border-gray-300/60 rounded-lg justify-center">
      <div
        className={`flex flex-col w-full h-60 overflow-hidden rounded-lg p-2 items-center`}
      >
        <Image
          quality={75}
          loading="lazy"
          src={photo}
          alt={name}
          className="min-w-full min-h-30 md:max-w-25 md:max-h-36 object-cover rounded-[7px]"
          width={130}
          height={130}
        />
        <div className="flex flex-col justify-between w-full h-full">
          <div className="menu-card__content text-left flex flex-col justify-start h-full">
            <h2 className="font-semibold text-gray-700 text-lg leading-6 line-clamp-1 mt-2 md:h-fit">
              {name}
            </h2>
            <p className="text-[#555] text-sm text-pretty line-clamp-2 leading-tight">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-1 justify-end h-5 mt-2">
            <span className="menu-card__description text-[#969696] md:text-lg">
              c/u
            </span>
            <span className="font-bold text-gray-700 oldstyle-nums text-xl md:text-2xl">
              {formatearPrecio(price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
