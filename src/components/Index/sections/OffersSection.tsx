import Carousel from "@/src/components/Index/sections/Carousel";
import { FaFire } from "react-icons/fa";
export default function OffersSection({ foods, template }: { foods: any; template: any }) {
    if (!Array.isArray(foods)) { return null; }
    const hasPromos = foods.some((food) => food.is_promo);
    if (!hasPromos) return null;
    return (
        <section aria-label="Ofertas" className="flex flex-col gap-1 w-full pt-4">
            <div className="flex items-center gap-1">
                <h2 className={`text-xl ml-2 font-normal ${template?.textColorOpacity || "text-gray-700/50"} text-start`}>
                    Ofertas
                </h2>
                <FaFire className={template?.icons || "text-primary"} size={16} />
            </div>
            <div className="w-full overflow-hidden">
                <Carousel foods={foods} template={template} />
            </div>
        </section>
    );
} 