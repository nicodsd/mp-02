"use client"
import React, { useState } from 'react';
import { URI } from '@/src/lib/const';

const Pricing = () => {
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            // Llamamos a tu API
            const response = await fetch(`${URI}auth/subscribe`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        reason: 'Plan Premium - QMENU',
                        transaction_amount: 20,
                        plan: 'premium',
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
            const data = await response.json();

            if (data.init_point) {
                // Redirigimos al usuario al Checkout de Mercado Pago
                window.location.href = data.init_point;
            }
        } catch (error) {
            alert("Hubo un error al procesar el pago");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold">Plan Premium</h2>
            <p className="text-gray-600">Gestión de pedidos por WhatsApp y pagos online.</p>
            <div className="my-4 text-4xl font-bold">$10.000<span className="text-sm">/mes</span></div>

            <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
                {loading ? 'Cargando...' : 'Suscribirme Ahora'}
            </button>
        </div>
    );
};

export default Pricing;