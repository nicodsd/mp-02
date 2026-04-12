"use client";
import Image from "next/image";

export function SortableFoodCard({ food, context, template }: { food: any, context: boolean, template?: any }) {

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
            className={`flex w-full overflow-hidden 
                ${template?.backgroundColor}
                ${context
                    ? `border-r ${template?.border} md:pr-6 px-2 py-2 h-full items-center`
                    : `border h-27 ${template?.border} rounded-lg p-2 items-center`
                }`}
        >
            <Image
                quality={75}
                loading="lazy"
                src={food.photo}
                alt={food.name}
                className={`md:max-w-25 md:max-h-36 object-cover rounded-[7px] ${!context ? "md:h-full md:w-full h-23 w-20" : "h-20 w-20"}`}
                width={100}
                height={100}
            />
            <div className="flex flex-col justify-between pl-2 w-full h-full">
                <div className="menu-card__content text-left">
                    <h2
                        className={`font-semibold ${template?.textColor} text-lg md:h-fit ${context ? "leading-4" : "h-4 md:text-2xl"}`}
                    >
                        {food.name}
                    </h2>
                    <p
                        className={`${template?.textColor} text-sm line-clamp-2 text-pretty leading-4 ${context ? "overflow-hidden mt-2" : "mt-2.5 md:mt-0"}`}
                    >
                        {food.description}
                    </p>
                </div>
                <div
                    className={`flex items-end gap-1 ${context ? "justify-start items-center" : "justify-end"}`}
                >
                    {food.is_promo && !context && (
                        <div className="flex flex-col items-end">
                            <span className={`font-bold ${template?.textColorOpacity} oldstyle-nums text-xs md:text-sm line-through decoration-red-600 decoration leading-1`}>
                                {formatearPrecio(food.price)}
                            </span>

                            <div className="flex items-center gap-1">
                                <span className={`font-black ${template?.textColor} oldstyle-nums text-xl md:text-2xl`}>
                                    {formatearPrecio(food.promo_price)}
                                </span>
                            </div>
                        </div>
                    )}
                    {!food.is_promo && (
                        <div className="flex items-center gap-1">
                            <span className={`font-bold ${template?.textColor} oldstyle-nums text-xl md:text-2xl`}>
                                {formatearPrecio(food.price)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}