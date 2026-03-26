import 'animate.css';
import Image from "next/image";

export default function PromoDayCard({ foods }: { foods: any }) {
  const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  });

  return (
    <div key={foods._id} className="animate__animated animate__bounceIn shadow-lg p-2 gap-2 w-full md:px-[2vw] rounded-xl h-48 relative overflow-hidden flex hover:-translate-y-1 transition-all duration-300 ease-in-out"
      style={{
        backgroundImage: `url("${foods.photo}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-red-800/50 to-red-800/15 to-100% backdrop-blur-lg z-10 rounded-xl"></div>

      <div className="relative z-20 w-[45%] h-full shrink-0">
        <Image
          loading="eager"
          src={foods.photo}
          alt={foods.name}
          fill
          className="object-cover rounded-lg shadow-xl border border-white/30"
        />
      </div>

      <div className="relative z-20 flex flex-col justify-between w-full h-full py-1 text-white">
        <div className="flex flex-col gap-0.5">
          <h3 className="leading-none text-xl md:text-3xl font-black line-clamp-2 uppercase">
            {foods.name}
          </h3>
          <p className="text-xs md:text-sm leading-tight text-gray-50 line-clamp-2">
            {foods.description}
          </p>
        </div>

        <div className="flex flex-col items-end border-t border-yellow-200/30 pt-1">
          <span className="text-[13px] md:text-sm text-gray-300 line-through decoration-red-500">
            Antes {priceFormatter.format(foods.price)}
          </span>
          <span className="text-xl md:text-2xl font-black text-[#fff2cc] drop-shadow-md">
            ¡Hoy {priceFormatter.format(foods.promo_price)}!
          </span>
        </div>
      </div>
    </div>
  );
}