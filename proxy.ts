import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";

export function middleware(req: NextRequest) {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const res = NextResponse.next();

    res.headers.set("x-nonce", nonce);

    const isDev = process.env.NODE_ENV === "development";

    const connectSrc = [
        "'self'",
        "https://api.qmenu.digital",
        "https://qmenu.digital",
        "https://api.emailjs.com",
        "http://localhost:4000",
        ...(isDev ? ["ws://localhost:*", "ws://127.0.0.1:*"] : [])
    ].join(" ");

    const cspHeader = `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""};
        style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}' 'unsafe-hashes'`};
        img-src 'self' blob: data: https://res.cloudinary.com https://cdn.pixabay.com https://asset.cloudinary.com;
        font-src 'self' data:;
        connect-src ${connectSrc};
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests;
    `.replace(/\s{2,}/g, " ").trim();

    res.headers.set("Content-Security-Policy", cspHeader);

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