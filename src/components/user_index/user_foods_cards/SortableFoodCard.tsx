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
                ${context
                    ? `border border-gray-200 bg-background md:pr-6 px-2 rounded-xl py-1 h-full items-center`
                    : `border h-27 ${template?.border} ${template?.backgroundColor} rounded-lg p-1 items-center`
                }`}
        >
            <Image
                quality={75}
                loading="eager"
                src={food.photo}
                alt={food.name}
                className={`md:max-w-25 md:max-h-36 object-cover rounded-[7px] md:h-full md:w-full ${!context ? "h-full" : "h-22"} min-w-20 w-20 max-w-20`}
                width={100}
                height={100}
            />
            <div className="flex flex-col justify-between py-1 pl-2 w-full h-full">
                <div className="menu-card__content text-left">
                    <h2
                        className={`font-semibold text-base md:h-fit 
                        ${context ? "leading-4" : `text-lg md:h-fit leading-4 md:leading-6 ${template?.textColor}`}`}
                    >
                        {food.name}
                    </h2>
                    <p
                        className={`text-sm line-clamp-2 text-pretty leading-4 ${context ? "overflow-hidden mt-2" : `mt-1 md:mt-0 ${template?.textColor}`}`}
                    >
                        {food.description}
                    </p>
                </div>
                <div
                    className={`flex items-end gap-1 ${context ? "justify-start items-center" : "justify-end"}`}
                >
                    {food.is_promo && !context && (
                        <div className="flex flex-col items-end">
                            <span className={`font-bold  ${context ? "" : template?.textColorOpacity} oldstyle-nums text-xs md:text-sm line-through decoration-red-600 decoration leading-1`}>
                                {formatearPrecio(food.price)}
                            </span>

                            <div className="flex items-center gap-1">
                                <span className={`font-black ${context ? "" : template?.textColor} oldstyle-nums text-xl md:text-2xl`}>
                                    {formatearPrecio(food.promo_price)}
                                </span>
                            </div>
                        </div>
                    )}
                    {!food.is_promo && (
                        <div className="flex items-center gap-1">
                            <span className={`font-bold ${context ? "" : template?.textColor} oldstyle-nums text-xl md:text-2xl`}>
                                {formatearPrecio(food.price)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}