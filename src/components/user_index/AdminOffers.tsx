import Carousel from "@/src/components/Index/sections/Carousel";

export default function AdminOffers({ foods, template }: { foods: any[], template: any }) {
    const hasPromos = foods.some((food) => food.is_promo);
    if (!hasPromos) return null;

    return (
        <section aria-label="Ofertas" className="flex flex-col gap-1 w-full pt-4">
            <div className="flex items-center gap-2">
                <h2 className={`text-xl ml-2 font-normal ${template?.textColor} text-start`}>
                    Ofertas <span className={`text-xl font-black ${template?.icons} italic`}>%OFF</span>
                </h2>
            </div>
            <div className="w-full overflow-hidden">
                <Carousel foods={foods} template={template} />
            </div>
        </section>
    );
}