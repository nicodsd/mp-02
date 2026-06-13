import Navbar from "@/src/components/land_page/Navbar";
import Hero from "@/src/components/land_page/Hero";
import Features from "@/src/components/land_page/Features";
import GuidePreview from "@/src/components/land_page/GuidePreview";
import Showcase from "@/src/components/land_page/Showcase";
import Pricing from "@/src/components/land_page/Pricing";
import Contact from "@/src/components/land_page/Contact";
import Footer from "@/src/components/land_page/Footer";
import FAQ from "@/src/components/land_page/FAQ";
import MiddleSection from "@/src/components/land_page/MiddleSection";
import MetricsSection from "@/src/components/land_page/MetricsSection";
import TestimonialsSection from "@/src/components/land_page/TestimonialsSection";
import MPRedirect from '@/src/components/navigation/MPRedirect';
//import Testimonials from "@/src/components/land_page/Testimonials";

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "QMenú",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "ARS"
        }
      },
      {
        "@type": "Organization",
        "name": "QMenú",
        "url": "https://qmenu.digital",
        "logo": "https://qmenu.digital/icon.svg"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Cómo funciona el menú digital para restaurantes?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Te registras gratis, cargas tus platos y generamos tu código QR al instante. Tus clientes lo escanean y ven tu menú en sus celulares sin instalar nada."
            }
          },
          {
            "@type": "Question",
            "name": "¿Qué ventajas tiene un menú QR gratis?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ahorras en costos de impresión, actualizas precios en tiempo real y ofreces una experiencia más moderna con pedidos directos al WhatsApp."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex selection:bg-primary selection:text-white relative bg-background-2 flex-col items-center w-full min-h-screen">
        <Navbar isIndex={true} />
        <MPRedirect />
        <main className="grow md:rounded-b-2xl md:border-x border-gray-300 bg-background w-full relative flex flex-col items-center md:max-w-7xl mx-auto px-4 border-b md:px-14">
          <Hero />
          <MiddleSection />
          <Features />
          <GuidePreview />
          <Showcase />
          <Pricing />
          <MetricsSection />
          <TestimonialsSection />
          <FAQ />
          <Contact />
        </main>
      </div>
      <Footer />
    </>
  );
} 