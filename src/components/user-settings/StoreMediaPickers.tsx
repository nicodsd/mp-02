"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { OctagonX } from "lucide-react";
import { FaCamera } from "react-icons/fa";
import { placeholder } from "@/src/lib/const";

interface StoreMediaPickersProps {
  previewPhoto: string;
  previewBackground: string;
  plan?: string;
  onPhotoSelect: (file: File) => void;
  onBackgroundSelect: (file: File) => void;
}

const StoreMediaPickers: React.FC<StoreMediaPickersProps> = ({
  previewPhoto,
  previewBackground,
  plan,
  onPhotoSelect,
  onBackgroundSelect,
}) => {
  return (
    <div className="flex justify-center md:justify-start gap-5 lg:gap-10 mb-4 pb-6">
      <div className="relative flex items-center justify-center gap-2 flex-col">
        <h3 className="text-lg text-gray-700">Logo</h3>
        <div className="w-30 md:w-40 h-30 md:h-40 lg:w-60 lg:h-60 relative rounded-full overflow-hidden">
          <Image
            src={previewPhoto}
            alt="Profile"
            width={200}
            height={200}
            quality={75}
            loading="eager"
            className="object-cover w-full h-full"
          />
          <label className="absolute top-0 w-full h-full right-1/2 text-center -translate-x-1/2 left-1/2 font-semibold text-white/70 text-xl gap-1 flex flex-col items-center justify-center active:bg-black bg-[#00000040] py-2.5 px-2 rounded-lg cursor-pointer hover:scale-110 transition">
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onPhotoSelect(f);
              }}
            />
            <FaCamera /> Editar
          </label>
        </div>
      </div>

      {plan !== "free" ? (
        <div className="relative flex items-center justify-center gap-2 flex-col">
          <h3 className="text-lg text-gray-700">Fondo</h3>
          <div className="w-45 md:w-60 h-30 md:h-40 lg:w-80 lg:h-60 relative rounded-lg overflow-hidden">
            <Image
              src={previewBackground || placeholder}
              alt="background"
              width={200}
              height={200}
              quality={75}
              loading="eager"
              className="object-cover w-full h-full"
            />
            <label className="absolute top-0 w-full h-full right-1/2 text-center -translate-x-1/2 left-1/2 font-semibold text-white/70 text-xl gap-1 flex flex-col items-center justify-center active:bg-black bg-[#00000040] py-2.5 px-2 rounded-lg cursor-pointer hover:scale-110 transition">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onBackgroundSelect(f);
                }}
              />
              <FaCamera /> Editar
            </label>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 flex-col">
          <h3 className="text-lg text-gray-700">Fondo</h3>
          <Link
            href="/panel-de-usuario?seccion=plan"
            className="px-5 opacity-70 cursor-pointer flex flex-col btn-god-rays items-center border-2 border-gray-400 justify-center gap-1 w-45 md:w-60 h-30 md:h-40 lg:w-80 lg:h-60 bg-gray-200/70 relative rounded-lg overflow-hidden"
          >
            <OctagonX size={50} className="text-gray-400" />
            <span className="text-gray-800 text-[12px] lg:text-md text-center">
              Mejora tu plan para agregar un fondo
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default StoreMediaPickers;
