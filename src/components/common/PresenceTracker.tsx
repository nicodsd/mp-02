"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const HEARTBEAT_INTERVAL_MS = 20_000;
const TAB_ID_STORAGE_KEY = "qmenu_presence_tab_id";

function getOrCreateTabId(): string {
  try {
    const existing = sessionStorage.getItem(TAB_ID_STORAGE_KEY);
    if (existing) return existing;
    const created =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `tab_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(TAB_ID_STORAGE_KEY, created);
    return created;
  } catch {
    return `tab_${Date.now()}`;
  }
}

export default function PresenceTracker() {
  const pathname = usePathname() || "/";
  const pathnameRef = useRef(pathname);
  const tabIdRef = useRef<string>("");
  const isTrackedRef = useRef(false);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    tabIdRef.current = getOrCreateTabId();

    const sendHeartbeat = async (forceStatus?: "active" | "idle") => {
      try {
        const status: "active" | "idle" =
          forceStatus ??
          (document.visibilityState === "visible" ? "active" : "idle");

        const res = await fetch("/api/presence/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          keepalive: true,
          body: JSON.stringify({
            path: pathnameRef.current,
            tabId: tabIdRef.current,
            status,
          }),
        });

        if (!res.ok) return;
        const data = await res.json().catch(() => null);
        isTrackedRef.current = Boolean(data?.tracked);
      } catch {
        // Silently ignore transient network errors
      }
    };

    const sendOfflineBeacon = () => {
      if (!isTrackedRef.current || !tabIdRef.current) return;
      try {
        const payload = JSON.stringify({ tabId: tabIdRef.current });
        if (typeof navigator !== "undefined" && navigator.sendBeacon) {
          const blob = new Blob([payload], { type: "application/json" });
          navigator.sendBeacon("/api/presence/offline", blob);
        } else {
          fetch("/api/presence/offline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            keepalive: true,
            body: payload,
          }).catch(() => {});
        }
      } catch {
        // Ignore errors during page unload
      }
    };

    const handleVisibilityChange = () => {
      if (!isTrackedRef.current) return;
      sendHeartbeat(
        document.visibilityState === "visible" ? "active" : "idle"
      );
    };

    const handleFocus = () => {
      if (!isTrackedRef.current) return;
      sendHeartbeat("active");
    };

    // Initial check/heartbeat on mount
    sendHeartbeat();

    const interval = setInterval(() => {
      if (isTrackedRef.current) {
        sendHeartbeat();
      }
    }, HEARTBEAT_INTERVAL_MS);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("pagehide", sendOfflineBeacon);
    window.addEventListener("beforeunload", sendOfflineBeacon);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pagehide", sendOfflineBeacon);
      window.removeEventListener("beforeunload", sendOfflineBeacon);
    };
  }, []);

  // Trigger a heartbeat whenever the user navigates to a new route
  useEffect(() => {
    if (!tabIdRef.current) {
      tabIdRef.current = getOrCreateTabId();
    }

    fetch("/api/presence/heartbeat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        path: pathname,
        tabId: tabIdRef.current,
        status: document.visibilityState === "visible" ? "active" : "idle",
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          isTrackedRef.current = Boolean(data.tracked);
        }
      })
      .catch(() => {});
  }, [pathname]);

  return null;
}
