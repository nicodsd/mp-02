"use client";
import React, { useState, useRef, useEffect } from "react";
import { X, Copy, Share2, Download, Check } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import Image from "next/image";

type ShareDishModalProps = {
  isOpen: boolean;
  onClose: () => void;
  food: any;
  restaurantName: string;
  restaurantSlug: string;
  template: any;
};

export default function ShareDishModal({
  isOpen,
  onClose,
  food,
  restaurantName,
  restaurantSlug,
  template,
}: ShareDishModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const qrRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !food) return null;

  const price = typeof food.price === "string" ? Number(food.price) : food.price;
  const promoPrice = typeof food.promo_price === "string" ? Number(food.promo_price) : food.promo_price;
  const isPromo = food.is_promo;

  const formatearNombre = (name: string) => {
    const words = name.split(" ");
    const shortWords = ["de", "y", "el", "la", "los", "las", "del"];
    return words.map(word => {
      if (shortWords.includes(word.toLowerCase())) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(" ");
  };

  const formatearPrecio = (val: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(val);
  };

  const cleanSlug = restaurantSlug ? restaurantSlug.trim().replace(/\s+/g, "-") : "";
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/menu-digital/${cleanSlug}?dish=${food._id}`
    : `https://menudigital.com/menu-digital/${cleanSlug}?dish=${food._id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar enlace: ", err);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `¡Mirá este plato de *${formatearNombre(restaurantName)}*! 😋\n\n*${formatearNombre(food.name)}*\n${food.description ? `_${food.description}_\n` : ""}\n💵 Precio: ${formatearPrecio(isPromo ? promoPrice : price)}\n\n👉 Hacé tu pedido ingresando al menú digital: ${shareUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // Resolve template colors
  const getCleanHexColor = (val: string, fallback: string) => {
    if (!val) return fallback;
    const match = val.match(/#([0-9a-fA-F]{3,6})/);
    if (match) {
      // Expand 3-digit hex to 6-digit to ensure hexToRgba works properly
      let hex = match[1];
      if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
      }
      return `#${hex}`;
    }
    const lower = val.toLowerCase();
    if (lower.includes("white")) return "#ffffff";
    if (lower.includes("black")) return "#050507";
    if (lower.includes("gray-700") || lower.includes("gray700")) return "#374151";
    if (lower.includes("gray-800") || lower.includes("gray800")) return "#1f2937";
    if (lower.includes("gray-900") || lower.includes("gray900")) return "#111827";
    if (lower.includes("gray-200") || lower.includes("gray200")) return "#ededed";
    if (lower.includes("primary")) return "#c2361e";
    return fallback;
  };

  const hexToRgba = (hex: string, alpha: number) => {
    if (!hex.startsWith("#") || hex.length !== 7) return `rgba(255,255,255,${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const bgColor = getCleanHexColor(template?.backgroundColor, "#ffffff");
  const cardColor = getCleanHexColor(template?.backgroundColor2, "#f4f4f5");
  const textColor = getCleanHexColor(template?.textColor, "#18181b");
  const textOpacity = getCleanHexColor(template?.textColorOpacity, "#71717a");
  const accentColor = getCleanHexColor(template?.icons, "#e28743");

  const handleDownloadStory = async () => {
    setDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get 2D context");

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // 1. Background Setup
      const drawBackground = () => {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 1080, 1920);

        // Decorative background blobs for glassmorphism contrast
        ctx.fillStyle = `${accentColor}25`; // 15% opacity
        ctx.beginPath();
        ctx.arc(150, 200, 600, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(980, 1720, 800, 0, 2 * Math.PI);
        ctx.fill();
      };

      drawBackground();

      // 2. Glassmorphism Card Container
      const cardX = 90;
      const cardY = 160;
      const cardW = 900;
      const cardH = 1500;
      const cardR = 60;

      // Draw strong drop shadow behind glass
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
      ctx.shadowBlur = 80;
      ctx.shadowOffsetY = 30;
      ctx.beginPath();
      ctx.roundRect?.(cardX, cardY, cardW, cardH, cardR);
      ctx.fillStyle = "#000"; // just for shadow casting
      ctx.fill();
      ctx.restore();

      // TRUE Glassmorphism effect in Canvas
      ctx.save();
      ctx.beginPath();
      ctx.roundRect?.(cardX, cardY, cardW, cardH, cardR);
      ctx.clip(); // Clip everything to the rounded card shape

      // Redraw background heavily blurred
      ctx.filter = "blur(50px)";
      drawBackground();
      ctx.filter = "none";

      // Apply translucent color tint from template
      ctx.fillStyle = hexToRgba(cardColor, 0.65);
      ctx.fillRect(cardX, cardY, cardW, cardH);

      // Add glassy diagonal reflection
      const glassGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
      glassGrad.addColorStop(0, "rgba(255, 255, 255, 0.15)");
      glassGrad.addColorStop(0.5, "rgba(255, 255, 255, 0)");
      glassGrad.addColorStop(1, "rgba(255, 255, 255, 0.05)");
      ctx.fillStyle = glassGrad;
      ctx.fillRect(cardX, cardY, cardW, cardH);

      ctx.restore(); // End clipping region

      // Draw Glass Border
      ctx.save();
      ctx.beginPath();
      ctx.roundRect?.(cardX, cardY, cardW, cardH, cardR);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inner contrast border
      ctx.strokeStyle = `${textColor}10`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // 3. Dish Image
      const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = (e) => reject(e);
          img.src = src;
        });
      };

      try {
        const foodImg = await loadImage(food.photo);
        ctx.save();

        const imgX = 140;
        const imgY = 210;
        const imgSize = 800;
        const imgR = 40;

        ctx.beginPath();
        ctx.roundRect?.(imgX, imgY, imgSize, imgSize, imgR);
        ctx.clip();

        const iw = foodImg.width;
        const ih = foodImg.height;
        let sx = 0, sy = 0, sw = iw, sh = ih;
        if (iw > ih) {
          sw = ih;
          sx = (iw - ih) / 2;
        } else if (ih > iw) {
          sh = iw;
          sy = (ih - iw) / 2;
        }

        ctx.drawImage(foodImg, sx, sy, sw, sh, imgX, imgY, imgSize, imgSize);
        ctx.restore();

        // Image inner shadow/border
        ctx.save();
        ctx.strokeStyle = `rgba(255,255,255,0.2)`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect?.(imgX, imgY, imgSize, imgSize, imgR);
        ctx.stroke();
        ctx.restore();

      } catch (err) {
        ctx.fillStyle = `${textColor}0D`;
        ctx.beginPath();
        ctx.roundRect?.(140, 210, 800, 800, 40);
        ctx.fill();
      }

      // 4. Texts
      ctx.textAlign = "center";

      // Restaurant
      ctx.font = "bold 28px sans-serif";
      ctx.fillStyle = textOpacity;

      // Ajustamos el tracking para que no estén tan separadas
      ctx.letterSpacing = "1px"; // 👈 Reducido de 6px a 1px (puedes usar "0px" para el valor por defecto)
      ctx.fillText(restaurantName.toUpperCase(), 540, 1080);

      // ⚠️ IMPORTANTE: Reseteamos el letterSpacing a "0px" para que 
      // los siguientes textos (Title, Price, Description) no hereden la separación.
      ctx.letterSpacing = "0px";

      // Title
      ctx.fillStyle = textColor;
      ctx.font = "bold 64px sans-serif";
      let displayName = food.name;
      if (displayName.length > 25) displayName = displayName.substring(0, 23) + "...";
      ctx.fillText(displayName, 540, 1160);

      // Price
      ctx.font = "900 76px sans-serif";
      ctx.fillStyle = accentColor;
      const finalPrice = isPromo ? promoPrice : price;
      ctx.fillText(formatearPrecio(finalPrice), 540, 1260);

      // Description / Tags
      if (food.is_gluten_free) {
        ctx.fillStyle = accentColor;
        ctx.font = "bold 32px sans-serif";
        ctx.fillText("SIN TACC / LIBRE DE GLUTEN", 540, 1340);
      } else {
        ctx.font = "32px sans-serif";
        ctx.fillStyle = textOpacity;
        let desc = food.description || "";
        if (desc.length > 55) desc = desc.substring(0, 52) + "...";
        ctx.fillText(desc, 540, 1340);
      }

      // 5. QR Code
      const qrCanvas = qrRef.current;
      if (qrCanvas) {
        ctx.save();
        const qrSize = 180;
        const qrX = 540 - qrSize / 2;
        const qrY = 1420;

        // Clean white background for QR scannability with subtle shadow
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.shadowColor = "rgba(0,0,0,0.15)";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 10;
        ctx.beginPath();
        ctx.roundRect?.(qrX - 25, qrY - 25, qrSize + 50, qrSize + 50, 30);
        ctx.fill();
        ctx.restore();

        ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
      }

      // 6. Footer
      ctx.fillStyle = textOpacity;
      ctx.font = "bold 26px sans-serif";
      ctx.letterSpacing = "2px";
      ctx.fillText("QMENU", 540, 1750);

      ctx.font = "22px sans-serif";
      ctx.letterSpacing = "1px";
      ctx.fillText("www.qmenu.digital", 540, 1790);

      // Trigger download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${food.name.replace(/\s+/g, "_").toLowerCase()}_story.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error generating story: ", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-100 overflow-y-auto backdrop-blur-md bg-black/40 transition-opacity duration-300`}
      onClick={onClose}
    >
      <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
        <div className="hidden">
          <QRCodeCanvas
            ref={qrRef}
            value={shareUrl}
            size={200}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"}
          />
        </div>

        <div
          ref={containerRef}
          className="relative flex flex-col md:flex-row w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl animate-fade-in"
          style={{ background: bgColor }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-30 p-2 text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 rounded-full transition-all active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Glassmorphism Preview */}
          <div className="relative flex-1 flex items-center justify-center p-6 md:p-8 border-b md:border-b-0 md:border-r border-black/5 overflow-hidden" style={{ background: bgColor }}>
            {/* Background Blobs for Preview */}
            <div
              className="absolute top-0 -left-10 w-64 h-64 rounded-full blur-[60px]"
              style={{ background: accentColor, opacity: 0.15 }}
            />
            <div
              className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full blur-[60px]"
              style={{ background: accentColor, opacity: 0.15 }}
            />

            <div
              className="w-full max-w-[260px] backdrop-blur-2xl sm:max-w-[320px] aspect-9/16 relative flex flex-col items-center justify-between p-4 sm:p-5 rounded-4xl shadow-2xl overflow-hidden z-10"
              style={{
                background: hexToRgba(cardColor, 0.25),
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: `1px solid rgba(255, 255, 255, 0.40)`,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
            >
              {/* Glass highlight */}
              <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none" />

              <span className="text-[9px] sm:text-[10px] tracking-[0.25em] font-bold uppercase mt-1 sm:mt-2 text-center" style={{ color: textOpacity }}>
                {restaurantName}
              </span>

              <div className="w-full flex flex-col items-center mt-1 sm:mt-2 flex-1 justify-center">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-sm border border-white/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <Image
                    src={food.photo}
                    alt={food.name}
                    className="w-full h-full object-cover"
                    width={200}
                    height={200}
                    loading="lazy"
                  />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-center mt-3 sm:mt-5 line-clamp-1 w-full drop-shadow-sm" style={{ color: textColor }}>
                  {food.name}
                </h3>

                <span className="text-2xl sm:text-3xl font-black mt-1 sm:mt-2 drop-shadow-sm" style={{ color: accentColor }}>
                  {formatearPrecio(isPromo ? promoPrice : price)}
                </span>

                <p className="text-[10px] sm:text-xs text-center mt-2 sm:mt-3 line-clamp-2 px-2 italic" style={{ color: textOpacity }}>
                  {food.description || "¡Imperdible especialidad de la casa!"}
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 mb-1 sm:mb-2 z-10 mt-3 sm:mt-4">
                <div className="p-2 sm:p-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/40">
                  <QRCodeCanvas
                    value={shareUrl}
                    size={65}
                    bgColor={"transparent"}
                    fgColor={"#000000"}
                    level={"M"}
                    className="sm:w-[75px] sm:h-[75px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="flex-1 flex flex-col justify-center p-6 md:p-8 space-y-5 sm:space-y-6" style={{ background: bgColor }}>
            <div className="space-y-2 text-left">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black" style={{ color: textColor }}>
                Llevá tu sabor a todos lados
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: textOpacity }}>
                Copiá el enlace directo o descargá una placa con diseño profesional, optimizada con los colores de tu menú, ideal para subir a historias de Instagram o compartir por WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-between w-full px-4 sm:px-5 py-3 sm:py-4 font-semibold rounded-2xl transition-all duration-300 active:scale-[0.98] group"
                style={{ background: cardColor, color: textColor, border: `1px solid ${textColor}1A` }}
              >
                <div className="flex items-center gap-3">
                  <Copy className="w-5 h-5 opacity-70" />
                  <span className="text-sm sm:text-base">{copied ? "¡Enlace copiado!" : "Copiar Enlace Directo"}</span>
                </div>
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <span className="text-[10px] sm:text-xs font-normal" style={{ color: textOpacity }}>Obtener link</span>
                )}
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="flex items-center gap-3 w-full px-4 sm:px-5 py-3 sm:py-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-600 font-semibold rounded-2xl transition-all duration-300 active:scale-[0.98] text-left"
              >
                <Share2 className="w-5 h-5" />
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base">Enviar por WhatsApp</span>
                  <span className="text-[9px] sm:text-[10px] text-green-600/70 font-normal">
                    Mensaje formateado listo
                  </span>
                </div>
              </button>

              <button
                onClick={handleDownloadStory}
                disabled={downloading}
                className="flex items-center gap-3 w-full px-4 sm:px-5 py-3 sm:py-4 font-bold text-white rounded-2xl transition-all duration-300 active:scale-[0.98] shadow-lg disabled:opacity-50 text-left"
                style={{
                  background: accentColor,
                }}
              >
                <Download className={`w-5 h-5 ${downloading ? "animate-bounce" : ""}`} />
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base">{downloading ? "Generando Historia..." : "Descargar Imagen para Historias"}</span>
                  <span className="text-[9px] sm:text-[10px] text-white/80 font-normal">
                    Diseño profesional (1080x1920)
                  </span>
                </div>
              </button>
            </div>

            <div className="pt-1 sm:pt-2 text-center md:text-left">
              <p className="text-[9px] sm:text-[10px]" style={{ color: textOpacity }}>
                Cualquiera que escanee el QR o haga clic en el link será redirigido exactamente a este plato en tu menú digital.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
