'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setAuthCookie } from '@/app/actions';
import { setUserCookie } from '@/app/actions';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
const RegisterPage: React.FC = () => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [imgName, setImgName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', String(0));
        formData.append('is_online', String(true));
        formData.append('is_active', String(false));
        formData.append('photo', image || '');
        try {
            const response = await fetch(`${URL}api/auth/signup`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
            const dataDB = await response.json();
            if (response.ok) {
                const { token, user } = dataDB;
                await setAuthCookie(token);
                await setUserCookie(user);
                setSuccess(dataDB.message || 'Registro exitoso!');
                setName('');
                setEmail('');
                setPassword('');
                setImage(null);
                router.push('/');
            } else {
                setError(dataDB.message || 'Fallo el registro.');
                setTimeout(() => setError(null), 4000);
                console.error('Error de registro:', dataDB.message);
            }
        } catch (err) {
            setError('Error de red o el servidor no está disponible.');
            setTimeout(() => setError(null), 4000);
            console.error('Error de registro:', err);
        }
    };
    return (
        <div className="bg-[#FFFCFA] min-h-screen px-3">
            <a href="/" className="absolute top-3 z-10 text-black text-center text-sm px-3 py-3"><ArrowBackIosIcon />Menú</a>
            <div className="relative w-full flex flex-col items-center justify-around min-h-screen py-18">

                {error && <p className="absolute top-40 bg-red-500 rounded-lg z-20 text-white text-center text-sm px-5 py-3">{error}</p>}
                {success && <p className="absolute top-40 bg-green-500 rounded-lg z-20 text-white text-center text-sm px-5 py-3">{success}</p>}

                {/* Header Text */}
                <div className="text-start w-full h-37 z-10 relative">
                    <div className="text-4xl left-5 lg:text-5xl absolute font-black text-gray-800 leading-7">
                        <p> Creá <br /> tu menú </p>
                        <p className="text-red-500 text-[75px] mt-2.5"> gratis!</p>
                    </div>
                </div>

                {/* Decorative Tablecloth Element (Top) */}
                <div
                    className="absolute top-47 w-[75%] sm:w-[90%] h-24 sm:h-32 lg:h-40 rounded-t-full z-0 transform translate-y-2"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ff4040' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z' /%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '30px 30px',
                    }}
                ></div>

                {/* Card Container */}
                <div className="w-full bg-[#FFFCFA] rounded-[2.5rem] shadow-lg border border-black p-6 sm:p-8 lg:p-10 z-10 mb-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        {/* Name Field */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="name" className="text-base sm:text-lg font-bold text-black ml-1">
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Bar Sinson"
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-800 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent shadow-sm transition-all"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="text-base sm:text-lg font-bold text-black ml-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="bar.sinson@gmail.com"
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-800 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent shadow-sm transition-all"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="password" className="text-base sm:text-lg font-bold text-black ml-1">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="********"
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-800 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent shadow-sm transition-all"
                            />
                        </div>

                        {/* File Input (Custom UI) */}
                        <div className="flex flex-col gap-1">
                            <label className="text-base sm:text-lg font-bold text-black ml-1">
                                Imagen o logo
                            </label>
                            <div className="flex flex-row items-stretch sm:items-center w-full rounded-lg overflow-hidden shadow-sm">
                                {/* File Name Display area */}
                                <div className="flex-1 bg-gray-200 px-4 py-3 sm:py-3 text-sm text-gray-700 font-medium truncate">
                                    {
                                        imgName
                                            ? imgName
                                            : 'No se selecciono ningun archivo.'
                                    }
                                </div>
                                {/* Custom Button */}
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('image')?.click()}
                                    className="bg-white px-5 py-2 sm:py-3 text-sm font-bold text-black hover:bg-gray-50 border sm:border-t-0 sm:border-l-2 rounded-lg border-black transition-colors whitespace-nowrap"
                                >
                                    Elegir imagen
                                </button>
                                {/* Hidden Actual Input */}
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={(e) => {
                                        setImage(e.target.files?.[0] || null);
                                        setImgName(e.target.files?.[0]?.name || '');
                                    }}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full mt-2 bg-[#ff4040] hover:bg-[#e63939] text-white text-base sm:text-lg font-bold py-3 sm:py-3 rounded-lg shadow-md hover:shadow-lg transform active:scale-[0.98] transition-all"
                        >
                            Enviar
                        </button>

                        {/* Footer Link */}
                        <div className="text-center mt-2">
                            <p className="text-gray-700 font-bold text-xs sm:text-sm">
                                ¿Ya tienes una cuenta?
                                <br />
                                <a href="/iniciar-sesion" className="text-blue-600 text-sm hover:text-blue-700 hover:underline">
                                    Iniciar sesión
                                </a>
                            </p>
                        </div>

                    </form>
                </div>

                {/* Decorative Tablecloth Element (Bottom) */}
                <div
                    className="absolute bottom-3 sm:-bottom-12 w-[75%] sm:w-[90%] h-32 sm:h-24 lg:h-28 z-0 transform translate-y-2"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ff4040' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z' /%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '30px 30px',
                        backgroundRepeat: 'repeat',
                    }}
                ></div>
            </div>
        </div>
    );
};
export default RegisterPage;