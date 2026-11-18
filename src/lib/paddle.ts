import { Environment, LogLevel, Paddle } from "@paddle/paddle-node-sdk";
import type { PaidPlanId } from "@/src/utils/planPricing";

export function isPlaceholderPaddleValue(value: string | undefined): boolean {
  if (!value) return true;
  return value.includes("placeholder");
}

export function getPaddleEnvironment(): Environment {
  const apiKey = process.env.PADDLE_API_KEY || "";
  const envFlag = process.env.PADDLE_ENV || process.env.NEXT_PUBLIC_PADDLE_ENV;
  const isSandbox =
    envFlag === "sandbox" ||
    apiKey.includes("_sdbx") ||
    (envFlag !== "production" && process.env.NODE_ENV !== "production");

  return isSandbox ? Environment.sandbox : Environment.production;
}

export function getPaddleClient(): Paddle {
  const apiKey = process.env.PADDLE_API_KEY || "";
  const environment = getPaddleEnvironment();

  return new Paddle(apiKey, {
    environment,
    logLevel: environment === Environment.sandbox ? LogLevel.verbose : LogLevel.error,
  });
}

export function getPaddlePriceId(plan: PaidPlanId, isPromoActive: boolean): string {
  if (plan === "premium") {
    return (
      process.env.PADDLE_PRICE_ID_PREMIUM ||
      process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PREMIUM ||
      ""
    );
  }

  if (isPromoActive) {
    return (
      process.env.PADDLE_PRICE_ID_PLUS_PROMO ||
      process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PLUS_PROMO ||
      process.env.PADDLE_PRICE_ID_PLUS ||
      process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PLUS ||
      ""
    );
  }

  return (
    process.env.PADDLE_PRICE_ID_PLUS ||
    process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PLUS ||
    ""
  );
}

