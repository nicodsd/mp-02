"use client";
import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { NEXT_PUBLIC_URL } from "@/src/lib/const";
import { Download, Check, ExternalLink, Copy } from "lucide-react";

interface QrButtonProps {
  name: string;
  logoUrl?: string;
}

const TEMPLATES = [
  { id: 1, name: "", bg: "#ffffff", fg: "#000000", accent: "#f3f4f6" },
  { id: 2, name: "Noche", bg: "#1a1a1a", fg: "#ffffff", accent: "#333333" },
  { id: 3, name: "Sunset", bg: "#ff5f6d", fg: "#ffffff", accent: "#ffc371" },
  { id: 4, name: "Bosque", bg: "#004d40", fg: "#e0f2f1", accent: "#00695c" },
];

export default function QrModalsGenerator({ name, logoUrl }: QrButtonProps) {
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);

  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const url = `${NEXT_PUBLIC_URL}menu/${encodeURIComponent(name.replace(" ", "-"))}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar: ", err);
    }
  };

  const handleDownload = () => {
    const qrCanvas = qrCanvasRef.current;
    if (!qrCanvas) return;

    const templateCanvas = document.createElement("canvas");
    const ctx = templateCanvas.getContext("2d");
    if (!ctx) return;

    const width = 350;
    const height = 450;
    templateCanvas.width = width;
    templateCanvas.height = height;

    ctx.fillStyle = selectedTemplate.bg;
    const roundRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
    ) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fill();
    };

    roundRect(0, 0, width, height, 20);

    const qrSize = 250;
    const qrX = width / 2 - qrSize / 2;
    const qrY = 50;

    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    if (logoUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = logoUrl;
      img.onload = () => {
        const size = 100;
        const lX = width / 2 - size / 2;
        const lY = qrY + qrSize / 2 - size / 2;

        ctx.fillStyle = selectedTemplate.bg;
        ctx.beginPath();
        ctx.arc(width / 2, qrY + qrSize / 2, size / 2 + 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, qrY + qrSize / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const aspect = img.width / img.height;
        let drawW = size;
        let drawH = size;
        if (aspect > 1) drawW = size * aspect;
        else drawH = size / aspect;

        ctx.drawImage(
          img,
          lX - (drawW - size) / 2,
          lY - (drawH - size) / 2,
          drawW,
          drawH,
        );
        ctx.restore();
        finalizeDownload(ctx, name);
      };
      img.onerror = () => finalizeDownload(ctx, name);
    } else {
      finalizeDownload(ctx, name);
    }
  };

  const finalizeDownload = (ctx: CanvasRenderingContext2D, text: string) => {
    ctx.font = "bold 22px Arial";
    ctx.fillStyle = selectedTemplate.fg;
    ctx.textAlign = "center";
    ctx.fillText(text, 350 / 2, 350);

    const link = document.createElement("a");
    link.download = `${text}-QR-${selectedTemplate.name}.png`;
    link.href = ctx.canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex items-center w-full justify-center">
      <div className="rounded-2xl border-[0.1px] flex flex-col bg-background w-full border-gray-200 p-4 text-center animate-in fade-in zoom-in duration-200">
        <div
          className="relative flex justify-center mb-6 p-5 rounded-2xl border border-gray-300 transition-colors duration-300"
          style={{ backgroundColor: selectedTemplate.bg }}
        >
          <QRCodeCanvas
            ref={qrCanvasRef}
            value={url}
            size={230}
            level={"H"}
            bgColor={selectedTemplate.bg}
            fgColor={selectedTemplate.fg}
            includeMargin={false}
          />
          {logoUrl && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4"
              style={{
                borderColor: selectedTemplate.bg,
                backgroundColor: selectedTemplate.bg,
              }}
            >
              <img
                src={logoUrl}
                alt="Logo"
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex justify-center gap-5 mb-6">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(t)}
              className={`group relative w-12 h-12 rounded-full border-2 transition-all ${selectedTemplate.id === t.id
                ? "border-blue-600 scale-110"
                : "border-transparent"
                }`}
              style={{ backgroundColor: t.bg }}
              title={t.name}
            >
              <div
                className="absolute inset-2 rounded-full"
                style={{ backgroundColor: t.fg }}
              />
              {selectedTemplate.id === t.id && (
                <div className="absolute -top-1 -right-1 bg-blue-600 rounded-full p-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        <span className="text-[11px] w-full text-right text-slate-700 mb-1">Copiar Enlace</span>
        <div className="gap-2 rounded-lg p-2 w-full flex items-center mb-4 bg-white border border-slate-200">
          <p className="text-[11px] text-slate-700 truncate text-left flex-1 font-mono">
            {url}
          </p>
          <button
            onClick={handleCopyUrl}
            className={`px-3 py-2 rounded-md w-fit justify-center text-[10px] min-h-9 font-bold transition-colors ${copied
              ? "bg-green-500 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <a
            href={url}
            className="w-full flex cursor-pointer justify-center items-center py-3.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all active:scale-95 shadow-lg"
          >
            <ExternalLink className="w-5 h-5 mr-2" /> Visitar
          </a>
          <button
            onClick={handleDownload}
            className="w-full flex cursor-pointer justify-center items-center py-3.5 bg-black text-white font-bold rounded-lg hover:bg-gray-900 transition-all active:scale-95 shadow-lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Descargar tu QR {selectedTemplate.name}
          </button>
        </div>
      </div>
    </div>
  );
}