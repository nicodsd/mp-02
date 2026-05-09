"use client";
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { URI } from '@/src/lib/const';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaSpinner } from "react-icons/fa";
import { ConfigOptionCard, ConfigSwitch } from '@/src/components/dashboard/configComponents/ConfigComponents';

import ImgDefaultTemplate from "@/public/images/dashboard/default.png";
import ImgListaDesplegable from "@/public/images/dashboard/lista-desplegable.png";
import ImgPorDefecto from "@/public/images/dashboard/por-defecto.png";
import ImgHorizontal from "@/public/images/dashboard/horizontal.png";
import ImgRecortado from "@/public/images/dashboard/recortado.png";

export default function ConfigureMenu({ user }: { user: any }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [navBar, setNavBar] = useState(user?.navBar || "default");
    const [presentation, setPresentation] = useState(user?.presentation_type || 'default');
    const [satellites, setSatellites] = useState({
        bebidas: user?.enable_bebidas || false,
        postres: user?.enable_postres || false
    });
    const [whatsappOrders, setWhatsappOrders] = useState(user?.whatsAppCart || true);

    const hasChanges = useMemo(() => {
        return (
            navBar !== (user?.navBar || "default") ||
            presentation !== (user?.presentation_type || 'default') ||
            satellites.bebidas !== (user?.enable_bebidas || false) ||
            satellites.postres !== (user?.enable_postres || false) ||
            whatsappOrders !== (user?.whatsAppCart || true)
        );
    }, [navBar, presentation, satellites, whatsappOrders, user]);

    const cancelChanges = () => {
        setNavBar(user?.navBar || 'default');
        setPresentation(user?.presentation_type || 'default');
        setSatellites({
            bebidas: user?.enable_bebidas || false,
            postres: user?.enable_postres || false
        });
        setWhatsappOrders(user?.whatsAppCart || true);
    };

    const handleUpdateTemplate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${URI}/menu/update/config/${user?.id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    navBar: navBar,
                    presentation: presentation,
                    enable_bebidas: satellites.bebidas,
                    enable_postres: satellites.postres,
                    whatsAppCart: whatsappOrders
                }),
            });
            if (!response.ok) throw new Error('Error al actualizar');
            const data = await response.json();
            if (data.success) router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pb-20 md:pb-32 px-3">
            <header className="py-3 flex flex-col gap-1 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Personalizar menú</h1>
                <p className="text-gray-500 text-sm">Configura la estructura y el flujo visual de tu menú.</p>
            </header>

            <form onSubmit={handleUpdateTemplate} className="flex flex-col w-full items-start justify-start gap-10">

                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col gap-3">
                    <div className="flex flex-col">
                        <h2 className="font-bold text-gray-800">Encabezado</h2>
                        <p className="text-xs text-gray-500">Selecciona un tipo de encabezado.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 w-full">
                        <ConfigOptionCard id="default" label="Por defecto" type="vertical" selected={navBar === "default"} onSelect={setNavBar}>
                            <Image className='w-fit h-14 object-contain' src={ImgPorDefecto} alt="D" width={150} height={150} />
                        </ConfigOptionCard>
                        <ConfigOptionCard id="recortado" label="Recortado" type="vertical" selected={navBar === "recortado"} onSelect={setNavBar}>
                            <Image className='w-fit h-14 object-contain' src={ImgRecortado} alt="R" width={150} height={150} />
                        </ConfigOptionCard>
                        <ConfigOptionCard id="horizontal" label="Horizontal" type="vertical" selected={navBar === "horizontal"} onSelect={setNavBar}>
                            <Image className='w-fit h-8 object-contain' src={ImgHorizontal} alt="H" width={150} height={150} />
                        </ConfigOptionCard>
                    </div>
                </motion.section>

                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="w-full flex flex-col gap-3">
                    <div className="flex flex-col">
                        <h2 className="font-bold text-gray-800">Tipo de presentación</h2>
                        <p className="text-xs text-gray-500">Elige la disposición de los platos.</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <ConfigOptionCard id="default" label="Por defecto" type="horizontal" selected={presentation === 'default'} onSelect={setPresentation}>
                            <Image className='w-14 h-14' src={ImgDefaultTemplate} alt="Def" width={150} height={150} />
                        </ConfigOptionCard>
                        <ConfigOptionCard id="list" label="Lista desplegable" type="horizontal" selected={presentation === 'list'} onSelect={setPresentation}>
                            <Image className='w-14 h-14' src={ImgListaDesplegable} alt="List" width={150} height={150} />
                        </ConfigOptionCard>
                    </div>
                </motion.section>

                <motion.section className="w-full">
                    <h2 className="font-bold text-gray-800 mb-2">Menús satélites</h2>
                    <div className="flex flex-col bg-gray-50/50 rounded-2xl px-4 py-1 border shadow-md border-gray-100">
                        <ConfigSwitch label="Habilitar menú superior Bebidas" enabled={satellites.bebidas} onChange={(v: boolean) => setSatellites({ ...satellites, bebidas: v })} />
                        <div className="h-px bg-gray-100 w-full" />
                        <ConfigSwitch label="Habilitar menú inferior Postres" enabled={satellites.postres} onChange={(v: boolean) => setSatellites({ ...satellites, postres: v })} />
                    </div>
                </motion.section>

                {/* SECCIÓN 4: WHATSAPP */}
                <motion.section className="w-full">
                    <h2 className="font-bold text-gray-800 mb-2">Pedidos WhatsApp</h2>
                    <div className="bg-gray-50/50 rounded-2xl px-4 py-1 border shadow-md border-gray-100">
                        <ConfigSwitch label="Función de pedidos activa" enabled={whatsappOrders} onChange={setWhatsappOrders} />
                    </div>
                </motion.section>

                {hasChanges && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        className="w-full flex-col md:flex-row items-center h-fit min-h-24 md:items-center justify-center md:justify-end bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50 flex gap-3 px-4 md:px-7 py-4 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]"
                    >
                        <span className="text-gray-700 md:mr-4 font-medium">¿Deseas guardar los cambios?</span>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button type="button" onClick={cancelChanges} className="px-5 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" disabled={loading} className="w-full md:w-auto px-8 bg-black text-white py-3 rounded-xl flex justify-center items-center gap-2 font-bold disabled:opacity-50">
                                {loading ? <FaSpinner className="animate-spin" /> : "Guardar Cambios"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </form>
        </div>
    );
}