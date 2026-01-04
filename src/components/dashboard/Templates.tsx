"use client";
import React, { useState } from "react";

// Tipos para las opciones de personalización
type TemplateOptions = {
    primaryColor: string;
    showPromo: boolean;
    showCategories: boolean;
};

const Templates: React.FC = () => {
    // Estado de personalización
    const [options, setOptions] = useState<TemplateOptions>({
        primaryColor: "#ff6600", // color por defecto
        showPromo: true,
        showCategories: true,
    });

    // 🔹 Funciones para actualizar opciones
    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOptions({ ...options, primaryColor: e.target.value });
    };

    const togglePromo = () => {
        setOptions({ ...options, showPromo: !options.showPromo });
    };

    const toggleCategories = () => {
        setOptions({ ...options, showCategories: !options.showCategories });
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">🎨 Personaliza tu aplicación</h1>

            {/* Selector de color */}
            <div className="mb-4">
                <label className="block mb-2 font-semibold">Color principal:</label>
                <input
                    type="color"
                    value={options.primaryColor}
                    onChange={handleColorChange}
                    className="w-16 h-10 cursor-pointer"
                />
            </div>

            {/* Toggles para condicionales */}
            <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={options.showPromo}
                        onChange={togglePromo}
                    />
                    Mostrar sección PromoDay
                </label>

                <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                        type="checkbox"
                        checked={options.showCategories}
                        onChange={toggleCategories}
                    />
                    Mostrar categorías
                </label>
            </div>

            {/* Vista previa dinámica */}
            <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: options.primaryColor }}
            >
                <h2 className="text-white font-bold">Vista previa</h2>
                {options.showPromo && (
                    <div className="bg-white text-black p-2 mt-2 rounded">
                        PromoDay renderizado 🎉
                    </div>
                )}
                {options.showCategories && (
                    <div className="bg-white text-black p-2 mt-2 rounded">
                        Categorías renderizadas 📂
                    </div>
                )}
            </div>
        </div>
    );
};

export default Templates;