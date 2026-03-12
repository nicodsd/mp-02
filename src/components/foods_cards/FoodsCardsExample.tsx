"use client";
import Image from "next/image";
export default function FoodsCardsExample({
  name,
  photo,
  description,
  price,
  context,
}: {
  name: string;
  photo: string;
  description: string;
  price: number | string;
  context?: boolean;
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
    <div className="flex w-full h-fit items-center">
      <div
        className={`flex w-full h-24.5 overflow-hidden
      ${
        context
          ? "border-r border-gray-300 md:pr-6 px-2 py-3 h-full"
          : "border border-gray-300 rounded-[7px] p-1.5 items-center"
      }`}
      >
        <Image
          quality={75}
          loading="lazy"
          src={photo}
          alt={name}
          className="max-w-16 md:max-w-25 h-20 md:max-h-36 object-cover rounded-[7px]"
          width={100}
          height={100}
        />
        <div className="flex flex-col justify-between pl-2 w-full h-full">
          <div className="menu-card__content text-left h-full">
            <h2
              className={`font-semibold text-gray-700 text-[18px] md:text-[1vw] md:h-fit ${context ? "h-fit leading-4" : "h-4"}`}
            >
              {name}
            </h2>
            <p
              className={`text-[#555] text-sm text-pretty leading-4 ${context ? "overflow-hidden mt-2" : "mt-3.5"}`}
            >
              {description.length > 250
                ? `${description.substring(0, 250)}...`
                : description}
            </p>
          </div>
          <div className="flex items-center gap-1 mt-1 justify-end">
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
