"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthCookie, setUserCookie } from '@/app/actions';
import { MdChevronLeft, MdImage } from "react-icons/md";
import Link from "next/link";
import logo from "@/public/images/logo/logo-rojo.png";
import Image from "next/image";

export default function LoginPage() {
  const URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else if (e.target.name === 'password') {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const response = await fetch(`${URL}api/auth/signin`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        let user = data.user;
        const { token } = data;
        await setAuthCookie(token);
        await setUserCookie(user);
        router.push("/");
      } else {
        // Handle error (optional: add error state to show message)
        console.error("Login failed:", data);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen font-sans flex flex-col relative selection:bg-secondary selection:text-primary overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full px-6 py-8 z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center text- text-sm font-semibold hover:opacity-80 transition-opacity"
        >
          <MdChevronLeft className="text-xl mr-1" />
          Volver
        </button>
      </div>

      <main className="flex-1 flex flex-col items-end justify-start mt-20 px-3 w-full my-auto">
        <div className="w-full bg-card-light py-8 rounded-3xl border border-gray-500 pt-16 relative transition-colors duration-200 mt-10">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div className="w-24 h-24 rounded-full bg-primary ring-1 border-7 border-white ring-gray-500 flex items-center justify-center">
              <div className="w-full h-full rounded-full flex items-center justify-center">
                <Image
                  src={logo}
                  alt="User"
                  width={100}
                  height={100}
                  className="w-full h-full rounded-full"
                />
                <MdImage className="text-gray-400 text-4xl" />
              </div>
            </div>
          </div>
          <div>

          </div>
          <div className="text-start mb-8 ml-8">
            <h1 className="text-card-dark text-4xl font-extrabold leading-7 tracking-tight">
              ¡Hola<br />
              de nuevo!
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="px-5">
              <div className="relative">
                <label className="sr-only" htmlFor="email">Email</label>
                <input
                  className="block w-full px-4 py-3 rounded-t-lg border-x border-t border-gray-500 text-gray-900 placeholder-gray-500 placeholder:text-base transition-all text-base"
                  id="email"
                  name="email"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative">
                <label className="sr-only" htmlFor="password">Contraseña</label>
                <input
                  className="block w-full px-4 py-3 rounded-b-lg border border-gray-500 text-gray-900 placeholder-gray-500 placeholder:text-base transition-all text-base shadow-md"
                  id="password"
                  name="password"
                  placeholder="Contraseña"
                  type="password"
                  value={password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="flex justify-center">
              <a className="text-xs font-semibold text-gray-500 hover:text-primary transition-colors" href="#">
                ¿Olvidaste tu contraseña?
              </a>
            </div>


            <div className="border-t border-gray-300 pt-4 px-5">
              <button
                className="w-full bg-primary hover:bg-[#d00000] shadow-md text-white font-semibold py-4 px-3 rounded-lg transform active:scale-[0.98] transition-all duration-200 text-sm uppercase tracking-wide cursor-pointer"
                type="submit"
              >
                Iniciar sesión
              </button>
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm font-semibold text-gray-600">
                ¿Aún no tienes cuenta?
              </p>
              <Link className="block text-blue-600 font-bold hover:underline text-base" href="/registro-de-usuario">
                Registrarse
              </Link>
            </div>
          </form>

        </div>
      </main>
      <footer className="w-full h-fit flex flex-col items-center justify-between bg-primary space-y-3 pt-6">
        <div className="flex items-center justify-center space-x-6">
          <h3 className="text-white text-sm font-semibold">¿Ya viste las novedades?</h3>
          <button className="text-white text-xs uppercase font-black p-4 w-35 bg-black rounded-lg">Haste premium</button>
        </div>
        <div className="flex items-center justify-center py-4">
          <p className="text-white text-sm">© 2025 - Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
}