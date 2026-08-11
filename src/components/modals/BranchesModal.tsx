"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface BranchesModalProps {
  menus: any[];
  userName: string;
  template: any;
}

export default function BranchesModal({ template, menus, userName }: BranchesModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  console.log(template)
  useEffect(() => {
    // Solo mostramos el modal si hay más de una sucursal, o podemos mostrarlo siempre si hay sucursales.
    // Vamos a mostrarlo si hay al menos una sucursal.
    if (menus && menus.length > 0) {
      setIsOpen(true);
    }
  }, [menus]);

  if (!isOpen) return null;

  const handleEnter = (menu: any) => {
    const identifier = menu?.location ? menu.location.replace(/\s+/g, '-') : menu._id;
    const link = `/menu-digital/${userName}/${identifier}`;
    router.push(link);
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3">
      <div
        className={`${template?.backgroundColor || "bg-white"} ${template?.textColor || "text-black"} rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-300`}
      >
        <div className={`flex items-center justify-between p-2 px-4 border-b ${template?.border || "border-gray-100"}`}>
          <h2 className="text-xl">Elige una sucursal</h2>
          <button
            onClick={() => setIsOpen(false)}
            className={`${template?.textColor || "text-black"} transition-colors p-2 rounded-full hover:bg-gray-100`}
            aria-label="Cerrar modal"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-2 px-4 max-h-[60vh] overflow-y-auto">
          <p className="mb-4 font-light text-sm">
            Por favor, selecciona la sucursal a la que deseas ingresar:
          </p>
          <div className="flex flex-col gap-1">
            {menus.map((menu: any, idx: number) => (
              <button
                key={menu._id || idx}
                onClick={() => handleEnter(menu)}
                className={`w-full flex items-center justify-between p-1 px-2 ${template?.backgroundColor || "bg-white"} ${template?.textColor || "text-black"} border ${template?.border} rounded-xl hover:border-primary hover:shadow-md transition-all group text-left`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full relative overflow-hidden bg-gray-100 border ${template?.border} shrink-0`}>
                    {menu.photo ? (
                      <Image src={menu.photo} alt={menu.location || "Sucursal"} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FaMapMarkerAlt size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center justify-start gap-1">
                      <FaMapMarkerAlt className={template?.icons || "text-black"} size={16} />
                      <h3 className={`${template?.textColor || "text-black"} font-semibold text-sm group-hover:text-primary transition-colors`}>
                        {menu.location || "Sucursal principal"}
                      </h3>
                    </div>
                    <p className={`text-xs ${template?.textColorOpacity || "text-black"}`}>
                      Entrar a ver el menú
                    </p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full ${template?.backgroundColor2 || "bg-gray-50"} flex items-center justify-center group-hover:bg-primary/10 transition-colors`}>
                  <span className="text-gray-400 group-hover:text-primary transition-colors">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 text-center">
          <button
            onClick={() => setIsOpen(false)}
            className={`${template?.textColor || "text-black"} hover:opacity-80 font-semibold underline underline-offset-4 transition-colors`}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
