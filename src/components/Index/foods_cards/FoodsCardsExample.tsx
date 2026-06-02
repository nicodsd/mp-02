"use client";
import Image from "next/image";
import AddFood from "@/src/components/buttons/AddFood";
import IconFood from "@/public/images/icons-index/IconFood";
import AddFoodExample from "@/src/components/buttons/AddFoodExample";

export default function FoodsCardsExample({
  name,
  user,
  photo,
  description,
  is_gluten_free,
  price,
  is_promo,
  _id,
  example,
  promo_price,
  template,
  whatsapp,
  list
}: {
  name: string;
  user: any;
  photo: string;
  _id: string;
  description: string;
  is_gluten_free: boolean;
  price: number | string;
  is_promo: boolean;
  promo_price: number | string;
  template: any;
  example?: boolean;
  whatsapp?: boolean;
  list?: boolean;
}) {

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
      className={`flex w-full relative overflow-hidden ${template?.backgroundColor || "bg-background"} border ${list ? "h-30 rounded-xl" : "h-26"} ${template?.border || "border-gray-200"} rounded-lg p-1 items-center transition-all duration-500`}
    >
      {
        is_gluten_free && (
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
        )}
      <div className={`relative shrink-0 md:max-w-25 md:max-h-36 md:h-full md:w-full h-full min-w-20 w-20 max-w-20 rounded-[7px] overflow-hidden`}>
        {user?.plan !== "free" &&
          <button
            onClick={(e) => {
              e.stopPropagation();
              document.dispatchEvent(
                new CustomEvent("share-dish", {
                  detail: {
                    _id,
                    name,
                    photo,
                    description,
                    price,
                    is_promo,
                    promo_price,
                    is_gluten_free,
                  },
                })
              );
            }}
            className={`${template?.textColor || "text-gray-700"} absolute bottom-1 left-1 flex items-center justify-center p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md active:scale-90 transition-all z-20 shadow-md`}
            title="Compartir plato"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.59 13.51 6.82 3.98m0-10.98-6.82 3.98" /></svg>
          </button>}
        <Image
          quality={75}
          loading="lazy"
          src={photo}
          alt={name}
          fill
          sizes="(max-width: 768px) 80px, 100px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col relative py-1 justify-between pl-2 w-full h-full">
        <div className="flex text-left">
          <div className="w-full">
            <h2
              className={`font-semibold ${template?.textColor || "text-gray-700"} text-lg md:h-fit leading-4`}
            >
              {name}
            </h2>
            <p
              className={`${template?.textColorOpacity || "text-gray-700/50"} text-sm line-clamp-2 text-pretty leading-4 mt-1 md:mt-0`}
            >
              {description}
            </p>
          </div>

          {whatsapp !== false ? (example ? (
            <AddFoodExample _id={_id} />
          ) : (
            <AddFood _id={String(_id)} />
          )) : null}
        </div>

        <div
          className={`flex flex-col relative h-full items-end gap-1 justify-end`}
        >
          {is_promo && (
            <div className={`flex flex-col ${template?.textColor || "text-gray-700"} items-end`}>
              <span className={`font-bold oldstyle-nums text-xs md:text-sm line-through decoration-red-600 decoration leading-1`}>
                {formatearPrecio(price)}
              </span>

              <div className="flex items-center">
                <span className={`font-black text-${template?.accentColors?.[1] || "primary"} oldstyle-nums text-xl md:text-2xl`}>
                  {formatearPrecio(promo_price)}
                </span>
              </div>
            </div>
          )}
          {!is_promo && (
            <div className="flex items-center">
              <span className={`font-bold ${template?.textColor || "text-gray-700"} oldstyle-nums text-xl md:text-2xl`}>
                {formatearPrecio(price)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div >
  );
}

