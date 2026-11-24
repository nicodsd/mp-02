import type { Metadata } from "next";
import Index from "@/src/pagesComponents/Index";
import Footer from "@/src/layouts/Footer";
import NavBar from "@/src/layouts/NavBar";
import templates from "@/src/data/templates.json";
import JsonLd from "@/src/components/seo/JsonLd";
import { buildPageMetadata, SITE_URL } from "@/src/lib/seo/site";
import { buildBreadcrumbSchema, SOFTWARE_ID, WEBSITE_ID } from "@/src/lib/seo/jsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "Ejemplo de Menú Digital QR para Restaurantes",
  description:
    "Explora una demo interactiva de menú digital con código QR para restaurantes, bares y cafeterías. Prueba categorías, fotos, buscador y pedidos por WhatsApp.",
  path: "/ejemplo",
});

export default async function Page() {
  let user = null;
  const template = templates.find((t) => t.template_id === "magma") || templates[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/ejemplo#webpage`,
        url: `${SITE_URL}/ejemplo`,
        name: "Ejemplo de Menú Digital QR para Restaurantes | QMenú",
        description:
          "Demo interactiva de un menú digital QR para restaurantes, bares y cafeterías con pedidos por WhatsApp.",
        inLanguage: "es-AR",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": SOFTWARE_ID },
      },
      buildBreadcrumbSchema([
        { name: "Inicio", path: "/" },
        { name: "Ejemplo de Menú Digital", path: "/ejemplo" },
      ]),
    ],
  };

  return (
    <div className={`flex relative flex-col min-h-screen ${template.bgMenu}`}>
      <JsonLd data={jsonLd} />
      <h1 className="sr-only">
        Ejemplo de Menú Digital QR para Restaurantes, Bares y Cafeterías
      </h1>
      <NavBar
        state={0}
        bttn={true}
        cookie={undefined}
        photo={user!}
        template={template}
        user={undefined}
      />
      <Index template={template} />
      <Footer template={template} />
    </div>
  );
}