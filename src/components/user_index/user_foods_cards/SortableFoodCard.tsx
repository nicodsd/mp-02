"use client";
import IconFood from "@/public/images/icons-index/IconFood";
import Image from "next/image";

export function SortableFoodCard({ food, context, template, user }: { food: any, context: boolean, template?: any, user?: any }) {

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
            className={`flex w-full relative overflow-hidden ${food.is_archived ? "grayscale opacity-50" : template?.backgroundColor}
                ${context
                    ? `border border-gray-200 bg-background md:pr-6 px-2 rounded-xl py-1 h-30 lg:h-16 items-center`
                    : `border h-27 ${template?.border} rounded-lg p-1 items-center`
                }`}
        >
            {
                food.is_gluten_free && !context && (
                    <div className={`absolute w-full z-10 top-0 left-0 flex justify-between`}>
                        <div className="px-2 py-1 flex items-center gap-2 bg-[#ffe17d] shadow-md shadow-black/30 text-white text-sm font-semibold rounded-br-2xl">
                            <span className={`font-semibold text-[#6d0000] oldstyle-nums`}>
                                Sin tacc
                            </span>
                            <IconFood
                                className="text-[#6d0000]"
                                size={18}
                            />
                        </div>
                    </div>
                )
            }
            <div className={`relative shrink-0 md:max-w-25 md:max-h-36 md:h-full h-full min-w-20 w-20 max-w-20 rounded-[7px] overflow-hidden`}>
                <Image
                    quality={75}
                    loading="eager"
                    src={food.photo}
                    alt={food.name}
                    fill
                    sizes="(max-width: 768px) 80px, 100px"
                    className="object-cover"
                />
            </div>
            <div className="flex flex-col xl:flex-row justify-between py-1 pl-2 w-full h-full">
                <div className="flex gap-2">
                    <div className="menu-card__content text-left">
                        <h2
                            className={`font-semibold text-base md:h-fit 
                        ${context ? "leading-none" : `text-lg md:h-fit leading-none ${template?.textColor}`}`}
                        >
                            {food.name}
                        </h2>
                        <p
                            className={`text-sm line-clamp-2 text-pretty leading-4 ${context ? "overflow-hidden" : `mt-1 md:mt-0 ${template?.textColorOpacity}`}`}
                        >
                            {food.description}
                        </p>
                    </div>
                    {
                        food.is_gluten_free && context && (
                            <div className={`flex justify-between`}>
                                <div className="h-fit p-2 flex items-center gap-2 bg-[#ffe17d] text-white text-xs font-semibold rounded-2xl">
                                    <IconFood
                                        className="text-[#6d0000]"
                                        size={18}
                                    />
                                </div>
                            </div>
                        )
                    }
                </div>

                <div
                    className={`flex items-end gap-1 ${context ? "justify-end" : "justify-end"}`}
                >
                    {user?.plan !== "free" && !context && <button
                        onClick={(e) => {
                            e.stopPropagation();
                            document.dispatchEvent(
                                new CustomEvent("share-dish", {
                                    detail: food,
                                })
                            );
                        }}
                        className="absolute top-2 right-2 flex items-center justify-center p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md active:scale-90 transition-all z-20 shadow-md"
                        title="Compartir plato"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.59 13.51 6.82 3.98m0-10.98-6.82 3.98" /></svg>
                    </button>}
                    {food.is_promo && (
                        <div className="flex flex-col items-end">
                            <span className={`font-bold  ${context ? "" : template?.textColorOpacity} oldstyle-nums text-xs md:text-sm line-through decoration-red-600 decoration leading-1`}>
                                {formatearPrecio(food.price)}
                            </span>

                            <div className="flex items-center gap-1">
                                <span className={`font-black ${context ? "text-md" : `text-xl ${template?.textColor}`} oldstyle-nums md:text-2xl`}>
                                    {formatearPrecio(food.promo_price)}
                                </span>
                            </div>
                        </div>
                    )}
                    {!food.is_promo && (
                        <div className="flex items-center gap-1">
                            <span className={`font-bold ${context ? "text-md" : `text-xl ${template?.textColor}`} oldstyle-nums md:text-2xl`}>
                                {formatearPrecio(food.price)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}