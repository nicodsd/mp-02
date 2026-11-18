"use client";
import { ArrowLeft } from 'lucide-react';
import Navbar from "@/src/components/land_page/Navbar";
import Footer from "@/src/components/land_page/Footer";
import Pricing from "@/src/components/land_page/Pricing";
import Link from 'next/link';

export default function PricingPage() {
    return (
        <>
            <div className="flex selection:bg-primary selection:text-white relative bg-background flex-col items-center w-full min-h-auto mb-20 md:mb-0">
                <Navbar isIndex={false} />
                <main className="grow pt-30 md:pt-40 pb-20 md:rounded-b-2xl bg-background w-full relative flex flex-col items-center md:max-w-7xl mx-auto px-4">
                    <div className="w-full">
                        <Link href="/guias" className="inline-flex items-center hover:text-orange-600 font-medium mb-3 transition-colors md:pl-12">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Guías / Cuanto cuesta crear un menú digital
                        </Link>
                        <Pricing className="pb-0" />
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
}
