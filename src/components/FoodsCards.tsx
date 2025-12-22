"use client";
import Image from "next/image";
export default function Cards({ name, photo, description, price, context }: { name: string, photo: string, description: string, price: number | string, context?: boolean }) {
  function formatearPrecio(precio: number | string) {
    const value = typeof precio === "string" ? Number(precio) : precio;
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(value);
  }
  return (
    <>
      <div
        className="flex w-full h-28 items-center"
      >
        <div className={` flex w-full p-2.5 h-28 overflow-hidden my-[4px] ${context ? "border-r border-gray-300 md:pr-6" : "border border-gray-300 rounded-[7px]"}`}>
          <Image
            quality={75}
            loading="lazy"
            src={photo}
            alt={name}
            className="max-w-18 md:max-w-25 max-h-23 md:max-h-36 object-cover rounded-[7px]"
            width={130}
            height={80}
          />
          <div className="flex flex-col justify-between pl-2 w-full">
            <div className="menu-card__content text-left">
              <h2 className="font-semibold text-gray-700 text-[18px] md:text-[1vw] h-4 md:h-fit">{name}</h2>
              <p className="mt-2 text-[#555] text-sm text-pretty">
                {description.length > 250 ? `${description.substring(0, 250)}...` : description}
              </p>
            </div>
            <div className="flex items-center gap-1 justify-end h-5">
              <span className="menu-card__description text-[#969696] md:text-lg">c/u</span>
              <span className="font-bold text-gray-700 oldstyle-nums text-xl md:text-2xl">
                {formatearPrecio(price)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 