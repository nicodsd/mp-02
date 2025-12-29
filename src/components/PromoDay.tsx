import promoday from "@/src/data/promoday.js";
import 'animate.css';
import Image from "next/image";
const { imageUrl, title, description, price, bgColor } = promoday;
export default function PromoDay() {
  function formatearPrecio(precio: number | string) {
    const value = typeof precio === "string" ? Number(precio) : precio;
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(value);
  }
  return (
    <section className="flex flex-col items-center md:items-start w-full">
      <div className="animate__animated animate__bounceIn md:px-[6vw] h-[13vh] md:py-2 bg-radial-[at_50%_75%] md:bg-radial-[at_0%_0%] hover:-translate-y-2 transition-all duration-300 ease-in-out from-red-700 via-red-600 to-yellow-600 to-100% md:w-full flex"
        style={{
          borderRadius: "1rem",
          overflow: "hidden",
          maxWidth: "100%",
          maxHeight: "100%",
          boxShadow: "0 6px 10px rgba(0,0,0,0.25)",
        }}
      >
        <Image
          loading="eager"
          src={imageUrl}
          alt={title}
          width={500}
          height={500}
          style={{
            objectFit: "cover",
          }}
          className="md:w-1/4 h-[13vh] w-[10vh] md:h-[25vh] lg:h-[30vh] md:rounded-xl md:shadow-2xl md:shadow-yellow-400"
        />
        <div
          className="flex flex-row md:ml-2 rounded-xl text-white p-2.5 md:w-full md:p-10"
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div
            className="md:flex md:flex-col md:justify-around w-[85%]"
            style={{ flex: 1, textAlign: "left" }}>
            <h2
              className="leading-5.5 md:leading-none text-base md:text-[3vw] font-black mb-1 md:w-full"
            >
              {title}
            </h2>
            <p
              className="text-sm font-normal md:text-[1vw]"
            >
              {description}
            </p>
          </div>
          <div
            className="flex flex-col justify-end items-end w-[20%]"
          >
            <p
              className="font-semibold text-[14px] text-[#ffd000] line-through md:text-[1vw]"
            >
              Antes {formatearPrecio(price)}
            </p>
            <p
              className="text-[20px] font-bold text-white md:text-[2vw]"
            >
              {formatearPrecio(price)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}