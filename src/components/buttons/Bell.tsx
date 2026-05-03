"use client";
import React, { useState, useEffect } from "react";
import { ConciergeBell } from "lucide-react";
import { useCartStore } from "@/src/lib/useCartStore";
import CartModal from "@/src/components/modals/CartModal";

export default function Bell({ user, template }: { user: any, template: any }) {
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
                className="fixed bottom-6 right-4 p-4 text-white cursor-pointer bg-green-500 shadow-lg border-3 border-black rounded-full z-100 focus:outline-none focus:scale-95 active:scale-95 transition-transform"
            >
                <div className="relative flex items-center justify-center">
                    <ConciergeBell size={40} color="white" />
                    {mounted && count > 0 && (
                        <span className="absolute animate__animated animate__bounce -top-5 font-bold -right-4 bg-red-500 text-white text-[14px] rounded-full min-w-[28px] h-[28px] flex items-center justify-center">
                            {count}
                        </span>
                    )}
                </div>
            </button>
            <CartModal user={user} isOpen={isCartOpen} template={template} onClose={() => setIsCartOpen(false)} />
        </>
    );
}