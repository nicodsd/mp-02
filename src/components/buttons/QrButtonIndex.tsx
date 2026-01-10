"use client";
import { BsQrCodeScan } from "react-icons/bs";
import "animate.css";

export default function QrButtonWithModal({ openModal }: { openModal: () => void }) {
    return (
        <>
            <button
                onClick={() => openModal()}
                className="flex flex-col text-sm gap-1 items-center font-bold md:right-10 px-2 h-17 w-25 py-2 cursor-pointer hover:opacity-80 hover:scale-105 transition-transform rounded-xl bg-black text-white shadow"
            >
                <BsQrCodeScan className="h-8 w-8 flex flex-col text-sm items-center rounded-full" />
                <p className="text-xs">Compartir QR</p>
            </button>
        </>
    );
}
