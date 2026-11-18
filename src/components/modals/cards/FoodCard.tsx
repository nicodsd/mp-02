import Image from "next/image";

interface Food {
    id?: string | number;
    name: string;
    photo: string;
    price: number | string;
    promo_price?: number | string;
    is_promo: boolean;
}

interface Template {
    backgroundColor?: string;
    border?: string;
    textColor?: string;
}

interface FoodCardProps {
    food: Food;
    template?: Template;
}

const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
});

function formatearPrecio(precio: number | string): string {
    const value = typeof precio === "string" ? Number(precio) : precio;
    return priceFormatter.format(isNaN(value) ? 0 : value);
}

export default function FoodCard({ food, template }: FoodCardProps) {
    const textColor = template?.textColor || "text-gray-700";

    return (
        <div
            className={`flex w-full overflow-hidden ${template?.backgroundColor || "bg-background"
                } border ${template?.border || "border-gray-200"
                } h-16 shadow-sm rounded-lg p-1 items-center`}
        >
            {/* Contenedor de la imagen */}
            <div className="h-full aspect-square shrink-0 relative rounded-[7px] overflow-hidden">
                <Image
                    quality={50}
                    loading="lazy"
                    src={food.photo}
                    alt={food.name}
                    fill
                    sizes="70px"
                    className="object-cover"
                />
            </div>

            {/* Contenido de texto y precios */}
            <div className="flex justify-between items-center pl-2 w-full h-full overflow-hidden">
                <h2 className={`text-sm ${textColor} leading-tight truncate pr-2`}>
                    {food.name}
                </h2>

                <div className="flex flex-col items-end shrink-0 justify-center">
                    {food.is_promo && food.promo_price !== undefined ? (
                        <>
                            <span className={`font-bold ${textColor} oldstyle-nums text-xs line-through decoration-red-600 leading-none`}>
                                {formatearPrecio(food.price)}
                            </span>
                            <span className={`font-black ${textColor} oldstyle-nums text-lg md:text-xl leading-tight`}>
                                {formatearPrecio(food.promo_price)}
                            </span>
                        </>
                    ) : (
                        <span className={`font-bold ${textColor} oldstyle-nums text-lg md:text-xl leading-tight`}>
                            {formatearPrecio(food.price)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}