"use client";

import React, { useState } from "react";
import { Coffee } from "lucide-react";

interface PausedMenuNoticeProps {
  restaurantName?: string;
  template?: any;
}

export default function PausedMenuNotice({
  restaurantName,
  template,
}: PausedMenuNoticeProps) {
  const [showModal, setShowModal] = useState(true);

  return (
    <>
      <div
        role="status"
        className="w-[94%] fixed z-1200 top-14 right-1/2 translate-x-1/2 rounded-xl bg-amber-100 border-b border-amber-200 text-amber-900 px-4 py-2.5 flex items-center justify-center gap-2.5 text-sm font-medium"
      >
        <Coffee size={25} className="text-amber-600 shrink-0" />
        <span>
          <strong>Local en descanso:</strong> este menú está pausado temporalmente y no recibe pedidos.
        </span>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="paused-menu-title"
            onClick={(e) => e.stopPropagation()}
            className={`${template?.backgroundColor || "bg-white"} w-full max-w-md p-6 rounded-3xl shadow-2xl border ${template?.border || "border-gray-200"} flex flex-col items-center text-center gap-4`}
          >
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <Coffee size={28} />
            </div>

            <div className="flex flex-col gap-1">
              <h2
                id="paused-menu-title"
                className={`text-xl font-bold ${template?.textColor || "text-gray-900"}`}
              >
                Local en descanso
              </h2>
              {restaurantName && (
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {restaurantName}
                </p>
              )}
            </div>

            <p className={`text-sm ${template?.textColor || "text-gray-600"} opacity-90 leading-relaxed`}>
              Este menú se encuentra pausado temporalmente. Podés recorrer la carta, pero por el momento no se están tomando pedidos.
            </p>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold cursor-pointer active:scale-95 transition-all"
            >
              Ver menú
            </button>
          </div>
        </div>
      )}
    </>
  );
}
