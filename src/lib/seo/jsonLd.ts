import { OG_IMAGE_URL, SITE_NAME, SITE_URL } from "./site";

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SOFTWARE_ID = `${SITE_URL}/#software`;

export function buildOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    alternateName: ["QMenu", "qmenu.digital"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/android-chrome-512x512.png`,
      width: 512,
      height: 512,
    },
  };
}

export function buildWebSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    alternateName: ["QMenu", "qmenu.digital"],
    url: SITE_URL,
    inLanguage: "es-AR",
    publisher: { "@id": ORG_ID },
  };
}

export function buildSoftwareApplicationSchema() {
  return {
    "@type": "SoftwareApplication",
    "@id": SOFTWARE_ID,
    name: SITE_NAME,
    alternateName: "QMenu",
    url: SITE_URL,
    image: OG_IMAGE_URL,
    description:
      "Plataforma web para crear menús digitales con código QR para restaurantes, bares, cafeterías y food trucks con pedidos por WhatsApp.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    inLanguage: "es",
    provider: { "@id": ORG_ID },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "0",
      highPrice: "49000",
      priceCurrency: "ARS",
      offerCount: 3,
    },
  };
}

export function buildFaqSchema(
  faqs: ReadonlyArray<{ question: string; answer: string }>
) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(
  items: ReadonlyArray<{ name: string; path: string }>
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? SITE_URL : `${SITE_URL}${item.path}`,
    })),
  };
}

export function buildArticleSchema({
  headline,
  description,
  path,
  datePublished,
  dateModified,
}: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
}) {
  const url = `${SITE_URL}${path}`;
  return {
    "@type": "Article",
    headline,
    description,
    url,
    mainEntityOfPage: url,
    image: OG_IMAGE_URL,
    inLanguage: "es-AR",
    datePublished,
    dateModified,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

export function buildHowToSchema({
  name,
  description,
  path,
  steps,
}: {
  name: string;
  description: string;
  path: string;
  steps: ReadonlyArray<{ name: string; text: string }>;
}) {
  return {
    "@type": "HowTo",
    name,
    description,
    image: OG_IMAGE_URL,
    inLanguage: "es-AR",
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      url: `${SITE_URL}${path}#paso-${index + 1}`,
    })),
  };
}
