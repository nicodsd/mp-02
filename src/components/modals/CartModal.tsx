"use client";
import { useCartStore } from '@/src/lib/useCartStore';
import { useFoodStore } from '@/src/lib/useFoodStore';
import FoodCard from '@/src/components/modals/cards/FoodCard';
import { FaWhatsapp, FaPlus, FaMinus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export default function CartModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { selectedIds, quantities, removeId, incrementQuantity, decrementQuantity } = useCartStore();
    const { foods } = useFoodStore();

    if (!isOpen) return null;

    const selectedFoods = foods.filter((food: any) => selectedIds.includes(String(food._id)));

    const handleEncargar = (ids: string[]) => {
        if (selectedFoods.length === 0) return;
        const message = `Hola! Quisiera pedirte:\n${selectedFoods.map((food: any) => `${quantities[food._id] || 1}x ${food.name}`).join("\n")} \nMuchas Gracias!`;
        window.open(`https://wa.me/5493855349557?text=${encodeURIComponent(message)}`, "_blank");
    }

    return (
        <div className="fixed inset-0 z-1000 flex items-end justify-center sm:items-center transition-all duration-300 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-background w-full sm:w-[500px] h-[80vh] sm:h-[600px] p-1 rounded-t-2xl pb-2 flex flex-col shadow-2xl relative"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-2">
                    <h2 className="text-2xl font-bold text-gray-800">Mis Pedidos</h2>
                    <button onClick={onClose} className="text-gray-600 rounded-full w-10 h-10 text-xl flex items-center justify-center font-bold hover:bg-gray-200 transition-colors">
                        <IoClose className="text-2xl" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto flex flex-col gap-1">
                    {selectedFoods.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-70">
                            <span className="text-5xl mb-4">🍽️</span>
                            <p className="text-gray-500 text-lg font-medium">¿Aun no sabes qué comer?</p>
                        </div>
                    ) : (
                        selectedFoods.map((food: any) => (
                            <div key={food._id} className="group flex items-center w-full gap-2">
                                <div className="flex-1 min-w-0">
                                    <FoodCard food={food} />
                                </div>
                                <div className="flex flex-col items-center justify-center gap-2 min-w-[70px]">
                                    <div className="flex items-center gap-2 bg-background rounded-lg px-1 py-1 shadow-inner">
                                        <button
                                            onClick={() => decrementQuantity(food._id)}
                                            className="w-7 h-7 flex items-center justify-center border border-gray-300 cursor-pointer shadow bg-white rounded-md text-gray-700 font-bold active:scale-95 transition-transform"
                                        >
                                            <FaMinus />
                                        </button>
                                        <span className="font-bold text-sm w-4 text-center">
                                            {quantities[food._id] || 1}
                                        </span>
                                        <button
                                            onClick={() => incrementQuantity(food._id)}
                                            className="w-7 h-7 flex items-center justify-center border border-gray-300 cursor-pointer shadow bg-white rounded-md text-gray-700 font-bold active:scale-95 transition-transform"
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeId(food._id)}
                                        className="text-red-500 cursor-pointer text-[10px] uppercase tracking-wider w-fit h-fit flex items-center justify-center font-bold transition-colors pointer-events-auto hover:text-red-600"
                                        title="Quitar del carrito"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="flex flex-col items-center justify-center gap-2 p-4 border-t border-gray-300">
                    <button disabled={selectedFoods.length === 0} onClick={() => { handleEncargar(selectedIds) }} className="w-fit px-10 mx-auto h-12 flex items-center justify-center gap-2 text-lg cursor-pointer disabled:bg-gray-400 bg-primary text-white font-bold rounded-lg">
                        <FaWhatsapp /> Encargar comida
                    </button>
                    <span className='text-center text-gray-500 text-sm'> 1. Al presionar "Encargar comida" te enviaremos a la aplicación de WhatsApp para tomar tu pedido.
                        <br />
                        2. Una vez en WhatsApp, solo debes presionar el botón de enviar para confirmar tu pedido.
                        <br />
                        <span className='text-gray-500 text-sm font-bold'>Los precios no incluyen delivery</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
