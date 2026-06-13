"use client"; // Este subcomponente sí es cliente

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RedirectHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preapprovalId = searchParams.get('preapproval_id');

    useEffect(() => {
        if (preapprovalId) {
            // Te saca del index y te lleva al paso 3 conservando el ID
            router.push(`/registro-de-usuario/3/success?preapproval_id=${preapprovalId}`);
        }
    }, [preapprovalId, router]);

    return null; // No renderiza nada visualmente, es solo lógica pura
}

export default function MPRedirect() {
    return (
        // Next.js exige Suspense cuando usás useSearchParams en componentes cliente
        <Suspense fallback={null}>
            <RedirectHandler />
        </Suspense>
    );
}