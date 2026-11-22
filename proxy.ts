import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";
import { PADDLE_ENABLED } from "@/src/lib/featureFlags";

export function proxy(req: NextRequest) {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const res = NextResponse.next();

    res.headers.set("x-nonce", nonce);

    const isDev = process.env.NODE_ENV === "development";

    // Paddle está muteado salvo NEXT_PUBLIC_PADDLE_ENABLED="true" (ver src/lib/featureFlags.ts)
    const paddle = (...sources: string[]) => (PADDLE_ENABLED ? sources : []);

    // Dominios permitidos para fetch/axios/WebSocket/Analytics/Paddle
    const connectSrc = [
        "'self'",
        "https://api.qmenu.digital",
        "https://qmenu.digital",
        "https://api.emailjs.com",
        // Google Analytics 4 / GTM / Hotjar
        "https://*.google-analytics.com",
        "https://*.analytics.google.com",
        "https://*.googletagmanager.com",
        "https://stats.g.doubleclick.net",
        "https://*.hotjar.com",
        "https://*.hotjar.io",
        "wss://*.hotjar.com",
        ...paddle("https://*.paddle.com", "https://*.profitwell.com"),
        "http://localhost:4000",
        "https://nominatim.openstreetmap.org",
        ...(isDev ? ["ws://localhost:*", "ws://127.0.0.1:*"] : [])
    ].join(" ");

    // Dominios permitidos para cargar scripts externos (GTM, GA, Hotjar, Paddle)
    // Se usa 'unsafe-inline' sin nonce para permitir generación estática (SSG) y caché en Edge CDN.
    const scriptSrc = [
        "'self'",
        "'unsafe-inline'",
        "https://www.googletagmanager.com",
        "https://*.googletagmanager.com",
        "https://www.google-analytics.com",
        "https://static.hotjar.com",
        "https://*.hotjar.com",
        ...paddle("https://cdn.paddle.com", "https://*.paddle.com", "https://public.profitwell.com"),
        ...(isDev ? ["'unsafe-eval'"] : [])
    ].join(" ");

    // Estilos: React (style={{...}} renderizado en el HTML del servidor), Emotion/MUI,
    // framer-motion, next/image, Leaflet, etc. generan estilos inline. Los atributos style=""
    // NO pueden llevar nonce, y si hay nonce/hash en la directiva el navegador ignora
    // 'unsafe-inline'. Por eso los estilos usan 'unsafe-inline' sin nonce (riesgo bajo:
    // el CSS inline no ejecuta código; la protección contra XSS la da script-src).
    const styleSrc = [
        "'self'",
        "'unsafe-inline'",
        ...paddle("https://cdn.paddle.com", "https://*.paddle.com"),
    ].join(" ");

    const imgSrc = [
        "'self'", "blob:", "data:",
        "https://res.cloudinary.com", "https://cdn.pixabay.com", "https://asset.cloudinary.com",
        "https://*.google-analytics.com", "https://*.googletagmanager.com",
        "https://*.hotjar.com",
        "https://*.basemaps.cartocdn.com", "https://*.tile.openstreetmap.org", "https://unpkg.com",
        ...paddle("https://*.paddle.com"),
    ].join(" ");

    const frameSrc = [
        "'self'",
        "https://www.googletagmanager.com",
        "https://*.hotjar.com",
        ...paddle("https://*.paddle.com", "https://buy.paddle.com", "https://sandbox-buy.paddle.com"),
    ].join(" ");

    // Construcción de la política CSP
    const cspHeader = `
        default-src 'self';
        script-src ${scriptSrc};
        style-src ${styleSrc};
        img-src ${imgSrc};
        font-src 'self' data:;
        media-src 'self' blob:;
        connect-src ${connectSrc};
        frame-src ${frameSrc};
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests;
    `.replace(/\s{2,}/g, " ").trim();

    res.headers.set("Content-Security-Policy", cspHeader);

    // Lógica de redirección según rutas
    const token = req.cookies.get("token")?.value;
    const user = req.cookies.get("user")?.value;
    const { pathname } = req.nextUrl;

    if (pathname === "/iniciar-sesion") {
        if (token && user) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    if (pathname === "/") {
        if (token || user) {
            return NextResponse.redirect(new URL("/mi-menu", req.url));
        }
    }

    const protectedRoutes = ["/panel-de-usuario", "/nuevo-plato", "/mi-menu"];
    if (protectedRoutes.some((path) => pathname.startsWith(path))) {
        if (!token || !user) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return res;
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
    ],
};