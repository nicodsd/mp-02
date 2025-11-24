import promoday from "../data/promoday.js";
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
    <section className="flex flex-col items-center">
      <div className="animate__animated animate__bounceIn"
        style={{
          background: bgColor || "#f5f5f5",
          borderRadius: "1rem",
          overflow: "hidden",
          maxWidth: "100%",
          maxHeight: "40vh",
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
            width: "100%",
            height: "150px",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            padding: "0.8rem",
            color: "#ffffff",
          }}
        >
          <div style={{ flex: 1, textAlign: "left" }}>
            <h2
              className="text-base/5.5 mb-1.5"
              style={{
                fontWeight: 800,
                fontSize: "21px",
              }}
            >
              {title}
            </h2>
            <p
              style={{ fontSize: "13px", fontWeight: 300, marginTop: "0.2rem" }}
            >
              {description}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              width: "34%",
            }}
          >
            <p
              style={{
                fontWeight: 600,
                fontSize: "14px",
                color: "#ff4e4e",
                margin: 0,
              }}
            >
              Antes {formatearPrecio(price)}
            </p>
            <p
              style={{
                color: "#ffffff",
                fontSize: "30px",
                fontWeight: 800,
                margin: 0,
              }}
            >
              {formatearPrecio(price)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}