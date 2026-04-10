"use client";
import Image from "next/image";
import { FaPlus } from "react-icons/fa";
import { useCartStore } from "@/src/lib/useCartStore";

export default function FoodsCardsExample({
  name,
  photo,
  description,
  price,
  is_promo,
  _id,
  promo_price,
}: {
  name: string;
  photo: string;
  description: string;
  price: number | string;
  is_promo: boolean;
  _id: string;
  promo_price: number | string;
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
    <div
      className={`flex w-full overflow-hidden bg-background border h-26 border-gray-300/60 rounded-lg p-2 items-center`}
    >
      <Image
        quality={75}
        loading="lazy"
        src={photo}
        alt={name}
        className={`md:max-w-25 md:max-h-36 object-cover rounded-[7px] md:h-full md:w-full h-full min-w-20 w-20 max-w-20`}
        width={100}
        height={100}
      />
      <div className="flex flex-col relative justify-between pl-2 w-full h-full">
        <div className="flex text-left">
          <div className="w-full">
            <h2
              className={`font-semibold text-gray-700 text-lg md:h-fit leading-4`}
            >
              {name}
            </h2>
            <p
              className={`text-[#555] text-sm line-clamp-2 text-pretty leading-4 mt-1 md:mt-0`}
            >
              {description}
            </p>
          </div>
          <button className="w-fit h-fit p-3 ml-2 border bg-green-500 border-black rounded-full flex items-center justify-center" >
            <FaPlus className="text-white" />
          </button>
        </div>

        <div
          className={`flex flex-col relative h-full items-end gap-1 justify-end`}
        >
          {is_promo && (
            <div className="flex flex-col items-end">
              <span className="font-bold text-gray-700 oldstyle-nums text-xs md:text-sm line-through decoration-red-600 decoration leading-1">
                {formatearPrecio(price)}
              </span>

              <div className="flex items-center">
                <span className="font-black text-red-600 oldstyle-nums text-xl md:text-2xl">
                  {formatearPrecio(promo_price)}
                </span>
              </div>
            </div>
          )}
          {!is_promo && (
            <div className="flex items-center">
              <span className="font-bold text-gray-700 oldstyle-nums text-xl md:text-2xl">
                {formatearPrecio(price)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
