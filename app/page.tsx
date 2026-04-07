import Navbar from "@/src/components/land_page/Navbar";
import Hero from "@/src/components/land_page/Hero";
import Features from "@/src/components/land_page/Features";
import Showcase from "@/src/components/land_page/Showcase";
import Pricing from "@/src/components/land_page/Pricing";
import Contact from "@/src/components/land_page/Contact";
import Footer from "@/src/layouts/Footer";
//import Testimonials from "@/src/components/land_page/Testimonials";

export default function Page() {
  return (
    <>
      <div className="flex relative bg-background-2 flex-col items-center w-full min-h-screen">
        <Navbar />
        <main className="grow rounded-b-2xl bg-white w-full relative flex flex-col items-center md:max-w-7xl mx-auto px-6 md:px-14 border border-gray-300">
          <Hero />
          <Features />
          <Showcase />
          <Pricing />
          <Contact />
        </main>
      </div>
      <Footer />
    </>
  );
}