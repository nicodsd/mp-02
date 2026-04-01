import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { URI } from '@/src/lib/const';
import templates from '@/src/data/templates.json';

interface Template {
    template_id: string;
    name: string;
    primaryColor: string;
    accentColors: string[];
}

export default function TemplateSelector({ user }: { user: any }) {

    const [selected, setSelected] = useState<string>('default');
    const [loading, setLoading] = useState(false);

    const handleSelect = (templateId: string) => {
        setSelected(templateId);
    };

    const handleUpdateTemplate = async () => {
        setLoading(true);

        try {
            const response = await fetch(`${URI}auth/update/template/${user}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    template_id: selected
                }),
            });

            if (response.ok) {
                console.log('Template actualizado a:', selected);
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error("Error al actualizar el template:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-start justify-start gap-4 min-h-screen font-sans pb-10">
            <header className="p-3 flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-800">Personaliza tu menú</h1>
                <p className="text-gray-500 text-sm">Selecciona una plantilla o vuelve a la original.</p>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 w-full flex flex-col items-center max-w-md p-4"
            >
                {templates.map((template) => (
                    <label
                        key={template.template_id}
                        className="flex items-center gap-6 cursor-pointer group w-full"
                    >
                        {/* Selector Circular */}
                        <div className="relative flex items-center justify-center">
                            <input
                                type="radio"
                                name="template"
                                value={template.template_id}
                                checked={selected === template.template_id}
                                onChange={() => handleSelect(template.template_id)}
                                className="peer sr-only"
                            />
                            <div className="w-8 h-8 border-4 border-gray-300 rounded-full peer-checked:border-gray-800 transition-all"></div>
                            <div className="absolute w-4 h-4 bg-gray-800 rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                        </div>

                        {/* Vista Previa de la Tarjeta */}
                        <div className="flex items-center w-full gap-4 flex-1">
                            <div
                                className={`relative w-40 aspect-square rounded-2xl p-4 shadow-xl transition-all duration-300 ${selected === template.template_id
                                    ? 'ring-3 ring-gray-800 scale-[1.05] z-10'
                                    : 'hover:scale-[1.02] opacity-80'
                                    } ${template.primaryColor}`}
                            >
                                {/* Miniatura de Perfil */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-lg w-full h-2/3 mb-3 flex items-center justify-center shadow-sm">
                                    <div className="space-y-2">
                                        <div className="w-10 h-10 bg-gray-700 rounded-full mx-auto"></div>
                                        <div className="w-14 h-1 bg-gray-400 rounded mx-auto"></div>
                                    </div>
                                </div>
                                {/* Detalles de Color Inferiores */}
                                <div className="space-y-2">
                                    <div className="flex gap-1">
                                        <div className={`h-2 w-6 ${template.accentColors[0]} rounded-full`}></div>
                                        <div className={`h-2 w-6 ${template.accentColors[1]} rounded-full`}></div>
                                    </div>
                                    <div className={`h-4 w-full ${template.accentColors[2]} rounded-md`}></div>
                                </div>
                            </div>

                            {/* Paleta de Colores Lateral */}
                            <div className="flex flex-col gap-1">
                                <div className={`w-5 h-5 rounded-full border border-gray-200 shadow-sm ${template.primaryColor}`}></div>
                                {template.accentColors.map((color, idx) => (
                                    <div key={idx} className={`w-5 h-5 rounded-full border border-gray-200 shadow-sm ${color}`}></div>
                                ))}
                            </div>
                        </div>
                    </label>
                ))}

                {/* Botón de Acción */}
                <button
                    onClick={handleUpdateTemplate}
                    disabled={loading}
                    className={`mt-10 w-full py-4 px-6 rounded-2xl font-bold text-white transition-all shadow-lg ${loading ? 'bg-gray-400 cursor-wait' : 'bg-gray-900 hover:bg-black active:scale-95'
                        }`}
                >
                    {loading ? 'Sincronizando...' : 'Guardar Preferencias'}
                </button>
            </motion.div>
        </div>
    );
}