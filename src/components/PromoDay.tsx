import 'animate.css';
import Image from "next/image";

interface Promo {
  photo: string;
  name: string;
  description: string;
  price: number;
  lastPrice: number;
}

//debemos traer una prop llamada promo
export default function PromoDay({ promo }: { promo: Promo }) {
  //let lastPrice = foods[0]?.lastPrice ? foods[0].lastPrice : foods[0].price + (foods[0].price * 0.2);
  function formatearPrecio(precio: number | string) {
    const value = typeof precio === "string" ? Number(precio) : precio;
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(value);
  }
  return (
    <section className="flex flex-col text-gray-700 mb-2 items-center md:items-start w-full gap-1.5">
      <div className="animate__animated animate__bounceIn p-3 gap-2 w-full md:px-[2vw] rounded-lg h-60 max-h-fit md:py-2 bg-radial-[at_50%_75%] md:bg-radial-[at_0%_0%] hover:-translate-y-2 transition-all duration-300 ease-in-out from-yellow-500 via-red-600 to-red-900 to-100% md:w-full flex"
        style={{
          overflow: "hidden",
          maxWidth: "100%",
          boxShadow: "0 6px 10px rgba(0,0,0,0.25)",
        }}
      >
        <Image
          loading="eager"
          src={promo.photo}
          alt={promo.name}
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
            className="flex flex-col items-center justify-between gap-5 w-full h-full"
            style={{ flex: 1, textAlign: "left" }}>
            <div className="flex flex-col justify-start h-full">
              <h2
                className="leading-5 text-xl text-pretty md:leading-none md:text-3xl font-bold mb-1"
              >
                {promo.name}
              </h2>
              <span className="text-sm leading-4 text-gray-100">{promo.description}</span>
            </div>
            <div className="border-[.5px] border-white/70 w-full"></div>
            <div className="flex w-full flex-col items-end justify-end h-full">
              <p
                className="text-[15px] text-center font-bold text-white line-through md:text-xl"
              >
                Antes {formatearPrecio(promo.lastPrice)}
              </p>
              <p
                className="text-xl drop-shadow text-center font-bold text-[#FFE282] md:text-3xl"
              >
                ¡Ahora! {formatearPrecio(promo.price)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section >
  );
}