"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { URI } from '@/src/lib/const';
import Image from 'next/image';
import { ConfigOptionCard, ConfigSwitch } from '@/src/components/dashboard/components/configComponents/ConfigComponents';

import ImgDefaultTemplate from "@/public/images/dashboard/default.png";
import ImgListaDesplegable from "@/public/images/dashboard/lista-desplegable.png";
import ImgPorDefecto from "@/public/images/dashboard/por-defecto.png";
import ImgHorizontal from "@/public/images/dashboard/horizontal.png";
import ImgRecortado from "@/public/images/dashboard/recortado.png";
import { updateMenuCookie } from '@/app/actions';

export default function ConfigureMenu({ user }: { user: any }) {

    const [loadingNavbar, setLoadingNavbar] = useState(false);
    const [loadingPresentation, setLoadingPresentation] = useState(false);
    const [navBar, setNavBar] = useState(user?.navBar || "default");
    const [presentation, setPresentation] = useState(user?.presentation || 'default');
    const [enableBebidas, setEnableBebidas] = useState(user?.enable_bebidas || false);
    const [enablePostres, setEnablePostres] = useState(user?.enable_postres || false);
    const [whatsappOrders, setWhatsappOrders] = useState(user?.whatsAppCart ?? true);

    useEffect(() => {
        if (user) {
            setNavBar(user.navBar || "default");
            setPresentation(user.presentation || 'default');
            setEnableBebidas(user.enable_bebidas || false);
            setEnablePostres(user.enable_postres || false);
            setWhatsappOrders(user.whatsAppCart ?? true);
        }
    }, [user]);

    const navBarOptions = [
        { id: "default", label: "Por defecto", format: "vertical", selected: navBar === "default", image: ImgPorDefecto, alt: "D", width: 200, height: 200 },
        { id: "recortado", label: "Recortado", format: "vertical", selected: navBar === "recortado", image: ImgRecortado, alt: "R", width: 200, height: 200 },
        { id: "horizontal", label: "Horizontal", format: "vertical", selected: navBar === "horizontal", image: ImgHorizontal, alt: "H", width: 200, height: 200 }
    ];

    const presentationOptions = [
        { id: "default", label: "Por defecto", format: "horizontal", selected: presentation === "default", image: ImgDefaultTemplate, alt: "Def", width: 150, height: 150 },
        { id: "list", label: "Lista desplegable", format: "horizontal", selected: presentation === "list", image: ImgListaDesplegable, alt: "List", width: 150, height: 150 }
    ];

    const updateConfig = async (key: string, value: any) => {

        if (key === "presentation" && presentation !== value) {
            setLoadingPresentation(true);
            setPresentation(value);
        }

        if (key === "navBar" && navBar !== value) {
            setLoadingNavbar(true);
            setNavBar(value);
        }

        if (key === 'enable_bebidas') setEnableBebidas(value);
        if (key === 'enable_postres') setEnablePostres(value);
        if (key === 'whatsAppCart') setWhatsappOrders(value);

        const payload = {
            navBar: key === 'navBar' ? value : navBar,
            presentation: key === 'presentation' ? value : presentation,
            enable_bebidas: key === 'enable_bebidas' ? value : enableBebidas,
            enable_postres: key === 'enable_postres' ? value : enablePostres,
            whatsAppCart: key === 'whatsAppCart' ? value : whatsappOrders
        };

        if ((navBar !== value && key === "navBar")
            ||
            (presentation !== value && key === "presentation")
            ||
            (enableBebidas !== value && key === "enable_bebidas")
            ||
            (enablePostres !== value && key === "enable_postres")
            ||
            (whatsappOrders !== value && key === "whatsAppCart")) {
            if (key === 'navBar') setLoadingNavbar(true);
            if (key === 'presentation') setLoadingPresentation(true);
            try {
                const response = await fetch(`${URI}/menu/update/config/${user?.id}`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (response.ok) {
                    await updateMenuCookie(payload)
                } else {
                    console.error("Error al guardar en el servidor");
                }
            } catch (error) {
                console.error("Error de red:", error);
            } finally {
                if (key === 'navBar') setLoadingNavbar(false);
                if (key === 'presentation') setLoadingPresentation(false);
                if (key === 'enable_bebidas') setLoadingPresentation(false);
                if (key === 'enable_postres') setLoadingPresentation(false);
                if (key === 'whatsAppCart') setLoadingPresentation(false);
            }
        }
    };

    return (
        <div className="min-h-screen pb-20 md:pb-32 px-3">
            {(loadingNavbar || loadingPresentation) && (
                <div className="fixed inset-0 bg-gray-50/50 z-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            )}
            <header className="py-3 flex flex-col gap-1 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Configuración del menú</h1>
                <p className="text-gray-500 text-sm">Tus cambios se aplican al instante.</p>
            </header>

            <div className="flex flex-col w-full items-start justify-start gap-10">

                <section className="w-full flex flex-col gap-3">

                    <h2 className="font-bold text-gray-800">Encabezado</h2>

                    <div className="grid grid-cols-3 gap-2 h-38 w-full">
                        {navBarOptions.map((option) => (
                            <ConfigOptionCard key={option.id} id={option.id} label={option.label} format={"vertical"} selected={option.selected}
                                onSelect={(id: string) => updateConfig('navBar', id)}>
                                <Image className='w-fit h-14 object-contain' src={option.image} alt={option.alt} width={option.width} height={option.height} />
                            </ConfigOptionCard>
                        ))}
                    </div>
                </section>

                <section className="w-full flex flex-col gap-3">
                    <h2 className="font-bold text-gray-800">Tipo de presentación</h2>
                    <div className="flex flex-col gap-3 h-52">
                        {presentationOptions.map((option) => (
                            <ConfigOptionCard key={option.id} id={option.id} label={option.label} format={"horizontal"} selected={option.selected}
                                onSelect={(id: string) => updateConfig('presentation', id)}>
                                <Image className='w-fit h-14 object-contain' src={option.image} alt={option.alt} width={option.width} height={option.height} />
                            </ConfigOptionCard>
                        ))}
                    </div>
                </section>

                <section className="w-full">
                    <h2 className="font-bold text-gray-800 mb-2">Menús satélites</h2>
                    <div className="flex flex-col bg-gray-50/50 rounded-2xl px-4 py-1 border shadow-md border-gray-100">
                        <ConfigSwitch label="Habilitar menú superior Bebidas" enabled={enableBebidas}
                            onChange={(v: boolean) => updateConfig('enable_bebidas', v)} />
                        <div className="h-px bg-gray-100 w-full" />
                        <ConfigSwitch label="Habilitar menú inferior Postres" enabled={enablePostres}
                            onChange={(v: boolean) => updateConfig('enable_postres', v)} />
                    </div>
                </section>

                <section className="w-full">
                    <h2 className="font-bold text-gray-800 mb-2">Pedidos WhatsApp</h2>
                    <div className="bg-gray-50/50 rounded-2xl px-4 py-1 border shadow-md border-gray-100">
                        <ConfigSwitch label="Función de pedidos activa" enabled={whatsappOrders}
                            onChange={(v: boolean) => updateConfig('whatsAppCart', v)} />
                    </div>
                </section>
            </div>
        </div>
    );
}