/**
 * Feature flags de la app.
 *
 * PADDLE_ENABLED: Paddle (pagos internacionales) está "muteado" por defecto.
 * Todo el código de Paddle se conserva; para reactivarlo basta con definir
 * NEXT_PUBLIC_PADDLE_ENABLED="true" en las variables de entorno y redeployar.
 * Mientras esté desactivado:
 *  - No se carga Paddle.js en el cliente ni se muestra la opción de pago.
 *  - Las rutas /api/paddle/* y /api/webhooks/paddle responden 503.
 *  - Los dominios de Paddle se quitan de la Content-Security-Policy.
 */
export const PADDLE_ENABLED = process.env.NEXT_PUBLIC_PADDLE_ENABLED === "true";
