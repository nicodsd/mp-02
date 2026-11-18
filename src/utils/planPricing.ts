export type PaidPlanId = "plus" | "premium";

/**
 * Precios oficiales inalterables (congelados en memoria para evitar mutaciones en runtime).
 * Ningún componente debe leer precios desde el DOM, strings formateados ni props editables.
 */
export const OFFICIAL_PLAN_PRICES = Object.freeze({
  plus: Object.freeze({
    regular: 24000,
    promo: 12000,
    beforeRegular: 29900,
    beforePromo: 24000,
    name: "Plus+",
  }),
  premium: Object.freeze({
    regular: 49000,
    promo: 49000,
    beforeRegular: 59900,
    beforePromo: 59900,
    name: "Premium",
  }),
} as const);

/**
 * Precios internacionales de referencia (USD) para suscripciones con tarjeta gestionadas por Paddle.
 */
export const OFFICIAL_INTERNATIONAL_PLAN_PRICES = Object.freeze({
  plus: Object.freeze({
    regularUsd: 25,
    promoUsd: 12,
    beforeRegularUsd: 30,
    beforePromoUsd: 25,
    name: "Plus+",
  }),
  premium: Object.freeze({
    regularUsd: 45,
    promoUsd: 45,
    beforeRegularUsd: 55,
    beforePromoUsd: 55,
    name: "Premium",
  }),
} as const);

export function isValidPaidPlanId(planId: unknown): planId is PaidPlanId {
  return planId === "plus" || planId === "premium";
}

export function getImmutableClientPlanAmount(planId: PaidPlanId, isPromoExpired: boolean): number {
  if (planId === "premium") {
    return OFFICIAL_PLAN_PRICES.premium.regular;
  }
  if (planId === "plus") {
    return isPromoExpired
      ? OFFICIAL_PLAN_PRICES.plus.regular
      : OFFICIAL_PLAN_PRICES.plus.promo;
  }
  throw new Error("Plan de pago inválido");
}

