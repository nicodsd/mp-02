"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import bell from "@/public/images/icons-index/bell.svg";
import { useCartStore } from "@/src/lib/useCartStore";
import CartModal from "@/src/components/modals/CartModal";

export default function Bell() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { selectedIds } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const count = selectedIds?.length;

    return (
        <>
            <button
                onClick={() => setIsCartOpen(true)}
                className="fixed bottom-5 p-4 text-white cursor-pointer bg-green-500 shadow-md border-3 border-white rounded-full right-5 z-100 focus:outline-none focus:scale-95 active:scale-95 transition-transform"
            >
                <div className="relative flex items-center justify-center">
                    <Image
                        src={bell}
                        alt="Bell"
                        width={30}
                        height={30}
                    />
                    {mounted && count > 0 && (
                        <span className="absolute -top-4 font-bold -right-4 bg-red-500 text-white text-[12px] rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1">
                            {count}
                        </span>
                    )}
                </div>
            </button>
            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}