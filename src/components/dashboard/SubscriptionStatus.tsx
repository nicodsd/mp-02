import React, { useState, useEffect } from 'react';

export default function SubscriptionStatus({ endDate }: { endDate: string }) {
    const [daysLeft, setDaysLeft] = useState<number | null>(null);

    useEffect(() => {
        const calculateDays = () => {
            const now = new Date();
            const end = new Date(endDate);
            const diffTime = end.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            setDaysLeft(diffDays > 0 ? diffDays : 0);
        };

        calculateDays();
    }, [endDate]);

    if (daysLeft === null) return <div>Cargando...</div>;

    return (
        <div className="status-card">
            <h3>Tu suscripción</h3>
            {daysLeft > 0 ? (
                <p>Te quedan <strong>{daysLeft} días</strong> de acceso.</p>
            ) : (
                <p style={{ color: 'red' }}>Tu suscripción ha vencido.</p>
            )}
            {daysLeft <= 5 && <button>Renovar ahora</button>}
        </div>
    );
};