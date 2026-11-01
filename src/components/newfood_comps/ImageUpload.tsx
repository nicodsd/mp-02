"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaCamera, FaImages, FaSyncAlt } from "react-icons/fa";
import { HiX } from "react-icons/hi";

export const ImageUpload = ({ preview, file, onImageChange, onDelete, imgPlaceholder, onError }: any) => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const cameraInputRef = useRef<HTMLInputElement | null>(null);

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
        if (onError) onError("");
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                cameraInputRef.current?.click();
                return;
            }

            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }

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
            const msg =
                err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError"
                    ? "Permiso de cámara denegado. Habilita el acceso a la cámara en tu navegador."
                    : "No se pudo acceder a la cámara. Verifica los permisos o el dispositivo.";
            if (onError) onError(msg);
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

    return (
        <div className="flex flex-col items-center gap-4 relative">
            <div className="relative w-full flex items-center justify-center gap-2 flex-col">
                <div className="w-full h-60 rounded-lg flex items-center justify-center relative overflow-hidden group bg-white">
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
                                className="absolute top-2 right-2 z-10 p-2 text-white bg-black/60 rounded-full transition-colors active:scale-90"
                                title="Cerrar cámara"
                            >
                                <HiX size={24} />
                            </button>
                            <button
                                type="button"
                                onClick={toggleCameraFacing}
                                className="absolute top-2 left-2 z-10 p-2 text-white bg-black/60 rounded-full transition-colors active:scale-90"
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
                    ) : preview !== imgPlaceholder ? (
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
                                className="absolute top-2 right-2 z-10 p-2 text-white bg-black/60 rounded-full transition-colors active:scale-90"
                            >
                                <HiX size={30} />
                            </button>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#00000040] p-4">
                            <label className="w-full flex-1 font-semibold text-white text-base gap-2 flex flex-col items-center justify-center bg-black/40 hover:bg-black/60 active:scale-95 rounded-lg cursor-pointer transition">
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) onImageChange(f);
                                    }}
                                />
                                <FaImages size={28} />
                                <span>Desde galería</span>
                            </label>

                            <button
                                type="button"
                                onClick={() => startCamera()}
                                className="w-full flex-1 font-semibold text-white text-base gap-2 flex flex-col items-center justify-center bg-black/40 hover:bg-black/60 active:scale-95 rounded-lg cursor-pointer transition"
                            >
                                <FaCamera size={28} />
                                <span>Tomar foto</span>
                            </button>

                            <input
                                ref={cameraInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                hidden
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) onImageChange(f);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};