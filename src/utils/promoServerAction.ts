"use server";

import { cookies } from "next/headers";
import crypto from "crypto";
import {
  OFFICIAL_PLAN_PRICES,
  PaidPlanId,
  isValidPaidPlanId,
} from "@/src/utils/planPricing";

const PROMO_DURATION_MS = 12 * 60 * 60 * 1000; // 12 horas
const PROMO_COOKIE_NAME = "qmenu_promo_exp_sig";
const SECRET_KEY =
  process.env.PROMO_SIGNING_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "qmenu-immutable-promo-hmac-secret-2026";

function signTimestamp(timestamp: number): string {
  const payload = String(timestamp);
  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
}

function verifySignedTimestamp(cookieValue: string | undefined): number | null {
  if (!cookieValue || !cookieValue.includes(".")) return null;
  const [payload, signature] = cookieValue.split(".");
  const parsed = parseInt(payload, 10);
  if (isNaN(parsed) || parsed <= 0) return null;

  const expectedSig = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(payload)
    .digest("hex");

  try {
    const sigBuf = Buffer.from(signature, "hex");
    const expectedBuf = Buffer.from(expectedSig, "hex");
    if (sigBuf.length !== expectedBuf.length) return null;
    if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export interface ServerPromoSyncResult {
  endTime: number;
  serverNow: number;
  isExpired: boolean;
}

/**
 * Inicializa o recupera el tiempo de finalización de la promo desde una cookie HttpOnly firmada.
 * Al ser HttpOnly y firmada con HMAC, el usuario no puede editarla ni borrarla desde el navegador/HTML/consola.
 */
export async function syncPromoSession(): Promise<ServerPromoSyncResult> {
  const cookieStore = await cookies();
  const now = Date.now();
  const existingCookie = cookieStore.get(PROMO_COOKIE_NAME)?.value;
  let endTime = verifySignedTimestamp(existingCookie);

  if (!endTime) {
    endTime = now + PROMO_DURATION_MS;
    const signedValue = signTimestamp(endTime);
    cookieStore.set(PROMO_COOKIE_NAME, signedValue, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      // Se conserva por 1 año para que, una vez expirada la promo de 12hs, no se reinicie sola
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return {
    endTime,
    serverNow: now,
    isExpired: now >= endTime,
  };
}

export interface VerifiedSubscriptionPayload {
  plan: PaidPlanId;
  transaction_amount: number;
  isPromoActive: boolean;
}

/**
 * Calcula en el servidor el precio exacto e inalterable de la suscripción según el ID del plan
 * y la validez real de la promoción de 12hs almacenada en la cookie HttpOnly firmada.
 */
export async function getVerifiedSubscriptionPayload(
  planId: unknown
): Promise<VerifiedSubscriptionPayload> {
  if (!isValidPaidPlanId(planId)) {
    throw new Error("Plan de suscripción inválido.");
  }

  const { isExpired } = await syncPromoSession();

  if (planId === "premium") {
    return {
      plan: "premium",
      transaction_amount: OFFICIAL_PLAN_PRICES.premium.regular,
      isPromoActive: false,
    };
  }

  // Plan Plus+
  const amount = isExpired
    ? OFFICIAL_PLAN_PRICES.plus.regular
    : OFFICIAL_PLAN_PRICES.plus.promo;

  return {
    plan: "plus",
    transaction_amount: amount,
    isPromoActive: !isExpired,
  };
}

