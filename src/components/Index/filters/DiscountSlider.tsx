"use client";
import React, { useState } from "react";

export default function DiscountSlider({
    onChange,
}: {
    onChange: (percent: number) => void;
}) {
    const [value, setValue] = useState(10);
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);

        if (newValue === 100) {
            setShowModal(true);
        } else {
            setValue(newValue);
            onChange(newValue);
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="font-semibold">Selecciona descuento:</label>

            <div className="relative w-full">
                <input
                    type="range"
                    min={10}
                    max={100}
                    step={10}
                    value={value}
                    onChange={handleChange}
                    className="w-full h-2 appearance-none bg-transparent cursor-pointer"
                    style={{
                        background:
                            "linear-gradient(to right, #eab308, #f97316, #dc2626)",
                    }}
                />
            </div>

            <div className="flex justify-between text-xs text-gray-600 px-1">
                <span>10%</span>
                <span>20%</span>
                <span>50%</span>
                <span>70%</span>
                <span>90%</span>
                <span>100%</span>
            </div>

            <p
                className={`text-sm font-bold ${value <= 20
                    ? "text-yellow-600"
                    : value <= 50
                        ? "text-orange-600"
                        : value <= 70
                            ? "text-red-600"
                            : "text-red-600"
                    }`}
            >
                Descuento: {value}%
            </p>

            {showModal && (
                <div className="fixed inset-0 bg-gray-200/70 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                        <h2 className="text-lg font-bold mb-4 text-red-600">⚠ Atención</h2>
                        <p className="text-gray-700 mb-4">
                            Estás intentando poner este plato con un descuento del 100%, lo
                            cual lo dejaría gratis. ¿Seguro que quieres continuar?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setValue(90);
                                }}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setValue(100);
                                    onChange(100);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}