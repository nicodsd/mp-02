import Carousel from "@/src/components/Index/sections/Carousel";

export default function AdminOffers({ foods }: { foods: any[] }) {
    const hasPromos = foods.some((food) => food.is_promo);
    if (!hasPromos) return null;

    return (
        <section aria-label="Ofertas" className="flex flex-col gap-1 w-full pt-4">
            <div className="flex items-center gap-2">
                <h2 className="text-xl ml-2 font-normal text-gray-600 text-start">
                    Ofertas <span className="text-xl font-black text-red-600 italic">%OFF</span>
                </h2>
            </div>
            <Carousel foods={foods} />
        </section>
    );
}