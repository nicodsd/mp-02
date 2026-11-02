"use client";

import React, { useState, useRef, useEffect, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import { FaCamera, FaImages, FaSyncAlt, FaCloudUploadAlt } from "react-icons/fa";
import { HiX } from "react-icons/hi";

interface ImageUploadProps {
    preview?: string;
    file?: File | null;
    onImageChange: (file: File) => void;
    onDelete?: () => void;
    imgPlaceholder?: string;
    onError?: (errorMsg: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    preview,
    onImageChange,
    onDelete,
    imgPlaceholder,
    onError,
}) => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const cameraInputRef = useRef<HTMLInputElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        setIsCameraOpen(false);
    };

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async (mode: "environment" | "user" = facingMode) => {
        onError?.("");
        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                cameraInputRef.current?.click();
                return;
            }

            stopCamera();

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: mode } },
                audio: false,
            });

            streamRef.current = stream;
            setIsCameraOpen(true);

            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play().catch(() => { });
                }
            }, 50);
        } catch (err: any) {
            const isPermissionError =
                err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError";
            const msg = isPermissionError
                ? "Permiso de cámara denegado. Habilita el acceso a la cámara en tu navegador."
                : "No se pudo acceder a la cámara. Verifica los permisos o el dispositivo.";
            onError?.(msg);
        }
    };

    const toggleCameraFacing = () => {
        const nextMode = facingMode === "environment" ? "user" : "environment";
        setFacingMode(nextMode);
        startCamera(nextMode);
    };

    const capturePhoto = () => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 640;
        const ctx = canvas.getContext("2d");

        if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const capturedFile = new File([blob], `camera_${Date.now()}.jpg`, {
                            type: "image/jpeg",
                        });
                        onImageChange(capturedFile);
                        stopCamera();
                    }
                },
                "image/jpeg",
                0.9
            );
        }
    };

    const handleFileSelected = (selectedFile?: File | null) => {
        if (!selectedFile) return;

        if (selectedFile.type.startsWith("image/")) {
            stopCamera();
            onImageChange(selectedFile);
        } else {
            onError?.("Por favor, selecciona o arrastra un archivo de imagen válido.");
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileSelected(e.dataTransfer.files?.[0]);
    };

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleFileSelected(e.target.files?.[0]);
        e.target.value = "";
    };

    const hasCustomPreview = preview !== imgPlaceholder;

    return (
        <div className="flex flex-col items-center gap-3 relative w-full">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full h-64 rounded-xl flex items-center justify-center relative overflow-hidden group transition-all border-2 ${isDragging
                    ? "border-blue-500 bg-blue-50/60 border-dashed scale-[1.01]"
                    : hasCustomPreview || isCameraOpen
                        ? "border-gray-200 bg-white border-solid"
                        : "border-gray-300 hover:border-gray-400 bg-background border-dashed"
                    }`}
            >
                {isCameraOpen ? (
                    <div className="relative w-full h-full bg-black flex items-center justify-center">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={stopCamera}
                            className="absolute top-3 right-3 z-10 p-2 text-white bg-black/60 rounded-full transition-colors active:scale-90"
                            title="Cerrar cámara"
                        >
                            <HiX size={24} />
                        </button>
                        <button
                            type="button"
                            onClick={toggleCameraFacing}
                            className="absolute top-3 left-3 z-10 p-2 text-white bg-black/60 rounded-full transition-colors active:scale-90"
                            title="Cambiar cámara"
                        >
                            <FaSyncAlt size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={capturePhoto}
                            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 w-12 h-12 rounded-full bg-white border-4 border-gray-300 shadow-lg active:scale-90 transition-transform"
                            title="Capturar foto"
                        />
                    </div>
                ) : hasCustomPreview ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                            src={preview as string}
                            alt="Vista previa"
                            width={300}
                            height={300}
                            quality={75}
                            loading="eager"
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                            type="button"
                            onClick={onDelete}
                            className="absolute top-3 right-3 z-10 p-2 text-white bg-black/60 hover:bg-black/80 rounded-full transition-colors active:scale-90"
                            title="Quitar imagen"
                        >
                            <HiX size={24} />
                        </button>
                        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-3 py-1.5 bg-black/65 hover:bg-black/80 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 backdrop-blur-xs transition active:scale-95 cursor-pointer"
                            >
                                <FaImages size={14} />
                                <span>Cambiar imagen</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => startCamera()}
                                className="px-3 py-1.5 bg-black/65 hover:bg-black/80 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 backdrop-blur-xs transition active:scale-95 cursor-pointer"
                            >
                                <FaCamera size={14} />
                                <span>Tomar otra</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center cursor-pointer select-none"
                    >
                        <div className="p-3 rounded-full bg-gray-100 text-gray-600 group-hover:scale-110 transition-transform">
                            <FaCloudUploadAlt size={36} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <p className="text-sm font-bold text-gray-700">
                                {isDragging
                                    ? "¡Suelta la imagen aquí!"
                                    : "Arrastra y suelta una imagen o haz clic para explorar"}
                            </p>
                            <p className="text-xs text-gray-400">
                                Soporta JPG, PNG, WEBP desde tu computadora o galería
                            </p>
                        </div>

                        <div className="flex items-center gap-2 w-full max-w-xs my-0.5">
                            <div className="h-px bg-gray-200 flex-1" />
                            <span className="text-[11px] font-semibold uppercase text-gray-400">o</span>
                            <div className="h-px bg-gray-200 flex-1" />
                        </div>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                startCamera();
                            }}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm active:scale-95 transition cursor-pointer"
                        >
                            <FaCamera size={18} />
                            <span>Tomar foto</span>
                        </button>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileInputChange}
                />

                <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    hidden
                    onChange={handleFileInputChange}
                />
            </div>
        </div>
    );
};