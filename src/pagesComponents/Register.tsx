"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { setAuthCookie, setUserCookie } from "@/app/actions";
import * as Yup from "yup";
import logo from "@/public/images/logo/logo-rojo.png";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { URI } from "@/src/lib/const";
import BttnBack from "@/src/components/buttons/BttnBack";

type FormValues = {
  email: string;
  is_online: boolean;
  is_active: boolean;
  password: string;
  logo: File | null;
  name: string;
  description: string;
  cover: File | null;
  phone: string;
  plan: string;
  location: string;
  instagram: string;
  facebook: string;
  tiktok: string;
};

const validationSchemas = [
  Yup.object({
    email: Yup.string().email("Email inválido").required("Ingrese un email"),
    password: Yup.string()
      .min(6, "Mínimo 6 caracteres")
      .required("Ingrese una contraseña"),
  }),
  Yup.object({
    plan: Yup.string().required("Seleccione un plan"),
  }),
  Yup.object({
    name: Yup.string().required("Ingrese un nombre"),
    logo: Yup.mixed().nullable().optional(),
    cover: Yup.mixed().nullable().optional(),
    location: Yup.string().optional(),
    description: Yup.string().test("len", "Mínimo 10 caracteres", (val) => !val || val.length >= 10).optional(),
    phone: Yup.string().test("len", "Mínimo 7 dígitos", (val) => !val || val.length >= 7).optional(),
    instagram: Yup.string().optional(),
    facebook: Yup.string().optional(),
    tiktok: Yup.string().optional(),
  }),
];

const steps = [
  { id: 0, label: "Cuenta" },
  { id: 1, label: "Planes" },
  { id: 2, label: "Perfil" },
];

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(
    null,
  );
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
    body.append("description", values.description || "");
    body.append("phone", String(values.phone || ""));
    body.append("location", values.location || "");
    body.append("is_active", values.is_active ? "1" : "0");
    body.append("is_online", values.is_online ? "1" : "0");
    body.append("plan", values.plan || "free");
    body.append("instagram", values.instagram || "");
    body.append("facebook", values.facebook || "");
    body.append("tiktok", values.tiktok || "");
    if (values.logo instanceof File) {
      body.append("photo", values.logo);
    }
    if (values.cover instanceof File) {
      body.append("cover", values.cover);
    }

    try {
      const response = await fetch(`${URI}auth/signup`, {
        method: "POST",
        body: body,
        credentials: "include",
      });
      const data = await response.json();
      let user = data.user;
      const { token } = data;
      await setAuthCookie(token);
      await setUserCookie(user);
      if (!response.ok) {
        setApiError(data.error || "Ocurrió un error al registrarse.");
        return;
      }
      router.push("/mi-menu");
    } catch (err) {
      setApiError("Error de conexión. Intente nuevamente.");
    }
  };

  return (
    <div className="relative h-full px-3 w-full md:w-[60%] lg:w-[50%] xl:w-[30%] md:mx-auto flex flex-col items-center">
      <div className="w-full py-3 z-10">
        <BttnBack />
      </div>

      <div className="h-full w-full pb-50">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-gray-900 text-start">
              Regístrate
            </h1>
            <p className="text-xs mt-1 text-gray-500 text-start">
              Completa los pasos para configurar tu perfil.
            </p>
          </div>
          <div className="w-10 h-10 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src={logo}
                alt="logo-app"
                width={100}
                height={100}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        <ol className="flex w-full h-20 mb-5 justify-center">
          {steps.map((s, idx) => {
            const active = idx <= step;
            const completed = idx < step;

            return (
              <li key={s.id} className="flex w-fit relative items-center">
                <div className="flex flex-col w-10 justify-center items-center z-10">
                  <span
                    className={`flex h-7 w-10 items-center justify-center rounded-full text-md font-bold transition-colors duration-300 ${active || completed
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                      }`}
                  >
                    {idx + 1}
                  </span>
                  <span
                    className={`mt-1 text-xs font-medium transition-colors duration-300 ${active
                      ? "text-primary dark:text-primary"
                      : "text-gray-400"
                      }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-8 flex-1 mx-2 -mt-6 transition-colors duration-300 ${idx < step ? "bg-primary h-0.75" : "bg-gray-200 h-0.5"
                      }`}
                  />
                )}
              </li>
            );
          })}
        </ol>

        <Formik<FormValues>
          initialValues={{
            email: "",
            password: "",
            logo: null,
            cover: null,
            name: "",
            description: "",
            phone: "",
            plan: "",
            location: "",
            is_active: true,
            is_online: true,
            instagram: "",
            facebook: "",
            tiktok: "",
          }}
          validationSchema={validationSchemas[step]}
          onSubmit={async (values, { setSubmitting }) => {
            if (step < steps.length - 1) {
              setStep(step + 1);
              setSubmitting(false);
              setApiError(null);
            } else {
              await handleFinalSubmit(values);
              setSubmitting(false);
            }
          }}
        >
          {({ setFieldValue, isSubmitting, values }) => (
            <Form className="space-y-6 h-full relative flex flex-col justify-center">
              {step === 0 && (
                <div className="animate-in fade-in space-y-2 slide-in-from-right-4 duration-300">
                  <h3 className="text-gray-600 font-semibold h-5 text-lg">
                    Ingrese su email y contraseña
                  </h3>
                  <p className="text-xs font-light text-gray-500">
                    Tu email nos sirve para restablecer tu contraseña por si te
                    olvidas o la pierdes.
                  </p>
                  <div className="flex flex-col justify-start h-70 mt-7">
                    <div className="flex flex-col w-full mb-4">
                      <label
                        htmlFor="email"
                        className="text-gray-600 font-semibold"
                      >
                        Email*
                      </label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@correo.com"
                        className="block w-full px-4 py-3 mt-1 outline-none rounded-lg border border-gray-500 text-gray-900 placeholder-gray-[#B8B8B8] placeholder:text-base transition-all text-base"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-xs text-red-500 font-medium"
                      />
                    </div>
                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="password"
                        className="text-gray-600 font-semibold"
                      >
                        Contraseña*
                      </label>
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="block w-full px-4 py-3 mt-1 outline-none rounded-lg border border-gray-500 text-gray-900 placeholder-gray-[#B8B8B8] placeholder:text-base transition-all text-base"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-xs text-red-500 font-medium"
                      />
                      <span className="text-xs text-gray-500 font-medium mt-0.5">
                        La contraseña debe tener al menos 8 caracteres.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="animate-in fade-in space-y-2 slide-in-from-right-4 duration-300">
                  <h3 className="text-gray-600 font-semibold h-5 text-lg">
                    Elige tu plan{" "}
                    <span className="text-xs font-light text-gray-500">
                      (es opcional)
                    </span>
                  </h3>
                  <p className="text-xs font-light text-gray-500">
                    Tu email nos sirve para restablecer tu contraseña por si te
                    olvidas o la pierdes.
                  </p>
                  <div className="flex flex-col justify-start h-fit mt-7">
                    <div className="flex flex-col w-full mb-4">
                      <div
                        role="group"
                        aria-labelledby="checkbox-group"
                        className="flex flex-col space-y-2"
                      >
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Field
                            className="w-4 h-4 accent-black"
                            type="radio"
                            name="plan"
                            value="free"
                          />
                          Plan Gratuito
                        </label>
                        <div className="flex flex-col space-y-0.5 text-xs font-light text-gray-500 ml-6">
                          <p>Todo lo que necesitas para comenzar</p>
                          <p>1 usuario</p>
                          <p>1 local</p>
                          <p>1 menu</p>
                          <p>15 platos</p>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Field
                            className="w-4 h-4 accent-black"
                            type="radio"
                            name="plan"
                            value="plus"
                          />
                          Plan Plus+
                        </label>
                        <div className="flex flex-col space-y-0.5 text-xs font-light text-gray-500 ml-6">
                          <p>Todo lo que necesitas para comenzar</p>
                          <p>1 usuario</p>
                          <p>1 local</p>
                          <p>1 menu</p>
                          <p>15 platos</p>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Field
                            className="w-4 h-4 accent-black"
                            type="radio"
                            name="plan"
                            value="premium"
                          />
                          Plan Premium
                        </label>
                        <div className="flex flex-col space-y-0.5 text-xs font-light text-gray-500 ml-6">
                          <p>Todo lo que necesitas para comenzar</p>
                          <p>1 usuario</p>
                          <p>1 local</p>
                          <p>1 menu</p>
                          <p>15 platos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-2  animate-in flex flex-col fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-gray-600 text-lg font-semibold h-5">
                    Crea tu marca
                  </h3>
                  <p className="text-xs font-light text-gray-500">
                    ¿Cómo se llama tu local? Agrega un nombre, una foto y un
                    fondo para personalizar tu QMenú.
                  </p>
                  <div className="flex flex-col gap-6 mt-7">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-md font-medium text-gray-700 mb-1"
                      >
                        Nombre*
                      </label>
                      <Field
                        id="name"
                        value={values.name}
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
                    <div className="grid grid-cols-2 gap-1 w-full mb-1">
                      <div className="flex flex-col pb-4 rounded-lg bg-gray-300/20 w-full justify-center items-center">
                        <label
                          htmlFor="logo"
                          className="block text-md font-medium text-gray-700 mb-1"
                        >
                          Logo (PNG/JPG)
                        </label>
                        <div className="flex items-center space-x-4 relative">
                          <label
                            htmlFor="logo"
                            className="cursor-pointer absolute -bottom-2 left-0 flex items-center justify-center px-3 min-w-21.5 py-1.5 border border-gray-300 rounded-lg shadow-sm text-xs font-light text-white bg-black hover:bg-gray-50 transition-colors"
                          >
                            <span>Elegir Logo</span>
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
                          {(logoPreview && (
                            <div className="rounded-full w-20 h-20">
                              <Image
                                src={logoPreview}
                                alt="Logo preview"
                                width={80}
                                height={80}
                                className="rounded-full border w-20 h-20 bg-black border-gray-200 object-cover"
                              />
                            </div>
                          )) || (
                              <div className="rounded-full w-20 h-20">
                                <div className="rounded-full w-20 h-20 border-2 border-black object-cover">
                                  {/* <Image
                                                        src="/placeholder.png"
                                                        alt="Logo preview"
                                                        fill
                                                        className="rounded-full border border-gray-200 object-cover"
                                                    /> */}
                                </div>
                              </div>
                            )}
                        </div>
                        <ErrorMessage
                          name="logo"
                          component="div"
                          className="mt-1 text-sm text-red-500 font-medium"
                        />
                      </div>
                      {values.plan !== "free" && (
                        <div className="flex flex-col pb-4 rounded-lg bg-gray-300/20 w-full justify-center items-center">
                          <label
                            htmlFor="cover"
                            className="block text-md font-medium text-gray-700 mb-1"
                          >
                            Foto de portada
                          </label>
                          <div className="flex justify-center items-center space-x-4 relative">
                            <label className="cursor-pointer mx-auto absolute z-10 -bottom-2 flex items-center justify-center px-3 min-w-21.5 py-1.5 border border-gray-300 rounded-lg shadow-sm text-xs font-light text-white bg-black hover:bg-gray-50 transition-colors">
                              <span>Subir fondo</span>
                              <input
                                id="cover"
                                name="cover"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(e) => {
                                  const file =
                                    e.currentTarget.files?.[0] || null;
                                  setFieldValue("cover", file);
                                  if (file) {
                                    const url = URL.createObjectURL(file);
                                    setCoverPhotoPreview(url);
                                  } else {
                                    setCoverPhotoPreview(null);
                                  }
                                }}
                              />
                            </label>
                            {(coverPhotoPreview && (
                              <div className="relative z-0 w-full h-20">
                                <Image
                                  src={coverPhotoPreview}
                                  alt="Cover photo preview"
                                  width={100}
                                  height={60}
                                  className="rounded-lg border w-30 h-20 border-gray-200 object-cover"
                                />
                              </div>
                            )) || (
                                <div className="">
                                  <div className="rounded-2xl w-40 h-20 border-2 border-black object-cover"></div>
                                  {/* <Image
                                                        src="/placeholder.png"
                                                        alt="Logo preview"
                                                        fill
                                                        className="rounded-full border border-gray-200 object-cover"
                                                    /> */}
                                </div>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="location"
                        className="block text-md font-medium text-gray-700 mb-1"
                      >
                        Ubicación
                      </label>
                      <Field
                        id="location"
                        name="location"
                        type="text"
                        placeholder="Av. Alvear 123"
                        className="block w-[70%] px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="phone"
                        className="block text-md font-medium text-gray-700"
                      >
                        Teléfono
                      </label>
                      <div className="flex items-center relative">
                        <div className="flex flex-col w-full">
                          <div className="flex items-center relative w-full">
                            <span className="text-gray-500 text-lg bg-gray-100 h-full mr-2 px-2 py-2 rounded-lg flex items-center">385</span>
                            <Field
                              id="phone"
                              name="phone"
                              type="tel"
                              placeholder="5349557"
                              className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            />
                            <ErrorMessage name="phone" component="div" className="-bottom-6 absolute text-sm text-red-500 font-medium" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-md font-medium text-gray-700 mb-1"
                      >
                        Descripción
                      </label>
                      <Field
                        id="description"
                        name="description"
                        as="textarea"
                        rows={3}
                        placeholder="Cuenta en pocas líneas qué ofreces y tu propuesta de valor."
                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                      />
                      <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-500 font-medium" />
                    </div>

                    <div>
                      <label className="block text-md font-medium text-gray-700 mt-2 mb-2">
                        Redes Sociales (opcional)
                      </label>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <span className="w-20 text-sm text-gray-600">Instagram</span>
                          <Field
                            name="instagram"
                            type="text"
                            placeholder="@tu_usuario"
                            className="block flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="w-20 text-sm text-gray-600">Facebook</span>
                          <Field
                            name="facebook"
                            type="text"
                            placeholder="Enlace o usuario"
                            className="block flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="w-20 text-sm text-gray-600">TikTok</span>
                          <Field
                            name="tiktok"
                            type="text"
                            placeholder="@tu_usuario"
                            className="block flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              <div className="h-fit w-full md:w-[60%] lg:w-[50%] xl:w-[40%] md:mx-auto fixed bottom-0 left-0 right-0 py-2 bg-background flex flex-col items-center justify-between mt-10">
                <div className="flex items-center mb-3 w-[80%] justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setStep((s) => Math.max(0, s - 1));
                      setApiError(null);
                    }}
                    disabled={step === 0 || isSubmitting}
                    className={`inline-flex items-center px-6 py-3 text-sm font-bold rounded-lg transition-all ${step === 0
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-white bg-black"
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
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Procesando...
                      </span>
                    ) : step === steps.length - 1 ? (
                      "Finalizar"
                    ) : (
                      "Siguiente"
                    )}
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <p className="text-sm h-4 font-semibold text-gray-600">
                    ¿Ya tienes cuenta?
                  </p>
                  <Link
                    className="text-blue-600 font-bold hover:underline"
                    href="/login"
                  >
                    Iniciar sesión
                  </Link>
                </div>
                {apiError && (
                  <div className="mb-6 p-4 w-[90%] mx-auto absolute bottom-0 left-0 right-0 bg-red-100 border border-red-400 rounded-lg text-red-600 text-sm text-center">
                    {apiError}
                  </div>
                )}
                <div className="text-center py-6 text-xs">
                  <p>
                    © {new Date().getFullYear()} QMenu. Todos los derechos
                    reservados.
                  </p>
                  <p>
                    Por{" "}
                    <a
                      className="font-bold"
                      href="https://www.linkedin.com/in/nicobarreraj"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Nico Barrera
                    </a>
                  </p>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
