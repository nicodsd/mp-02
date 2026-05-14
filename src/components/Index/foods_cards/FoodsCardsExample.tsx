"use client";
import Image from "next/image";
import AddFood from "@/src/components/buttons/AddFood";
import AddFoodExample from "@/src/components/buttons/AddFoodExample";
import { FaEdit } from "react-icons/fa";

export default function FoodsCardsExample({
  name,
  photo,
  description,
  price,
  is_promo,
  _id,
  example,
  promo_price,
  template,
}: {
  name: string;
  photo: string;
  _id: string;
  description: string;
  price: number | string;
  is_promo: boolean;
  promo_price: number | string;
  template: any;
  example?: boolean;
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
      className={`flex w-full overflow-hidden ${template?.backgroundColor || "bg-background"} border h-26 ${template?.border || "border-gray-200"} rounded-lg p-1 items-center`}
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
      <div className="flex flex-col relative py-1 justify-between pl-2 w-full h-full">
        <div className="flex text-left">
          <div className="w-full">
            <h2
              className={`font-semibold ${template?.textColor || "text-gray-700"} text-lg md:h-fit leading-4`}
            >
              {name}
            </h2>
            <p
              className={`${template?.textColorOpacity || "text-gray-700/50"} text-sm line-clamp-2 text-pretty leading-4 mt-1 md:mt-0`}
            >
              {description}
            </p>
          </div>
          {
            example ? (
              <AddFoodExample _id={_id} />
            ) : (
              <AddFood _id={String(_id)} />
            )
          }
        </div>

        <div
          className={`flex flex-col relative h-full items-end gap-1 justify-end`}
        >
          {is_promo && (
            <div className={`flex flex-col ${template?.textColor || "text-gray-700"} items-end`}>
              <span className={`font-bold oldstyle-nums text-xs md:text-sm line-through decoration-red-600 decoration leading-1`}>
                {formatearPrecio(price)}
              </span>

              <div className="flex items-center">
                <span className={`font-black text-${template?.accentColors?.[1] || "primary"} oldstyle-nums text-xl md:text-2xl`}>
                  {formatearPrecio(promo_price)}
                </span>
              </div>
            </div>
          )}
          {!is_promo && (
            <div className="flex items-center">
              <span className={`font-bold ${template?.textColor || "text-gray-700"} oldstyle-nums text-xl md:text-2xl`}>
                {formatearPrecio(price)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
