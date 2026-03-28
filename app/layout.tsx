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
