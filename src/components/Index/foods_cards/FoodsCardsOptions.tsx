"use client";
import Image from "next/image";
import AddFood from "@/src/components/buttons/AddFood";
import AddFoodExample from "@/src/components/buttons/AddFoodExample";

type FoodsCardsOptionsProps = {
  food: any;
  context?: boolean;
  template?: any;
  example?: boolean;
};

export default function Cards({
  food,
  context,
  template,
  example,
}: FoodsCardsOptionsProps) {
  const { _id, name, photo, description, price } = food;
  function formatearPrecio(precio: number | string) {
    const value = typeof precio === "string" ? Number(precio) : precio;
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(value);
  }
  return (
    <div className={`flex w-38 items-center ${food.is_archived ? "grayscale opacity-50" : template?.backgroundColor} ${template?.backgroundColor || "bg-background"} border ${template?.border || "border-gray-300/60"} rounded-lg justify-center`}>
      <div
        className={`flex flex-col w-full h-64 overflow-hidden rounded-lg p-2 items-center`}
      >
        <Image
          quality={75}
          loading="lazy"
          src={photo}
          alt={name}
          className="min-w-full min-h-30 md:max-w-25 md:max-h-36 object-cover rounded-[7px]"
          width={130}
          height={130}
        />
        <div className="flex flex-col justify-between w-full h-full">
          <div className="menu-card__content text-left flex flex-col justify-start h-full">
            <h2 className={`${template?.textColor || "text-gray-700"} font-semibold text-lg leading-6 line-clamp-1 mt-2 md:h-fit`}>
              {name}
            </h2>
            <p className={`${template?.textColorOpacity || "text-gray-700/50"} text-[14px] text-pretty line-clamp-2 leading-tight`}>
              {description}
            </p>
          </div>
          <div className="flex items-end gap-1 justify-between h-fit mt-2">
            <span className={`${template?.textColor || "text-gray-700"} font-bold oldstyle-nums text-xl md:text-2xl`}>
              {formatearPrecio(price)}
            </span>
            {
              example ? (
                <AddFoodExample _id={_id} />
              ) : (
                context &&
                <AddFood _id={String(_id)} />
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}
