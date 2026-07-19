"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import image from "@/public/images/placeholders/logo-fifa.webp" // Asegúrate de que esta ruta sea correcta
import { useEffect, useState } from "react";

export default function WelcomeModal() {
  const [show, setShow] = useState(true);
  const [render, setRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 6000);

    const removeTimer = setTimeout(() => {
      setRender(false);
    }, 6500);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!render) return null;

  return (
    <div
      className={`z-100 backdrop-blur-sm bg-black/70 flex flex-col gap-3 items-center py-24 p-8 h-screen fixed top-0 left-0 right-0 bottom-0 w-full justify-center transition-opacity duration-500 ${show ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
    >
      <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: "easeInOut" }} className="bg-white shadow-2xl flex flex-col w-full h-full relative md:w-1/4 md:h-[80vh] rounded-2xl">
        <div className="relative w-full h-[66%] md:h-[80%]">
          <Image className="object-cover rounded-t-2xl w-full h-full" src={image} alt="Background" fill priority />
        </div>
        <div
          className={`relative w-full h-[34%] md:h-[20%] z-10 px-6 flex justify-center items-center transition-transform duration-500 `}
        >
          <p className="text-[#002cee] leading-none text-balance text-5xl font-semibold">¡Promos que son un golazo! ⚽</p>

        </div>
      </motion.div>
      <button onClick={() => setShow(false)} className="relative cursor-pointer z-100 p-2 text-gray-300 rounded-full">
        Cerrar
      </button>
    </div>
  );
}