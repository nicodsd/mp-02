"use client";
import Image from "next/image";
import AddFood from "@/src/components/buttons/AddFood";
import AddFoodExample from "@/src/components/buttons/AddFoodExample";
import IconFood from "@/public/images/icons-index/IconFood";

type FoodsCardsOptionsProps = {
  food: any;
  context?: boolean;
  template?: any;
  example?: boolean;
  whatsapp?: boolean;
};

export default function Cards({
  food,
  context,
  template,
  example,
  whatsapp
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
    <div className={`flex w-40 items-center relative ${food.is_archived ? "grayscale opacity-50" : template?.backgroundColor} ${template?.backgroundColor || "bg-background"} border ${template?.border || "border-gray-300/60"} rounded-lg justify-center`}>
      {
        food?.is_gluten_free && (
          <div className={`absolute w-full top-0 left-0 flex justify-between`}>
            <div className="px-2 py-1.5 flex items-center gap-2 bg-[#c2361e] shadow-md shadow-black/40 text-white text-sm font-semibold rounded-br-2xl">
              <span className={`font-semibold text-white oldstyle-nums`}>
                Sin tacc
              </span>
              <IconFood
                className="text-white"
                size={18}
              />
            </div>
          </div>
        )}
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
          <div className="text-left flex space-y-1 flex-col justify-start h-full">
            <h2 className={`${template?.textColor || "text-gray-700"} font-bold text-lg leading-none text-wrap line-clamp-2 mt-1.5 md:h-fit`}>
              {name}
            </h2>
            <p className={`${template?.textColorOpacity || "text-gray-700/50"} text-[14px] text-pretty line-clamp-2 leading-tight`}>
              {description}
            </p>
          </div>
          <div className="flex items-end gap-1 justify-between h-fit mt-2">
            <span className={`${template?.textColor || "text-gray-700"} font-bold oldstyle-nums text-2xl md:text-2xl`}>
              {formatearPrecio(price)}
            </span>
            {context &&
              (whatsapp !== false ? (
                example ? (
                  <AddFoodExample _id={_id} />
                ) : (
                  <AddFood _id={String(_id)} />
                )
              ) : null)
            }
          </div>
        </div>
      </div>
    </div>
  );
}
