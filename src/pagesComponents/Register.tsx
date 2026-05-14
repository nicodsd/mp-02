"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { setAuthCookie, setUserCookie, setMenuCookie } from "@/app/actions";
import * as Yup from "yup";
import logo from "@/public/images/logo/LOGOTIPO.svg";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { URI } from "@/src/lib/const";
import { useParams, useSearchParams } from "next/navigation";
import BttnBack from "@/src/components/buttons/BttnBack";
import PlanSelector from "@/src/components/AcordeonPlanRegister";
import { OctagonX, Mail, KeyRound, Store } from "lucide-react";
import {
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaCamera,
  FaMapMarkerAlt,
} from "react-icons/fa";

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
  phonePrefix: string;
  plan: string;
  mp_preapproval_id: string;
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
    name: Yup.string()
      .test("len", "Mínimo 3 caracteres", (val) => !val || val.length >= 3)
      .test("len", "Máximo 20 caracteres", (val) => !val || val.length <= 20)
      .required("Ingrese un nombre"),
  }),
  Yup.object({
    plan: Yup.string().optional(),
    mp_preapproval_id: Yup.string().optional(),
  }),
  Yup.object({
    logo: Yup.mixed().nullable().optional(),
    cover: Yup.mixed().nullable().optional(),
    location: Yup.string().optional(),
    description: Yup.string()
      .test("len", "Mínimo 5 caracteres", (val) => !val || val.length >= 5)
      .test("len", `Máximo 30 caracteres`, (val) => !val || val.length <= 30)
      .optional(),
    instagram: Yup.string().optional(),
    facebook: Yup.string().optional(),
    tiktok: Yup.string().optional(),
    phonePrefix: Yup.number().when('phone', {
      is: (val: string) => val && val.length > 0,
      then: (schema) => schema.required('Ingrese un prefijo'),
      otherwise: (schema) => schema.optional(),
    }),
    phone: Yup.number().optional().min(7, "Mínimo 7 dígitos")
  }),
];

const steps = [
  { page: 0, label: "Cuenta" },
  { page: 1, label: "Planes" },
  { page: 2, label: "Perfil" },
];

export default function Register() {
  const params = useParams<{ page: string; }>();
  const searchParams = useSearchParams();
  const preapprovalId = searchParams.get("preapproval_id");
  const email = searchParams.get("email");
  const router = useRouter();
  const password = searchParams.get("password");
  const [step, setStep] = useState(0);
  const [sessionPlan, setSessionPlan] = useState<string>("");
  const [sessionEmail, setSessionEmail] = useState<string>("");
  const [sessionPassword, setSessionPassword] = useState<string>("");
  const [sessionUsername, setSessionUsername] = useState<string>("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isResponse, setIsResponse] = useState<boolean | null>(null);
  const [isPayActive, setIsPayActive] = useState<boolean | null>(false);

  useEffect(() => {
    if (params.page) {
      setStep(Number(params.page));
    }
    const fetchSessionData = async () => {
      try {
        const response = await fetch(`${URI}/auth/check-session`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        if (result.success) {
          setSessionPlan(result.data.plan);
          setSessionPassword(result.data.password);
          setSessionUsername(result.data.name);
          setSessionEmail(result.data.email);
          if (preapprovalId) {
            setIsPayActive(true);
          }
        } else {
          // Si no hay sesión (pero hay ID), quizás expiró
          setSessionPlan("");
          setSessionEmail("");
          setSessionPassword("");
          setSessionUsername("");
        }
      } catch (error) {
        console.error("❌ Error recuperando sesión:", error);
      }
    };

    // Solo buscamos sesión si hay un ID de Mercado Pago en la URL
    if (preapprovalId) {
      fetchSessionData();
    } else {
      // Si no hay preapprovalId, nos aseguramos de que los estados de sesión estén vacíos (Plan Free)
      setSessionPlan("");
      setSessionEmail("");
      setSessionPassword("");
      setSessionUsername("");
    }
  }, [preapprovalId, params]);

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  useEffect(() => {
    if (serverMessage) {
      outNotification();
    }
  }, [serverMessage]);

  const outNotification = () => {
    setTimeout(() => {
      setServerMessage(null);
    }, 8000);
  }

  const handleFinalSubmit = async (values: FormValues) => {
    setServerMessage(null);

    const body = new FormData();
    // USER -------------------------------------------------------------------------
    // 1. PRIORIDAD DE IDENTIDAD: Sesión > Estado Directo > Formulario
    // Si sessionEmail existe, usamos ese. Si no, usamos el del input del form.
    const finalEmail = sessionEmail || email || values.email;
    body.append("email", finalEmail);
    // CONTRASEÑA: Solo se envía si NO hay sesión (Registro Free)
    // Si el usuario pagó, la password ya está hasheada en la sesión del servidor.

    const finalPassword = sessionPassword || password || values.password;
    body.append("password", finalPassword);

    // MERCADO PAGO ID
    body.append("mp_preapproval_id", preapprovalId || "");
    // PLAN: Prioridad a la sesión de pago, sino lo que eligió en el form o "free"
    body.append("plan", sessionPlan || values.plan || "free");
    const finalUsername = sessionUsername || values.name;
    body.append("name", finalUsername);
    body.append("is_active", values.is_active ? "1" : "0");
    body.append("is_online", values.is_online ? "1" : "0");

    // MENU -------------------------------------------------------------------------
    // DATOS DE PERFIL (Vienen siempre del Formulario)
    body.append("description", values.description || "");
    body.append("phone", String((values.phonePrefix || "") + (values.phone || "")));
    body.append("template_id", "default");
    body.append("location", values.location || "");
    // ESTADOS Y REDES
    body.append("instagram", values.instagram || "");
    body.append("facebook", values.facebook || "");
    body.append("tiktok", values.tiktok || "");
    // ARCHIVOS (Cloudinary)
    if (values.logo instanceof File) {
      body.append("photo", values.logo);
    }
    if (values.cover instanceof File) {
      body.append("cover", values.cover);
    }
    if (isPayActive) {
      body.append("paymentCreated", new Date().toISOString());
    }
    try {
      const response = await fetch(`${URI}/auth/signup`, {
        method: "POST",
        body: body,
        credentials: "include",
      });
      const data = await response.json();
      const { token } = data;
      await setAuthCookie(token);
      if (!response.ok) {
        setIsResponse(data?.success);
        setServerMessage(data?.message || "Ocurrió un error al registrarse.");
        return;
      }
      if (data.success) {
        if (data.user) {
          await setUserCookie(data.user);
          await setMenuCookie(data.menu);
        }
        router.push("/");
      }
    } catch (err) {
      setServerMessage("Error de conexión. Intente nuevamente.");
    }
  };

  return (
    <div className="relative h-full px-4 w-full md:w-[60%] lg:w-[50%] xl:w-[30%] md:mx-auto flex flex-col items-center">
      <div className="w-full py-3 z-10">
        <BttnBack />
      </div>
      {serverMessage && (
        <div className={`p-4 mx-auto animate-in fade-in duration-400 slide-in-from-top-16 border-2 ${isResponse === false ? "bg-red-500" : "bg-green-500"} ${isResponse === false ? "border-red-500" : "border-green-500"} ${isResponse === false ? "text-white" : "text-background"} text-md shadow-lg font-semibold w-[90%] md:w-[60%] lg:w-[50%] xl:w-[30%] md:mx-auto fixed top-12 z-100 left-0 right-0 rounded-xl`}>
          {serverMessage}
        </div>
      )}
      <div className="h-full w-full pt-2 pb-36">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-stone-800 text-start">
              Regístrate
            </h1>
            <p className="text-xs mt-1 text-gray-500 text-start">
              Completa los pasos para configurar tu perfil.
            </p>
          </div>
          <div className="w-12 h-12 flex items-center justify-center">
            <Image
              src={logo}
              alt="logo-app"
              width={100}
              height={100}
              className="w-full h-full"
            />
          </div>
        </div>

        <ol className="flex w-full h-20 justify-center">
          {steps.map((s, idx) => {
            const active = idx <= step;
            const completed = idx < step;

            return (
              <li key={s.page} className="flex w-fit relative items-center">
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
            mp_preapproval_id: "",
            logo: null,
            cover: null,
            name: "",
            description: "",
            phonePrefix: "",
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
              setServerMessage(null);
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
                        htmlFor="name"
                        className="text-md text-gray-700"
                      >
                        Nombre de tu local*
                      </label>
                      <div className="flex items-center mt-1 justify-end relative w-full">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Store size={17} />
                        </div>
                        <Field
                          id="name"
                          value={values.name}
                          name="name"
                          maxLength={15}
                          type="text"
                          placeholder="Mi Local"
                          className="block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-xs mr-1 text-red-500 font-medium absolute"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col w-full mb-4">
                      <label
                        htmlFor="email"
                        className="text-md text-gray-700"
                      >
                        Email*
                      </label>
                      <div className="flex items-center mt-1 justify-end relative w-full">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Mail size={17} />
                        </div>
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          placeholder="tu@correo.com"
                          className="block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-xs mr-1 text-red-500 font-medium absolute"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="password"
                        className="text-md text-gray-700"
                      >
                        Contraseña*
                      </label>
                      <div className="flex items-center mt-1 justify-end relative w-full">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <KeyRound size={17} />
                        </div>
                        <Field
                          id="password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          className="block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-xs mr-1 text-red-500 font-medium absolute"
                        />
                      </div>
                      <span className="text-xs text-gray-500 font-medium mt-1">
                        La contraseña debe tener al menos 8 caracteres.
                      </span>
                      <span className="text-xs text-gray-500 font-medium mt-0.5">
                        Debe contener una mayúscula, una minúscula y un número
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-8">
                  <div className="animate-in space-y-2 fade-in slide-in-from-right-4 duration-300">
                    <h3 className="text-gray-600 font-semibold h-5 text-lg">
                      Elige tu plan
                    </h3>
                    <p className="text-sm font-light text-gray-500">
                      Selecciona el plan que mejor se adapte a tus necesidades.
                    </p>
                  </div>
                  <div className="flex flex-col justify-start h-fit mt-3">
                    <PlanSelector values={values} setFieldValue={setFieldValue} />
                  </div>
                  <span className="text-xs lg:text-sm text-gray-500 font-light mt-1">
                    <p className="mb-1">
                      Si deseas realizar un reembolso, <Link className="cursor-pointer underline font-medium" href="/contacto">comunicate por aquí</Link>
                    </p>
                    <p>
                      Tambien puedes cambiar de plan o darte de baja cuando quieras, los pagos se realizan por medio de <Link className="cursor-pointer underline font-semibold text-blue-500" href="https://www.mercadopago.com.ar/subscriptions#from-section=menu">Mercado Pago</Link> y se aceptan todas las tarjetas.
                    </p>
                  </span>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-2  animate-in flex flex-col fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-gray-600 text-lg font-semibold h-5">
                    Creá tu marca
                  </h3>
                  <p className="text-xs font-light text-gray-500">
                    Por último, agrega información de tu local gastronómico, luego podrás empezar a subir tus platos a internet y también compartirlos en redes sociales.
                  </p>
                  <div className="flex flex-col gap-6 mt-4">

                    <div className={`flex justify-evenly w-full mb-5`}>
                      <div className="relative flex items-center justify-center gap-2 flex-col">
                        <h3 className="text-md text-gray-700">Logo</h3>
                        <div className={`w-30 md:w-40 h-30 md:h-40 relative ${logoPreview ? "border-gray-200" : "border-transparent"} border rounded-full overflow-hidden`}>
                          {logoPreview && <Image
                            src={logoPreview}
                            alt="Profile"
                            width={200}
                            height={200}
                            quality={75}
                            loading="eager"
                            className="object-cover w-full h-full"
                          />}
                          <label className={`absolute top-0 w-full h-full right-1/2 text-center -translate-x-1/2 left-1/2 font-semibold text-white/70 text-xl gap-1 flex flex-col items-center justify-center active:bg-black/50 ${!logoPreview ? "bg-[#00000040]" : "bg-transparent"} py-2.5 px-2 rounded-lg cursor-pointer hover:scale-110 transition`}>
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
                            {!logoPreview && <FaCamera />}
                            {!logoPreview && "Agregar"}
                          </label>
                        </div>
                      </div>

                      {values.plan !== "free" && isPayActive ? (
                        <div className="flex flex-col rounded-lg w-fit justify-center items-center">
                          <div className="relative flex items-center justify-center gap-2 flex-col">
                            <h3 className="text-lg text-gray-700">Fondo</h3>
                            <div className={`w-45 md:w-60 h-30 md:h-40 relative ${coverPhotoPreview ? "border-gray-200" : "border-transparent"} border rounded-lg overflow-hidden`}>
                              {coverPhotoPreview && <Image
                                src={coverPhotoPreview}
                                alt="background"
                                width={200}
                                height={200}
                                quality={75}
                                loading="eager"
                                className="object-cover w-full h-full"
                              />}
                              <label className={`absolute top-0 w-full h-full right-1/2 text-center -translate-x-1/2 left-1/2 font-semibold text-white/70 text-xl gap-1 flex flex-col items-center justify-center active:bg-black ${!coverPhotoPreview ? "bg-[#00000040]" : "bg-transparent"} py-2.5 px-2 rounded-lg cursor-pointer hover:scale-110 transition`}>
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
                                {!coverPhotoPreview && <FaCamera />}
                                {!coverPhotoPreview && "Agregar"}
                              </label>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 flex-col">
                          <h3 className="text-md text-gray-700">Fondo</h3>
                          <div onClick={() => {
                            setStep((s) => Math.max(0, s - 1));
                            setServerMessage(null);
                          }} className="w-45 px-5 opacity-80 active:opacity-30 active:scale-95 transition-all cursor-pointer flex flex-col btn-god-rays items-center border-2 border-gray-400 justify-center gap-1 md:w-60 h-30 bg-gray-200/70 md:h-40 relative rounded-lg overflow-hidden">
                            <OctagonX size={50} className="text-gray-400" />
                            <p className="text-gray-500 text-sm text-center">Función disponible en plan de pago</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex w-full space-x-5 justify-between">
                      <div className="flex flex-col items-start justify-around">
                        <label
                          htmlFor="location"
                          className="block text-md text-gray-700"
                        >
                          Ubicación
                        </label>
                        <label
                          htmlFor="phone"
                          className="block text-md text-gray-700"
                        >
                          WhatsApp
                        </label>
                      </div>

                      <div className="flex gap-3 w-full flex-col items-center justify-between">
                        <div className="flex items-center justify-end relative w-full">
                          <FaMapMarkerAlt className="absolute left-3 text-gray-400" />
                          <Field
                            id="location"
                            name="location"
                            maxLength={20}
                            type="text"
                            placeholder="Av. Alvear 123"
                            className="block w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                          />
                          <ErrorMessage name="location" component="div" className="text-xs mr-1 text-red-500 font-medium absolute" />
                        </div>
                        <div className="flex items-center justify-end relative w-full">
                          <Field
                            id="phone"
                            name="phonePrefix"
                            maxLength={3}
                            type="tel"
                            inputMode="numeric"
                            placeholder="385"
                            className="text-gray-700 appearance-none overflow-hidden w-13 text-center text-xl bg-stone-100 border border-gray-300 h-full mr-1 font-bold px-2 py-2 rounded-lg flex items-center"
                          />
                          <Field
                            id="phone"
                            name="phone"
                            type="tel"
                            inputMode="numeric"
                            placeholder="1234567"
                            maxLength={7}
                            className="text-gray-700 appearance-none overflow-hidden w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                          />
                          <ErrorMessage name="phone" component="div" className="text-xs mr-1 text-red-500 font-medium absolute" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-md text-gray-700 mb-1"
                      >
                        Descripción
                      </label>
                      <Field
                        id="description"
                        name="description"
                        as="textarea"
                        rows={2}
                        maxLength={30}
                        placeholder="Cuenta en pocas líneas qué ofreces y tu propuesta de valor."
                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                      />
                      <ErrorMessage name="description" component="div" className="mt-0.5 text-sm text-red-500 font-medium absolute" />
                    </div>

                    <div className="border-t border-gray-300 pt-2">
                      <label className="block text-md text-gray-700 mt-2 mb-2">
                        Redes
                      </label>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <span className="w-8 text-xl text-gray-700"><FaInstagram /></span>
                          <Field
                            name="instagram"
                            type="text"
                            maxLength={15}
                            placeholder="@tu_usuario"
                            className="block flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="w-8 text-xl text-gray-700"><FaFacebook /></span>
                          <Field
                            name="facebook"
                            type="text"
                            maxLength={15}
                            placeholder="Nombre de usuario"
                            className="block flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="w-8 text-xl text-gray-700"><FaTiktok /></span>
                          <Field
                            name="tiktok"
                            type="text"
                            maxLength={15}
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
                <div className="flex items-center mb-2 w-full px-4 justify-end gap-3">

                  {!preapprovalId ? <button
                    type="button"
                    onClick={() => {
                      setStep((s) => Math.max(0, s - 1));
                      setServerMessage(null);
                    }}
                    disabled={step === 0 || isSubmitting}
                    className={`inline-flex active:scale-95 transition-all cursor-pointer items-center px-8 py-3 border text-md font-bold rounded-lg ${step === 0
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 bg-background border border-gray-400"
                      }`}
                  >
                    Atrás
                  </button>
                    :
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex active:scale-95 transition-all cursor-pointer items-center px-8 py-3 border text-md font-bold rounded-lg text-gray-700 bg-background border-gray-400"
                    >
                      Omitir
                    </button>
                  }
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex active:scale-90 transition-all cursor-pointer items-center w-full min-w-40 max-w-50 justify-center px-8 py-3 text-md font-bold text-white bg-black hover:bg-[#0009] rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="flex items-center justify-center gap-3 pt-2 w-full text-center">
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
                <div className="text-center py-2 text-xs">
                  <p>
                    © {new Date().getFullYear()} QMenu.
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