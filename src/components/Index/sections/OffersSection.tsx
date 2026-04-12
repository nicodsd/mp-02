import Carousel from "@/src/components/Index/sections/Carousel";

export default function OffersSection({ foods, template }: { foods: any[]; template: any }) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <h2 className={`text-xl ml-2 font-normal ${template?.textColorOpacity || "text-gray-700/50"} text-start`}>
                    Ofertas <span className={`text-xl font-black ${template?.icons || "text-primary"} italic`}>%OFF</span>
                </h2>
            </div>

            <div className="w-full overflow-hidden">
                <Carousel foods={foods} template={template} />
            </div>
        </div>
    );
}