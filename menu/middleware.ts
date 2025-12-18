import { NextResponse } from "next/server";
export function middleware(req: any) {
    const token = req.cookies.get("token")?.value;
    const user = req.cookies.get("user")?.value;
    // Rutas protegidas
    const protectedRoutes = ["/panel-de-usuario", "/nuevo-plato"];
    if (protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path))) {
        if (!token || !user) {
            return NextResponse.redirect(new URL("/iniciar-sesion", req.url));
        }
    }
    return NextResponse.next();
}
// Configuración de rutas donde se aplica el middleware
export const config = {
    matcher: ["/panel-de-usuario/:path*", "/nuevo-plato/:path*"],
};