"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { setAuthCookie, setUserCookie } from "@/app/actions";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo/logo-rojo.png";
import BttnBack from "@/src/components/buttons/BttnBack";
import { URI } from "@/src/lib/const";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Introduce un email válido")
    .required("El email es obligatorio"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
});

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setServerError(null);
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);
      try {
        const response = await fetch(`${URI}auth/signin`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok) {
          await setAuthCookie(data.token);
          await setUserCookie(data.user);
          router.push("/mi-menu");
        } else {
          setAlreadyLoggedIn(data.alreadyLoggedIn);
          setServerError(data.message || "Error de credenciales");
        }
      } catch (error) {
        setServerError("Error de conexión");
      }
    },
  });

  const handleLogin = async () => {
    try {
      const res = await fetch(`${URI}auth/update/is_online/${formik.values.email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ is_online: true }),
      });
      if (res.status === 200) {
        setServerError(null);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      setServerError("Error de conexión");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex flex-col relative px-3 w-full md:w-[60%] lg:w-[50%] xl:w-[30%] md:mx-auto">
        <div className="w-full py-3 z-10">
          <BttnBack />
        </div>
        {serverError && (
          <div className="p-4 fixed top-10 z-100 left-0 right-0 w-full text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {serverError} {
              alreadyLoggedIn && (
                <button onClick={() => { handleLogin() }} className="text-blue-600 font-bold hover:underline cursor-pointer">Iniciar Sesión</button>
              )
            }
          </div>
        )}
        <main className="flex-1 flex flex-col items-end justify-start mt-15">
          <div className="w-full py-8 rounded-3xl border border-gray-300 pt-14 relative mt-2">
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
              <div className="w-24 h-24 rounded-full bg-primary ring-1 border-7 border-white ring-gray-300 flex items-center justify-center">
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
            <div className="text-start mb-5 px-5">
              <h1 className="text-card-700 text-3xl leading-none font-extrabold tracking-tight">
                ¡Hola! <br />
              </h1>
              <p className="text-gray-600 text-sm font-semibold">
                Inicia sesión en tu cuenta.
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-8">
              <div className="px-5">

                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className={`block w-full px-4 py-3 rounded-t-lg border-x border-t border-gray-300 text-gray-900 outline-none transition-all ${formik.touched.email && formik.errors.email
                      ? "border-red-500 bg-red-50"
                      : ""
                      }`}
                  />
                </div>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Contraseña"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    className={`block w-full px-4 py-3 rounded-b-lg border border-gray-300 text-gray-900 outline-none transition-all ${formik.touched.password && formik.errors.password
                      ? "border-red-500 bg-red-50"
                      : ""
                      }`}
                  />
                  <div className="flex flex-col mt-1">
                    {formik.touched.email && formik.errors.email && (
                      <span className="text-[10px] text-red-600 font-bold ml-2">
                        {formik.errors.email}
                      </span>
                    )}
                    {formik.touched.password && formik.errors.password && (
                      <span className="text-[10px] text-red-600 font-bold ml-2">
                        {formik.errors.password}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-300 pt-4 px-5">
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className={`w-full bg-primary text-white cursor-pointer font-bold py-4 px-3 rounded-lg uppercase tracking-wide transition-all ${formik.isSubmitting
                    ? "opacity-50"
                    : "hover:bg-[#d00000] active:scale-[0.98]"
                    }`}
                >
                  {formik.isSubmitting ? "Verificando..." : "Iniciar sesión"}
                </button>
              </div>
              <div className="mt-2 text-center">
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
            </form>
          </div>
        </main>
      </div>
      <footer className="w-full h-fit flex flex-col items-center justify-between bg-primary space-y-5 py-3">
        <div className="flex items-center justify-center space-x-6">
          <h3 className="text-white text-sm font-semibold">
            ¿Ya viste las novedades?
          </h3>
          <a
            href="/pagos"
            className="text-white text-center text-xs uppercase font-black p-3 w-35 bg-black rounded-lg cursor-pointer"
          >
            Haste premium
          </a>
        </div>
        <div className="text-center text-xs text-white">
          <p>
            © {new Date().getFullYear()} QMenu. Todos los derechos reservados.
          </p>
          <p>
            Por{" "}
            <a
              className="font-bold cursor-pointer"
              href="https://github.com/nicobarrera"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nico Barrera
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
