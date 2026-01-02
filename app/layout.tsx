import "./globals.css";
import type { Metadata } from "next";
import { Asap } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
      </body>
    </html>
  );
}