"use client";

import React from "react";
import { FaSlidersH } from "react-icons/fa";
import { openCookiePreferences } from "@/src/lib/cookieConsent";

export default function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={openCookiePreferences}
      className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-primary hover:bg-red-700 text-white rounded-xl shadow-sm active:scale-95 transition-all cursor-pointer"
    >
      <FaSlidersH size={14} />
      Configurar preferencias de cookies
    </button>
  );
}
