"use client"; // Este subcomponente sí es cliente

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// 1. QUITAMOS el "async" de la función del componente
function RedirectHandler({ userCookie, token }: { userCookie: string, token: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preapprovalId = searchParams.get('preapproval_id');

    useEffect(() => {
        // CASO 1: Registro nuevo (Viene de MP con ID, pero NO está logueado)
        if (preapprovalId && !userCookie && !token) {
            router.push(`/registro-de-usuario/3/success?preapproval_id=${preapprovalId}`);
        }

        // CASO 2: Upgrade de Plan (Viene de MP con ID Y ADEMÁS está logueado)
        // Agregamos "preapprovalId" para que no redirija a cualquiera que esté logueado y mire la landing
        else if (preapprovalId && userCookie && token) {
            router.push(`/panel-de-usuario?preapproval_id=${preapprovalId}`);
            // Opcional: pasarle el id al panel si necesitas impactar el cambio ahí
        }
    }, [preapprovalId, userCookie, token, router]); // 2. Agregamos todas las dependencias correctamente

    return null;
}

export default function MPRedirect({ userCookie, token }: { userCookie: string, token: string }) {
    return (
        <Suspense fallback={null}>
            <RedirectHandler userCookie={userCookie} token={token} />
        </Suspense>
    );
}