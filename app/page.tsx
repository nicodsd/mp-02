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

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "name": "QMenú",
        "alternateName": ["QMenu", "qmenu.digital"],
        "url": "https://qmenu.digital"
      },
      {
        "@type": "SoftwareApplication",
        "name": "QMenú",
        "alternateName": "QMenu",
        "url": "https://qmenu.digital",
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
        "alternateName": "QMenu",
        "url": "https://qmenu.digital",
        "logo": "https://qmenu.digital/android-chrome-512x512.png"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Qué es esta plataforma y cómo me ayuda?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Nuestra plataforma te permite crear tu propio menú digital en minutos. Agilizas la toma de pedidos, mejoras la experiencia de tus clientes y le das a tu negocio una imagen mucho más profesional."
            }
          },
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
            "name": "¿Puedo personalizar el diseño de mi menú?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "En tu panel de usuario cuentas con una sección de Personalización donde puedes elegir entre diferentes diseños, opciones y colores para que el menú se adapte a tu marca."
            }
          },
          {
            "@type": "Question",
            "name": "¿Puedo modificar los precios o agregar promociones en cualquier momento?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sí, todos los cambios que hagas en el panel se reflejan en tiempo real. Ahorras en costos de impresión y ofreces pedidos directos al WhatsApp."
            }
          },
          {
            "@type": "Question",
            "name": "¿Necesito descargar alguna aplicación o tienen que hacerlo mis clientes?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, la plataforma es 100% web. Tanto tú como tus clientes acceden directamente desde el navegador de cualquier celular, tablet o computadora sin instalar nada."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="overflow-x-hidden w-full max-w-[100vw]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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