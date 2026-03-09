"use client";
import { useRef, useEffect, useState } from "react";
import QrButtonIndex from "@/src/components/buttons/QrButtonIndex";
import { URL_PROD } from "@/src/lib/const";

interface QrButtonProps {
  name: string;
  logoUrl?: string;
  url?: string;
}

export default function QrModalsGenerator({ name, logoUrl }: QrButtonProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const url = `${URL_PROD}menu/${encodeURIComponent(name)}`;
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false); // Estado para el feedback

  useEffect(() => {
    if (qrRef.current && window.QRCode) {
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
  }, [url]);

  // Función para copiar al portapapeles
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      // Revertir el estado después de 2 segundos
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar: ", err);
    }
  };

  const handleDownload = () => {
    const qrCanvas = qrRef.current?.querySelector(
      "canvas",
    ) as HTMLCanvasElement;
    if (!qrCanvas) return;

    const templateCanvas = document.createElement("canvas");
    const ctx = templateCanvas.getContext("2d");
    if (!ctx) return;

    // Aumentamos un poco el tamaño de la plantilla para mejor calidad general (Opcional)
    const width = 350;
    const height = 450;
    templateCanvas.width = width;
    templateCanvas.height = height;

    // Fondo blanco con esquinas redondeadas (un toque pro)
    ctx.fillStyle = "#ffffff";
    // ctx.fillRect(0, 0, width, height); // Fondo rectangular simple

    // Función para dibujar rectángulo redondeado (Mejora visual)
    const roundRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
    ) => {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
      return ctx;
    };
    roundRect(0, 0, width, height, 20).fill();

    // Dibujar QR centrado
    const qrSize = 250; // Aumentamos el tamaño del QR en la plantilla
    const qrX = width / 2 - qrSize / 2;
    const qrY = 50;
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    // Dibujar logo encima del QR con reescalado PROPORCIONAL
    if (logoUrl) {
      const img = new Image();
      // Importante: CrossOrigin para evitar errores de seguridad al descargar
      img.crossOrigin = "anonymous";
      img.src = typeof logoUrl === "string" ? logoUrl : "";

      img.onload = () => {
        // --- LÓGICA DE REESCALADO SENIOR ---
        const maxLogoSize = 70; // Tamaño máximo (ancho o alto)
        let logoWidth = img.width;
        let logoHeight = img.height;

        // Calculamos la relación de aspecto
        const ratio = logoWidth / logoHeight;

        // Ajustamos proporcionalmente
        if (logoWidth > logoHeight) {
          // Es más ancha que alta
          logoWidth = maxLogoSize;
          logoHeight = maxLogoSize / ratio;
        } else {
          // Es más alta que ancha (o cuadrada)
          logoHeight = maxLogoSize;
          logoWidth = maxLogoSize * ratio;
        }

        // Coordenadas para centrar el logo reescalado
        const logoX = width / 2 - logoWidth / 2;
        const logoY = qrY + qrSize / 2 - logoHeight / 2;

        // Dibujar fondo blanco detrás del logo (para que no se pise con el QR)
        // Lo hacemos un poco más grande que el logo para que respire
        const padding = 10;
        ctx.fillStyle = "#fff";
        roundRect(
          logoX - padding / 2,
          logoY - padding / 2,
          logoWidth + padding,
          logoHeight + padding,
          10,
        ).fill();

        // Dibujar el logo final
        ctx.drawImage(img, logoX, logoY, logoWidth, logoHeight);

        // Texto debajo
        ctx.font = "bold 22px Arial"; // Un poco más grande
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.fillText(name, width / 2, qrY + qrSize + 50);

        // Descargar PNG
        const link = document.createElement("a");
        link.download = `${name}-qr.png`;
        link.href = templateCanvas.toDataURL("image/png");
        link.click();
      };

      img.onerror = () => {
        console.error("No se pudo cargar el logo para la descarga.");
        // Si falla el logo, descargamos solo el QR para no trabar al usuario
        downloadJustQr(ctx, width, qrSize, qrY, name);
      };
    } else {
      // Texto debajo sin logo
      downloadJustQr(ctx, width, qrSize, qrY, name);
    }
  };

  // Función auxiliar por si no hay logo o falla
  const downloadJustQr = (
    ctx: CanvasRenderingContext2D,
    width: number,
    qrSize: number,
    qrY: number,
    name: string,
  ) => {
    ctx.font = "bold 22px Arial";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText(name, width / 2, qrY + qrSize + 50);

    const link = document.createElement("a");
    link.download = `${name}-QR.png`;
    // Usamos el canvas de la plantilla, no el del QR original
    link.href = ctx.canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="mt-3 animate__animated animate__fadeIn rounded-xl p-6 w-full text-center relative">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Comparte tu menú
      </h2>

      <div className="relative inline-block mx-auto mb-1">
        <div
          ref={qrRef}
          className="mx-auto border-4 border-gray-50 p-2 rounded-lg"
        />
        {logoUrl ? (
          <img
            src={typeof logoUrl === "string" ? logoUrl : ""}
            alt="Logo"
            className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white border-2 border-white shadow-sm"
          />
        ) : (
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded text-[10px] font-bold shadow-sm uppercase">
            {name}
          </span>
        )}
      </div>

      {/* Sección de URL y Botón de Copiar */}
      <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between border border-gray-100">
        <p className="text-xs text-gray-500 truncate mr-2 text-left">{url}</p>
        <button
          onClick={handleCopyUrl}
          className={`shrink-0 p-2 rounded-md transition-all ${
            copied
              ? "bg-green-100 text-green-600"
              : "bg-white text-blue-600 hover:bg-blue-50 border border-blue-100 shadow-sm"
          }`}
          title="Copiar enlace"
        >
          {copied ? (
            <span className="text-xs font-bold">¡Copiado!</span>
          ) : (
            <span className="text-xs font-bold">Copiar</span>
          )}
        </button>
      </div>
    </div>
  );
}
