import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
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
  title: "QMenú | Tu Menú Digital Rápido y Gratis",
  description: "Crea el menú digital QR para tu restaurante o bar en minutos. Sube tus platos, actualiza precios en tiempo real y recibe pedidos directo en WhatsApp sin comisiones.",
  keywords: ["menú digital", "carta qr", "menu qr gratis", "restaurantes", "pedidos whatsapp", "qmenu", "digitalizar bar", "carta digital online", "menú digital para restaurantes"],
  authors: [{ name: "QMenú Team" }],
  openGraph: {
    title: "QMenú | Tu Menú Digital Rápido y Gratis",
    description: "Moderniza la experiencia de tu restaurante. Actualizaciones en tiempo real y pedidos por WhatsApp.",
    url: "https://qmenu.digital",
    siteName: "QMenú",
    images: [
      {
        url: "https://qmenu.digital/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "QMenú - Plataforma de Menús Digitales",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QMenú | Tu Menú Digital Rápido y Gratis",
    description: "Moderniza la experiencia de tu restaurante con códigos QR.",
    images: ["https://qmenu.digital/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: '5Xn36Qc5L74gqgqL_rM7V14uM0vjU0q7z6s2n0V4L0k',
    other: {
      "msvalidate.01": "C4AD066D90EC52C5E5872237F50C455C",
    },
  },
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
        {/* Bloque HEAD de GTM */}
        <Script
          nonce={nonce}
          id="gtm-head"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5BM4SFVG');
            `,
          }}
        />
        <meta property="csp-nonce" content={nonce} />
      </head>
      <body className="antialiased">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5BM4SFVG"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <EmotionProvider>
          <main>{children}</main>
          <SpeedInsights />
          <Analytics />
        </EmotionProvider>
      </body>
    </html>
  );
}
