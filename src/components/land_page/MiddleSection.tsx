"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function MiddleSection() {
    return (
        <section id="caracteristicas" className="relative md:py-0 md:pb-10 overflow-hidden w-full">
            <div className="w-full px-3 md:px-30 space-x-6 py-12 grid grid-cols-1 md:grid-cols-2 items-center justify-center relative z-10">
                <div className="absolute z-0 w-full h-full md:h-3/4 bg-red-700 rounded-4xl md:rounded-[4.5rem]"></div>
                <div className="text-center md:text-start flex flex-col z-10 w-full items-start justify-center">
                    <motion.h2 initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-[3rem] leading-none md:text-6xl md:pr-10 font-bold text-white mb-4 md:mb-6">¿Te imaginas tener tu <span className="bg-clip-text text-transparent bg-lime-300">local en internet?</span></motion.h2>
                    <motion.p initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-white text-base md:text-lg w-fit">
                        Ahora es posible, y gratis, con <span className="font-bold">QMenu</span> puedes crear un menú digital profesional en minutos y compartirlo con tus clientes a través de un código QR o un enlace personalizado.
                    </motion.p>
                </div>

                {/*mobile*/}
                <Image src="/images/placeholders/image-background-foods.png" alt="" width={500} height={500} className="w-200 md:hidden bottom-30 mx-auto absolute h-auto z-20" />
                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="relative md:hidden w-full flex justify-center">
                    <div className="absolute z-60 w-full h-40 bottom-0 bg-linear-to-b from-transparent to-black translate-y-6 rounded-b-[5rem]"></div>
                    <Image src="/images/placeholders/imagen-phone.png" alt="" width={1920} height={1080} className="w-45 border-3 translate-y-2 border-primary h-auto z-50  rounded-3xl shadow-xl shadow-primary" />
                </motion.div>

                {/*deskt*/}
                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="relative hidden md:flex w-full justify-center">
                    <div className="absolute z-20 w-70 h-20 bottom-0 bg-linear-to-b from-transparent to-red-700 rounded-[5rem]"></div>
                    <Image src="/images/placeholders/imagen-phone.png" alt="vista-de-telefono-con-la-app" priority width={500} height={500} className="w-60 border-3 border-primary h-auto z-10 -translate-y-6 rounded-3xl shadow-2xl shadow-red-800" />
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="w-160 hidden md:block -right-35 absolute">
                        <Image src="/images/placeholders/image-background-foods.png" alt="" width={500} height={500} className="w-160 hidden md:block h-auto z-30" />
                    </motion.div>
                    <div className="absolute z-0 w-70 h-20 bottom-0 bg-red-700 rounded-[5rem]"></div>
                </motion.div>
            </div>
        </section>
    );
}