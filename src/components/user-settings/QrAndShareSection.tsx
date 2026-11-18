"use client";
import React, { useState } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import QrCode from "@/src/components/user-settings/QrCode";
import { logoutUser } from "@/src/utils/logout";

interface QrAndShareSectionProps {
  user: any;
  previewPhoto: string;
}

const QrAndShareSection: React.FC<QrAndShareSectionProps> = ({
  user,
  previewPhoto,
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutUserAction = async (userId: string) => {
    setIsLoggingOut(true);
    try {
      await logoutUser(userId);
    } catch (err) {
      console.error("Error en logout:", err);
    } finally {
      window.location.replace("/");
    }
  };

  return (
    <>
      <div className="w-full md:w-5/12 lg:w-1/3 px-3 mt-3 flex flex-col gap-y-1 border-gray-200 md:pl-6">
        <h2 className="text-xl font-bold text-gray-800">
          {user?.plan !== "free" ? "Personaliza y Comparte" : "Comparte"}
        </h2>
        <span className="text-gray-500 text-sm">
          Comparte el código QR para acceder a tu menú, o tambien puedes copiar
          el enlace para compartir en tus redes sociales.
        </span>

        <div className="w-full flex mt-5 md:mt-16 justify-center">
          <QrCode user={user} logoUrl={previewPhoto} />
        </div>
        <div className="w-full pl-5">
          <button
            type="button"
            onClick={() => handleLogoutUserAction(String(user?.id))}
            className="mt-10 md:mt-30 flex items-center active:scale-90 gap-3 text-red-500 active:text-red-900 transition-colors md:hidden font-bold cursor-pointer"
          >
            <HiOutlineLogout size={20} /> Cerrar Sesión
          </button>
        </div>
      </div>

      {isLoggingOut && (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-primary animate-spin mb-4" />
          <p className="text-base font-bold text-gray-800">
            Cerrando sesión...
          </p>
        </div>
      )}
    </>
  );
};

export default QrAndShareSection;
