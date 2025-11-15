import promoday from "../data/promoday.js";
import 'animate.css';

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
      <h2
        style={{
          width: "100%",
          margin: "0.2rem 0 0 0",
          fontSize: "2.6rem",
          fontWeight: 900,
          textAlign: "start",
        }}
      >
        PROMO DEL DÍA
      </h2>
      <div className="animate__animated animate__bounceIn"
        style={{
          background: bgColor || "#f5f5f5",
          borderRadius: "1rem",
          overflow: "hidden",
          maxWidth: "100%",
          maxHeight: "50vh",
          boxShadow: "0 6px 10px rgba(0,0,0,0.25)",
        }}
      >
        <img
          src={imageUrl}
          alt={title}
          style={{
            width: "100%",
            height: "180px",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            padding: "1rem",
            color: "#ffffff",
          }}
        >
          <div style={{ flex: 1, textAlign: "left" }}>
            <h2
              className="text-base/5.5 mb-1.5"
              style={{
                fontWeight: 800,
                fontSize: "22px",
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
