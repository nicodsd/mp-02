import 'animate.css';
import Image from "next/image";

export default function PromoDayCard({ foods }: { foods: any }) {
  const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  });

  return (
    <div className="relative flex h-44 w-full gap-2 overflow-hidden rounded-xl p-2 shadow-lg md:h-52 md:p-3 md:gap-4">
      <Image src={foods.photo} alt={foods.name} width={200} height={200} className="absolute inset-0 z-10 rounded-xl object-cover w-full" />
      <div className="absolute inset-0 z-10 rounded-xl bg-linear-to-r from-red-900/90 via-red-800/70 to-red-800/40 backdrop-blur-md"></div>

      <div className="relative z-20 h-full shrink-0">
        <Image
          loading="eager"
          src={foods.photo}
          alt={foods.name}
          width={200}
          height={200}
          className="h-full w-32 rounded-lg border border-white/20 object-cover shadow-xl md:w-44"
        />
      </div>

      <div className="relative z-20 flex flex-1 flex-col justify-between py-1 pb-2 text-white min-w-0 w-0">
        <div className="flex flex-col gap-0.5">
          <h3 className="line-clamp-2 text-2xl font-black uppercase leading-tight md:text-2xl">
            {foods.name}
          </h3>
          <p className="line-clamp-2 text-sm opacity-90 leading-tight md:text-sm">
            {foods.description}
          </p>
        </div>

        <div className="mt-auto flex flex-col items-end border-t border-yellow-200/20 pt-1">
          <span className="text-[10px] text-gray-300 line-through md:text-sm">
            Antes {priceFormatter.format(foods.price)}
          </span>
          <span className="text-2xl font-extrabold text-yellow-100 drop-shadow-md leading-none md:text-2xl">
            ¡Hoy {priceFormatter.format(foods.promo_price)}!
          </span>
        </div>
      </div>
    </div>
  );
}