"use client";
import FoodsCardsExample from "@/src/components/foods_cards/FoodsCardsExample";
import Loading from "@/src/skeleton/Loading";
import { FaEdit, FaTrash } from 'react-icons/fa';
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

                        <div key={food._id} className={`flex justify-between items-center`}>
                            <div className={`w-full ${context ? "border-l border-t border-b border-gray-300 rounded-l-xl h-40" : ""}`}>
                                <FoodsCardsExample name={food.name} photo={food.photo} description={food.description} price={food.price} context={context} />
                            </div>
                            {context && (
                                <div className="flex flex-row items-center md:w-[15%] w-fit justify-center h-full">
                                    <div className="flex h-full items-center justify-center rounded-r-xl bg-gray-50 px-2 border-r border-t border-b border-gray-300 w-full">
                                        <button className="border-gray-300 bg-gray-50 text-xs h-10 border text-gray-500 px-2 md:px-4 py-3 gap-2 hover:border-gray-500 hover:bg-gray-100 flex items-center justify-center rounded-xl hover:text-gray-500 transition-transform cursor-pointer"><FaEdit size={15} />Editar</button>
                                    </div>
                                    <button className="bg-white text-xs h-10 text-red-500 px-2 md:px-4 flex items-center justify-center rounded-xl transition-transform cursor-pointer"> Eliminar</button>
                                </div>
                            )}
                        </div>

                    ))
                )
            }
        </div>
    );
}