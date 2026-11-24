import type { Metadata } from "next";
import Navbar from "@/src/components/land_page/Navbar";
import Footer from "@/src/components/land_page/Footer";
import ContactForm from "@/src/components/land_page/ContactForm";
import JsonLd from "@/src/components/seo/JsonLd";
import { buildPageMetadata, SITE_URL } from "@/src/lib/seo/site";
import { buildBreadcrumbSchema, ORG_ID, WEBSITE_ID } from "@/src/lib/seo/jsonLd";

const PAGE_PATH = "/cotizar-menu";

export const metadata: Metadata = buildPageMetadata({
  title: "Cotizá tu Menú Digital QR para Restaurantes y Bares",
  description:
    "Solicita una cotización a medida para el menú digital QR de tu restaurante, bar o cafetería. Armamos tu carta completa y aceptamos pagos internacionales.",
  path: PAGE_PATH,
});

export default function CotizarMenuPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${SITE_URL}${PAGE_PATH}#webpage`,
        url: `${SITE_URL}${PAGE_PATH}`,
        name: "Cotizá tu Menú Digital QR | QMenú",
        description:
          "Solicita un presupuesto personalizado para crear el menú digital con código QR de tu restaurante o negocio gastronómico.",
        inLanguage: "es-AR",
        isPartOf: { "@id": WEBSITE_ID },
        about: {
          "@type": "Service",
          name: "Diseño y armado de menú digital QR a medida",
          provider: { "@id": ORG_ID },
          areaServed: "Worldwide",
        },
      },
      buildBreadcrumbSchema([
        { name: "Inicio", path: "/" },
        { name: "Cotizar menú", path: PAGE_PATH },
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
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Cotizá tu menú digital QR para restaurantes y bares
                  </h1>
                  <p className="text-gray-600 text-base md:text-md lg:mx-0">
                    <strong>¿No sos de Argentina?</strong> No te preocupes, aceptamos pagos internacionales.
                    Contactate con nosotros para cotizar el plan que mejor se adapte a la carta digital de tu negocio gastronómico.
                  </p>
                </div>

                <ContactForm messagePlaceholder="Hola, quisiera tener mi menú listo con 50 platos." />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
