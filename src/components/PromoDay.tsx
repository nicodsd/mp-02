import 'animate.css';
import Image from "next/image";

export default function PromoDayCard({ foods, template }: { foods: any, template: any }) {
  const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  });

  return (
    <div className={`relative border-2 ${template?.icons || "border-gray-200"} flex min-h-30 w-full overflow-hidden rounded-2xl p-2 md:h-52 md:p-3`}>
      <div className={`absolute inset-0 z-20 bg-linear-to-r from-black/20 via-[#000000] to-[#000000]`}></div>

      <Image src={foods.photo} alt={foods.name} width={100} height={100} className="absolute -left-5 w-50 top-0 my-auto inset-0 z-10 object-contain" />

      <div className="z-20 relative w-full flex flex-1 flex-col justify-between text-white">

        <div>
          <h3 className="line-clamp-1 text-start text-lg font-bold uppercase leading-tight md:text-xl">
            {
              foods.name.length > 20 ? foods.name.slice(0, 24) + "..." : foods.name
            }
          </h3>
          <p className="text-start text-sm font-normal opacity-80 leading-tight md:text-xl">{
            foods?.description?.length > 30 ? foods?.description?.slice(0, 30) + "..." : foods?.description
          }</p>
        </div>
        <div className={`justify-center items-end flex flex-col`}>
          <span className="text-[13px] text-gray-300 line-through decoration-primary md:text-sm">
            Antes {priceFormatter.format(foods.price)}
          </span>

          <span className={`text-2xl font-extrabold drop-shadow-md px-2 py-1 rounded-md ${template?.accentColors?.[1] || "text-yellow-300 bg-primary"} leading-none md:text-2xl`}>
            <span className={`text-sm font-black text-white italic mr-1`}>%OFF</span>
            ¡Hoy {priceFormatter.format(foods.promo_price)}!
          </span>

        </div>

      </div>

    </div>
  );
}