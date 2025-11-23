'use client'
import React, { useState } from 'react';

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [image, setImage] = useState<File | null>(null); // New state for image file
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        if (image) {
            formData.append('image', image); // Append the image file
        }

        try {
            const response = await fetch('http://localhost:4000/api/auth/signup', {
                method: 'POST',
                // Do NOT set 'Content-Type' header when sending FormData,
                // the browser will set it automatically with the correct boundary.
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message || 'Registro exitoso!');
                setEmail('');
                setPassword('');
                setImage(null); // Clear image state on success
            } else {
                setError(data.message || 'Fallo el registro.');
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
                    <label htmlFor="image" style={{ display: 'block', marginBottom: '5px' }}>Imagen de perfil (opcional):</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*" // Restrict to image files
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
            {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
            {success && <p style={{ color: 'green', marginTop: '15px' }}>{success}</p>}
        </div>
    );
};

export default RegisterPage;
