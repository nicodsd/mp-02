'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setAuthCookie } from '@/app/actions';
const RegisterPage: React.FC = () => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', String(0));
        formData.append('is_online', String(true));
        formData.append('is_active', String(false));
        formData.append('image', image || '');
        try {
            const response = await fetch(`${URL}api/auth/signup`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
            const dataDB = await response.json();
            if (response.ok) {
                const { tokenCookie } = await dataDB;
                await setAuthCookie(tokenCookie);
                setSuccess(dataDB.message || 'Registro exitoso!');
                setEmail('');
                setPassword('');
                setImage(null);
                router.push('/');
            } else {
                setError(dataDB.message || 'Fallo el registro.');
            }
        } catch (err) {
            setError('Error de red o el servidor no está disponible.');
            console.error('Error de registro:', err);
        }
    };
    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2>Registro</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="image" style={{ display: 'block', marginBottom: '5px' }}>Imagen de perfil:</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Registrarse
                </button>
            </form>
            <a className="text-blue-500 hover:underline" href="/iniciar-sesion">¿Ya tienes una cuenta?</a>
            {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
            {success && <p style={{ color: 'green', marginTop: '15px' }}>{success}</p>}
        </div>
    );
};
export default RegisterPage;