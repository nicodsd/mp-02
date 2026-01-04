"use client";

import { useState, useRef, useEffect } from "react";

interface QrButtonProps {
    name: string;
    id: string | number;
}

export default function QrButtonWithModal({ name, id }: QrButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);

    const url = `https://qrmenu-gold-alpha.vercel.app?name=${encodeURIComponent(
        name
    )}&id=${id}`;

    useEffect(() => {
        if (isOpen && qrRef.current && window.QRCode) {
            qrRef.current.innerHTML = "";
            new window.QRCode(qrRef.current, {
                text: url,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: window.QRCode.CorrectLevel.H,
            });
        }
    }, [isOpen, url]);

    const handleDownload = () => {
        const canvas = qrRef.current?.querySelector("canvas") as HTMLCanvasElement;
        if (canvas) {
            const link = document.createElement("a");
            link.download = `${name}-qr.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    padding: "0.6rem 1.2rem",
                    backgroundColor: "#0070f3",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                }}
            >
                Generar QR de {name}
            </button>

            {isOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            padding: "2rem",
                            borderRadius: "8px",
                            textAlign: "center",
                            minWidth: "300px",
                        }}
                    >
                        <h2>QR generado</h2>
                        <div ref={qrRef} style={{ margin: "1rem auto" }} />
                        <p>
                            <a href={url} target="_blank" rel="noopener noreferrer">
                                {url}
                            </a>
                        </p>
                        <button
                            onClick={handleDownload}
                            style={{
                                marginTop: "1rem",
                                padding: "0.5rem 1rem",
                                backgroundColor: "#0070f3",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                            }}
                        >
                            Descargar PNG
                        </button>
                        <br />
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                marginTop: "1rem",
                                padding: "0.5rem 1rem",
                                backgroundColor: "#ccc",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                            }}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
