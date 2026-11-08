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
    regular: 34900,
    promo: 34900,
    beforeRegular: 39900,
    beforePromo: 39900,
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

