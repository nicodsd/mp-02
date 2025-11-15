// /c:/Users/Nicolas/REPOS git/mp-02/menu/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Asap } from "next/font/google";
import Footer from "@/src/layouts/Footer";

const asap = Asap({
  style: "normal",
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Menu | App",
  description: "Aplicación de menú con diferentes platillos",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={asap.className}>
      <body className="antialiased">
        <main>{children}</main>
      </body>
    </html>
  );
}
