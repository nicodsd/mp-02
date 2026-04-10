"use client";
import Image from "next/image";

export default function FoodCard({
    food
}: {
    food: any;
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
            className={`flex w-full overflow-hidden bg-white border border-gray-300 h-20 shadow-sm rounded-lg p-2 items-end`}
        >
            <div className="h-full">
                <Image
                    quality={75}
                    loading="lazy"
                    src={food.photo}
                    alt={food.name}
                    className={`md:max-w-25 md:max-h-36 object-cover rounded-[7px] md:h-full md:w-full h-full w-16`}
                    width={70}
                    height={70}
                />
            </div>
            <div className="flex flex-col relative justify-between items-start pl-2 pt-0.5 w-full h-full">
                <h2
                    className={`font-semibold text-gray-700 leading-none`}
                >
                    {food.name}
                </h2>

                <div
                    className={`flex flex-col relative h-full w-full items-end gap-1 justify-end`}
                >
                    {food.is_promo && (
                        <div className="flex flex-col items-end">
                            <span className="font-bold text-gray-700 oldstyle-nums text-xs md:text-sm line-through decoration-red-600 decoration leading-1">
                                {formatearPrecio(food.price)}
                            </span>

                            <div className="flex items-center">
                                <span className="font-black text-red-600 oldstyle-nums text-xl md:text-2xl">
                                    {formatearPrecio(food.promo_price)}
                                </span>
                            </div>
                        </div>
                    )}
                    {!food.is_promo && (
                        <div className="flex items-center">
                            <span className="font-bold text-gray-700 oldstyle-nums text-xl md:text-2xl">
                                {formatearPrecio(food.price)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
