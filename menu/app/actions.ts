'use server';
import { cookies } from "next/headers";
import { revalidateTag } from 'next/cache';
export async function refreshPage() {
    revalidateTag('categories', 'max');
    revalidateTag('foods', 'max');
}
export async function setAuthCookie(token: string) {
    (await cookies()).set({
        name: "Set-Cookie",
        value: token,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
    });
}