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
    <div className="flex flex-wrap justify-center md:justify-start gap-6 lg:gap-10 mb-6 pb-6">
      {/* Sección Logo */}
      <div className="flex flex-col items-center gap-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Logo
        </span>

        <div className="group relative w-32 h-32 md:w-40 md:h-40 lg:w-56 lg:h-56 rounded-full p-1 bg-white ring-1 ring-gray-200 shadow-sm hover:shadow-md hover:ring-indigo-300 transition-all duration-300">
          <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-50">
            <Image
              src={previewPhoto}
              alt="Profile"
              width={200}
              height={200}
              quality={75}
              loading="eager"
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />

            <label className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 active:bg-slate-900/70 text-white font-medium text-sm md:text-base cursor-pointer transition-all duration-300">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onPhotoSelect(f);
                }}
              />
              <div className="p-2.5 rounded-full bg-white/20 backdrop-blur-md">
                <FaCamera className="text-lg" />
              </div>
              <span>Cambiar logo</span>
            </label>
          </div>
        </div>
      </div>

      {/* Sección Fondo */}
      {plan !== "free" ? (
        <div className="flex flex-col items-center gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Fondo
          </span>

          <div className="group relative w-48 h-32 md:w-64 md:h-40 lg:w-80 lg:h-56 rounded-2xl p-1 bg-white ring-1 ring-gray-200 shadow-sm hover:shadow-md hover:ring-indigo-300 transition-all duration-300">
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-50">
              <Image
                src={previewBackground || placeholder}
                alt="background"
                width={200}
                height={200}
                quality={75}
                loading="eager"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />

              <label className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 active:bg-slate-900/70 text-white font-medium text-sm md:text-base cursor-pointer transition-all duration-300">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onBackgroundSelect(f);
                  }}
                />
                <div className="p-2.5 rounded-full bg-white/20 backdrop-blur-md">
                  <FaCamera className="text-lg" />
                </div>
                <span>Cambiar fondo</span>
              </label>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Fondo
          </span>

          <Link
            href="/panel-de-usuario?seccion=plan"
            className="group relative flex flex-col items-center justify-center gap-2 px-5 w-48 h-32 md:w-64 md:h-40 lg:w-80 lg:h-56 rounded-2xl border-2 border-dashed border-gray-300 bg-linear-to-b from-gray-50 to-gray-100/80 hover:border-indigo-400 hover:from-indigo-50/40 hover:to-purple-50/40 transition-all duration-300 cursor-pointer overflow-hidden btn-god-rays"
          >
            <div className="p-2.5 rounded-full bg-white shadow-sm ring-1 ring-gray-200/80 group-hover:scale-110 group-hover:ring-indigo-200 transition-transform duration-300">
              <OctagonX size={28} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-gray-700 font-medium text-xs lg:text-sm group-hover:text-indigo-950 transition-colors">
                Mejora tu plan para agregar un fondo
              </p>
              <span className="inline-block mt-1 text-[11px] font-semibold text-indigo-600 group-hover:underline">
                Ver planes →
              </span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default StoreMediaPickers;
