import Navbar from "@/src/components/land_page/Navbar";
import Hero from "@/src/components/land_page/Hero";
import Features from "@/src/components/land_page/Features";
import Showcase from "@/src/components/land_page/Showcase";
import Pricing from "@/src/components/land_page/Pricing";
import Contact from "@/src/components/land_page/Contact";
import Footer from "@/src/components/land_page/Footer";
import FAQ from "@/src/components/land_page/FAQ";
//import Testimonials from "@/src/components/land_page/Testimonials";

export default function Page() {
  return (
    <>
      <div className="flex relative bg-background-2 flex-col items-center w-full min-h-screen">
        <Navbar />
        <main className="grow md:rounded-b-2xl border-x border-gray-300 bg-background w-full relative flex flex-col items-center md:max-w-7xl mx-auto px-4 border-b md:px-14 md:shadow">
          <Hero />
          <Features />
          <Showcase />
          <Pricing />
          <FAQ />
          <Contact />
        </main>
      </div>
      <Footer />
    </>
  );
} 