"use client";

import { useState } from 'react';
import BttnBack from '@/src/components/buttons/BttnBack'
import logo from "@/public/images/logo/logo-rojo.png";
import Image from 'next/image'
import Link from 'next/link';
import { useFormik } from "formik";
import * as Yup from "yup";
import { URI } from '@/src/lib/const';


export default function OlvideMiContrasenaPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const formik = useFormik({
        initialValues: { email: "" },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Introduce un email válido")
                .required("El email es obligatorio"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                setStatus("loading");

                // API call al backend
                const formData = new FormData();
                formData.append("email", values.email);
                await fetch(`${URI}/auth/forgot-password`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: values.email }),
                    credentials: "include",
                });

                setStatus("success");
                resetForm();
            } catch (error) {
                console.error(error);
                setStatus("error");
            } finally {
                setTimeout(() => setStatus("idle"), 5000);
            }
        },
    });

    return (
        <div className="min-h-screen flex flex-col justify-between">


            {status === "success" && <div className='fixed inset-0 h-screen w-full bg-black/20 backdrop-blur-md flex items-center justify-center z-50'>
                <div className='bg-white w-[80%] md:w-[40%] md:h-[40%] p-20 rounded-lg flex flex-col items-center justify-center gap-10'>
                    <Image src={"https://res.cloudinary.com/dsruux0wb/image/upload/v1778718744/logo-qmenu-negro_ebsasv.png"} alt="Success" width={100} height={100} className="w-24 h-auto" />
                    <div className="flex w-full flex-col items-center justify-center gap-10">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 text-center">
                                Se ha enviado un correo electrónico a {formik.values.email} con un enlace para restablecer tu contraseña.
                            </h2>
                            <p className="text-sm mt-3 text-gray-600 text-center">
                                Si no has recibido el correo electrónico, por favor verifica tu carpeta de spam.
                            </p>
                        </div>
                        <button onClick={() => setStatus("idle")} className="bg-primary text-white px-8 py-2 cursor-pointer rounded-lg">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>}

            <div className="relative h-full px-4 w-full md:w-[60%] lg:w-[50%] xl:w-[30%] md:mx-auto flex flex-col items-center">
                <div className="w-full py-3 z-10">
                    <BttnBack />
                </div>
                <main className="flex-1 w-full flex flex-col items-end justify-start mt-18">
                    <div className="w-full py-8 pt-14 relative mt-2">
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                            <div className="w-24 h-24 rounded-full ring-1 bg-background border-white ring-gray-300 flex items-center justify-center">
                                <Image
                                    src={logo}
                                    alt="User"
                                    width={100}
                                    height={100}
                                    className="w-full h-full rounded-full"
                                />
                            </div>
                        </div>
                        <div className="text-start mb-5 px-5 flex flex-col gap-2">
                            <h1 className="text-stone-800 text-3xl leading-none font-extrabold tracking-tight">
                                ¿Olvidaste tu contraseña? <br />
                            </h1>
                            <p className="text-gray-600 text-sm font-semibold">
                                Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.
                            </p>
                        </div>

                        {/* Formulario con Formik */}
                        <form onSubmit={formik.handleSubmit} className="space-y-4 px-3">
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 outline-none transition-all"
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {formik.errors.email}
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className={`w-full bg-primary ${status === "loading" ? "cursor-not-allowed opacity-70" : "active:scale-90"} text-white font-bold py-4 px-3 rounded-lg cursor-pointer uppercase tracking-wide transition-all`}
                            >
                                {status === "loading" ? "Enviando..." : "Enviar enlace"}
                            </button>
                        </form>

                        {/* Feedback */}
                        {status === "success" && (
                            <p className="text-green-600 text-sm mt-3 text-center">Correo enviado correctamente ✅</p>
                        )}
                        {status === "error" && (
                            <p className="text-red-600 text-sm mt-3 text-center">Hubo un error al enviar ❌</p>
                        )}

                        <div className="mt-8 text-center">
                            <p className="text-sm h-4 font-semibold text-gray-600">
                                ¿Aún no tienes cuenta?
                            </p>
                            <Link
                                className="block text-blue-600 font-bold hover:underline cursor-pointer"
                                href="/registro-de-usuario"
                            >
                                Registrarse
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
            <footer className="w-full h-fit flex flex-col items-center justify-between bg-background space-y-5 py-2">
                <div className="text-center py-2 text-xs">
                    <p>© {new Date().getFullYear()} QMenu.</p>
                </div>
            </footer>
        </div>
    );
}
