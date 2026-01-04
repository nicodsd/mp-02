"use client";
import { BsQrCodeScan } from "react-icons/bs";
import "animate.css";

import { useState, useRef, useEffect } from "react";

interface QrButtonProps {
    name: string;
    id: string | number;
    logoUrl?: string; // 👉 logo opcional
}

export default function QrButtonWithModal({ name, id, logoUrl }: QrButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);

    const url = `https://qrmenu-gold-alpha.vercel.app?name=${encodeURIComponent(
        name
    )}`;

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
        const qrCanvas = qrRef.current?.querySelector("canvas") as HTMLCanvasElement;
        if (!qrCanvas) return;

        // Crear un canvas más grande para la plantilla
        const templateCanvas = document.createElement("canvas");
        const ctx = templateCanvas.getContext("2d");
        if (!ctx) return;

        const width = 300;
        const height = 400;
        templateCanvas.width = width;
        templateCanvas.height = height;

        // Fondo blanco
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        // Dibujar QR centrado
        const qrSize = 200;
        ctx.drawImage(
            qrCanvas,
            width / 2 - qrSize / 2,
            40,
            qrSize,
            qrSize
        );

        // Dibujar logo encima del QR
        if (logoUrl) {
            const img = new Image();
            img.src = typeof logoUrl === "string" ? logoUrl : "";
            img.onload = () => {
                const logoSize = 60;
                ctx.fillStyle = "#fff";
                ctx.fillRect(
                    width / 2 - logoSize / 2,
                    40 + qrSize / 2 - logoSize / 2,
                    logoSize,
                    logoSize
                );
                ctx.drawImage(
                    img,
                    width / 2 - logoSize / 2,
                    40 + qrSize / 2 - logoSize / 2,
                    logoSize,
                    logoSize
                );

                // Texto debajo
                ctx.font = "bold 18px Arial";
                ctx.fillStyle = "#000";
                ctx.textAlign = "center";
                ctx.fillText(name, width / 2, qrSize + 120);

                // Descargar PNG
                const link = document.createElement("a");
                link.download = `${name}-qr.png`;
                link.href = templateCanvas.toDataURL("image/png");
                link.click();
            };
        } else {
            // Texto debajo sin logo
            ctx.font = "bold 18px Arial";
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.fillText(name, width / 2, qrSize + 120);

            const link = document.createElement("a");
            link.download = `${name}-qr.png`;
            link.href = templateCanvas.toDataURL("image/png");
            link.click();
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex flex-col text-sm items-center font-bold"
            >
                <BsQrCodeScan className="h-15 w-15 p-3 flex flex-col text-sm items-center bg-black text-white font-bold rounded-full hover:bg-blue-700 transition" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white animate__animated animate__fadeIn rounded-lg shadow-lg p-6 text-center relative w-[320px]">
                        <h2 className="text-2xl font-semibold mb-4">Descarga y comparte</h2>
                        <div className="relative inline-block mx-auto">
                            <div ref={qrRef} className="mx-auto my-4" />
                            {logoUrl ? (
                                <img
                                    src={typeof logoUrl === "string" ? logoUrl : ""}
                                    alt="Logo"
                                    className="absolute top-1/2 left-1/2 w-15 h-15 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-1"
                                />
                            ) : (
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded text-sm font-bold">
                                    {name}
                                </span>
                            )}
                        </div>

                        <p className="text-sm wrap-break-word mb-4">
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                {url}
                            </a>
                        </p>

                        <button
                            onClick={handleDownload}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition mb-2"
                        >
                            Descargar plantilla PNG
                        </button>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
