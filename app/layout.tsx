import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Asap, Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import CookieConsentManager, {
  ConsentAwareAnalytics,
} from "@/src/components/common/CookieConsentManager";
import PresenceTracker from "@/src/components/common/PresenceTracker";
const geist = Geist({ subsets: ["latin"], variable: "--font-sans", preload: false });

const asap = Asap({
  style: "normal",
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://qmenu.digital"),
  title: {
    default: "QMenú | Menú Digital QR Gratis para Restaurantes y Bares",
    template: "%s | QMenú",
  },
  description:
    "Crea el menú digital QR para tu restaurante, bar o cafetería en minutos. Sube tus platos, actualiza precios en tiempo real y recibe pedidos directo en WhatsApp sin comisiones.",
  keywords: [
    "menú digital",
    "menú QR para restaurantes",
    "carta qr",
    "menu qr gratis",
    "restaurantes",
    "pedidos whatsapp",
    "qmenu",
    "qmenú",
    "digitalizar bar",
    "carta digital online",
    "menú digital para restaurantes",
  ],
  authors: [{ name: "QMenú Team", url: "https://qmenu.digital" }],
  openGraph: {
    title: "QMenú | Menú Digital QR Gratis para Restaurantes y Bares",
    description:
      "Moderniza la experiencia de tu restaurante con carta QR. Actualizaciones en tiempo real y pedidos por WhatsApp.",
    url: "https://qmenu.digital",
    siteName: "QMenú",
    images: [
      {
        url: "https://qmenu.digital/og-image.png",
        width: 1200,
        height: 630,
        alt: "QMenú - Plataforma de Menús Digitales QR para Restaurantes",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QMenú | Menú Digital QR Gratis para Restaurantes y Bares",
    description:
      "Crea el menú digital con código QR de tu restaurante o bar gratis y recibe pedidos por WhatsApp.",
    images: ["https://qmenu.digital/og-image.png"],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={cn(asap.className, "font-sans", geist.variable)}>
      <head>
        {/* Bloque HEAD de GTM con Google Consent Mode v2 */}
        <Script
          id="gtm-head"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              window.gtag = window.gtag || gtag;
              var defaultConsent = {
                security_storage: 'granted',
                functionality_storage: 'denied',
                personalization_storage: 'denied',
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500
              };
              try {
                var rawConsent = localStorage.getItem('qmenu_cookie_consent');
                if (rawConsent === 'accepted') {
                  defaultConsent.functionality_storage = 'granted';
                  defaultConsent.personalization_storage = 'granted';
                  defaultConsent.analytics_storage = 'granted';
                  defaultConsent.ad_storage = 'granted';
                  defaultConsent.ad_user_data = 'granted';
                  defaultConsent.ad_personalization = 'granted';
                } else if (rawConsent && rawConsent !== 'declined') {
                  var parsedConsent = JSON.parse(rawConsent);
                  if (parsedConsent && typeof parsedConsent === 'object') {
                    if (parsedConsent.preferences) {
                      defaultConsent.functionality_storage = 'granted';
                      defaultConsent.personalization_storage = 'granted';
                    }
                    if (parsedConsent.analytics) {
                      defaultConsent.analytics_storage = 'granted';
                    }
                    if (parsedConsent.marketing) {
                      defaultConsent.ad_storage = 'granted';
                      defaultConsent.ad_user_data = 'granted';
                      defaultConsent.ad_personalization = 'granted';
                    }
                  }
                }
              } catch (e) {}
              gtag('consent', 'default', defaultConsent);
              (function(){
                function isInvalidHotjar(node) {
                  try {
                    if (node && node.tagName === 'SCRIPT' && typeof node.src === 'string' && node.src.indexOf('static.hotjar.com/c/hotjar-http') !== -1) {
                      return true;
                    }
                  } catch (e) {}
                  return false;
                }
                var origAppend = Element.prototype.appendChild;
                Element.prototype.appendChild = function(node) {
                  if (isInvalidHotjar(node)) return node;
                  return origAppend.call(this, node);
                };
                var origInsert = Element.prototype.insertBefore;
                Element.prototype.insertBefore = function(node, ref) {
                  if (isInvalidHotjar(node)) return node;
                  return origInsert.call(this, node, ref);
                };
              })();
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5BM4SFVG');
            `,
          }}
        />
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
        {children}
        <PresenceTracker />
        <CookieConsentManager />
        <ConsentAwareAnalytics />
      </body>
    </html>
  );
}
