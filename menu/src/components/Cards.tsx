"use client";
import Loading from "@/src/skeleton/loading";
import Image from "next/image";

type Card = {
  _id: string | number;
  photo: string;
  name: string;
  description: string;
  price: number | string;
};
export default function Cards({ foods, categories }: { foods: Card[], categories: any[] }) {

  //console.log("MENU CARD F1:",foods)
  //console.log("MENU CARD C2:", categories)

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
              className="menu-card rounded-[7px] overflow-hidden my-0.5 shadow-md flex w-full bg-white p-3.5"
            >
              <Image
                src={food.photo}
                alt={food.name}
                className="menu-card__image rounded-[7px]"
                width={500}
                height={500}
              />
              <div className="flex flex-col justify-between pl-3 w-full">
                <div className="menu-card__content text-left w-full">
                  <h2 className="menu-card__title text-base/5">{food.name}</h2>
                  <p className="menu-card__description mt-2">
                    {food.description}
                  </p>
                </div>
                <div className="menu-card__price-container flex items-center gap-1.5 justify-end">
                  <span className="menu-card__description">c/u</span>
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
