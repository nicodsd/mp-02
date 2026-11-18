export type CookieCategory = "necessary" | "preferences" | "analytics" | "marketing";

export interface CookiePreferences {
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  version: number;
}

export const COOKIE_CONSENT_KEY = "qmenu_cookie_consent";
export const MENU_COOKIE_KEY = "qmenu_customer_consent";
export const COOKIE_CONSENT_VERSION = 2;

export const COOKIE_CONSENT_UPDATED_EVENT = "qmenu:cookie-consent-updated";
export const OPEN_COOKIE_PREFERENCES_EVENT = "qmenu:open-cookie-preferences";

export const DEFAULT_COOKIE_PREFERENCES: CookiePreferences = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
  updatedAt: "",
  version: COOKIE_CONSENT_VERSION,
};

export const ALL_ACCEPTED_PREFERENCES: Omit<CookiePreferences, "updatedAt" | "version"> = {
  necessary: true,
  preferences: true,
  analytics: true,
  marketing: true,
};

export const ONLY_NECESSARY_PREFERENCES: Omit<CookiePreferences, "updatedAt" | "version"> = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | unknown[]>;
    gtag?: (...args: unknown[]) => void;
  }
}

function parseLegacyOrStored(raw: string | null): CookiePreferences | null {
  if (!raw) return null;

  if (raw === "accepted") {
    return {
      ...ALL_ACCEPTED_PREFERENCES,
      updatedAt: new Date().toISOString(),
      version: COOKIE_CONSENT_VERSION,
    };
  }

  if (raw === "declined") {
    return {
      ...ONLY_NECESSARY_PREFERENCES,
      updatedAt: new Date().toISOString(),
      version: COOKIE_CONSENT_VERSION,
    };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<CookiePreferences>;
    if (parsed && typeof parsed === "object") {
      return {
        necessary: true,
        preferences: Boolean(parsed.preferences),
        analytics: Boolean(parsed.analytics),
        marketing: Boolean(parsed.marketing),
        updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
        version: typeof parsed.version === "number" ? parsed.version : COOKIE_CONSENT_VERSION,
      };
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Reads stored cookie preferences from localStorage.
 * Returns null if the user has not made a choice yet.
 */
export function getStoredCookiePreferences(): CookiePreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const mainRaw = localStorage.getItem(COOKIE_CONSENT_KEY);
    const parsedMain = parseLegacyOrStored(mainRaw);
    if (parsedMain) return parsedMain;

    const menuRaw = localStorage.getItem(MENU_COOKIE_KEY);
    return parseLegacyOrStored(menuRaw);
  } catch {
    return null;
  }
}

/**
 * Updates Google Tag Manager Consent Mode v2 and pushes a dataLayer event.
 */
export function syncGtmConsent(prefs: CookiePreferences): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  const gtag =
    window.gtag ||
    function gtagPush(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  const consentState = {
    security_storage: "granted",
    functionality_storage: prefs.preferences ? "granted" : "denied",
    personalization_storage: prefs.preferences ? "granted" : "denied",
    analytics_storage: prefs.analytics ? "granted" : "denied",
    ad_storage: prefs.marketing ? "granted" : "denied",
    ad_user_data: prefs.marketing ? "granted" : "denied",
    ad_personalization: prefs.marketing ? "granted" : "denied",
  };

  gtag("consent", "update", consentState);

  window.dataLayer.push({
    event: "cookie_consent_update",
    cookie_consent: {
      necessary: true,
      preferences: prefs.preferences,
      analytics: prefs.analytics,
      marketing: prefs.marketing,
    },
  });
}

/**
 * Persists cookie preferences, syncs GTM Consent Mode v2, and notifies listeners.
 */
export function saveCookiePreferences(
  selection: Pick<CookiePreferences, "preferences" | "analytics" | "marketing">
): CookiePreferences {
  const fullPrefs: CookiePreferences = {
    necessary: true,
    preferences: Boolean(selection.preferences),
    analytics: Boolean(selection.analytics),
    marketing: Boolean(selection.marketing),
    updatedAt: new Date().toISOString(),
    version: COOKIE_CONSENT_VERSION,
  };

  if (typeof window !== "undefined") {
    try {
      const serialized = JSON.stringify(fullPrefs);
      localStorage.setItem(COOKIE_CONSENT_KEY, serialized);
      localStorage.setItem(MENU_COOKIE_KEY, serialized);
    } catch {
      // Ignore storage quota / private mode errors
    }

    syncGtmConsent(fullPrefs);
    window.dispatchEvent(
      new CustomEvent<CookiePreferences>(COOKIE_CONSENT_UPDATED_EVENT, {
        detail: fullPrefs,
      })
    );
  }

  return fullPrefs;
}

/**
 * Dispatches an event to open the global cookie preferences modal from anywhere.
 */
export function openCookiePreferences(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_COOKIE_PREFERENCES_EVENT));
}
