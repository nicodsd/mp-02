import React from "react";
import { MdChevronLeft } from "react-icons/md";
import { ListChecks, ShoppingBag, Rocket } from "lucide-react";

export default function DisenoStepperLlamativo() {
    const steps = [
        {
            id: "1",
            icon: <ListChecks className="w-10 h-10" />,
            title: "Cargar Datos",
            description: "Sube una foto, el precio y categoría",
        },
        {
            id: "2",
            icon: <ShoppingBag className="w-10 h-10" />,
            title: "Lista Temporal",
            description: "Revisa la lista de platos agregados",
        },
        {
            id: "3",
            icon: <Rocket className="w-10 h-10" />,
            title: "Subir al Menú",
            description: "Publicación final para clientes",
        },
    ];

    return (
        <div className="w-full flex flex-col items-center py-6">
            {/* Header proporcionado */}
            <header className="px-4 pb-7 flex flex-col gap-2 text-start md:text-left w-full lg:w-[90%] max-w-6xl">
                <div className="flex w-full flex-col px-2 md:px-0 py-3 justify-between items-start">
                    <a
                        href="/"
                        className="flex items-center text-sm cursor-pointer font-semibold hover:opacity-80 transition-opacity"
                    >
                        <MdChevronLeft className="text-xl mr-1" />
                        Volver
                    </a>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-800">
                    Carga de Platos
                </h2>
                <p className="text-gray-500 text-sm leading-4">
                    Completa los pasos a continuación y comienza a vender.
                </p>
            </header>

            {/* Diseño más llamativo (no interactivo, solo visual) */}
            <div className="w-full lg:w-[90%] max-w-6xl px-2 md:grid grid-cols-1 md:grid-cols-3 gap-1 flex justify-center">
                {steps.map((step) => (
                    <div key={step.id} className="relative group w-3/4">

                        {/* Contenedor de la tarjeta con borde y sombra */}
                        <div className="relative flex text-center flex-col items-center gap-3 z-10">
                            <div className="text-primary">
                                {/* Icono con fondo */}
                                {step.id}
                                <div className="w-8 h-8 text-primary rounded-2xl flex items-center justify-center">
                                    {step.icon}
                                </div>
                            </div>

                            {/* Título y descripción */}
                            <div className="flex flex-col md:gap-2">
                                <h3 className="text-lg font-medium text-black/60 leading-none tracking-tight">
                                    {step.title}
                                </h3>
                                <p className="text-sm mt-2 md:text-md text-balance text-gray-500 leading-4 md:leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}