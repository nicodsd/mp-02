"use client";
import FoodCard from '@/src/components/modals/cards/FoodCard';
import { FaWhatsapp, FaPlus, FaMinus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useCartStoreExample } from '@/src/lib/useCartStoreExample';

export default function CartModalExample({ isOpen, onClose, template, allFoods }: { isOpen: boolean; onClose: () => void, template: any, allFoods: any[] }) {
    const { selectedIds, quantities, removeId, incrementQuantity, decrementQuantity, clearCart } = useCartStoreExample();

    function formatearPrecio(precio: number | string) {
        const value = typeof precio === "string" ? Number(precio) : precio;
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
        }).format(value);
    }
    if (!isOpen) return null;

    const selectedFoods = allFoods.filter((food: any) => selectedIds.includes(String(food._id)));

    const handleEncargar = (ids: string[]) => {
        if (selectedFoods.length === 0) return;
        const message = `Hola! Quisiera pedirte:\n${selectedFoods.map((food: any) => `${quantities[food._id] || 1}x ${food.name}`).join("\n")} \nMuchas Gracias!`;
        window.open(`https://wa.me/5493851234567?text=${encodeURIComponent(message)}`, "_blank");
    }

    return (
        <div className={`fixed inset-0 z-1000 flex items-end justify-center ${template?.backgroundColor || "bg-background"} sm:items-center transition-all duration-300 bg-black/50 backdrop-blur-sm`} onClick={onClose}>
            <div
                className={`${template?.backgroundColor || "bg-background"} w-full sm:w-[500px] h-[80vh] sm:h-[600px] p-1 rounded-t-2xl pb-2 flex flex-col shadow-2xl relative`}
                onClick={e => e.stopPropagation()}
            >
                <div className={`flex justify-between items-center ${template?.textColor || "text-gray-700"} p-2`}>
                    <div className="flex items-center gap-2">
                        <h2 className={`text-2xl font-bold ${template?.textColor || "text-gray-700"}`}>Mis Pedidos</h2>
                        <span className={`text-sm font-bold ${template?.backgroundColor2 || "bg-gray-300"} ${template?.accentColors?.[1] || "text-gray-700"} rounded-full w-7 h-7 flex items-center justify-center`}>{Object.keys(quantities).length}</span>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button disabled={Object.keys(quantities).length === 0} onClick={() => clearCart()} className={`rounded-full text-sm flex items-center justify-center disabled:text-gray-400 disabled:cursor-not-allowed font-bold hover:bg-gray-200 transition-colors ${template?.textColor || "text-primary"}`}>
                            Borrar todo
                        </button>
                        <button onClick={onClose} className={`rounded-full w-10 h-10 text-xl flex items-center justify-center font-bold hover:bg-gray-200 transition-colors ${template?.textColor || "text-gray-700"}`}>
                            <IoClose className="text-2xl" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 px-1 overflow-y-auto flex flex-col gap-1">
                    {selectedFoods.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-70">
                            <span className="text-5xl mb-4">🍽️</span>
                            <p className={`text-lg font-medium ${template?.textColor || "text-gray-700"}`}>¿Aun no sabes qué comer?</p>
                        </div>
                    ) : (
                        selectedFoods.map((food: any) => (
                            <div key={food._id} className="group flex items-center w-full gap-2">
                                <div className="flex-1 min-w-0">
                                    <FoodCard food={food} template={template} />
                                </div>
                                <div className="flex flex-col items-center justify-center gap-2 min-w-[70px]">
                                    <div className={`flex items-center gap-2 ${template?.backgroundColor2 || "bg-background"} rounded-lg px-1 py-1 shadow-inner`}>
                                        <button
                                            onClick={() => decrementQuantity(food._id)}
                                            className={`w-7 h-7 flex ${template?.backgroundColor || "bg-background"} items-center justify-center border ${template?.border || "border-gray-200"} cursor-pointer shadow rounded-md ${template?.textColor || "text-gray-700"} font-bold active:scale-95 transition-transform`}
                                        >
                                            <FaMinus />
                                        </button>
                                        <span className={`font-bold text-sm w-4 text-center ${template?.textColor || "text-gray-700"}`}>
                                            {quantities[food._id] || 1}
                                        </span>
                                        <button
                                            onClick={() => incrementQuantity(food._id)}
                                            className={`w-7 h-7 flex ${template?.backgroundColor || "bg-background"} items-center justify-center border ${template?.border || "border-gray-200"} cursor-pointer shadow rounded-md ${template?.textColor || "text-gray-700"} font-bold active:scale-95 transition-transform`}
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeId(food._id)}
                                        className={`text-red-500 cursor-pointer text-[13px] uppercase tracking-wider w-fit h-fit flex items-center justify-center font-black transition-colors pointer-events-auto hover:text-red-600`}
                                        title="Quitar del carrito"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className={`flex flex-col items-center justify-center gap-4 p-4 border-t ${template?.border || "border-gray-300"}`}>
                    <div className="flex flex-col items-center justify-center">
                        <h4 className={`text-3xl font-bold ${template?.textColor || "text-gray-700"}`}>Total: {formatearPrecio(selectedFoods.reduce((acc, food) => acc + food.price * (quantities[food._id] || 1), 0))}</h4>
                        <span className={`text-sm font-bold ${template?.textColor || "text-gray-700"}`}>*Los precios no incluyen delivery*</span>
                    </div>

                    <button disabled={selectedFoods.length === 0} onClick={() => { handleEncargar(selectedIds) }} className={`w-fit px-14 mx-auto h-14 flex items-center justify-center gap-2 text-lg enabled:cursor-pointer disabled:bg-gray-400 bg-green-500 border-2 ${template?.border || "border-black"} text-white font-bold rounded-lg`}>
                        <FaWhatsapp size={26} color="white" /> Encargar comida
                    </button>
                    <span className={`text-center text-sm ${template?.textColorOpacity || "text-gray-700/50"}`}> 1. Al presionar "Encargar comida" te enviaremos a la aplicación de WhatsApp para tomar tu pedido.
                        <br />
                        2. Una vez en WhatsApp, solo debes presionar el botón de enviar para confirmar tu pedido.
                    </span>
                </div>
            </div>
        </div>
    );
}
