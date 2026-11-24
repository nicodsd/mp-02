import type { Metadata } from "next";
import { ArrowLeft } from 'lucide-react';
import Navbar from "@/src/components/land_page/Navbar";
import Footer from "@/src/components/land_page/Footer";
import Pricing from "@/src/components/land_page/Pricing";
import Link from 'next/link';
import JsonLd from "@/src/components/seo/JsonLd";
import { buildPageMetadata } from "@/src/lib/seo/site";
import {
    buildArticleSchema,
    buildBreadcrumbSchema,
    buildOrganizationSchema,
    buildSoftwareApplicationSchema,
} from "@/src/lib/seo/jsonLd";

const PAGE_PATH = "/guias/cuanto-sale-crear-un-menu-digital";
const PAGE_TITLE = "Cuánto sale crear un menú digital QR para restaurantes: Planes y Precios";
const PAGE_DESC =
    "Conoce los planes y precios para crear el menú digital con código QR de tu restaurante, bar o cafetería. Empieza gratis y escala sin comisiones por pedido.";

export const metadata: Metadata = buildPageMetadata({
    title: PAGE_TITLE,
    description: PAGE_DESC,
    path: PAGE_PATH,
    type: "article",
    publishedTime: "2026-01-15",
    modifiedTime: "2026-03-01",
});

export default function PricingPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            buildOrganizationSchema(),
            buildSoftwareApplicationSchema(),
            buildBreadcrumbSchema([
                { name: "Inicio", path: "/" },
                { name: "Guías", path: "/guias" },
                { name: "Cuánto sale crear un menú digital", path: PAGE_PATH },
            ]),
            buildArticleSchema({
                headline: PAGE_TITLE,
                description: PAGE_DESC,
                path: PAGE_PATH,
                datePublished: "2026-01-15",
                dateModified: "2026-03-01",
            }),
        ],
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            <div className="flex selection:bg-primary selection:text-white relative bg-background flex-col items-center w-full min-h-auto mb-20 md:mb-0">
                <Navbar isIndex={false} />
                <main className="grow pt-30 md:pt-40 pb-20 md:rounded-b-2xl bg-background w-full relative flex flex-col items-center md:max-w-7xl mx-auto px-4">
                    <div className="w-full">
                        <Link href="/guias" className="inline-flex items-center hover:text-orange-600 font-medium mb-3 transition-colors md:pl-12">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Guías / Cuánto cuesta crear un menú digital
                        </Link>
                        <div className="text-center md:text-start mt-6 mb-4 px-2 md:pl-12">
                            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 text-balance mb-4">
                                ¿Cuánto sale crear un menú digital QR para tu restaurante?
                            </h1>
                            <p className="text-base text-zinc-600 text-balance">
                                Elegí el plan ideal para tu local gastronómico, registrate y empezá a publicar tu carta digital en minutos.
                            </p>
                        </div>
                        <Pricing showHeader={false} className="pb-0" />
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
}
