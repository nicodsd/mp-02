import "./globals.css";
import type { Metadata } from "next";
import { Asap, Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import EmotionProvider from "@/src/components/EmotionProvider";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";
import { SpeedInsights } from "@vercel/speed-insights/next";
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const nonce = headerList.get("x-nonce") || "";
  return (
    <html lang="es" className={cn(asap.className, "font-sans", geist.variable)}>
      <head>
        <meta property="csp-nonce" content={nonce} />
      </head>
      <body className="antialiased">
        <EmotionProvider>
          <main>{children}</main>
          <SpeedInsights />
          <Analytics />
        </EmotionProvider>
      </body>
    </html>
  );
}
