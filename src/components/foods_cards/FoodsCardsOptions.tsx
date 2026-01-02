"use client";
import Image from "next/image";
export default function Cards({ name, photo, description, price, context }: { name: string, photo: string, description: string, price: number | string, context?: boolean }) {
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
            className="flex w-35 items-center justify-center"
        >
            <div
                className={`flex flex-col w-full h-53 shadow-md overflow-hidden border border-gray-300 rounded-[7px] p-2 items-center`}
            >
                <Image
                    quality={75}
                    loading="lazy"
                    src={photo}
                    alt={name}
                    className="min-w-full min-h-25 md:max-w-25 md:max-h-36 object-cover rounded-[7px]"
                    width={130}
                    height={80}
                />
                <div className="flex flex-col justify-between w-full h-full">
                    <div className="menu-card__content text-left flex flex-col justify-between h-full">
                        <h2 className="font-semibold text-gray-700 leading-[14px] mt-2 md:h-fit">{name} sadsad sad</h2>
                        <p className="mt-1 text-[#555] text-sm text-pretty leading-3 h-8">
                            {description.length > 250 ? `${description.substring(0, 250)}...` : description + " asdasd dsadas dsadas"}
                        </p>
                    </div>
                    <div className="flex items-center gap-1 justify-end h-5 mt-1">
                        <span className="menu-card__description text-[#969696] md:text-lg">c/u</span>
                        <span className="font-bold text-gray-700 oldstyle-nums text-xl md:text-2xl">
                            {formatearPrecio(price)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
} 