import React, { useState } from 'react';

// --- COMPONENTES DEL DASHBOARD MÓVIL ---

const Header = () => (
    <div style={{
        padding: '20px',
        background: '#1a1a2e',
        color: '#fff',
        borderBottomLeftRadius: '25px',
        borderBottomRightRadius: '25px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h2 style={{ margin: 0, fontSize: '18px' }}>Hola, Administrador 👋</h2>
                <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>QMenú Santiago del Estero</p>
            </div>
            <div style={{ background: '#e94560', padding: '10px', borderRadius: '12px', fontSize: '20px' }}>
                🔥
            </div>
        </div>
    </div>
);

const MobileStatCard = ({ title, value, color }) => (
    <div style={{
        background: '#fff',
        padding: '15px',
        borderRadius: '15px',
        minWidth: '140px',
        flex: 1,
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        borderLeft: `4px solid ${color}`
    }}>
        <div style={{ fontSize: '11px', color: '#888', marginBottom: '5px', fontWeight: 'bold' }}>{title.toUpperCase()}</div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{value}</div>
    </div>
);

const AdminProductCard = ({ name, price, status, img }) => (
    <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '12px',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
    }}>
        <img src={img} alt={name} style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
        <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 4px', fontSize: '14px' }}>{name}</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#e94560' }}>${price}</span>
                <span style={{
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: status === 'Activo' ? '#e1f9e5' : '#fee2e2',
                    color: status === 'Activo' ? '#1da33c' : '#ef4444'
                }}>
                    {status}
                </span>
            </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button style={{ background: '#f0f2f5', border: 'none', padding: '5px', borderRadius: '6px' }}>✏️</button>
        </div>
    </div>
);

const BottomNav = () => (
    <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '15px 0',
        borderTop: '1px solid #eee',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
    }}>
        <div style={{ textAlign: 'center', color: '#e94560', fontSize: '20px' }}>📊</div>
        <div style={{ textAlign: 'center', color: '#ccc', fontSize: '20px' }}>🍕</div>
        <div style={{ textAlign: 'center', color: '#ccc', fontSize: '20px' }}>⚙️</div>
    </div>
);

// --- COMPONENTE PRINCIPAL MÓVIL ---

export default function MobileDashboard() {
    return (
        <div style={{
            backgroundColor: '#f0f2f5',
            minHeight: '100vh',
            paddingBottom: '80px', // Espacio para el BottomNav
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
            <Header />

            <div style={{ padding: '20px' }}>
                {/* Métricas en Grid 2x2 */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <MobileStatCard title="Ventas" value="$85k" color="#4e73df" />
                    <MobileStatCard title="Visitas" value="1.2k" color="#1cc88a" />
                </div>

                {/* Buscador rápido */}
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    style={{
                        width: '100%', padding: '12px', borderRadius: '12px',
                        border: 'none', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                />

                {/* Lista de Gestión */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px' }}>Gestión de Platos</h3>
                    <button style={{ background: '#1a1a2e', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px' }}>
                        + Agregar
                    </button>
                </div>

                <AdminProductCard
                    name="Pizza Margherita"
                    price="555.565"
                    status="Activo"
                    img="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100"
                />
                <AdminProductCard
                    name="Burger King Style"
                    price="42.300"
                    status="Inactivo"
                    img="https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100"
                />
                <AdminProductCard
                    name="Papas Fritas XL"
                    price="12.500"
                    status="Activo"
                    img="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=100"
                />
            </div>

            <BottomNav />
        </div>
    );
}