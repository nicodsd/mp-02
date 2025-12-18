'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setAuthCookie } from '@/app/actions';
import { setUserCookie } from '@/app/actions';
import icon from "@/public/images/logo/LOGOTIPO.svg"
import pizza from "@/public/images/icons-index/pizza-b.svg"
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
        <div className="bg-[#ff1c1c] min-h-screen px-3 pt-6 flex flex-col items-start md:px-[20vw] lg:px-[25vw]">
            <a href="/" className="text-[#fffafa] text-center text-sm px-3"><ArrowBackIosIcon />Inicio</a>
            <div className="relative w-full flex flex-col items-center pt-6 justify-start">

                {error && <p className="absolute top-40 bg-red-500 rounded-lg z-20 text-white text-center text-sm px-5 py-3">{error}</p>}
                {success && <p className="absolute top-40 bg-green-500 rounded-lg z-20 text-white text-center text-sm px-5 py-3">{success}</p>}

                {/* Header Text */}
                <div className="text-start w-full h-37 z-10 relative">
                    <div className="text-4xl md:leading-8 md:left-[3vw] absolute z-30 left-5 font-black text-[#fffafa] leading-9">
                        <h2>Registrate,<br />y crea tu menú</h2>
                        <h2 className="text-[#ffca1c] text-[75px] lg:text-[90px] mt-2.5 md:mt-2.7 lg:mt-3.5">gratis!</h2>
                    </div>
                    <img className='absolute top-3 md:-top-6 lg:-top-12 md:right-[2vw] lg:right-[4vw] -rotate-10 drop-shadow-[0px_12px_0px_#ffca1c] right-[3vw] h-[30vw] w-[30vw] md:h-40 md:w-40 lg:h-52 lg:w-52' src={icon.src} alt="icon" />
                </div>
                {/* Card Container */}
                <div className="w-full bg-[#FFFCFA] rounded-[2.5rem] border border-gray-800 p-6 sm:p-8 lg:p-10 z-10 mt-6 md:mt-4">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Name Field */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="name" className="text-base sm:text-lg font-bold text-gray-700 ml-1">
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Bar Sinson"
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-800 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="text-base sm:text-lg font-bold text-gray-700 ml-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="bar.sinson@gmail.com"
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-800 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="password" className="text-base sm:text-lg font-bold text-gray-700 ml-1">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="********"
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-800 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                            />
                        </div>
                        {/* File Input (Custom UI) */}
                        <div className="flex flex-col gap-1">
                            <label className="text-base sm:text-lg font-bold text-gray-700 ml-1">
                                Imagen o logo
                            </label>
                            <div className="flex sm:items-center w-full overflow-hidden">
                                {/* File Name Display area */}
                                <div className="flex-1 bg-gray-200 rounded-lg px-4 py-3 sm:py-3 text-sm text-gray-700 font-medium truncate">
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
                                    className="bg-[#FFFCFA] px-5 py-2 sm:py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 border rounded-lg border-gray-800 transition-colors whitespace-nowrap"
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
                            className="w-full mt-2 bg-[#ce0000] hover:bg-[#a20303] cursor-pointer text-white text-lg font-bold py-3 sm:py-3 rounded-lg shadow-md hover:shadow-lg transform active:scale-[0.98] transition-all"
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
            </div>
        </div>
    );
};
export default RegisterPage;