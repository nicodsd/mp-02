"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function MiddleSection() {
    return (
        <section id="caracteristicas" className="relative md:my-10 overflow-hidden w-full">
            <div className="w-full md:px-10 space-x-6 md:py-20 pt-10 pb-46 grid grid-cols-1 md:grid-cols-2 items-center justify-center relative z-0 h-full">

                <div className="absolute z-0 h-full md:h-3/4 w-full bg-linear-to-br from-red-600 to-orange-600 rounded-2xl"></div>
                <div className="text-center px-4 md:text-start flex flex-col z-10 w-full items-start justify-center">
                    <motion.h2 initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-[3rem] leading-none md:text-[3.5rem] font-bold text-white mb-4 md:mb-6">¿Te imaginas tener tu <span className="bg-clip-text text-transparent bg-lime-200">local en internet?</span></motion.h2>
                    <motion.p initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-white text-base md:text-lg w-fit">
                        Ahora es posible, y gratis, con <span className="font-black">QMenu</span> puedes crear un menú digital profesional en minutos y compartirlo con tus clientes a través de un código QR o un enlace personalizado.
                    </motion.p>
                </div>

                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="absolute -bottom-10 md:hidden w-full flex justify-center">
                    <Image src="/images/placeholders/image-background-foods.png" alt="menu-digital-whatsapp" width={500} height={500} className="w-100 md:hidden mx-auto h-auto z-20" />
                </motion.div>

                {/*deskt*/}
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="w-180 hidden md:block -right-20 mt-auto mb-0 absolute">
                    <Image src="/images/placeholders/image-background-foods.png" alt="comida-volando" width={500} height={500} className="w-full drop-shadow-xl shadow-black -rotate-3 hidden md:block h-auto z-30" />
                </motion.div>
            </div>
        </section>
    );
}