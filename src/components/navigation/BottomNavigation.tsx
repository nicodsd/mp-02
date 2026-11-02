"use client";
import { useRouter } from "next/navigation";
import QrModalsGenerator from "@/src/components/modals/QrModalsGenerator";
import { useState } from "react";
import {
  FaQrcode,
  FaPlusCircle,
  FaUserEdit,
} from "react-icons/fa";
import {
  HiOutlineTicket,
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
  foods,
  template,
}: BottomNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const navItems = [
    {
      label: "Compartir QR",
      icon: <FaQrcode size={22} />,
      action: () => {
        if (isOpen === true) {
          setIsOpen(false);
        } else {
          setIsOpen(true);
        }
      },
    },
    {
      label: "Agregar Plato",
      icon: <FaPlusCircle size={22} />,
      action: () => router.push("/nuevo-plato"),
    },
    {
      label: "Promocionar",
      icon: <HiOutlineTicket size={22} />,
      action: () => router.push("/panel-de-usuario?seccion=promociones"),
    },
    {
      label: "Editar Perfil",
      icon: <FaUserEdit size={22} />,
      action: () => router.push("/panel-de-usuario"),
    },
  ]

  /*  template_id: 'royal',
      name: 'Royal',
      bgMenu: 'bg-[#fafeff]',
      backgroundColor: 'bg-[#fafeff]',
      backgroundColor2: 'bg-[#F4F7FF]',
      accentColors: [ 'bg-[#070B24]', 'bg-[#0223a8]', 'bg-[#F4F7FF]', 'bg-[#FFF0F3]' ],
      accentColors2: [ '[#070B24]', '[#0223a8]', '[#F4F7FF]', '[#FFF0F3]' ],
      textColor: 'text-[#001154]',
      textColorOpacity: 'text-[#001154]/60',
      textColor2: 'text-white',
      icons: 'text-[#0223a8]',
      border: 'border-[#0223a8]/30' */

  return (
    <>
      <QrModalsGenerator
        user={user}
        logoUrl={logoUrl}
        template={template}
        isOpen={isOpen}
        openModal={() => setIsOpen(false)}
      />
      <div className={`fixed bottom-4 w-[95%] md:w-[60%] lg:w-[40%] shadow-md shadow-black/20 border bg-gray-700/40 ${template?.border} backdrop-blur-sm mx-auto rounded-2xl inset-x-0 z-50`}>
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="flex flex-col cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center flex-1 h-full gap-1.5 group active:scale-95 transition-transform"
            >
              <div className={`text-gray-100 group-hover:text-gray-600 group-active:text-gray-600`}>
                {item.icon}
              </div>
              <span className={`text-[10px] md:text-xs font-semibold text-gray-100 group-hover:text-gray-600 uppercase tracking-tighter leading-none`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
