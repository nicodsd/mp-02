"use client";

import React from "react";
import Image from "next/image";
import AddFood from "@/src/components/buttons/AddFood";
import IconFood from "@/public/images/icons-index/IconFood";
import AddFoodExample from "@/src/components/buttons/AddFoodExample";
import { Share2 } from "lucide-react"; // Usado correctamente abajo

// 1. Instanciamos el formateador fuera del componente para no recrearlo en cada render
const priceFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
});

function formatearPrecio(precio: number | string) {
  const value = typeof precio === "string" ? Number(precio) : precio;
  return priceFormatter.format(value);
}

// 2. Definimos una interfaz limpia para TypeScript reemplazando el bloque inline
interface FoodCardProps {
  name: string;
  user: any;
  photo: string;
  _id: string;
  description: string;
  is_gluten_free: boolean;
  price: number | string;
  is_promo: boolean;
  promo_price: number | string;
  template?: {
    backgroundColor?: string;
    border?: string;
    textColor?: string;
    textColorOpacity?: string;
    accentColors?: string[];
  };
  example?: boolean;
  whatsapp?: boolean;
  edit?: (food: any) => void;
  list?: boolean;
}

export default function FoodsCardsExample({
  name,
  user,
  photo,
  description,
  is_gluten_free,
  price,
  is_promo,
  _id,
  example,
  promo_price,
  template,
  whatsapp,
  edit,
  list
}: FoodCardProps) {

  const quality = example ? 10 : 10;
  return (
    <div
      id={`dish-${_id}`}
      className={`flex w-full relative overflow-hidden ${template?.backgroundColor || "bg-background"} border ${list ? "h-30 rounded-xl" : "h-26"} ${template?.border || "border-gray-200"} rounded-lg p-1 items-center`}
    >
      {is_gluten_free && (
        <div className="absolute w-full z-10 top-0 left-0 flex justify-between">
          <div className="px-2 py-1 flex items-center gap-2 bg-[#ffe17d] shadow-md shadow-black/30 text-white text-sm font-semibold rounded-br-2xl">
            <span className="font-semibold text-[#6d0000] oldstyle-nums">
              Sin tacc
            </span>
            <IconFood className="text-[#6d0000]" size={18} />
          </div>
        </div>
      )}

      <div className="relative shrink-0 md:max-w-25 md:max-h-36 md:h-full md:w-full h-full min-w-20 w-20 max-w-20 rounded-[7px] overflow-hidden">
        {user?.plan !== "free" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              document.dispatchEvent(
                new CustomEvent("share-dish", {
                  detail: {
                    _id,
                    name,
                    photo,
                    description,
                    price,
                    is_promo,
                    promo_price,
                    is_gluten_free,
                  },
                })
              );
            }}
            className={`${template?.textColor || "text-gray-700"} absolute bottom-1 left-1 flex items-center justify-center p-2 rounded-full bg-black/60 hover:bg-black/80 text-white active:scale-90 transition-transform z-20`}
            title="Compartir plato"
          >
            {/* CORRECCIÓN: Agregamos el icono Share2 que estaba importado pero ausente */}
            <Share2 size={15} className="text-white" />
          </button>
        )}
        <Image
          quality={75}
          loading="lazy"
          src={photo}
          alt={name}
          fill
          sizes="(max-width: 768px) 80px, 100px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col relative py-1 justify-between pl-2 w-full h-full">
        <div className="flex text-left">
          <div className="w-full">
            <h2 className={`font-semibold ${template?.textColor || "text-gray-700"} text-lg md:h-fit leading-4`}>
              {name}
            </h2>
            <p className={`${template?.textColorOpacity || "text-gray-700/50"} text-sm line-clamp-2 text-pretty leading-4 mt-1 md:mt-0`}>
              {description}
            </p>
          </div>

          {whatsapp !== false ? (
            example ? (
              <AddFoodExample _id={_id} />
            ) : (
              <AddFood _id={String(_id)} />
            )
          ) : null}
        </div>

        <div className="flex flex-col relative h-full items-end gap-1 justify-end">
          {is_promo && (
            <div className={`flex flex-col ${template?.textColor || "text-gray-700"} items-end`}>
              <span className="font-bold oldstyle-nums text-xs md:text-sm line-through decoration-red-600 decoration leading-1">
                {formatearPrecio(price)}
              </span>

              <div className="flex items-center">
                <span
                  style={{ color: template?.accentColors?.[1] || "inherit" }}
                  className={`font-black oldstyle-nums text-xl md:text-2xl ${!template?.accentColors?.[1] ? "text-primary" : ""}`}
                >
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