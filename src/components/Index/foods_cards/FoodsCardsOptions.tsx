"use client";
import Image from "next/image";
import AddFood from "@/src/components/buttons/AddFood";
import AddFoodExample from "@/src/components/buttons/AddFoodExample";
import IconFood from "@/public/images/icons-index/IconFood";

type FoodsCardsOptionsProps = {
  food: any;
  context?: boolean;
  user: any;
  template?: any;
  example?: boolean;
  whatsapp?: boolean;
};

export default function Cards({
  food,
  context,
  template,
  user,
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
    <div
      id={`dish-${_id}`}
      className={`flex w-40 items-center relative ${food.is_archived ? "grayscale opacity-50" : template?.backgroundColor} ${template?.backgroundColor || "bg-background"} border ${template?.border || "border-gray-300/60"} rounded-lg justify-center transition-all duration-500`}
    >
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

      {/* Share Button (Spotify-like trigger) */}
      {user?.plan !== "free" && <button
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

      <div
        className={`flex flex-col w-full h-64 overflow-hidden rounded-lg p-2 items-center`}
      >
        <div className="relative min-w-full h-[125px] md:max-w-25 md:max-h-36 shrink-0 rounded-[7px] overflow-hidden">
          <Image
            quality={75}
            loading="lazy"
            src={photo}
            alt={name}
            fill
            sizes="(max-width: 768px) 160px, 130px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-between w-full h-full">
          <div className="text-left flex space-y-1 flex-col justify-start h-full">
            <h2 className={`${template?.textColor || "text-gray-700"} font-bold text-lg leading-none text-wrap line-clamp-2 mt-1.5 md:h-fit`}>
              {name}
            </h2>
            <p className={`${template?.textColorOpacity || "text-gray-700/50"} text-[14px] text-pretty line-clamp-2 leading-none`}>
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
    </div >
  );
}
