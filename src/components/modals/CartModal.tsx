"use client";
import dynamic from "next/dynamic";
import FoodCard from '@/src/components/modals/cards/FoodCard';
import { FaWhatsapp, FaPlus, FaMinus, FaArrowRight, FaUser, FaMapMarkerAlt, FaRegCommentDots, FaArrowLeft, FaCheck, FaStore, FaMotorcycle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useCartStore } from '@/src/lib/useCartStore';
import { useState, useCallback } from 'react';
import { submitOrderToBackend, OrderPayload } from '@/src/utils/orders';

const LocationMapPicker = dynamic(
    () => import('@/src/components/modals/map/LocationMapPicker'),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full min-h-[280px] rounded-2xl bg-gray-200/70 animate-pulse flex flex-col items-center justify-center gap-2 border border-gray-300">
                <FaMapMarkerAlt className="text-gray-400 text-3xl animate-bounce" />
                <span className="text-xs font-medium text-gray-500">Cargando mapa interactivo...</span>
            </div>
        ),
    }
);

interface CartModalProps {
    user: any;
    isOpen: boolean;
    onClose: () => void;
    template: any;
}

export default function CartModal({ user, isOpen, onClose, template }: CartModalProps) {
    const { selectedIds, quantities, removeId, incrementQuantity, decrementQuantity, clearCart } = useCartStore();
    const foods: any[] = user?.foods || [];
    const canUseComandas = user?.plan === "plus" || user?.plan === "premium";

    const [deliveryType, setDeliveryType] = useState<'takeaway' | 'delivery'>('takeaway');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [reference, setReference] = useState('');
    const [coords, setCoords] = useState<{ lat: number; lng: number }>({
        lat: -27.7833,
        lng: -64.2667,
    });
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);

    // Pasos:
    // 1: Lista de platos del carrito
    // 2: Selector de ubicación en el mapa (pantalla completa sin interferencia del teclado)
    // 3: Confirmación de datos del destinatario (Nombre, Dirección editable, Referencia)
    const [step, setStep] = useState<1 | 2 | 3>(1);

    const handleClose = () => {
        setStep(1);
        onClose();
    };

    const handleLocationChange = useCallback(
        ({
            lat,
            lng,
            addressText,
            isLoadingAddress: loading,
        }: {
            lat: number;
            lng: number;
            addressText?: string;
            isLoadingAddress: boolean;
        }) => {
            setCoords({ lat, lng });
            setIsLoadingAddress(loading);
            if (addressText) {
                setAddress(addressText);
            }
        },
        []
    );

    function formatearPrecio(precio: number | string) {
        const value = typeof precio === "string" ? Number(precio) : precio;
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
        }).format(value);
    }

    if (!isOpen) return null;

    const selectedFoods = foods.filter((food: any) => selectedIds.includes(String(food._id)));
    const totalItemsCount = selectedFoods.reduce((acc, food) => acc + (quantities[food._id] || 1), 0);
    const totalPrice = selectedFoods.reduce((acc, food) => acc + food.price * (quantities[food._id] || 1), 0);

    const handleNextStep = () => {
        if (selectedFoods.length === 0) return;

        if (step === 1) {
            if (deliveryType === 'delivery') {
                setStep(2); // Ir al mapa interactivo
            } else {
                setStep(3); // En retiro en local, ir directo a pedir el nombre del cliente
            }
            return;
        }

        if (deliveryType === 'delivery' && step === 2) {
            setStep(3); // Ir a confirmación de datos
            return;
        }

        // En paso 3, validar nombre obligatorio (tanto para retiro como para envío)
        if (step === 3) {
            if (!name.trim()) {
                alert("Por favor ingresa tu nombre para identificar tu pedido.");
                return;
            }
            if (deliveryType === 'delivery' && !address.trim()) {
                alert("Por favor ingresa o confirma la dirección de entrega.");
                return;
            }
        }

        // Solo los planes Plus y Premium registran comandas en el sistema; Free solo envía por WhatsApp
        if (canUseComandas) {
            const ownerUserId =
                user?.user_id ||
                user?.foods?.[0]?.user_id ||
                user?.id ||
                user?._id ||
                "anonimo";
            const menuId = user?._id || user?.menu_id || undefined;

            const orderPayload: OrderPayload = {
                cliente_id: String(ownerUserId),
                user_id: String(ownerUserId),
                menu_id: menuId ? String(menuId) : undefined,
                negocio_nombre: user?.name ? String(user.name) : undefined,
                cliente_nombre: name.trim(),
                nota: reference.trim() || undefined,
                items: selectedFoods.map((food: any) => {
                    const qty = quantities[food._id] || 1;
                    const unitPrice =
                        food.is_promo && typeof food.promo_price === "number"
                            ? Number(food.promo_price)
                            : Number(food.price);
                    return {
                        food_id: String(food._id),
                        nombre: food.name,
                        cantidad: qty,
                        precio_unitario: unitPrice,
                        subtotal: unitPrice * qty,
                    };
                }),
                total: totalPrice,
                tipo_entrega: deliveryType,
                ...(deliveryType === 'delivery'
                    ? {
                        envio: {
                            lat: coords.lat,
                            lng: coords.lng,
                            direccion_texto: address.trim(),
                            referencia: reference.trim() || undefined,
                        },
                    }
                    : {}),
                estado: "pendiente",
            };

            void submitOrderToBackend(orderPayload);
        }

        let deliveryInfo = "";
        if (deliveryType === 'delivery') {
            const mapsUrl = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
            deliveryInfo = `\n\n*Datos de Envío:*\nCliente: ${name.trim()}\nDirección: ${address.trim()}${reference.trim() ? `\nReferencia: ${reference.trim()}` : ""
                }\nUbicación en mapa: ${mapsUrl}`;
        } else {
            deliveryInfo = `\n\n*Retiro por local*\nCliente: ${name.trim()}${reference.trim() ? `\nAclaración: ${reference.trim()}` : ""
                }`;
        }

        const rawPhone = user?.phone ? String(user.phone).replace(/\D/g, "") : "";
        const targetPhone = rawPhone
            ? rawPhone.startsWith("54")
                ? rawPhone
                : `549${rawPhone}`
            : "5493855349557";

        const message = `Hola! Soy *${name.trim()}*, quisiera pedirte:\n${selectedFoods.map((food: any) => `${quantities[food._id] || 1}x ${food.name}`).join("\n")}${deliveryInfo}\n*Total estimado:* ${formatearPrecio(totalPrice)}\nMuchas gracias.`;
        window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`, "_blank");
        clearCart();
        handleClose();
    };

    const handleBackStep = () => {
        if (step === 3) {
            setStep(deliveryType === 'delivery' ? 2 : 1);
        } else if (step === 2) {
            setStep(1);
        }
    };

    return (
        <div
            className="fixed inset-0 z-1000 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300"
            onClick={handleClose}
        >
            <div
                className={`${template?.backgroundColor || "bg-background"} w-full sm:w-125 h-[90dvh] sm:h-162.5 p- rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl relative overflow-hidden`}
                onClick={e => e.stopPropagation()}
            >
                {/* Header dinámico */}
                <div className={`flex justify-between items-center ${template?.textColor || "text-gray-700"} py-2 px-4 shrink-0`}>
                    <div className="flex items-center gap-2">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={handleBackStep}
                                className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200/60 active:scale-95 transition-all ${template?.textColor || "text-gray-700"}`}
                                title="Volver"
                            >
                                <FaArrowLeft size={16} />
                            </button>
                        )}
                        <div>
                            <h2 className={`text-lg sm:text-2xl font-bold ${template?.textColor || "text-gray-700"} transition-all duration-200`}>
                                {step === 1
                                    ? "Mis Pedidos"
                                    : step === 2
                                        ? "Ubica tu dirección"
                                        : deliveryType === "delivery"
                                            ? "Datos de entrega"
                                            : "Datos del pedido"}
                            </h2>
                            {step > 1 && (
                                <p className="text-[11px] text-gray-500 font-medium">
                                    {deliveryType === "delivery"
                                        ? `Paso ${step - 1} de 2 para envío a domicilio`
                                        : "Identifica tu pedido para retiro en local"}
                                </p>
                            )}
                        </div>
                        {step === 1 && (
                            <span className="text-xs sm:text-sm font-bold bg-green-600 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center">
                                {totalItemsCount}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {step === 1 && selectedFoods.length > 0 && (
                            <button
                                onClick={() => clearCart()}
                                className={`rounded-full text-xs font-bold px-2 py-1 hover:bg-gray-200 transition-colors ${template?.textColor || "text-primary"}`}
                            >
                                Borrar todo
                            </button>
                        )}
                        <button
                            onClick={handleClose}
                            className={`rounded-full w-9 h-9 text-xl flex items-center justify-center font-bold hover:bg-gray-200 transition-colors ${template?.textColor || "text-gray-700"}`}
                        >
                            <IoClose className="text-2xl" />
                        </button>
                    </div>
                </div>

                {/* Contenido principal según paso */}
                <div className="flex-1 min-h-0 px-2 flex flex-col overflow-y-auto">
                    {/* PASO 1: Listado de platos */}
                    {step === 1 && (
                        selectedFoods.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-70">
                                <span className="text-5xl mb-4">🍽️</span>
                                <p className={`text-lg font-medium ${template?.textColor || "text-gray-700"}`}>¿Aún no sabes qué comer?</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1 pb-2">
                                {selectedFoods.map((food: any) => (
                                    <div key={food._id} className="group flex items-center w-full gap-2">
                                        <div className="flex-1 min-w-0">
                                            <FoodCard food={food} template={template} />
                                        </div>
                                        <div className="flex flex-col items-center justify-center gap-1 min-w-17.5">
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
                                ))}
                            </div>
                        )
                    )}

                    {/* PASO 2: Selección dinámica con Mapa interactivo y Buscador */}
                    {step === 2 && (
                        <div className="flex flex-col h-full gap-2 pb-1">
                            <div className="flex items-center justify-between px-1">
                                <span className={`text-xs font-semibold ${template?.textColor || "text-gray-600"} opacity-90`}>
                                    Mueve el mapa para colocar el pin en tu puerta:
                                </span>
                            </div>

                            <div className="flex-1 min-h-65 w-full">
                                <LocationMapPicker
                                    initialLat={coords.lat}
                                    initialLng={coords.lng}
                                    onLocationChange={handleLocationChange}
                                />
                            </div>

                            {/* Previsualización de dirección detectada */}
                            <div className="bg-white/80 border border-gray-200 rounded-xl p-2.5 flex items-center gap-2 shadow-xs shrink-0">
                                <FaMapMarkerAlt className="text-red-500 shrink-0 text-base" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                                        Dirección seleccionada
                                    </p>
                                    <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                                        {isLoadingAddress ? "Detectando calle y altura..." : (address || "Ubicación en el mapa")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PASO 3: Formulario limpio sin interferencia del mapa ni teclado */}
                    {step === 3 && (
                        <div className="flex flex-col gap-3 py-2 px-1 h-full justify-start overflow-y-auto">
                            <div className="bg-green-600 rounded-xl p-3 flex items-start gap-2.5 text-sm text-white">
                                <FaCheck className="text-white mt-0.5 shrink-0" size={18} />
                                <div>
                                    <span className="font-bold">
                                        {deliveryType === "delivery"
                                            ? "Ubicación GPS fijada en el mapa."
                                            : "Modalidad: Retiro en el local."}
                                    </span>
                                    <p className="text-gray-100 text-xs mt-0.5">
                                        {deliveryType === "delivery"
                                            ? "Por favor completa tu nombre y revisa o ajusta la dirección para el repartidor."
                                            : canUseComandas
                                                ? "Por favor ingresa tu nombre para que el local identifique tu comanda al preparar el pedido."
                                                : "Por favor ingresa tu nombre para que el local identifique tu pedido."}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 w-full mt-1">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                                        <FaUser size={13} className="text-gray-400" /> Tu Nombre *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Juan Pérez"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        autoFocus
                                        className={`w-full px-3.5 py-3 text-sm sm:text-base border ${template?.border || "border-gray-300"} rounded-xl bg-white ${template?.textColor || "text-gray-800"} outline-none focus:ring-2 focus:ring-green-500 shadow-xs`}
                                    />
                                </div>

                                {deliveryType === "delivery" && (
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                                            <FaMapMarkerAlt size={13} className="text-red-500" /> Dirección (Calle y Número) *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Ej: Av. Belgrano 450"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className={`w-full px-3.5 py-3 text-sm sm:text-base border ${template?.border || "border-gray-300"} rounded-xl bg-white ${template?.textColor || "text-gray-800"} outline-none focus:ring-2 focus:ring-green-500 shadow-xs`}
                                        />
                                    </div>
                                )}

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                                        <FaRegCommentDots size={13} className="text-gray-400" />{" "}
                                        {deliveryType === "delivery"
                                            ? "Referencia o Indicaciones (Opcional)"
                                            : "Aclaraciones sobre tu pedido (Opcional)"}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={
                                            deliveryType === "delivery"
                                                ? "Ej: Timbre 4B, casa con portón blanco"
                                                : "Ej: Sin aderezos, paso a retirar en 20 min"
                                        }
                                        value={reference}
                                        onChange={(e) => setReference(e.target.value)}
                                        className={`w-full px-3.5 py-3 text-sm sm:text-base border ${template?.border || "border-gray-300"} rounded-xl bg-white ${template?.textColor || "text-gray-800"} outline-none focus:ring-2 focus:ring-green-500 shadow-xs`}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer compacto y fijo */}
                <div className={`flex items-center justify-center gap-6 py-6 px-2 shrink-0 bg-inherit`}>
                    {step === 1 && (
                        <div
                            role="radiogroup"
                            aria-label="Tipo de entrega"
                            className="relative w-full max-w-md grid grid-cols-2 p-1 rounded-full bg-gray-200 shadow-inner select-none"
                        >
                            {/* Indicador deslizante */}
                            <span
                                aria-hidden="true"
                                className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-green-500 shadow-md transition-transform duration-300 ease-out ${deliveryType === 'delivery' ? 'translate-x-full' : 'translate-x-0'}`}
                            />
                            {([
                                { value: 'takeaway', label: 'Retiro', Icon: FaStore },
                                { value: 'delivery', label: 'Delivery', Icon: FaMotorcycle },
                            ] as const).map(({ value, label, Icon }) => {
                                const active = deliveryType === value;
                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        role="radio"
                                        aria-checked={active}
                                        onClick={() => setDeliveryType(value)}
                                        className={`relative z-10 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-full cursor-pointer transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-1 ${active ? 'text-white' : 'text-gray-600 hover:text-gray-800'}`}
                                    >
                                        <Icon size={15} />
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <div className="flex justify-end w-fit py-2">
                        <div className="flex gap-2">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={handleBackStep}
                                    className={`px-4 py-2.5 text-sm cursor-pointer border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors`}
                                >
                                    Atrás
                                </button>
                            )}

                            <button
                                disabled={selectedFoods.length === 0}
                                onClick={handleNextStep}
                                className={`px-5 sm:px-7 py-2.5 flex items-center justify-center gap-2 text-sm sm:text-base enabled:cursor-pointer disabled:bg-gray-400 bg-green-500 text-white font-bold rounded-xl shadow-md transition-all hover:bg-green-600 active:scale-95 disabled:cursor-not-allowed`}
                            >
                                {step === 1 ? (
                                    <> Pagar:  <h4 className={`text-2xl sm:text-3xl font-bold leading-none`}>
                                        {formatearPrecio(totalPrice)}
                                    </h4></>
                                ) : deliveryType === 'delivery' && step === 2 ? (
                                    <>Confirmar <FaArrowRight size={13} /></>
                                ) : (
                                    <>Pedir <FaWhatsapp size={20} color="white" /></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
