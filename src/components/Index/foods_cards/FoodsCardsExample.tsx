"use client";
import Image from "next/image";
export default function FoodsCardsExample({
  name,
  photo,
  description,
  price,
  is_promo,
  promo_price,
  context,
}: {
  name: string;
  photo: string;
  description: string;
  price: number | string;
  is_promo: boolean;
  promo_price: number | string;
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
        className={`flex w-full overflow-hidden
      ${context
            ? "border-r border-gray-300 md:pr-6 px-2 py-2 h-full"
            : "border h-27 border-gray-300/60 rounded-lg p-2 items-center"
          }`}
      >
        <Image
          quality={75}
          loading="lazy"
          src={photo}
          alt={name}
          className={`md:max-w-25 md:max-h-36 object-cover rounded-[7px] ${!context ? "md:h-full md:w-full h-23 w-20" : "h-30 w-24"}`}
          width={100}
          height={100}
        />
        <div className="flex flex-col justify-between pl-2 w-full h-full">
          <div className="menu-card__content text-left">
            <h2
              className={`font-semibold text-gray-700 text-lg md:h-fit ${context ? "leading-4" : "h-4 md:text-2xl"}`}
            >
              {name}
            </h2>
            <p
              className={`text-[#555] text-sm line-clamp-2 text-pretty leading-4 ${context ? "overflow-hidden mt-2" : "mt-2.5 md:mt-0"}`}
            >
              {description}
            </p>
          </div>

          <div
            className={`flex items-end gap-1 ${context ? "justify-start items-center" : "justify-end"}`}
          >
            {is_promo && !context && (
              <div className="flex flex-col items-end">
                <span className="font-bold text-gray-700 oldstyle-nums text-xs md:text-sm line-through decoration-red-600 decoration leading-1">
                  {formatearPrecio(price)}
                </span>

                <div className="flex items-center gap-1">
                  {!context && (
                    <span className="menu-card__description text-[#969696] md:text-lg">
                      c/u
                    </span>
                  )}
                  <span className="font-black text-red-600 oldstyle-nums text-xl md:text-2xl">
                    {formatearPrecio(promo_price)}
                  </span>
                </div>
              </div>
            )}
            {!is_promo && (
              <div className="flex items-center gap-1">
                {!context && (
                  <span className="menu-card__description text-[#969696] md:text-lg">
                    c/u
                  </span>
                )}
                <span className="font-bold text-gray-700 oldstyle-nums text-xl md:text-2xl">
                  {formatearPrecio(price)}
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
