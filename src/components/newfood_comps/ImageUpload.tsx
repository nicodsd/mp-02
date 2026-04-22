"use client";
import React from "react";
import Image from "next/image";
import { PhotoCamera } from "@mui/icons-material";
import { HiX } from "react-icons/hi";

export const ImageUpload = ({ preview, file, onImageChange, onDelete, imgPlaceholder }: any) => {
    return (
        <div className="flex flex-col items-center gap-4 relative">
            <div className="relative flex items-center justify-center gap-2 flex-col">
                <div className="w-60 h-60 rounded-3xl flex items-center justify-center shadow border-2 border-dashed border-gray-300 relative overflow-hidden group bg-white">
                    {preview !== imgPlaceholder ? (
                        <>
                            <Image
                                src={preview}
                                alt="Vista previa"
                                width={200}
                                height={200}
                                quality={75}
                                loading="eager"
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            />
                            <button
                                type="button"
                                onClick={onDelete}
                                className="absolute top-2 right-2 z-10 p-2 text-black bg-gray-300/40 backdrop-blur-sm rounded-full transition-colors active:scale-90"
                            >
                                <HiX size={30} />
                            </button>
                        </>)

                        : (
                            <label className="absolute top-0 w-full h-full right-1/2 text-center -translate-x-1/2 left-1/2 font-semibold text-white/70 text-xl gap-1 flex flex-col items-center justify-center active:bg-black bg-[#00000040] py-2.5 px-2 rounded-lg cursor-pointer hover:scale-110 transition">
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) onImageChange(f);
                                    }}
                                />
                                <PhotoCamera sx={{ fontSize: 48 }} /> Agregar
                            </label>
                        )}
                </div>
            </div>
        </div>
    );
};