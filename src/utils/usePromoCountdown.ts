"use client";
import { useState, useEffect } from "react";
import { syncPromoSession } from "@/src/utils/promoServerAction";

const PROMO_DURATION_MS = 12 * 60 * 60 * 1000; // 12 horas
const STORAGE_KEY = "qmenu_plus_promo_end_time";

export interface PromoCountdownState {
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
  mounted: boolean;
}

export function usePromoCountdown(): PromoCountdownState {
  const [state, setState] = useState<PromoCountdownState>({
    hours: "12",
    minutes: "00",
    seconds: "00",
    isExpired: false,
    mounted: false,
  });

  useEffect(() => {
    let isCancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;
    let endTime = Date.now() + PROMO_DURATION_MS;
    let clockOffset = 0; // diferencia entre reloj del servidor y reloj del cliente

    // Lectura rápida inicial de respaldo mientras responde la cookie HttpOnly del servidor
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed > 0) {
          endTime = parsed;
        }
      }
    } catch {
      // Ignorar errores de localStorage
    }

    const updateTimer = (): boolean => {
      if (isCancelled) return true;
      const currentServerTime = Date.now() + clockOffset;
      const diff = endTime - currentServerTime;

      if (diff <= 0) {
        setState({
          hours: "00",
          minutes: "00",
          seconds: "00",
          isExpired: true,
          mounted: true,
        });
        return true;
      }

      const totalSeconds = Math.max(0, Math.floor(diff / 1000));
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      setState({
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
        isExpired: false,
        mounted: true,
      });
      return false;
    };

    const startCountdownLoop = () => {
      if (interval) clearInterval(interval);
      const expired = updateTimer();
      if (expired) return;

      interval = setInterval(() => {
        const isDone = updateTimer();
        if (isDone && interval) {
          clearInterval(interval);
        }
      }, 1000);
    };

    // Sincronización autoritativa con la cookie HttpOnly firmada en el servidor
    syncPromoSession()
      .then((serverData) => {
        if (isCancelled) return;
        endTime = serverData.endTime;
        clockOffset = serverData.serverNow - Date.now();
        try {
          localStorage.setItem(STORAGE_KEY, String(endTime));
        } catch {
          // Ignorar errores de almacenamiento
        }
        startCountdownLoop();
      })
      .catch(() => {
        if (isCancelled) return;
        startCountdownLoop();
      });

    return () => {
      isCancelled = true;
      if (interval) clearInterval(interval);
    };
  }, []);

  return state;
}
