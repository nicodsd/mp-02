"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";

interface MenuItem {
  _id?: string;
  menuEnlisted?: number;
  location?: string;
  photo?: string;
}

interface TemplateConfig {
  backgroundColor?: string;
  backgroundColor2?: string;
  textColor?: string;
  textColorOpacity?: string;
  border?: string;
  icons?: string;
}

interface BranchesModalProps {
  menus: MenuItem[];
  userName: string;
  template?: TemplateConfig;
}

export default function BranchesModal({ template, menus = [], userName }: BranchesModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Helper memoizado para generar la URL del menú de forma consistente
  const getMenuLink = useCallback(
    (menu: MenuItem) => {
      const isCentral = menu?.menuEnlisted === 0;
      const identifier =
        menu?.menuEnlisted ??
        (menu?.location ? menu.location.replace(/\s+/g, "-") : menu._id);

      return isCentral
        ? `/menu-digital/${userName}`
        : `/menu-digital/${userName}/${identifier}`;
    },
    [userName]
  );

  // Helper para comparar rutas de manera segura
  const isCurrentPath = useCallback(
    (link: string) => {
      try {
        return decodeURIComponent(pathname) === decodeURIComponent(link);
      } catch {
        return pathname === link;
      }
    },
    [pathname]
  );

  useEffect(() => {
    if (!menus || menus.length === 0) return;

    // Comprobamos si la ruta actual coincide con CUALQUIERA de las sucursales pasadas
    const isAlreadyOnAMenu = menus.some((menu) => {
      const link = getMenuLink(menu);
      return isCurrentPath(link);
    });

    // Solo abrimos el modal si el usuario NO está ya navegando en alguno de los menús
    if (!isAlreadyOnAMenu) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [menus, pathname, getMenuLink, isCurrentPath]);

  if (!isOpen) return null;

  const handleEnter = (menu: MenuItem) => {
    const link = getMenuLink(menu);

    if (isCurrentPath(link)) {
      setIsOpen(false);
    } else {
      setIsOpen(false);
      router.push(link);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3">
      <div
        className={`${template?.backgroundColor || "bg-white"} ${template?.textColor || "text-black"
          } rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-300`}
      >
        <div
          className={`flex items-center justify-between p-2 px-4 border-b ${template?.border || "border-gray-100"
            }`}
        >
          <h2 className="text-xl font-semibold">Elige una sucursal</h2>
          <button
            onClick={() => setIsOpen(false)}
            className={`${template?.textColor || "text-black"
              } transition-colors p-2 rounded-full hover:bg-black/5`}
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
            {menus.map((menu, idx) => {
              const link = getMenuLink(menu);
              const active = isCurrentPath(link);

              return (
                <button
                  key={menu._id || idx}
                  onClick={() => handleEnter(menu)}
                  className={`w-full flex items-center justify-between p-2 px-3 ${template?.backgroundColor || "bg-white"
                    } ${template?.textColor || "text-black"} border ${template?.border || "border-gray-200"
                    } rounded-xl hover:border-primary hover:shadow-md transition-all group text-left ${active ? "ring-2 ring-primary/50" : ""
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full relative overflow-hidden bg-gray-100 border ${template?.border || "border-gray-200"
                        } shrink-0`}
                    >
                      {menu.photo ? (
                        <Image
                          src={menu.photo}
                          alt={menu.location || "Sucursal"}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FaMapMarkerAlt size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center justify-start gap-1">
                        <FaMapMarkerAlt
                          className={template?.icons || "text-black"}
                          size={16}
                        />
                        <h3
                          className={`${template?.textColor || "text-black"
                            } font-semibold text-sm group-hover:text-primary transition-colors`}
                        >
                          {menu.location || "Sucursal principal"}
                        </h3>
                      </div>
                      <p
                        className={`text-xs ${template?.textColorOpacity || "opacity-70"
                          }`}
                      >
                        {active ? "Sucursal actual" : "Entrar a ver el menú"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full ${template?.backgroundColor2 || "bg-gray-50"
                      } flex items-center justify-center group-hover:bg-primary/10 transition-colors`}
                  >
                    <span className="text-gray-400 group-hover:text-primary transition-colors">
                      →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 text-center">
          <button
            onClick={() => setIsOpen(false)}
            className={`${template?.textColor || "text-black"
              } hover:opacity-80 font-semibold underline underline-offset-4 transition-colors text-sm`}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}