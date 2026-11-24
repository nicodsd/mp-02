import type { Metadata } from "next";

export const SITE_URL = "https://qmenu.digital";
export const SITE_NAME = "QMenú";
export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const canonicalUrl = path === "/" ? SITE_URL : `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "es_AR",
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: `${title} - ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [OG_IMAGE_URL],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
