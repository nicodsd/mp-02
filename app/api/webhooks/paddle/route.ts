import { NextResponse } from "next/server";
import { Environment, EventName } from "@paddle/paddle-node-sdk";
import { getPaddleClient, getPaddleEnvironment } from "@/src/lib/paddle";
import { activatePaddleSubscription } from "@/app/actions";
import { PADDLE_ENABLED } from "@/src/lib/featureFlags";

let cachedCidrs: { cidrs: string[]; expiresAt: number } | null = null;
const IP_CACHE_TTL_MS = 60 * 60 * 1000;

function ipv4ToInt(ip: string): number | null {
  const parts = ip.trim().split(".");
  if (parts.length !== 4) return null;
  let result = 0;
  for (const part of parts) {
    const num = Number(part);
    if (!Number.isInteger(num) || num < 0 || num > 255) return null;
    result = (result << 8) | num;
  }
  return result >>> 0;
}

function ipInCidr(ip: string, cidr: string): boolean {
  const [range, bitsStr] = cidr.split("/");
  const ipInt = ipv4ToInt(ip);
  const rangeInt = ipv4ToInt(range);
  const bits = bitsStr ? Number(bitsStr) : 32;
  if (ipInt === null || rangeInt === null || !Number.isInteger(bits) || bits < 0 || bits > 32) {
    return false;
  }
  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
  return (ipInt & mask) === (rangeInt & mask);
}

async function getPaddleIpv4Cidrs(): Promise<string[] | null> {
  if (cachedCidrs && Date.now() < cachedCidrs.expiresAt) {
    return cachedCidrs.cidrs;
  }
  try {
    const res = await fetch("https://api.paddle.com/ips", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const cidrs = json?.data?.ipv4_cidrs;
    if (!Array.isArray(cidrs)) return null;
    cachedCidrs = { cidrs, expiresAt: Date.now() + IP_CACHE_TTL_MS };
    return cidrs;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  // Paddle muteado (ver src/lib/featureFlags.ts)
  if (!PADDLE_ENABLED) {
    return NextResponse.json({ error: "Paddle deshabilitado" }, { status: 503 });
  }
  if (getPaddleEnvironment() === Environment.production) {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = (forwardedFor?.split(",")[0] || request.headers.get("x-real-ip") || "").trim();
    if (clientIp) {
      const cidrs = await getPaddleIpv4Cidrs();
      if (cidrs && !cidrs.some((cidr) => ipInCidr(clientIp, cidr))) {
        return NextResponse.json({ error: "Forbidden IP" }, { status: 403 });
      }
    }
  }

  const signature = request.headers.get("paddle-signature") || "";
  const rawRequestBody = await request.text();
  const secretKey = process.env.PADDLE_WEBHOOK_SECRET || "";

  if (!signature || !secretKey) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  try {
    const paddle = getPaddleClient();
    const eventData = await paddle.webhooks.unmarshal(
      rawRequestBody,
      secretKey,
      signature
    );

    switch (eventData.eventType) {
      case EventName.TransactionCompleted: {
        const tx = eventData.data as any;
        const customData = tx?.customData || {};
        await activatePaddleSubscription({
          paddle_subscription_state: "active",
          paddle_transaction_id: tx?.id,
          paddle_subscription_id: tx?.subscriptionId || undefined,
          paddle_customer_id: tx?.customerId || undefined,
          plan: customData?.plan,
          email: customData?.email,
        });
        break;
      }

      case EventName.SubscriptionCreated:
      case EventName.SubscriptionActivated:
      case EventName.SubscriptionUpdated: {
        const sub = eventData.data as any;
        const customData = sub?.customData || {};
        await activatePaddleSubscription({
          paddle_subscription_state: sub?.status || "active",
          paddle_subscription_id: sub?.id,
          paddle_customer_id: sub?.customerId || undefined,
          plan: customData?.plan,
          email: customData?.email,
        });
        break;
      }

      case EventName.SubscriptionCanceled:
      case EventName.SubscriptionPaused:
      case EventName.SubscriptionPastDue: {
        const sub = eventData.data as any;
        const customData = sub?.customData || {};
        await activatePaddleSubscription({
          paddle_subscription_state: sub?.status || "canceled",
          paddle_subscription_id: sub?.id,
          paddle_customer_id: sub?.customerId || undefined,
          plan: customData?.plan,
          email: customData?.email,
        });
        break;
      }

      default:
        console.log(
          `ℹ️ Evento Paddle recibido sin acción específica: ${eventData.eventType}`
        );
    }

    return NextResponse.json(
      { ok: true, eventType: eventData.eventType },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error verificando webhook de Paddle:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}

