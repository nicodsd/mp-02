import "./globals.css";
import type { Metadata } from "next";
import { Asap, Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import EmotionProvider from "@/src/components/EmotionProvider";
import { cn } from "@/lib/utils";
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const asap = Asap({
  style: "normal",
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QMenú",
  description: "Tu menú en tus manos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={cn(asap.className, "font-sans", geist.variable)}>
      <body className="antialiased">
        <EmotionProvider>
          <main>{children}</main>
          <Analytics />
        </EmotionProvider>
        <Script
          src="https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}