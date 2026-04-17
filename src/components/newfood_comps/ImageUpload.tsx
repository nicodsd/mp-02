"use client";
import React from "react";
import Image from "next/image";
import { PhotoCamera, DeleteOutline } from "@mui/icons-material";

export const ImageUpload = ({ preview, file, onImageChange, onDelete, imgPlaceholder }: any) => {
    return (
        <div className="flex flex-col items-center gap-4 relative">
            <div className="w-48 h-48 rounded-3xl flex items-center justify-center shadow border-2 border-dashed border-gray-300 relative overflow-hidden group bg-white">
                {preview !== imgPlaceholder ? (
                    <>
                        <Image
                            src={preview}
                            fill
                            alt="Vista previa"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                            type="button"
                            onClick={onDelete}
                            className="absolute top-2 right-2 z-10 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg active:scale-90"
                        >
                            <DeleteOutline fontSize="small" />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center text-gray-400">
                        <PhotoCamera sx={{ fontSize: 48 }} />
                        <span className="text-[10px] font-bold uppercase mt-2">Sin imagen</span>
                    </div>
                )}
            </div>

            <label className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all cursor-pointer active:scale-95">
                <PhotoCamera sx={{ fontSize: 16 }} />
                {file ? "Cambiar Imagen" : "Subir Foto"}
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) onImageChange(f);
                    }}
                />
            </label>
        </div>
    );
};