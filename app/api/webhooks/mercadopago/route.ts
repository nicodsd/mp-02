import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

// TODO: Importar tus librerías y funciones de QMenú de la BD
import { activateRestaurantSubscription } from "@/app/actions";

// 1. Inicializar cliente con acceso del backend
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN_PROD!, // ¡Asegúrate de que tus variables de entorno estén bien!
});

export async function POST(request: Request) {
    try {
        // 2. Mercado Pago puede enviar la info en el Body (Webhooks) o QueryParams (IPN)
        const body = await request.json();

        // Obtenemos qué evento es (topic / type) y qué ID tiene
        const type = body.type || new URL(request.url).searchParams.get("topic");
        const paymentId = body.data?.id || body.id;

        // Solo nos importan los "pagos" (payment). Aunque sea suscripción, MP genera un pago individual cada mes.
        if (type === "payment" && paymentId) {

            // 3. CONSULTA DE SEGURIDAD: Vamos a buscar el pago a Mercado Pago usando el SDK. 
            //    Así evitamos que un bot finja un webhook hacia nuestra API.
            const paymentAPI = new Payment(client);
            const paymentData = await paymentAPI.get({ id: paymentId });
            console.log("🚀 Payment Data:", paymentData);

            // 4. Analizamos si realmente se cobró con éxito
            if (paymentData.status === "approved") {

                // 5. Identificamos al pagador. Tienes dos formas muy comunes:
                //    a. Por el correo electrónico del pagador
                const userEmail = paymentData.payer?.email;
                //    b. Por el "external_reference" o ID de tu Base de Datos (Si lo configuraste al inicio de la suscripción)
                const qmenuId = paymentData.external_reference;

                console.log(`✅ Pago aprobado de suscripción para usuario: ${userEmail}`);

                // 6. 🚀 AQUÍ ACTIVAS QMENÚ EN TU BASE DE DATOS
                await activateRestaurantSubscription({
                    status: "active",
                    qMenuId: qmenuId,
                    email: userEmail,
                    transactionId: paymentData.id
                });
            }
        }

        // 7. RESPUESTA RÁPIDA: Mercado Pago necesita recibir un 200 OK antes de los 10 segundos, 
        //    de otro modo va a seguir mandando la alerta de nuevo (reintentos).
        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error) {
        console.error("❌ Error en el Webhook de Mercado Pago:", error);
        // Opcional: devolver un 500 hará que MP reintente el envío en unos minutos o 1 hora.
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
