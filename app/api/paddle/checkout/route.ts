import { NextResponse } from "next/server";
import {
  getPaddleClient,
  getPaddlePriceId,
  isPlaceholderPaddleValue,
} from "@/src/lib/paddle";
import { isValidPaidPlanId } from "@/src/utils/planPricing";
import { getVerifiedSubscriptionPayload } from "@/src/utils/promoServerAction";

export async function GET() {
  const apiKey = process.env.PADDLE_API_KEY;
  if (isPlaceholderPaddleValue(apiKey)) {
    return NextResponse.json(
      {
        configured: false,
        message: "PADDLE_API_KEY aún no está configurada con una credencial real.",
      },
      { status: 200 }
    );
  }

  try {
    const paddle = getPaddleClient();
    const productCollection = paddle.products.list();
    const firstPage = await productCollection.next();
    return NextResponse.json({
      configured: true,
      productsCount: firstPage.length,
    });
  } catch (error: any) {
    console.error("Error listando productos de Paddle:", error);
    return NextResponse.json(
      {
        configured: false,
        error: error?.message || "No se pudo conectar con Paddle.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plan, email, name, password, source } = body ?? {};

    if (!isValidPaidPlanId(plan)) {
      return NextResponse.json(
        { error: "Plan de suscripción inválido." },
        { status: 400 }
      );
    }

    const verified = await getVerifiedSubscriptionPayload(plan);
    const priceId = getPaddlePriceId(verified.plan, verified.isPromoActive);

    // 1. Registrar primero la petición de suscripción en el backend principal
    const rawApiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const backendBaseUrl = rawApiUrl.trim().replace(/\/+$/, "");

    let backendOk = false;
    let backendData: Record<string, any> | null = null;

    try {
      const backendResponse = await fetch(
        `${backendBaseUrl}/auth/subscribe-paddle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            cookie: request.headers.get("cookie") || "",
          },
          body: JSON.stringify({
            reason: `Plan ${verified.plan.toUpperCase()} - QMENU (Paddle Internacional)`,
            transaction_amount: verified.transaction_amount_usd,
            currency: "USD",
            plan: verified.plan,
            price_id: priceId,
            email: typeof email === "string" ? email : "",
            password: typeof password === "string" ? password : "",
            name: typeof name === "string" ? name : "",
            source: typeof source === "string" ? source : "web",
          }),
        }
      );

      if (backendResponse.ok) {
        backendOk = true;
        backendData = await backendResponse.json().catch(() => null);

        // Si el backend ya creó y devolvió la transacción de Paddle, la retornamos directo
        if (backendData?.transactionId || backendData?.checkoutUrl) {
          return NextResponse.json({
            transactionId: backendData.transactionId || null,
            checkoutUrl: backendData.checkoutUrl || null,
            priceId: backendData.priceId || priceId,
            plan: verified.plan,
            isPromoActive: verified.isPromoActive,
            transaction_amount_ars: verified.transaction_amount,
            transaction_amount_usd: verified.transaction_amount_usd,
            backendRegistered: true,
          });
        }
      } else {
        console.warn(
          `⚠️ Backend /auth/subscribe-paddle devolvió status ${backendResponse.status}`
        );
      }
    } catch (backendErr) {
      console.warn(
        "⚠️ No se pudo registrar en /auth/subscribe-paddle (pendiente en Render):",
        backendErr
      );
    }

    if (isPlaceholderPaddleValue(priceId)) {
      return NextResponse.json(
        {
          error:
            "Los Price IDs de Paddle aún no están configurados. Configura PADDLE_PRICE_ID_PLUS, PADDLE_PRICE_ID_PLUS_PROMO y PADDLE_PRICE_ID_PREMIUM en tus variables de entorno.",
          code: "PADDLE_NOT_CONFIGURED",
          backendRegistered: backendOk,
        },
        { status: 503 }
      );
    }

    // 2. Comunicarse desde el servidor con la API de Paddle
    const apiKey = process.env.PADDLE_API_KEY;
    if (!isPlaceholderPaddleValue(apiKey)) {
      try {
        const paddle = getPaddleClient();
        const transaction = await paddle.transactions.create({
          items: [{ priceId, quantity: 1 }],
          customData: {
            plan: verified.plan,
            email: typeof email === "string" ? email : "",
            name: typeof name === "string" ? name : "",
            source: typeof source === "string" ? source : "web",
            registrationId:
              backendData?.id ||
              backendData?._id ||
              backendData?.registrationId ||
              "",
          },
        });

        return NextResponse.json({
          transactionId: transaction.id,
          checkoutUrl: transaction.checkout?.url || null,
          priceId,
          plan: verified.plan,
          isPromoActive: verified.isPromoActive,
          transaction_amount_ars: verified.transaction_amount,
          transaction_amount_usd: verified.transaction_amount_usd,
          backendRegistered: backendOk,
        });
      } catch (sdkError: any) {
        console.error("Error creando transacción en Paddle SDK:", sdkError);
        return NextResponse.json(
          {
            error:
              sdkError?.message ||
              "No se pudo crear la transacción de checkout en Paddle.",
            backendRegistered: backendOk,
          },
          { status: 502 }
        );
      }
    }

    // Fallback cuando aún no hay API key de servidor pero sí Price ID para Paddle.js client-side
    return NextResponse.json({
      transactionId: null,
      checkoutUrl: null,
      priceId,
      plan: verified.plan,
      isPromoActive: verified.isPromoActive,
      transaction_amount_ars: verified.transaction_amount,
      transaction_amount_usd: verified.transaction_amount_usd,
      backendRegistered: backendOk,
    });
  } catch (error: any) {
    console.error("Error en /api/paddle/checkout:", error);
    return NextResponse.json(
      { error: error?.message || "Error interno al iniciar checkout de Paddle." },
      { status: 500 }
    );
  }
}
