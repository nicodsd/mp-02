import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { URI } from '@/src/lib/const';
import templates from '@/src/data/templates.json';
import { useRouter } from 'next/navigation';
import { updateTemplate } from "@/app/actions";
import { FaCircle } from 'react-icons/fa';

export default function TemplateSelector({ user }: { user: any }) {
    const [selected, setSelected] = useState<string>(user?.template_id || 'default');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const currentTemplate = templates.find(t => t.template_id === selected) || templates[0];
    const userTemplate = templates.find(t => t.template_id === user.template_id) || templates[0];

    const handleSelect = (templateId: string) => {
        setSelected(templateId);
    };

    const handleUpdateTemplate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${URI}/menu/update/config/${user?.id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ template_id: selected }),
            });
            if (!response.ok) throw new Error('Error al actualizar');
            const data = await response.json();
            if (data.success) {
                await updateTemplate(selected);
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full items-start justify-start gap-4 min-h-screen pb-26 md:pb-20 px-3">
            <header className="py-3 flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-800">Personalizar menú</h1>
                <p className="text-gray-500 text-sm">1. Selecciona la identidad visual de tu negocio.
                    <br />2. Dale en <span className="font-bold uppercase">"Aplicar Tema"</span> para verlos reflejados en tu menú.</p>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center md:justify-start flex-wrap gap-3 w-full relative"
            >
                {templates.map((template) => {
                    const isSelected = selected === template.template_id;

                    return (
                        <label
                            key={template.template_id}
                            onClick={() => handleSelect(template.template_id)}
                            className={`relative w-36 md:w-fit flex flex-col items-center p-2 cursor-pointer rounded-3xl border-2 transition-all duration-300 
                                ${isSelected
                                    ? `${template.border} bg-gray-50 shadow-lg scale-105 z-10`
                                    : 'border-gray-200 bg-white hover:bg-gray-50 opacity-90'
                                }`}
                        >
                            {/* Card Preview Miniatúra */}
                            <div className={`w-full md:w-32 h-36 rounded-2xl border ${template.border} p-3 mb-2 shadow-inner ${template.backgroundColor} transition-colors overflow-hidden`}>
                                {/* Header de la mini-card */}
                                <div className="flex flex-col items-center gap-1 mb-2">
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

                            <span className={`font-bold text-sm ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>
                                {template.name}
                            </span>

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
            <div className="w-full flex-col md:flex-row items-center h-fit md:h-24 md:items-center justify-center md:justify-end bg-background border-t border-gray-200 fixed bottom-0 left-0 right-0 z-70 flex gap-3 px-4 md:px-7 py-3">
                <div className="flex items-center gap-2">
                    <span className='text-xs hidden md:block text-end px-10 text-gray-600'>*Los cambios se reflejarán en tu menú, solo debe recargar la página para verlos.</span>
                    <button
                        onClick={handleUpdateTemplate}
                        disabled={loading || selected === userTemplate.template_id}
                        className={`min-w-70 md:py-3 px-6 py-3 enabled:cursor-pointer disabled:cursor-not-allowed border-3 rounded-xl font-black md:text-lg text-sm transition-all shadow-md uppercase tracking-wider
                    ${loading || selected === userTemplate.template_id ? 'bg-gray-100 text-gray-300 opacity-60 cursor-not-allowed' : ` ${currentTemplate.backgroundColor} ${currentTemplate.border} ${currentTemplate.textColor} active:scale-[0.98]`}`}
                    >
                        {loading ? 'Guardando cambios...' : `Aplicar tema ${currentTemplate.name}`}
                    </button>
                </div>
                <span className='text-xs md:hidden text-center px-10 text-gray-600'>*Los cambios se reflejarán en tu menú, solo debe recargar la página para verlos.</span>
            </div>
        </div>
    );
}

{/* <div className="w-full flex-col md:flex-row items-start md:items-center justify-center md:justify-end bg-background border-t border-gray-200 fixed bottom-0 left-0 right-0 z-70 flex gap-3 px-4 md:px-7 py-3">
    <span className="text-gray-700 md:mr-4 text-md">¿Deseas guardar los cambios?</span>
    <div className="flex gap-2 w-full md:w-auto">
        <button
            type="button"
            onClick={() =>
                isEditing &&
                cancelChanges()
            }
            className="px-6 py-3 border cursor-pointer rounded-xl"
        >
            Cancelar
        </button>
        <button
            type="submit"
            disabled={loading}
            className="w-full active:scale-90 transition-all disabled:opacity-50 min-w-50 md:w-auto px-6 bg-black text-white py-3 rounded-xl flex justify-center cursor-pointer items-center gap-2"
        >
            {loading ? (
                <>
                    <FaSpinner className="animate-spin" /> Guardando...
                </>
            ) : (
                "Guardar Cambios"
            )}
        </button>
    </div>
</div> */}