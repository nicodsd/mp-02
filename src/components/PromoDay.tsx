import 'animate.css';
import Image from "next/image";

export default function PromoDay({ foods }: { foods: any }) {
  const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  });
  return (
    <section className="flex flex-col text-gray-700 mb-2 items-center md:items-start w-full gap-1.5">
      {foods?.map((food: any) => (
        <div key={food._id} className="animate__animated animate__bounceIn p-2 gap-2 w-full md:px-[2vw] rounded-xl h-60 max-h-fit md:py-2 bg-primary md:bg-radial-[at_0%_0%] hover:-translate-y-2 transition-all duration-300 ease-in-out from-yellow-400 via-red-600 to-violet-400/60 to-100% md:w-full flex"
          style={{
            overflow: "hidden",
            maxWidth: "100%",
          }}
        >
          <Image
            loading="eager"
            src={food.photo}
            alt={food.name}
            width={200}
            height={200}
            style={{
              objectFit: "cover",
            }}
            className="h-full rounded-xl w-[43%] md:w-[30%] md:rounded-xl shadow-xl md:shadow-yellow-400"
          />
          <div
            className="flex justify-center items-center md:ml-2 text-white px-1 py-1 w-full h-full"
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              className="flex flex-col items-center justify-between gap-5 w-full h-full py-1"
              style={{ flex: 1, textAlign: "left" }}>
              <div className="flex flex-col w-full justify-start min-h-18.5 h-fit">
                <h3
                  className="leading-5.5 text-[1.4rem] h-fit line-clamp-2 text-pretty md:leading-none md:text-3xl font-black"
                >
                  {food.name.toUpperCase()}
                </h3>
                <span className="text-sm leading-4 text-pretty text-gray-100 line-clamp-2">{food.description}</span>
              </div>

              <div className="flex w-full border-t-2 pt-2 border-yellow-200 flex-col items-end justify-end h-full">
                <p
                  className="text-center font-semibold text-gray-200/90 line-through text-lg md:text-xl"
                >
                  Antes {priceFormatter.format(food.price)}
                </p>
                <p
                  className="text-[1.6rem] drop-shadow-lg text-center font-bold text-[#fff2cc] md:text-3xl"
                >
                  ¡Ahora! {priceFormatter.format(food.promo_price)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section >
  );
}