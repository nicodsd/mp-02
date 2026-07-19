"use client";
import FoodCard from '@/src/components/modals/cards/FoodCard';
import { FaWhatsapp, FaPlus, FaMinus, FaArrowRight, FaUser, FaMapMarkerAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useCartStoreExample } from '@/src/lib/useCartStoreExample';
import { useState } from 'react';

interface CartModalExampleProps {
    isOpen: boolean;
    onClose: () => void;
    template: any;
    allFoods: any[];
}

export default function CartModalExample({ isOpen, onClose, template, allFoods = [] }: CartModalExampleProps) {
    const { selectedIds, quantities, removeId, incrementQuantity, decrementQuantity, clearCart } = useCartStoreExample();

    const [deliveryType, setDeliveryType] = useState<'takeaway' | 'delivery'>('takeaway');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [step, setStep] = useState(1);

    const handleClose = () => {
        setStep(1);
        onClose();
    };

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
    const totalItemsCount = selectedFoods.reduce((acc, food) => acc + (quantities[food._id] || 1), 0);

    const handleEncargar = () => {
        if (selectedFoods.length === 0) return;

        if (deliveryType === 'delivery' && step === 1) {
            setStep(2);
            return;
        }

        if (deliveryType === 'delivery' && (!name.trim() || !address.trim())) {
            alert("Por favor, completa tu nombre y dirección para realizar el envío.");
            return;
        }

        let deliveryInfo = "";
        if (deliveryType === 'delivery') {
            deliveryInfo = `\n\n*Datos de Envío:*\nNombre: ${name}\nDirección: ${address}`;
        } else {
            deliveryInfo = `\n\n*Retiro por local*`;
        }

        const message = `Hola! Quisiera pedirte:\n${selectedFoods.map((food: any) => `${quantities[food._id] || 1}x ${food.name}`).join("\n")}${deliveryInfo}\nMuchas Gracias!`;

        window.open(`https://wa.me/5493851234567?text=${encodeURIComponent(message)}`, "_blank");
        handleClose();
    };

    return (
        <div
            className="fixed inset-0 z-1000 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300"
            onClick={handleClose}
        >
            <div
                className={`${template?.backgroundColor || "bg-background"} w-full sm:w-[500px] h-[88vh] sm:h-[700px] p-1 rounded-t-2xl sm:rounded-2xl pb-2 flex flex-col shadow-2xl relative`}
                onClick={e => e.stopPropagation()}
            >
                {/* Header dinámico */}
                <div className={`flex justify-between items-center ${template?.textColor || "text-gray-700"} p-2`}>
                    <div className="flex items-center gap-2">
                        <h2 className={`text-2xl font-bold ${template?.textColor || "text-gray-700"} transition-all duration-200`}>
                            {step === 1 ? "Mis Pedidos" : "¿A dónde te lo enviamos?"}
                        </h2>
                        {step === 1 && (
                            <span className={`text-sm font-bold ${template?.backgroundColor2 || "bg-gray-300"} ${template?.accentColors?.[1] || "text-gray-700"} rounded-full w-7 h-7 flex items-center justify-center`}>
                                {totalItemsCount}
                            </span>
                        )}
                    </div>
                    <div className="flex justify-end gap-2">
                        {step === 1 && (
                            <button
                                disabled={selectedFoods.length === 0}
                                onClick={() => clearCart()}
                                className={`rounded-full text-sm flex items-center justify-center disabled:text-gray-400 disabled:cursor-not-allowed font-bold hover:bg-gray-200 transition-colors ${template?.textColor || "text-primary"}`}
                            >
                                Borrar todo
                            </button>
                        )}
                        <button onClick={handleClose} className={`rounded-full w-10 h-10 text-xl flex items-center justify-center font-bold hover:bg-gray-200 transition-colors ${template?.textColor || "text-gray-700"}`}>
                            <IoClose className="text-2xl" />
                        </button>
                    </div>
                </div>

                {/* Lista de productos / Formulario */}
                <div className="flex-1 px-1 overflow-y-auto flex flex-col gap-1">
                    {step === 1 ? (
                        selectedFoods.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-70">
                                <span className="text-5xl mb-4">🍽️</span>
                                <p className={`text-lg font-medium ${template?.textColor || "text-gray-700"}`}>¿Aún no sabes qué comer?</p>
                            </div>
                        ) : (
                            selectedFoods.map((food: any) => (
                                <div key={food._id} className="group flex items-center w-full gap-2">
                                    <div className="flex-1 min-w-0">
                                        <FoodCard food={food} template={template} />
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-1 min-w-[70px]">
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
                                            className="text-red-500 cursor-pointer text-[13px] uppercase tracking-wider w-fit h-fit flex items-center justify-center font-black transition-colors pointer-events-auto hover:text-red-600"
                                            title="Quitar del carrito"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))
                        )
                    ) : (
                        <div className="flex flex-col gap-4 p-4 h-full justify-center">
                            <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
                                <div className="relative w-full flex items-center gap-2">
                                    <span className="text-gray-400 text-lg">
                                        <FaUser size={24} />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Tu Nombre"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className={`w-full p-3 py-5 text-lg border ${template?.border || "border-gray-300"} rounded-lg bg-transparent ${template?.textColor || "text-gray-700"} outline-none focus:border-primary`}
                                    />
                                </div>
                                <div className="relative w-full flex items-center gap-2">
                                    <span className="text-gray-400 text-lg">
                                        <FaMapMarkerAlt size={24} />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Tu Dirección"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className={`w-full p-3 py-5 text-lg border ${template?.border || "border-gray-300"} rounded-lg bg-transparent ${template?.textColor || "text-gray-700"} outline-none focus:border-primary`}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={`flex flex-col items-center justify-center gap-4 p-2 border-t ${template?.border || "border-gray-300"}`}>
                    {step === 1 && (
                        <div className="w-full flex flex-col gap-2">
                            <div className="flex justify-center gap-6 py-1">
                                <label className={`flex items-center gap-3 ${template?.textColor || "text-gray-700"} cursor-pointer font-semibold text-base select-none`}>
                                    <input
                                        type="radio"
                                        checked={deliveryType === 'takeaway'}
                                        onChange={() => setDeliveryType('takeaway')}
                                        className="accent-green-600 scale-125 cursor-pointer"
                                    />
                                    Retiro en local
                                </label>
                                <label className={`flex items-center gap-3 ${template?.textColor || "text-gray-700"} cursor-pointer font-semibold text-base select-none`}>
                                    <input
                                        type="radio"
                                        checked={deliveryType === 'delivery'}
                                        onChange={() => setDeliveryType('delivery')}
                                        className="accent-green-600 scale-125 cursor-pointer"
                                    />
                                    Envío a domicilio
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col items-center justify-center">
                        <h4 className={`text-3xl font-bold ${template?.textColor || "text-gray-700"}`}>
                            Total: {formatearPrecio(selectedFoods.reduce((acc, food) => acc + food.price * (quantities[food._id] || 1), 0))}
                        </h4>
                        <span className={`text-sm font-bold ${template?.textColor || "text-gray-700"}`}>*Los precios no incluyen delivery*</span>
                    </div>

                    <div className="flex gap-4 justify-center items-center w-full">
                        {step === 2 && (
                            <button onClick={() => setStep(1)} className={`px-6 h-14 flex items-center justify-center gap-2 text-lg cursor-pointer bg-gray-200 border-2 ${template?.border || "border-gray-400"} ${template?.textColor || "text-gray-700"} font-bold rounded-lg hover:bg-gray-300 transition-colors`}>
                                Volver
                            </button>
                        )}
                        <button
                            disabled={selectedFoods.length === 0}
                            onClick={handleEncargar}
                            className={`w-fit px-8 sm:px-14 h-14 flex items-center justify-center gap-2 text-lg enabled:cursor-pointer disabled:bg-gray-400 bg-green-500 ${template?.border || "border-transparent"} text-white font-bold rounded-lg transition-all hover:bg-green-600 disabled:cursor-not-allowed`}
                        >
                            {deliveryType === 'delivery' && step === 1 ? (
                                <>Continuar <FaArrowRight /></>
                            ) : (
                                <>Encargar comida <FaWhatsapp size={26} color="white" /></>
                            )}
                        </button>
                    </div>
                    <span className={`text-center text-[10px] leading-none sm:px-10 sm:text-xs ${template?.textColorOpacity || "text-gray-700/50"}`}>
                        1. Al presionar "Encargar comida" te enviaremos a la aplicación de WhatsApp para tomar tu pedido.
                        <br />
                        2. Una vez en WhatsApp, solo debes presionar el botón de enviar para confirmar tu pedido.
                    </span>
                </div>
            </div>
        </div>
    );
}