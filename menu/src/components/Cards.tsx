"use client";
import Loading from "@/src/skeleton/Loading";
import Image from "next/image";
type Card = {
  _id: string | number;
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
              key={food._id}
              className="menu-card rounded-[7px] overflow-hidden my-[4px] shadow-md flex w-full bg-[#fffcf2] p-2.5"
            >
              <Image
                quality={75}
                loading="lazy"
                src={food.photo}
                alt={food.name}
                className="max-w-15 max-h-23 object-cover rounded-[7px]"
                width={130}
                height={80}
              />
              <div className="flex flex-col justify-between pl-2 w-full">
                <div className="menu-card__content text-left w-full">
                  <h2 className="menu-card__title text-base/5 h-4">{food.name}</h2>
                  <p className="menu-card__description mt-2 text-[#555] text-sm text-base/5.5">
                    {food.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 justify-end h-5">
                  <span className="menu-card__description text-[#555]">c/u</span>
                  <span className="menu-card__price">
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