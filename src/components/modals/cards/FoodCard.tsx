"use client";
import Image from "next/image";

// Instanciamos el formateador fuera del componente para que no impacte en el scroll
const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
});

function formatearPrecio(precio: number | string) {
    const value = typeof precio === "string" ? Number(precio) : precio;
    return priceFormatter.format(value);
}

export default function FoodCard({
    food,
    template
}: {
    food: any;
    template: any;
}) {

    return (
        <div
            className={`flex w-full overflow-hidden ${template?.backgroundColor || "bg-background"} border ${template?.border || "border-gray-200"} h-20 shadow-sm rounded-lg p-2 items-end`}
        >
            {/* Contenedor de la imagen ajustado a un cuadrado perfecto (aspect-square) */}
            <div className="h-full aspect-square shrink-0 relative rounded-[7px] overflow-hidden">
                <Image
                    quality={75}
                    loading="lazy"
                    src={food.photo}
                    alt={food.name}
                    fill
                    sizes="70px"
                    className="object-cover"
                />
            </div>
            <div className="flex flex-col relative justify-between items-start pl-2 pt-0.5 w-full h-full">
                <h2
                    className={`text-sm ${template?.textColor || "text-gray-700"} leading-none`}
                >
                    {food.name}
                </h2>

                <div
                    className={`flex flex-col relative h-full w-full items-end gap-1 justify-end`}
                >
                    {food.is_promo && (
                        <div className="flex flex-col items-end">
                            <span className={`font-bold ${template?.textColor || "text-gray-700"} oldstyle-nums text-xs md:text-sm line-through decoration-red-600 decoration leading-1`}>
                                {formatearPrecio(food.price)}
                            </span>

                            <div className="flex items-center">
                                <span className={`font-black ${template?.textColor || "text-gray-700"} oldstyle-nums text-xl md:text-2xl`}>
                                    {formatearPrecio(food.promo_price)}
                                </span>
                            </div>
                        </div>
                    )}
                    {!food.is_promo && (
                        <div className="flex items-center">
                            <span className={`font-bold ${template?.textColor || "text-gray-700"} oldstyle-nums text-xl md:text-2xl`}>
                                {formatearPrecio(food.price)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}