import promoday from "../data/promoday";

const { imageUrl, title, description, price, bgColor } = promoday;

export default function PromoDay() {
    return (
        <section>
            <h2
                style={{
                    margin: "0.2rem 0 0 0",
                    fontSize: "2rem",
                    fontWeight: 900,
                    textAlign: "left",
                }}
            >
                PROMO DEL DÍA
            </h2>
            <div
                style={{
                    background: bgColor || "#f5f5f5",
                    borderRadius: "1rem",
                    overflow: "hidden",
                    maxWidth: "100%",
                    maxHeight: "40vh",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
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
                            style={{
                                fontWeight: 800,
                                fontSize: "25px",
                                margin: 0,
                            }}
                        >
                            {title}
                        </h2>
                        <p style={{ fontSize: "13px", marginTop: "0.2rem" }}>
                            {description}
                        </p>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            alignItems: "flex-end",
                            width: "50%",
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
                            Antes ${price}
                        </p>
                        <p
                            style={{
                                color: "#ffffff",
                                fontSize: "30px",
                                fontWeight: 800,
                                margin: 0,
                            }}
                        >
                            ${price}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}