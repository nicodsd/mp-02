"use client";

import React from "react";
import Image from "next/image";
import AddFood from "@/src/components/buttons/AddFood";
import AddFoodExample from "@/src/components/buttons/AddFoodExample";
import IconFood from "@/public/images/icons-index/IconFood";
import { Share2 } from "lucide-react";

// 1. Instanciamos el formateador fuera del componente para maximizar la performance en listas largas
const priceFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
});

function formatearPrecio(precio: number | string) {
  const value = typeof precio === "string" ? Number(precio) : precio;
  return priceFormatter.format(value);
}

// 2. Definición estricta de tipos para un mejor soporte de Turbopack y TypeScript
interface FoodItem {
  _id: string;
  name: string;
  photo: string;
  description: string;
  price: number | string;
  is_archived?: boolean;
  is_gluten_free?: boolean;
  is_promo?: boolean;
  promo_price?: number | string;
}

type FoodsCardsOptionsProps = {
  food: FoodItem;
  context?: boolean;
  user: any;
  template?: {
    backgroundColor?: string;
    border?: string;
    textColor?: string;
    textColorOpacity?: string;
    accentColors?: string[];
  };
  example?: boolean;
  whatsapp?: boolean;
};

export default function Cards({
  food,
  context,
  template,
  user,
  example,
  whatsapp
}: FoodsCardsOptionsProps) {
  const {
    _id,
    name,
    photo,
    description,
    price,
    is_archived,
    is_gluten_free,
    is_promo,
    promo_price
  } = food;

  return (
    <div
      id={`dish-${_id}`}
      className={`flex w-40 items-center relative rounded-lg justify-center transition-all duration-500 border
        ${is_archived ? "grayscale opacity-50" : ""} 
        ${template?.backgroundColor || "bg-background"} 
        ${template?.border || "border-gray-300/60"}`}
    >
      {is_gluten_free && (
        <div className="absolute w-full top-0 left-0 flex justify-between z-10">
          <div className="px-2 py-1.5 flex items-center gap-2 bg-[#c2361e] shadow-md shadow-black/40 text-white text-sm font-semibold rounded-br-2xl">
            <span className="font-semibold text-white oldstyle-nums">
              Sin tacc
            </span>
            <IconFood className="text-white" size={18} />
          </div>
        </div>
      )}

      {/* Share Button (Spotify-like trigger) */}
      {user?.plan !== "free" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            document.dispatchEvent(
              new CustomEvent("share-dish", {
                detail: food,
              })
            );
          }}
          className="absolute top-2 right-2 flex items-center justify-center p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md active:scale-90 transition-all z-20"
          title="Compartir plato"
        >
          <Share2 className="text-white" size={15} />
        </button>
      )}

      <div className="flex flex-col w-full h-64 overflow-hidden rounded-lg p-2 items-center">
        <div className="relative min-w-full h-[125px] md:max-w-25 md:max-h-36 shrink-0 rounded-[7px] overflow-hidden">
          <Image
            quality={75}
            loading="lazy"
            src={photo}
            alt={name}
            fill
            sizes="(max-width: 768px) 160px, 130px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-between w-full h-full mt-1.5">
          <div className="text-left flex space-y-1 flex-col justify-start h-full">
            <h2 className={`${template?.textColor || "text-gray-700"} font-bold text-base leading-none text-wrap line-clamp-2 mt-0.5 md:h-fit`}>
              {name}
            </h2>
            <p className={`${template?.textColorOpacity || "text-gray-700/50"} text-[13px] text-pretty line-clamp-2 leading-tight`}>
              {description}
            </p>
          </div>

          <div className="flex items-end gap-1 justify-between h-fit mt-2">
            {/* Lógica de precio normal vs precio promocional integrada */}
            {is_promo && promo_price ? (
              <div className="flex flex-col items-start leading-none">
                <span className={`${template?.textColorOpacity || "text-gray-700/50"} text-xs line-through decoration-red-600`}>
                  {formatearPrecio(price)}
                </span>
                <span
                  style={{ color: template?.accentColors?.[1] || "inherit" }}
                  className={`font-bold oldstyle-nums text-xl ${!template?.accentColors?.[1] ? "text-red-600" : ""}`}
                >
                  {formatearPrecio(promo_price)}
                </span>
              </div>
            ) : (
              <span className={`${template?.textColor || "text-gray-700"} font-bold oldstyle-nums text-xl`}>
                {formatearPrecio(price)}
              </span>
            )}

            {context && whatsapp !== false && (
              example ? (
                <AddFoodExample _id={_id} />
              ) : (
                <AddFood _id={String(_id)} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}