import React from "react";
import Carousel from "@/src/components/Index/sections/Carousel";

export default function OffersSection({ foods }: { foods: any[] }) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <h2 className="text-xl ml-2 font-normal text-gray-600 text-start">
                    Ofertas <span className="text-xl font-black text-red-600 italic">%OFF</span>
                </h2>
            </div>

            <div className="w-full overflow-hidden">
                <Carousel foods={foods} />
            </div>
        </div>
    );
}