// app/api/register/route.ts
import { setAuthCookie, setUserCookie } from "@/app/actions";
import { URL } from "@/src/lib/const";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const formData = await req.formData();
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;
    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;
    const phone = formData.get("phone") as string | null;

    const logo = formData.get("logo") as File | null;
    const coverPhoto = formData.get("coverPhoto") as File | null;
    if (!email || !password || !name || !description || !phone) {
        return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
    }
    try {
        const response = await fetch(`${URL}api/auth/signup`, {
            method: "POST",
            body: formData,
            credentials: "include",
        });
        const dataDB = await response.json();
        if (response.ok) {
            const { token, user } = dataDB;
            await setAuthCookie(token);
            await setUserCookie(user);
            return NextResponse.json({ ok: true, user, token });
        } else {
            return NextResponse.json({ error: dataDB.message || "Fallo el registro." }, { status: 400 });
        }
    } catch (err) {
        console.error("Error de registro:", err);
        return NextResponse.json(
            { error: "Error de red o el servidor no está disponible." },
            { status: 500 }
        );
    }
}