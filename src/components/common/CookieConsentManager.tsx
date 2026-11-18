"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import CookieConsentBanner from "./CookieConsentBanner";
import CookiePreferencesModal from "./CookiePreferencesModal";
import {
  COOKIE_CONSENT_UPDATED_EVENT,
  CookiePreferences,
  OPEN_COOKIE_PREFERENCES_EVENT,
  getStoredCookiePreferences,
} from "@/src/lib/cookieConsent";

export function ConsentAwareAnalytics() {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

  useEffect(() => {
    const stored = getStoredCookiePreferences();
    setAnalyticsAllowed(Boolean(stored?.analytics));

    const handleUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<CookiePreferences>;
      setAnalyticsAllowed(Boolean(customEvent.detail?.analytics));
    };

    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, handleUpdated);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, handleUpdated);
    };
  }, []);

  if (!analyticsAllowed) return null;

  return (
    <>
      <SpeedInsights />
      <Analytics />
    </>
  );
}

export default function CookieConsentManager() {
  const pathname = usePathname();
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsPreferencesOpen(true);
    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, handleOpen);
    return () => {
      window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, handleOpen);
    };
  }, []);

  // En /menu-digital/* se muestra MenuCookieConsentModal con contexto del restaurante
  const isMenuRoute = pathname?.startsWith("/menu-digital");

  return (
    <>
      {!isMenuRoute && (
        <CookieConsentBanner onOpenPreferences={() => setIsPreferencesOpen(true)} />
      )}
      <CookiePreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />
    </>
  );
}
