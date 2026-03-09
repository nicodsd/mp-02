import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";

export function proxy(req: NextRequest) {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const res = NextResponse.next();

    // Adjunta el nonce como header para que el layout lo pueda leer
    res.headers.set("x-nonce", nonce);

    const isDev = process.env.NODE_ENV === "development";
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ""};
    style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`};
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, " ").trim();

    res.headers.set("Content-Security-Policy", cspHeader);

    const protectedRoutes = ["/panel-de-usuario", "/nuevo-plato", "/menu/:path*"];
    if (protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path))) {
        const token = req.cookies.get("token")?.value;
        const user = req.cookies.get("user")?.value;
        if (!token || !user) {
            return NextResponse.redirect(new URL("/registro-de-usuario", req.url));
        }
    }

    return res;
}

export const config = {
    matcher: ["/panel-de-usuario/:path*", "/nuevo-plato/:path*", "/menu/:path*"],
};