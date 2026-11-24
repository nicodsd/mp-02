import type { Metadata } from "next";
import Navbar from "@/src/components/land_page/Navbar";
import Footer from "@/src/components/land_page/Footer";
import ContactForm from "@/src/components/land_page/ContactForm";
import JsonLd from "@/src/components/seo/JsonLd";
import { buildPageMetadata, SITE_URL } from "@/src/lib/seo/site";
import { buildBreadcrumbSchema, ORG_ID, WEBSITE_ID } from "@/src/lib/seo/jsonLd";

const PAGE_PATH = "/contacto";

export const metadata: Metadata = buildPageMetadata({
  title: "Contacto y Soporte para tu Menú Digital QR",
  description:
    "Comunícate con el equipo de QMenú para consultas sobre tu menú digital QR, planes personalizados para restaurantes o soporte técnico.",
  path: PAGE_PATH,
});

export default function ContactoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${SITE_URL}${PAGE_PATH}#webpage`,
        url: `${SITE_URL}${PAGE_PATH}`,
        name: "Contacto y Soporte | QMenú",
        description:
          "Página de contacto y soporte de QMenú para restaurantes, bares y cafeterías.",
        inLanguage: "es-AR",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORG_ID },
      },
      buildBreadcrumbSchema([
        { name: "Inicio", path: "/" },
        { name: "Contacto", path: PAGE_PATH },
      ]),
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="flex flex-col items-center w-full min-h-screen selection:bg-primary selection:text-white relative">
        <Navbar isIndex={false} />

        <main className="grow md:rounded-b-2xl bg-background w-full relative flex flex-col items-center justify-start md:max-w-7xl mx-auto px-4 pt-30">
          <section id="contacto" className="w-full p-6 relative border rounded-2xl border-gray-300">
            <div className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                <div className="text-center md:text-start md:mb-16 px-2">
                  <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
                    Contacto — Soporte para tu menú digital QR
                  </h1>
                  <p className="text-stone-600 text-base md:text-md mb-8 lg:mx-0">
                    Si tienes dudas sobre tu carta digital, quieres realizar un reembolso, un reclamo o necesitas un plan personalizado para tu restaurante o bar, comunicate por aquí.
                  </p>
                </div>

                <ContactForm messagePlaceholder="¿En qué podemos ayudarte?" />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
