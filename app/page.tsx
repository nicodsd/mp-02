import type { Metadata } from "next";
import WelcomeModal from "@/src/components/land_page/WelcomeModal";
import Navbar from "@/src/components/land_page/Navbar";
import Hero from "@/src/components/land_page/Hero";
import VideoSection from "@/src/components/land_page/VideoSection";
import Features from "@/src/components/land_page/Features";
import GuidePreview from "@/src/components/land_page/GuidePreview";
import Showcase from "@/src/components/land_page/Showcase";
import Pricing from "@/src/components/land_page/Pricing";
import Contact from "@/src/components/land_page/Contact";
import Footer from "@/src/components/land_page/Footer";
import FAQ from "@/src/components/land_page/FAQ";
import MiddleSection from "@/src/components/land_page/MiddleSection";
import SliderBanner from "@/src/components/land_page/SliderBanner";
import MetricsSection from "@/src/components/land_page/MetricsSection";
import TestimonialsSection from "@/src/components/land_page/TestimonialsSection";
import MPRedirect from '@/src/components/navigation/MPRedirect';
import EntrepreneurCommitment from "@/src/components/land_page/EntrepreneurCommitment";
import JsonLd from "@/src/components/seo/JsonLd";
import {
  buildFaqSchema,
  buildOrganizationSchema,
  buildSoftwareApplicationSchema,
  buildWebSiteSchema,
} from "@/src/lib/seo/jsonLd";
import { HOME_FAQS } from "@/src/data/faqs";

export const metadata: Metadata = {
  title: {
    absolute: "QMenú | Menú Digital QR Gratis para Restaurantes y Bares",
  },
  description:
    "Crea tu menú digital QR gratis para restaurantes, bares y cafeterías en minutos. Actualiza precios en tiempo real y recibe pedidos directo en WhatsApp sin comisiones.",
  alternates: {
    canonical: "/",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationSchema(),
      buildWebSiteSchema(),
      buildSoftwareApplicationSchema(),
      buildFaqSchema(HOME_FAQS),
    ],
  };

  return (
    <div className="overflow-x-hidden w-full max-w-[100vw]">
      <JsonLd data={jsonLd} />
      <div className="flex selection:bg-primary selection:text-white relative flex-col items-center w-full min-h-screen">
        <Navbar isIndex={true} />
        <MPRedirect />
        <main className="grow md:rounded-b-2xl bg-background w-full relative flex flex-col items-center md:max-w-7xl mx-auto px-4">
          {/*  <WelcomeModal /> */}
          <Hero />
          <SliderBanner />
          <VideoSection />
          <Features />
          <GuidePreview />
          <MetricsSection />
          <TestimonialsSection />
          <Showcase />
          <EntrepreneurCommitment />
          <Pricing />
          <FAQ />
          <Contact />
        </main>
      </div>
      <Footer />
    </div>
  );
} 