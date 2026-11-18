"use client";
import { useRouter } from "next/navigation";
import QrModalsGenerator from "@/src/components/modals/QrModalsGenerator";
import { useState } from "react";
import { Store, PlusCircle } from "lucide-react";
import {
  FaQrcode,
  FaPlusCircle
} from "react-icons/fa";
import {
  HiOutlineShoppingBag,
} from "react-icons/hi";

interface BottomNavigationProps {
  user: any;
  logoUrl?: string;
  foods?: any;
  template?: any;
}

export default function BottomNavigation({
  user,
  logoUrl,
  template,
}: BottomNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const navItems = [
    {
      label: "Compartir QR",
      icon: <FaQrcode className="h-8 w-8 transition-colors" />,
      action: () => {
        setIsOpen((prev) => !prev);
      },
    },
    {
      label: "Agregar Plato",
      // fill-current permite que el ícono de Lucide tome el color del texto al presionarlo
      icon: <PlusCircle className="h-8 w-8 fill-transparent active:fill-current transition-colors" />,
      action: () => router.push("/nuevo-plato"),
    },
    {
      label: "Comandas",
      icon: <HiOutlineShoppingBag className="h-8 w-8 fill-transparent active:fill-current transition-colors" />,
      action: () => router.push("/panel-de-usuario?seccion=comandas"),
    },
    {
      label: "Panel",
      icon: <Store className="h-8 w-8 fill-transparent active:fill-current transition-colors" />,
      action: () => router.push("/panel-de-usuario"),
    },
  ];

  return (
    <>
      <QrModalsGenerator
        user={user}
        logoUrl={logoUrl}
        template={template}
        isOpen={isOpen}
        openModal={() => setIsOpen(false)}
      />
      <div className={`fixed bottom-4 px-4 w-[95%] md:w-[60%] lg:w-[40%] shadow-md shadow-black/20 border bg-gray-700/50 ${template?.border} backdrop-blur-sm mx-auto rounded-2xl inset-x-0 z-50`}>
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="flex flex-col cursor-pointer hover:scale-103 disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center flex-1 h-full gap-1.5 group active:scale-95 transition-transform"
            >
              {/* Añadimos clases active para cambiar el color y el relleno al presionar */}
              <div className="text-gray-100 group-active:text-white">
                {item.icon}
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}