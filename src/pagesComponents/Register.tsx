"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { MdChevronLeft } from "react-icons/md";
import logo from "@/public/images/logo/logo-rojo.png";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type FormValues = {
    email: string;
    password: string;
    logo: File | null;
    name: string;
    description: string;
    phone: string;
};

const validationSchemas = [
    Yup.object({
        email: Yup.string().email("Email inválido").required("Ingrese un email"),
        password: Yup.string().min(6, "Mínimo 6 caracteres").required("Ingrese una contraseña"),
    }),
    Yup.object({
        name: Yup.string().required("Ingrese un nombre"),
        logo: Yup.mixed().required("Seleccione un logo"),
    }),
    Yup.object({
        description: Yup.string().min(10, "Mínimo 10 caracteres"),
        phone: Yup.string().matches(/^\+54 9 \d+$/, "Formato inválido (+54 9 ...)").required("Ingrese un teléfono"),
    }),
];

const steps = [
    { id: 0, label: "Cuenta" },
    { id: 1, label: "Marca" },
    { id: 2, label: "Perfil" },
];

export default function Register() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (logoPreview) URL.revokeObjectURL(logoPreview);
        };
    }, [logoPreview]);

    const handleFinalSubmit = async (values: FormValues) => {
        setApiError(null);
        const body = new FormData();
        body.append("email", values.email);
        body.append("password", values.password);
        body.append("name", values.name);
        body.append("description", values.description);
        body.append("phone", values.phone);
        if (values.logo) body.append("logo", values.logo);

        try {
            const res = await fetch("/api/registro-de-usuario", { method: "POST", body });
            const data = await res.json();

            if (!res.ok) {
                setApiError(data.error || "Ocurrió un error al registrarse.");
                return;
            }

            router.push("/");
        } catch (err) {
            console.error(err);
            setApiError("Error de conexión. Intente nuevamente.");
        }
    };

    return (
        <div className="relative mx-auto px-2 py-2 md:mx-[12vw] lg:mx-[27vw]  flex flex-col items-center">
            <div className="absolute top-0 left-0 w-full px-6 py-8 z-10">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center text-white text-sm font-semibold hover:opacity-80 transition-opacity"
                >
                    <MdChevronLeft className="text-xl mr-1" />
                    Volver
                </button>
            </div>

            <div className="w-full mt-12 bg-white rounded-3xl shadow-xl">
                <div className="absolute top-10 right-8 transform">
                    <div className="w-20 h-20 rounded-full bg- border-7 border-white flex items-center justify-center">
                        <div className="w-full h-full rounded-full flex items-center justify-center">
                            <Image
                                src={logo}
                                alt="User"
                                width={100}
                                height={100}
                                className="w-full h-full rounded-full"
                            />
                        </div>
                    </div>
                </div>
                <div className="p-5">
                    <h1 className="text-2xl font-bold text-gray-900 text-start">Regístrate</h1>
                    <p className="text-xs mt-1 text-gray-500 text-start">
                        Completa los pasos para configurar tu perfil.
                    </p>
                </div>

                {/* Progress */}
                <ol className="flex w-full h-20 mb-5 justify-center">
                    {steps.map((s, idx) => {
                        const active = idx <= step;
                        const completed = idx < step;

                        return (
                            <li key={s.id} className="flex w-fit relative items-center">
                                <div className="flex flex-col w-10 justify-center items-center z-10">
                                    <span
                                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors duration-300 ${active || completed
                                            ? "bg-primary text-white"
                                            : "bg-gray-200 text-gray-500"
                                            }`}
                                    >
                                        {idx + 1}
                                    </span>
                                    <span
                                        className={`mt-1 text-xs font-medium transition-colors duration-300 ${active ? "text-primary dark:text-primary" : "text-gray-400"
                                            }`}
                                    >
                                        {s.label}
                                    </span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div
                                        className={`h-0.5 w-13 flex-1 mx-2 -mt-6 transition-colors duration-300 ${idx < step ? "bg-primary" : "bg-gray-200"
                                            }`}
                                    />
                                )}
                            </li>
                        );
                    })}
                </ol>


                {apiError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                        {apiError}
                    </div>
                )}

                <Formik<FormValues>
                    initialValues={{ email: "", password: "", logo: null, name: "", description: "", phone: "" }}
                    validationSchema={validationSchemas[step]}
                    onSubmit={(values, { setSubmitting }) => {
                        if (step < steps.length - 1) {
                            setStep(step + 1);
                            setSubmitting(false);
                            setApiError(null);
                        } else {
                            handleFinalSubmit(values);
                        }
                    }}
                >
                    {({ setFieldValue, isSubmitting, values }) => (
                        <Form className="space-y-6 pb-8 relative">
                            {step === 0 && (
                                <div className="animate-in fade-in space-y-2 slide-in-from-right-4 duration-300 px-5">
                                    <h3 className="text-gray-600 font-semibold">Ingrese su email y contraseña</h3>
                                    <div className="h-30 flex flex-col items-start">
                                        <Field
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="tu@correo.com"
                                            className="block w-full px-4 py-3 outline-none rounded-t-lg border-x border-t border-gray-500 text-gray-900 placeholder-gray-500 placeholder:text-base transition-all text-base"
                                        />
                                        <Field
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="block w-full px-4 py-3 outline-none rounded-b-lg border border-gray-500 text-gray-900 placeholder-gray-500 placeholder:text-base transition-all text-base shadow-md"
                                        />
                                        <div className="mt-2">
                                            <ErrorMessage
                                                name="password"
                                                component="div"
                                                className="text-xs text-red-500 font-medium"
                                            />
                                            <ErrorMessage
                                                name="email"
                                                component="div"
                                                className="text-xs text-red-500 font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 px-5">
                                    <div>
                                        <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                                            Logo (PNG/JPG)
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <label className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                                <span>Seleccionar archivo</span>
                                                <input
                                                    id="logo"
                                                    name="logo"
                                                    type="file"
                                                    accept="image/*"
                                                    className="sr-only"
                                                    onChange={(e) => {
                                                        const file = e.currentTarget.files?.[0] || null;
                                                        setFieldValue("logo", file);
                                                        if (file) {
                                                            const url = URL.createObjectURL(file);
                                                            setLogoPreview(url);
                                                        } else {
                                                            setLogoPreview(null);
                                                        }
                                                    }}
                                                />
                                            </label>
                                            <span className="text-sm text-gray-500">
                                                {values.logo ? values.logo.name : "Ningún archivo seleccionado"}
                                            </span>
                                        </div>
                                        {logoPreview && (
                                            <div className="mt-3 relative w-20 h-20">
                                                <Image
                                                    src={logoPreview}
                                                    alt="Logo preview"
                                                    fill
                                                    className="rounded-lg border border-gray-200 object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre de la marca
                                        </label>
                                        <Field
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Mi Tienda"
                                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                        />
                                        <ErrorMessage
                                            name="name"
                                            component="div"
                                            className="mt-1 text-sm text-red-500 font-medium"
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div>
                                        <label htmlFor="coverPhoto" className="block text-sm font-medium text-gray-700 mb-1">
                                            Foto de portada
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <label className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                                <span>Seleccionar archivo</span>
                                                <input
                                                    id="coverPhoto"
                                                    name="coverPhoto"
                                                    type="file"
                                                    accept="image/*"
                                                    className="sr-only"
                                                    onChange={(e) => {
                                                        const file = e.currentTarget.files?.[0] || null;
                                                        setFieldValue("logo", file);
                                                        if (file) {
                                                            const url = URL.createObjectURL(file);
                                                            setLogoPreview(url);
                                                        } else {
                                                            setLogoPreview(null);
                                                        }
                                                    }}
                                                />
                                            </label>
                                            <span className="text-sm text-gray-500">
                                                {values.logo ? values.logo.name : "Ningún archivo seleccionado"}
                                            </span>
                                        </div>
                                        <ErrorMessage
                                            name="logo"
                                            component="div"
                                            className="mt-1 text-sm text-red-500 font-medium"
                                        />
                                        {logoPreview && (
                                            <div className="mt-3 relative w-full h-32">
                                                <Image
                                                    src={logoPreview}
                                                    alt="Logo preview"
                                                    fill
                                                    className="rounded-lg border border-gray-200 object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                            Descripción
                                        </label>
                                        <Field
                                            id="description"
                                            name="description"
                                            as="textarea"
                                            rows={4}
                                            placeholder="Cuenta en pocas líneas qué ofreces y tu propuesta de valor."
                                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                                        />
                                        <ErrorMessage
                                            name="description"
                                            component="div"
                                            className="mt-1 text-sm text-red-500 font-medium"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                            Teléfono
                                        </label>
                                        <Field
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="+54 9 385 ..."
                                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                        />
                                        <ErrorMessage
                                            name="phone"
                                            component="div"
                                            className="mt-1 text-sm text-red-500 font-medium"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between border-t border-gray-300 p-5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep((s) => Math.max(0, s - 1));
                                        setApiError(null);
                                    }}
                                    disabled={step === 0 || isSubmitting}
                                    className={`inline-flex items-center px-6 py-3 text-sm font-bold rounded-lg transition-all ${step === 0
                                        ? "text-gray-300 cursor-not-allowed"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 bg-gray-100"
                                        }`}
                                >
                                    Atrás
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] bg-primary hover:bg-[#d00000] rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Procesando...
                                        </span>
                                    ) : (
                                        step === steps.length - 1 ? "Finalizar" : "Siguiente"
                                    )}
                                </button>
                            </div>
                            <div className="flex items-center justify-center gap-1 text-center">
                                <p className="text-xs font-semibold text-gray-600">
                                    ¿Ya tienes cuenta?
                                </p>
                                <Link className="text-blue-600 font-bold hover:underline text-xs" href="/iniciar-sesion">
                                    Iniciar sesión
                                </Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}