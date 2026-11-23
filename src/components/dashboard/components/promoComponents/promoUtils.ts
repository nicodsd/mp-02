import { URI } from "@/src/lib/const";

export const priceFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
});

export const PROMO_META_STORAGE_KEY = "qmenu_food_promos_meta_v1";

export type PromoMode = "percentage" | "multiplier" | "second_unit" | "fixed";

export type DurationPreset =
  | "unlimited"
  | "1h"
  | "2h"
  | "3h"
  | "6h"
  | "12h"
  | "24h"
  | "48h"
  | "7d"
  | "custom";

export type RoundingOption = 0 | 50 | 100 | 500;

export interface PromoMetadata {
  mode: PromoMode;
  badge: string;
  percentOff: number;
  buyQty?: number;
  payQty?: number;
  secondUnitPercent?: number;
  startedAt: number;
  expiresAt: number | null;
  durationLabel?: string;
  occasionTag?: string;
  categoryApplied?: boolean;
}

export interface PromoModalTarget {
  type: "single" | "batch" | "category";
  food?: any;
  foods?: any[];
  categoryName?: string;
}

export interface CategorySummary {
  name: string;
  total: number;
  inPromoCount: number;
  availableCount: number;
  avgPrice: number;
  samplePhotos: string[];
  foods: any[];
}

export interface PromoCalculationInput {
  mode: PromoMode;
  percent: number;
  buyQty: number;
  payQty: number;
  secondUnitPercent: number;
  fixedPriceInput: string;
  roundingStep: RoundingOption;
}

export const MULTIPLIER_PRESETS = [
  { label: "2x1", buy: 2, pay: 1, desc: "Llevás 2 y pagás 1 (50% ahorro)" },
  { label: "3x2", buy: 3, pay: 2, desc: "Llevás 3 y pagás 2 (33% ahorro)" },
  { label: "3x1", buy: 3, pay: 1, desc: "Llevás 3 y pagás 1 (67% ahorro)" },
  { label: "4x2", buy: 4, pay: 2, desc: "Llevás 4 y pagás 2 (50% ahorro)" },
  { label: "4x3", buy: 4, pay: 3, desc: "Llevás 4 y pagás 3 (25% ahorro)" },
];

export const SECOND_UNIT_PRESETS = [
  { label: "2da al 50%", secondPercent: 50, effectiveOff: 25, desc: "25% de descuento promedio llevando 2" },
  { label: "2da al 70%", secondPercent: 70, effectiveOff: 35, desc: "35% de descuento promedio llevando 2" },
  { label: "2da al 80%", secondPercent: 80, effectiveOff: 40, desc: "40% de descuento promedio llevando 2" },
];

export const QUICK_PERCENTAGES = [10, 15, 20, 25, 30, 40, 50, 70];

export const DURATION_OPTIONS: { key: DurationPreset; label: string; hours?: number }[] = [
  { key: "unlimited", label: "Sin límite" },
  { key: "1h", label: "1 hora", hours: 1 },
  { key: "2h", label: "2 horas", hours: 2 },
  { key: "3h", label: "3 horas", hours: 3 },
  { key: "6h", label: "6 horas", hours: 6 },
  { key: "12h", label: "12 horas", hours: 12 },
  { key: "24h", label: "24 hs (1 día)", hours: 24 },
  { key: "48h", label: "48 hs (2 días)", hours: 48 },
  { key: "7d", label: "7 días", hours: 168 },
  { key: "custom", label: "Personalizado" },
];

export const OCCASION_TAGS = ["", "Happy Hour", "Solo por hoy", "Promo Flash", "Fin de Semana", "Noche Especial"];

export function roundPrice(value: number, step: RoundingOption): number {
  const safe = Math.max(0, value);
  if (!step || step <= 0 || safe === 0) return Math.round(safe);
  return Math.max(0, Math.round(safe / step) * step);
}

export function formatRemainingTime(ms: number): { text: string; isUrgent: boolean; isExpired: boolean } {
  if (ms <= 0) {
    return { text: "Expirada", isUrgent: true, isExpired: true };
  }
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const isUrgent = totalSeconds < 3600;

  if (days > 0) {
    return {
      text: `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`,
      isUrgent: false,
      isExpired: false,
    };
  }
  return {
    text: `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`,
    isUrgent,
    isExpired: false,
  };
}

export function loadStoredPromoMeta(): Record<string, PromoMetadata> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROMO_META_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveStoredPromoMeta(metaMap: Record<string, PromoMetadata>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROMO_META_STORAGE_KEY, JSON.stringify(metaMap));
  } catch (e) {
    console.error("No se pudo guardar metadata de promociones:", e);
  }
}

export function inferPromoMeta(
  food: any,
  promoMetaMap: Record<string, PromoMetadata>
): PromoMetadata {
  const basePrice = Number(food.price || 0);
  const pPrice = Number(food.promo_price ?? basePrice);
  const inferredPercent =
    basePrice > 0 ? Math.max(0, Math.round(((basePrice - pPrice) / basePrice) * 100)) : 0;

  if (food?.promo_type) {
    return {
      mode: food.promo_type as PromoMode,
      badge:
        food.promo_badge ||
        (pPrice === 0 ? "GRATIS" : inferredPercent > 0 ? `${inferredPercent}% OFF` : "PROMO"),
      percentOff: inferredPercent,
      buyQty: food.promo_buy_qty ?? undefined,
      payQty: food.promo_pay_qty ?? undefined,
      secondUnitPercent: food.promo_second_unit_percent ?? undefined,
      startedAt: food.promo_started_at ?? Date.now(),
      expiresAt: typeof food.promo_expires_at === "number" ? food.promo_expires_at : null,
      occasionTag: food.promo_occasion || undefined,
    };
  }

  const stored = promoMetaMap[String(food._id)];
  if (stored) return stored;

  return {
    mode: "percentage",
    badge: pPrice === 0 ? "GRATIS" : inferredPercent > 0 ? `${inferredPercent}% OFF` : "PROMO",
    percentOff: inferredPercent,
    startedAt: Date.now(),
    expiresAt: null,
  };
}

export function calculatePromoPrice(
  basePriceRaw: number,
  config: PromoCalculationInput
): { promoPrice: number; effectivePercent: number; badge: string } {
  const basePrice = Math.max(0, Number(basePriceRaw) || 0);

  if (config.mode === "percentage") {
    const pct = Math.max(0, Math.min(100, config.percent));
    if (pct === 100) {
      return { promoPrice: 0, effectivePercent: 100, badge: "GRATIS" };
    }
    const rawDiscounted = basePrice - (basePrice * pct) / 100;
    return {
      promoPrice: roundPrice(rawDiscounted, config.roundingStep),
      effectivePercent: pct,
      badge: `${pct}% OFF`,
    };
  }

  if (config.mode === "multiplier") {
    const safeBuy = Math.max(2, Number(config.buyQty) || 2);
    const safePay = Math.max(1, Math.min(safeBuy - 1, Number(config.payQty) || 1));
    const unitEquivalent = (basePrice * safePay) / safeBuy;
    const effPct = Math.round(((safeBuy - safePay) / safeBuy) * 100);
    return {
      promoPrice: roundPrice(unitEquivalent, config.roundingStep),
      effectivePercent: effPct,
      badge: `${safeBuy}x${safePay}`,
    };
  }

  if (config.mode === "second_unit") {
    const safeSecondPct = Math.max(10, Math.min(100, Number(config.secondUnitPercent) || 50));
    const effPct = Math.round(safeSecondPct / 2);
    const rawDiscounted = basePrice - (basePrice * effPct) / 100;
    return {
      promoPrice: roundPrice(rawDiscounted, config.roundingStep),
      effectivePercent: effPct,
      badge: `2da al ${safeSecondPct}%`,
    };
  }

  const fixedVal = Math.max(0, Number(config.fixedPriceInput) || 0);
  const cappedFixed = basePrice > 0 ? Math.min(basePrice, fixedVal) : fixedVal;
  const effPct =
    basePrice > 0 ? Math.max(0, Math.round(((basePrice - cappedFixed) / basePrice) * 100)) : 0;
  return {
    promoPrice: Math.round(cappedFixed),
    effectivePercent: effPct,
    badge: cappedFixed === 0 ? "GRATIS" : effPct > 0 ? `${effPct}% OFF` : "OFERTA",
  };
}

export function computeExpirationTimestamp(
  durationPreset: DurationPreset,
  customExpiresDateTime: string
): { expiresAt: number | null; durationLabel: string } {
  if (durationPreset === "unlimited") {
    return { expiresAt: null, durationLabel: "Sin límite" };
  }
  if (durationPreset === "custom") {
    if (!customExpiresDateTime) return { expiresAt: null, durationLabel: "Sin límite" };
    const parsed = new Date(customExpiresDateTime).getTime();
    if (Number.isNaN(parsed) || parsed <= Date.now()) {
      return { expiresAt: Date.now() + 3600 * 1000, durationLabel: "1 hora" };
    }
    return { expiresAt: parsed, durationLabel: "Personalizado" };
  }
  const found = DURATION_OPTIONS.find((d) => d.key === durationPreset);
  const hours = found?.hours || 1;
  return {
    expiresAt: Date.now() + hours * 3600 * 1000,
    durationLabel: found?.label || `${hours}h`,
  };
}

export async function sendFoodPromoUpdate(
  foodId: string | number,
  body: Record<string, any>
): Promise<boolean> {
  const res = await fetch(`${URI}/foods/promo/${foodId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  return res.ok;
}
