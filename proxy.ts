import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";

export function proxy(req: NextRequest) {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const res = NextResponse.next();

    res.headers.set("x-nonce", nonce);

    const isDev = process.env.NODE_ENV === "development";

    // Dominios permitidos para fetch/axios/WebSocket/Analytics/Paddle
    const connectSrc = [
        "'self'",
        "https://api.qmenu.digital",
        "https://qmenu.digital",
        "https://api.emailjs.com",
        "https://www.google-analytics.com",
        "https://analytics.google.com",
        "https://stats.g.doubleclick.net",
        "https://*.paddle.com",
        "https://*.profitwell.com",
        "http://localhost:4000",
        ...(isDev ? ["ws://localhost:*", "ws://127.0.0.1:*"] : [])
    ].join(" ");

    // Dominios permitidos para cargar scripts externos (GTM, GA, Paddle)
    const scriptSrc = [
        "'self'",
        `'nonce-${nonce}'`,
        "'unsafe-inline'",
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com",
        "https://cdn.paddle.com",
        "https://*.paddle.com",
        "https://public.profitwell.com",
        ...(isDev ? ["'unsafe-eval'"] : [])
    ].join(" ");

    // Construcción de la política CSP
    const cspHeader = `
        default-src 'self';
        script-src ${scriptSrc};
        style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}' 'unsafe-hashes'`} https://cdn.paddle.com https://*.paddle.com;
        img-src 'self' blob: data: https://res.cloudinary.com https://cdn.pixabay.com https://asset.cloudinary.com https://www.google-analytics.com https://www.googletagmanager.com https://*.basemaps.cartocdn.com https://*.tile.openstreetmap.org https://unpkg.com https://*.paddle.com;
        font-src 'self' data:;
        connect-src ${connectSrc} https://nominatim.openstreetmap.org;
        frame-src 'self' https://*.paddle.com https://buy.paddle.com https://sandbox-buy.paddle.com https://www.googletagmanager.com;
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