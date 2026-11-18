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
                className={`flex w-full overflow-hidden ${template?.backgroundColor || "bg-background"
                    } border ${template?.border || "border-gray-200"
                    } h-16 shadow-sm rounded-lg p-1 items-center`}
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

                <div className="h-full aspect-square shrink-0 relative rounded-[7px] overflow-hidden">
                    <Image
                        quality={50}
                        loading="lazy"
                        src={photo}
                        alt={name}
                        fill
                        sizes="70px"
                        className="object-cover"
                    />
                </div>

                <div className="flex justify-between items-center pl-2 w-full h-full overflow-hidden">
                    <h2 className={`text-sm ${template?.textColor} leading-tight truncate pr-2`}>
                        {name}
                    </h2>

                    <div className="flex flex-col items-end shrink-0 justify-center">
                        {is_promo && promo_price !== undefined ? (
                            <>
                                <span className={`font-bold ${template?.textColor} oldstyle-nums text-xs line-through decoration-red-600 leading-none`}>
                                    {formatearPrecio(price)}
                                </span>
                                <span className={`font-black ${template?.textColor} oldstyle-nums text-lg md:text-xl leading-tight`}>
                                    {formatearPrecio(promo_price)}
                                </span>
                            </>
                        ) : (
                            <span className={`font-bold ${template?.textColor} oldstyle-nums text-lg md:text-xl leading-tight`}>
                                {formatearPrecio(price)}
                            </span>
                        )}
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