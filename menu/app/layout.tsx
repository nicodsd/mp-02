import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/src/layouts/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Menu | App",
  description: "Aplicación de menú con diferentes platillos",
};

export default function RootLayout({ children }: Readonly <{ children: React.ReactNode; }> ) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header>Mi Header</header>
        <NavBar newfood={false} text={"Nombre Menu"}/>
        <main> {children} </main>
        <footer>Mi Footer</footer>
      </body>
    </html>
  );
}
