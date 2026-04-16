import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { URI } from '@/src/lib/const';
import templates from '@/src/data/templates.json';
import { useRouter } from 'next/navigation';
import { updateTemplate } from "@/app/actions";

export default function TemplateSelector({ user }: { user: any }) {
    const [selected, setSelected] = useState<string>('default');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const currentTemplate = templates.find(t => t.template_id === selected) || templates[0];

    const handleSelect = (templateId: string) => {
        setSelected(templateId);
    };

    const handleUpdateTemplate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${URI}auth/update/template/${user}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ template_id: selected }),
            });
            if (!response.ok) throw new Error('Error al actualizar');
            const data = await response.json();
            if (data.success) {
                await updateTemplate(selected);
                console.log(data.user);
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-start justify-center gap-4 min-h-screen pb-32 md:pb-0 px-2 max-w-4xl mx-auto">
            <header className="py-3 flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-800">Personalizar menú</h1>
                <p className="text-gray-500 text-sm">1. Selecciona la identidad visual de tu negocio.
                    <br />2. Dale en <span className="font-bold uppercase">"Aplicar Tema"</span> para verlos reflejados en tu menú.</p>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full relative"
            >
                {templates.map((template) => {
                    const isSelected = selected === template.template_id;

                    return (
                        <label
                            key={template.template_id}
                            onClick={() => handleSelect(template.template_id)}
                            className={`relative flex flex-col items-center p-2 cursor-pointer rounded-3xl border-2 transition-all duration-300 
                                ${isSelected
                                    ? `${template.border} bg-gray-50 shadow-lg scale-105 z-10`
                                    : 'border-gray-200 bg-white hover:bg-gray-50 opacity-90'
                                }`}
                        >
                            {/* Card Preview Miniatúra */}
                            <div className={`w-full h-40 rounded-2xl border ${template.border} p-3 mb-3 shadow-inner ${template.backgroundColor} transition-colors overflow-hidden`}>
                                {/* Header de la mini-card */}
                                <div className="flex flex-col items-center gap-1 mb-4">
                                    <div className={`w-8 h-8 rounded-full bg-black ${template.accentColors[0]} shadow-sm`} />
                                    <div className={`h-1.5 w-12 rounded-full ${template.textColor} opacity-40`} />
                                </div>

                                {/* Cuerpo de la mini-card (Simulando Items) */}
                                <div className="space-y-2">
                                    <div className={`h-8 w-full rounded-lg ${template.backgroundColor2} flex items-center px-2`}>
                                        <div className={`h-1 w-2/3 rounded-full ${template.accentColors[1]} opacity-30`} />
                                    </div>
                                    <div className={`h-8 w-full rounded-lg ${template.backgroundColor2} flex items-center px-2`}>
                                        <div className={`h-1 w-1/2 rounded-full ${template.accentColors[1]} opacity-30`} />
                                    </div>
                                </div>

                                {/* Botón flotante simulado */}
                                <div className={`mt-4 h-6 w-full rounded-xl ${template.accentColors[0]} flex items-center justify-center`}>
                                    <div className={`h-1 w-6 rounded-full ${template.textColor2} opacity-80`} />
                                </div>
                            </div>

                            {/* Nombre y Dots de Paleta */}
                            <div className="flex flex-col items-center gap-2">
                                <span className={`font-bold text-sm ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {template.name}
                                </span>
                                <div className="flex -space-x-1">
                                    {template.accentColors.slice(0, 3).map((color, i) => (
                                        <div key={i} className={`w-3 h-3 rounded-full border border-white ${color}`} />
                                    ))}
                                </div>
                            </div>

                            {/* Input Radio oculto pero funcional */}
                            <input
                                type="radio"
                                name="template"
                                checked={isSelected}
                                onChange={() => { }}
                                className="sr-only"
                            />
                        </label>
                    );
                })}
            </motion.div>
            <div className="fixed md:relative w-full z-100 bottom-0 left-0 right-0 px-6 pt-4 pb-7 bg-background/90 backdrop-blur-lg border-t border-gray-200 flex flex-col items-center gap-2">
                <button
                    onClick={handleUpdateTemplate}
                    disabled={loading && selected === currentTemplate.template_id}
                    className={`w-full py-3 px-2 enabled:cursor-pointer disabled:cursor-not-allowed rounded-xl font-black text-lg transition-all shadow-md uppercase tracking-wider
                    ${loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : `border-4 ${currentTemplate.backgroundColor} ${currentTemplate.border} ${currentTemplate.textColor} active:scale-[0.98]`}`}
                >
                    {loading ? 'Guardando cambios...' : `Aplicar tema ${currentTemplate.name}`}
                </button>
                <span className='text-xs text-center px-10 text-gray-600'>*Los cambios se reflejarán en tu menú, solo debe recargar la página para verlos.</span>
            </div>
        </div>
    );
}