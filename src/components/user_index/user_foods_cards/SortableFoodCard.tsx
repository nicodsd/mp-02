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

    if (context) {
        return (
            <div
                className={`flex flex-1 min-w-0 relative overflow-hidden items-center gap-2.5 md:gap-3 py-1 md:py-1.5 px-1 md:px-2 ${food.is_archived ? "grayscale opacity-60" : ""}`}
            >
                {/* Imagen del plato */}
                <div className="relative shrink-0 w-15 h-15 md:w-14 md:h-14 rounded-lg overflow-hidden border border-gray-100 bg-gray-100">
                    <Image
                        quality={75}
                        loading="lazy"
                        src={food.photo || "/images/placeholders/image_placeholder.png"}
                        alt={food.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                    />
                </div>

                {/* Contenido: En móvil (< md) apila texto arriba y precio/etiquetas abajo; en md: alinea horizontalmente */}
                <div className="flex flex-col md:flex-row md:items-center justify-between flex-1 min-w-0 gap-1 md:gap-3">
                    <div className="flex flex-col justify-center min-w-0 flex-1 gap-0.5">
                        <div className="flex items-center gap-1.5 min-w-0 md:flex-wrap">
                            <h2 className="font-semibold text-sm md:text-[15px] text-gray-800 leading-tight truncate">
                                {food.name}
                            </h2>
                            {/* Etiquetas en escritorio (md:) al lado del título como en la imagen de referencia */}
                            {food.is_promo && (
                                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-600 border border-teal-200/80 leading-none shrink-0">
                                    En promoción
                                </span>
                            )}
                            {food.is_gluten_free && (
                                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#ffe17d] text-[#6d0000] leading-none shrink-0">
                                    <IconFood className="text-[#6d0000]" size={12} />
                                    <span>Sin TACC</span>
                                </span>
                            )}
                        </div>

                        {food.description && (
                            <p className="text-xs text-gray-500 truncate md:line-clamp-1 leading-snug">
                                {food.description}
                            </p>
                        )}

                        {/* Etiquetas en móvil (< md) debajo de la descripción para no romper el ancho del título */}
                        {(food.is_promo || food.is_gluten_free) && (
                            <div className="flex md:hidden items-center gap-1 flex-wrap pt-0.5">
                                {food.is_gluten_free && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#ffe17d] text-[#6d0000] leading-none shrink-0">
                                        <IconFood className="text-[#6d0000]" size={10} />
                                        <span>Sin TACC</span>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Precio */}
                    <div className="flex items-center justify-start md:justify-end shrink-0 md:pl-2">
                        {food.is_promo ? (
                            <div className="flex flex-row md:flex-col items-baseline md:items-end gap-1.5 md:gap-0 leading-tight">
                                <span className="text-[14px] text-gray-400 line-through decoration-red-500/80 font-medium oldstyle-nums whitespace-nowrap order-2 md:order-1">
                                    {formatearPrecio(food.price)}
                                </span>
                                <span className="font-semibold text-sm md:text-xl text-gray-900 oldstyle-nums whitespace-nowrap order-1 md:order-2">
                                    {formatearPrecio(food.promo_price)}
                                </span>

                            </div>
                        ) : (
                            <span className="font-medium text-sm md:text-xl text-gray-900 oldstyle-nums whitespace-nowrap">
                                {formatearPrecio(food.price)}
                            </span>
                        )}
                        {food.is_promo && (
                            <span className="md:hidden inline-flex ml-2 items-center px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-600 border border-teal-200/80 leading-none shrink-0">
                                En promoción
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`flex w-full relative overflow-hidden ${food.is_archived ? "grayscale opacity-50" : template?.backgroundColor}
                border h-24 ${template?.border} rounded-lg p-0.5 items-center`}
        >
            {(food.is_gluten_free || food.is_promo) && !context && (
                <div className="absolute w-full z-10 top-0 left-0 flex items-center gap-1">
                    {food.is_gluten_free && (
                        <div className="px-2 py-0.5 flex items-center gap-1.5 bg-[#ffe17d] shadow-md shadow-black/30 text-white text-xs font-semibold rounded-br-2xl">
                            <span className="font-semibold text-[#6d0000] oldstyle-nums">
                                Sin tacc
                            </span>
                            <IconFood className="text-[#6d0000]" size={16} />
                        </div>
                    )}
                    {food.is_promo && (
                        <div className="px-2 py-0.5 flex items-center bg-teal-600 shadow-md shadow-black/30 text-white text-[11px] font-semibold rounded-br-2xl">
                            <span>En promoción</span>
                        </div>
                    )}
                </div>
            )}
            <div className="md:max-w-25 md:max-h-36 md:h-full h-full relative shrink-0 min-w-20 w-20 max-w-20 rounded-[7px] overflow-hidden">
                <Image
                    quality={75}
                    loading="lazy"
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
                            className={`font-medium text-lg md:h-fit leading-none ${template?.textColor}`}
                        >
                            {food.name}
                        </h2>
                        <p
                            className={`text-sm line-clamp-2 text-pretty leading-4 mt-1 md:mt-0 ${template?.textColorOpacity}`}
                        >
                            {food.description}
                        </p>
                    </div>
                </div>

                <div
                    className="flex items-end gap-1 justify-end pr-1.5"
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
                        className={`${template?.textColor || "text-gray-700"} absolute bottom-1 left-1 flex items-center justify-center p-2 rounded-full bg-black/60 hover:bg-black/80 text-white active:scale-90 transition-all z-20 shadow-md`}
                        title="Compartir plato"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.59 13.51 6.82 3.98m0-10.98-6.82 3.98" /></svg>
                    </button>}
                    {food.is_promo && (
                        <div className="flex flex-col items-end">
                            <span className={`font-bold ${template?.textColorOpacity} oldstyle-nums text-xs md:text-sm line-through decoration-red-600 decoration leading-1`}>
                                {formatearPrecio(food.price)}
                            </span>

                            <div className="flex items-center gap-1">
                                <span className={`font-bold text-[21px] ${template?.textColor} oldstyle-nums md:text-2xl`}>
                                    {formatearPrecio(food.promo_price)}
                                </span>
                            </div>
                        </div>
                    )}
                    {!food.is_promo && (
                        <div className="flex items-center gap-1">
                            <span className={`font-semibold text-[21px] ${template?.textColor} oldstyle-nums md:text-2xl`}>
                                {formatearPrecio(food.price)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
