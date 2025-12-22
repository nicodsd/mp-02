"use client";
import Cards from "@/src/components/FoodsCards";
import Loading from "@/src/skeleton/Loading";
import { FaEdit, FaSearch, FaTrash, FaPlus } from 'react-icons/fa';
type RenderCardsProps = {
    foods: any[];
    count?: number;
    context?: boolean;
};
export default function RenderCards({ foods, count, context }: RenderCardsProps) {
    return (
        <div className="w-full flex flex-col gap-1">
            {
                foods.length < 0 ? (
                    <Loading count={count ?? 6} />
                ) : (
                    foods.map((food) => (
                        <>
                            <div key={food._id} className={`flex justify-between items-center ${context ? "bg-[#f0f0f093] rounded-xl" : ""}`}>
                                <div className="w-full">
                                    <Cards name={food.name} photo={food.photo} description={food.description} price={food.price} context={context} />
                                </div>
                                {context && (
                                    <div className="flex flex-col md:flex-row items-center gap-2 md:w-[15%] w-[20%] px-3 rounded-r-xl justify-center h-full bg-[#f0f0f0ec]">
                                        <button className="border-gray-300 bg-gray-50 text-xs h-10 border text-gray-500 px-2 md:px-4 py-3 gap-2 hover:border-gray-500 hover:bg-gray-100 flex items-center justify-center rounded-xl hover:text-gray-500 transition-transform cursor-pointer"><FaEdit size={15} /></button>
                                        <button className="border-red-300 bg-red-50 text-xs h-10 border text-red-500 px-2 md:px-4 py-3 gap-2 hover:border-red-500 hover:bg-red-100 flex items-center justify-center rounded-xl hover:text-red-500 transition-transform cursor-pointer"><FaTrash size={15} /></button>
                                    </div>
                                )}
                            </div>
                        </>
                    ))
                )
            }
        </div>
    );
}