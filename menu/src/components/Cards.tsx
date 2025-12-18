"use client";
import Loading from "@/src/skeleton/Loading";
import Image from "next/image";
type Card = {
  id: string | number;
  photo: string;
  name: string;
  description: string;
  price: number | string;
};
export default function Cards({ foods }: { foods: Card[] }) {
  function formatearPrecio(precio: number | string) {
    const value = typeof precio === "string" ? Number(precio) : precio;
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(value);
  }
  return (
    <>
      {Array.isArray(foods) ? (
        <div>
          {foods?.map((food) => (
            <div
              key={food.id}
              className="menu-card rounded-[7px] border border-gray-400 overflow-hidden my-[4px] flex w-full h-28 p-2.5"
            >
              <Image
                quality={75}
                loading="lazy"
                src={food.photo}
                alt={food.name}
                className="max-w-18 md:max-w-25 max-h-23 md:max-h-36 object-cover rounded-[7px]"
                width={130}
                height={80}
              />
              <div className="flex flex-col justify-between pl-2 w-full">
                <div className="menu-card__content text-left w-full">
                  <h2 className="font-semibold text-gray-700 text-[18px] md:text-[1vw] h-4 md:h-fit">{food.name}</h2>
                  <p className="mt-2 text-[#555] text-sm">
                    {food.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 justify-end h-5">
                  <span className="menu-card__description text-[#969696] md:text-lg">c/u</span>
                  <span className="font-bold text-gray-700 oldstyle-nums text-xl md:text-2xl">
                    {formatearPrecio(food.price)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}