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
  name: string;
  logoUrl?: string;
  foods?: any;
}

export default function BottomNavigation({
  name,
  logoUrl,
  foods,
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
    {
      label: "Promociones",
      icon: <FaTag size={20} />,
      action: () => {
        if (openDiscount === true) {
          setOpenDiscount(false);
        } else {
          setOpenDiscount(true);
        }
      },
    },
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
        name={name}
        logoUrl={logoUrl}
        isOpen={isOpen}
        openModal={() => setIsOpen(false)}
      />
      <div className="fixed bottom-0 inset-x-0 bg-background border-t border-gray-200 pb-2 z-50">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="flex flex-col cursor-pointer items-center justify-center flex-1 h-full gap-1 group active:scale-95 transition-transform"
            >
              <div className="text-gray-500 group-hover:text-primary group-active:text-primary transition-colors">
                {item.icon}
              </div>
              <span className="text-[10px] font-bold text-gray-500 group-hover:text-black uppercase tracking-tighter leading-none">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
