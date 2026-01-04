import "./globals.css";
import type { Metadata } from "next";
import { Asap } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import EmotionProvider from "@/src/components/EmotionProvider";

const asap = Asap({
  style: "normal",
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QMenú",
  description: "Tu menú en tus manos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (

    <html lang="es" className={asap.className}>
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