"use client"; // Este subcomponente sí es cliente

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function hasCookie(name: string): boolean {
    if (typeof document === 'undefined') return false;
    return document.cookie.split('; ').some((row) => row.startsWith(`${name}=`));
}

// 1. QUITAMOS el "async" de la función del componente
function RedirectHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preapprovalId = searchParams.get('preapproval_id');

    useEffect(() => {
        if (!preapprovalId) return;

        const isLoggedIn = hasCookie('user') && hasCookie('token');

        // CASO 1: Registro nuevo (Viene de MP con ID, pero NO está logueado)
        if (!isLoggedIn) {
            router.push(`/registro-de-usuario/3/success?preapproval_id=${preapprovalId}`);
        }
        // CASO 2: Upgrade de Plan (Viene de MP con ID Y ADEMÁS está logueado)
        else {
            router.push(`/panel-de-usuario?preapproval_id=${preapprovalId}`);
        }
    }, [preapprovalId, router]);

    return null;
}

export default function MPRedirect() {
    return (
        <Suspense fallback={null}>
            <RedirectHandler />
        </Suspense>
    );
}