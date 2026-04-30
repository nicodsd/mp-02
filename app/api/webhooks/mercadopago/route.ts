import { MercadoPagoConfig, Payment, PreApproval } from "mercadopago";
import { NextResponse } from "next/server";
import { activateRestaurantSubscription } from "@/app/actions";
import crypto from "crypto";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN_PROD!,
});

// ----------------------------------------------------------
// VALIDACIÓN DE FIRMA
// ----------------------------------------------------------
function isValidWebhookSignature(
    rawBody: string,
    signatureHeader: string | null,
    secret: string | undefined
): boolean {
    if (process.env.NODE_ENV !== "production") return true;
    if (!secret || !signatureHeader) return false;

    const parts = signatureHeader.split(",");
    const tsPart = parts.find(p => p.startsWith("ts="));
    const v1Part = parts.find(p => p.startsWith("v1="));

    if (!tsPart || !v1Part) return false;

    let timestamp = tsPart.split("=")[1];
    let receivedSignature = v1Part.split("=")[1];


    parts.forEach((part) => {
        const [key, value] = part.split("=");
        if (key === "ts") timestamp = value;
        if (key === "v1") receivedSignature = value;
    });

    if (!timestamp || !receivedSignature) {
        console.error("❌ Formato de firma inválido");
        return false;
    }

    // Verificar que el timestamp no tenga más de 10 minutos
    const tolerance = 600; // segundos
    const currentTime = Math.floor(Date.now() / 1000);
    const notificationTime = parseInt(timestamp, 10);

    if (Math.abs(currentTime - notificationTime) > tolerance) {
        console.error(`❌ Timestamp fuera de tolerancia. Actual: ${currentTime}, Notificación: ${notificationTime}`);
        return false;
    }

    // Calcular firma esperada
    const message = `${timestamp}.${rawBody}`;
    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(message)
        .digest("hex");

    // COMPARACIÓN SEGURA
    const expectedBuffer = Buffer.from(expectedSignature);
    const receivedBuffer = Buffer.from(receivedSignature);

    return expectedBuffer.length === receivedBuffer.length &&
        crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}
// ----------------------------------------------------------
// HANDLER POST
// ---------------------------------------------------------
export async function POST(request: Request) {
    const rawBody = await request.text();
    const signatureHeader = request.headers.get("x-signature");
    console.log("📨 Webhook POST recibido");
    console.log(`   x-signature presente: ${!!signatureHeader}`);
    console.log(`   Entorno: ${process.env.NODE_ENV || "development"}`);
    // Validar firma (en desarrollo pasa directo)
    if (!isValidWebhookSignature(rawBody, signatureHeader, process.env.MP_WEBHOOK_SECRET)) {
        return NextResponse.json(
            { error: "Webhook no autorizado" },
            { status: 403 }
        );
    }

    // Parsear el body

    let body = {} as any;
    try {
        body = JSON.parse(rawBody);
        console.log("📦 Notificación:", JSON.stringify(body, null, 2));
    } catch (e) {
        console.log("Body no es JSON, revisando query params...");
        const urlObj = new URL(request.url);
        body = {
            type: urlObj.searchParams.get("topic") || urlObj.searchParams.get("type"),
            data: {
                id: urlObj.searchParams.get("id") || urlObj.searchParams.get("data.id")
            },
            entity: urlObj.searchParams.get("entity")
        };
    }
    const entity = body.entity || body.type;
    const entityId = body.data?.id;
    console.log(`🔔 Entity: ${entity}, ID: ${entityId}`);
    if (!entityId) {
        console.log("⚠️ No se encontró ID en la notificación");
        return NextResponse.json({ received: true }, { status: 200 });
    }
    // ----------------------------------------------------------
    // PROCESAR SEGÚN EL TIPO DE ENTIDAD
    // ----------------------------------------------------------
    try {
        // PAGO
        if (entity === "payment") {
            console.log("💳 Procesando notificación de PAGO");
            const paymentAPI = new Payment(client);
            try {
                const paymentData = await paymentAPI.get({ id: entityId });
                console.log(`   Estado: ${paymentData.status}`);
                console.log(`   Email: ${paymentData.payer?.email}`);
                console.log(`   External Ref: ${paymentData.external_reference}`);

                if (paymentData.status === "approved") {
                    await activateRestaurantSubscription({
                        mp_subscription_state: "active",
                        mp_preapproval_id: paymentData.external_reference || paymentData.metadata?.qmenu_id,
                    });
                    console.log("✅ Suscripción activada por pago aprobado");
                } else {
                    console.log(`   ⏳ Estado no procesado: ${paymentData.status}`);
                }
            } catch (error: any) {
                if (error?.status === 404 || error?.error === "not_found") {
                    console.log(`⚠️ Pago ${entityId} no encontrado (normal en simulación)`);
                } else {
                    console.error("❌ Error consultando pago:", error);
                }
            }
        }

        // SUSCRIPCIÓN / PREAPPROVAL
        else if (
            entity === "preapproval" ||
            entity === "subscription_preapproval" ||
            body.type === "subscription_authorized_payment"
        ) {
            console.log("🔄 Procesando notificación de SUSCRIPCIÓN");
            const preapprovalAPI = new PreApproval(client);
            try {
                const preapprovalData = await preapprovalAPI.get({ id: entityId });
                console.log(`   Estado: ${preapprovalData.status}`);
                console.log(`   Email: ${preapprovalData.payer_email}`);
                console.log(`   External Ref: ${preapprovalData.external_reference}`);

                switch (preapprovalData.status) {
                    case "authorized":
                        console.log("✅ Suscripción autorizada");
                        await activateRestaurantSubscription({
                            mp_subscription_state: preapprovalData.status, // "authorized", "cancelled", etc.
                            mp_preapproval_id: preapprovalData.id,        // El ID de la suscripción
                            // mp_subscription_id: ... (si lo necesitas guardar aparte)
                        });
                        break;

                    case "cancelled":
                        console.log("❌ Suscripción cancelada");
                        await activateRestaurantSubscription({
                            mp_subscription_state: preapprovalData.status, // "authorized", "cancelled", etc.
                            mp_preapproval_id: preapprovalData.id,        // El ID de la suscripción
                            // mp_subscription_id: ... (si lo necesitas guardar aparte)
                        });
                        break;
                    case "paused":
                        console.log("⏸️ Suscripción pausada");
                        await activateRestaurantSubscription({
                            mp_subscription_state: preapprovalData.status, // "authorized", "cancelled", etc.
                            mp_preapproval_id: preapprovalData.id,        // El ID de la suscripción
                            // mp_subscription_id: ... (si lo necesitas guardar aparte)
                        });
                        break;
                    default:
                        console.log(`ℹ️ Estado no manejado: ${preapprovalData.status}`);
                }
            } catch (error: any) {
                if (error?.status === 400 || error?.error === "not_found") {
                    console.log(`⚠️ Suscripción ${entityId} no encontrada (normal en simulación)`);
                } else {
                    console.error("❌ Error consultando suscripción:", error);
                }
            }
        }

        // OTRO
        else {
            console.log(`📋 Tipo "${entity}" no manejado específicamente`);
        }

    } catch (error: any) {
        console.error("❌ Error general procesando webhook:", error);
    }

    // Siempre responder 200 para que MP no reintente
    return NextResponse.json({ received: true }, { status: 200 });
}

// ----------------------------------------------------------
// HANDLER GET (para simulación y verificación)
// ----------------------------------------------------------
export async function GET(request: Request) {
    const urlObj = new URL(request.url);
    const params = {
        dataId: urlObj.searchParams.get("data.id"),
        type: urlObj.searchParams.get("type"),
        topic: urlObj.searchParams.get("topic"),
        id: urlObj.searchParams.get("id"),
    };
    console.log("🧪 Webhook GET recibido:", params);
    // Si es una simulación con ID, podemos intentar consultar
    const entityId = params.dataId || params.id;
    if (entityId) {
        try {
            if (params.type === "payment" || params.topic === "payment") {
                const paymentAPI = new Payment(client);
                const paymentData = await paymentAPI.get({ id: entityId });
                console.log(`💳 Simulación - Estado del pago ${entityId}: ${paymentData.status}`);
            } else if (
                params.type === "subscription_preapproval" ||
                params.type === "subscription_authorized_payment"
            ) {
                const preapprovalAPI = new PreApproval(client);
                const preapprovalData = await preapprovalAPI.get({ id: entityId });
                console.log(`🔄 Simulación - Estado suscripción ${entityId}: ${preapprovalData.status}`);
            }
        } catch (error: any) {
            if (error?.status === 404 || error?.error === "not_found") {
                console.log(`⚠️ ID ${entityId} no encontrado (normal en simulación)`);
            } else {
                console.error("Error en simulación:", error);
            }
        }
    }
    return NextResponse.json({
        message: "Webhook GET recibido correctamente",
        params

    }, { status: 200 });
}