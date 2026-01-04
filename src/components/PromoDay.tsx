import 'animate.css';
import Image from "next/image";
export default function PromoDay({ imageUrl, title, description, price, lastPrice }: { imageUrl: string, title: string, description: string, price: number, lastPrice: number }) {
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
      <div className="animate__animated animate__bounceIn w-full md:px-[6vw] rounded-lg h-[10vh] md:py-2 bg-radial-[at_50%_75%] md:bg-radial-[at_0%_0%] hover:-translate-y-2 transition-all duration-300 ease-in-out from-red-700 via-red-600 to-yellow-600 to-100% md:w-full flex"
        style={{
          overflow: "hidden",
          maxWidth: "100%",
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
          className="md:w-1/4 h-full w-[25%] md:h-[25vh] lg:h-[30vh] md:rounded-xl md:shadow-2xl md:shadow-yellow-400"
        />
        <div
          className="flex flex-row md:ml-2 text-white py-3 w-full h-full md:p-10"
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div
            className="flex items-center justify-between gap-2 px-3 w-full h-full"
            style={{ flex: 1, textAlign: "left" }}>
            <div className="flex flex-col justify-around h-full">
              <h2
                className="leading-4 text-pretty md:leading-none md:text-[3vw] font-bold mb-1"
              >
                {title}
              </h2>
              <span className="text-[12px] leading-3 text-gray-200">{description}</span>
            </div>
            <div className="border border-white h-full"></div>
            <div className="flex flex-col justify-around h-full">
              <p
                className="text-[12px] text-center font-bold text-white line-through md:text-[2vw]"
              >
                Antes: {formatearPrecio(lastPrice)}
              </p>
              <p
                className="text-[22px] text-center font-bold text-white md:text-[2vw]"
              >
                {formatearPrecio(price)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section >
  );
}