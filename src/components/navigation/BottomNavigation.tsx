"use client";
import { useRouter } from "next/navigation";
import QrModalsGenerator from "@/src/components/modals/QrModalsGenerator";
import PromoDayModal from "@/src/components/modals/PromoDayModal";
import React, { useState } from "react";
import {
  FaQrcode,
  FaTag,
  FaPlusCircle,
  FaUserEdit,
  FaHome,
} from "react-icons/fa";

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
  const [openDiscount, setOpenDiscount] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const navItems = [
    {
      label: "Compartir QR",
      icon: <FaQrcode size={20} />,
      action: () => {
        if (isOpen === true) {
          setIsOpen(false);
        } else {
          setIsOpen(true);
        }
      },
    },
    /*     {
          label: "Promociones",
          icon: <FaTag size={20} />,
          action: () => {
            if (openDiscount === true) {
              setOpenDiscount(false);
            } else {
              setOpenDiscount(true);
            }
          },
        }, */
    {
      label: "Agregar Plato",
      icon: <FaPlusCircle size={22} />,
      action: () => router.push("/nuevo-plato"),
    },
    {
      label: "Editar Perfil",
      icon: <FaUserEdit size={20} />,
      action: () => router.push("/panel-de-usuario"),
    },
    /* {
      label: "Inicio",
      icon: <FaHome size={20} />,
      action: () => console.log("Home"),
    }, */
  ];

  return (
    <>
      {openDiscount && (
        <PromoDayModal openModal={() => setOpenDiscount(false)} foods={foods} />
      )}
      <QrModalsGenerator
        user={user}
        logoUrl={logoUrl}
        template={template}
        isOpen={isOpen}
        openModal={() => setIsOpen(false)}
      />
      <div className={`fixed bottom-3 w-[95%] md:w-[60%] lg:w-[40%] shadow-md shadow-black/20 border border-gray-300/70 backdrop-blur-sm mx-auto rounded-2xl inset-x-0 bg-background/95 z-50`}>
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              /* disabled={item.label === "Promociones"} */
              className="flex flex-col cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center flex-1 h-full gap-1.5 group active:scale-95 transition-transform"
            >
              <div className={`text-gray-900 group-hover:text-red-500 group-active:text-red-500 transition-colors`}>
                {item.icon}
              </div>
              <span className={`text-[10px] md:text-xs font-semibold text-gray-900 group-hover:text-red-500 uppercase tracking-tighter leading-none`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
