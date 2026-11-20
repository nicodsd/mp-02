"use client";
import React from "react";
import QrCode from "@/src/components/user-settings/QrCode";

interface QrAndShareSectionProps {
  user: any;
  previewPhoto: string;
}

const QrAndShareSection: React.FC<QrAndShareSectionProps> = ({
  user,
  previewPhoto,
}) => {

  return (
    <>
      <div className="w-full mt-3 flex flex-col gap-y-1 md:pl-6">
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
      </div>
    </>
  );
};

export default QrAndShareSection;
