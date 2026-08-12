"use client";

import Image from "next/image";
import AddFood from "@/src/components/buttons/AddFood";
import IconFood from "@/public/images/icons-index/IconFood";
import AddFoodExample from "@/src/components/buttons/AddFoodExample";

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
    photo: string;
    _id: string;
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
}

export default function FoodsCardsExample({
    name,
    photo,
    is_gluten_free,
    price,
    is_promo,
    _id,
    example,
    promo_price,
    template,
    whatsapp,
}: FoodCardProps) {

    return (
        <div className="w-full flex items-center">
            <div
                id={`dish-${_id}`}
                className={`flex w-full relative overflow-hidden ${template?.backgroundColor || "bg-background"} border min-h-12 h-12 max-h-12 ${template?.border || "border-gray-200"} rounded-lg items-center`}
            >
                {is_gluten_free && (
                    <div className="absolute w-full z-10 top-0 left-0 flex justify-between">
                        <div className="px-2 py-0.5 flex items-center gap-2 bg-[#ffe17d] shadow-md shadow-black/30 text-white text-xs font-semibold rounded-br-2xl">
                            <span className="font-semibold text-[#6d0000] oldstyle-nums">
                                Sin tacc
                            </span>
                            <IconFood className="text-[#6d0000]" size={18} />
                        </div>
                    </div>
                )}

                <div className="relative shrink-0 md:max-w-25 md:max-h-30 md:h-full md:w-full h-full min-w-15 max-w-14 rounded-[7px] overflow-hidden">
                    <Image
                        quality={40}
                        loading="lazy"
                        src={photo}
                        alt={name}
                        fill
                        sizes="(max-width: 100px) 30px, 30px"
                        className="object-cover"
                    />
                </div>

                <div className="flex flex-col relative py-1 justify-between pl-2 w-full h-full">
                    <div className="flex text-left items-center justify-between gap-2 h-full">
                        <h2 className={`${template?.textColor || "text-gray-700"} text-[14px] leading-4`}>
                            {name}
                        </h2>
                        <div className="flex flex-col relative h-full items-end pr-1.5 justify-end">
                            {is_promo && (
                                <div className={`flex flex-col ${template?.textColor || "text-gray-700"} items-end`}>
                                    <span className="font-bold oldstyle-nums text-xs md:text-sm line-through decoration-red-600 decoration leading-0">
                                        {formatearPrecio(price)}
                                    </span>

                                    <div className="flex items-center">
                                        <span
                                            style={{ color: template?.accentColors?.[1] || "inherit" }}
                                            className={`font-bold oldstyle-nums text-md md:text-2xl ${!template?.accentColors?.[1] ? "text-primary" : ""}`}
                                        >
                                            {formatearPrecio(promo_price)}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {!is_promo && (
                                <div className="flex items-center">
                                    <span className={`font-semibold ${template?.textColor || "text-gray-700"} oldstyle-nums text-md md:text-2xl`}>
                                        {formatearPrecio(price)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
            {whatsapp !== false ? (
                example ? (
                    <AddFoodExample _id={_id} />
                ) : (
                    <AddFood _id={String(_id)} />
                )
            ) : null}
        </div>
    );
}