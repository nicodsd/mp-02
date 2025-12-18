'use client'
import React, { useEffect, useState } from 'react';

const Templates: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [options, setOptions] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/templates'); // Cambia la URL según tu backend
                const data = await response.json();
                setOptions(data);
            } catch (error) {
                console.error('Error fetching templates:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Cargando...</div>; // Componente de carga
    }

    return (
        <div>
            <h1>Selecciona un Template</h1>
            <ul>
                {options.map((option) => (
                    <li key={option.id}>{option.name}</li> // Ajusta según la estructura de tus datos
                ))}
            </ul>
        </div>
    );
};

export default Templates;