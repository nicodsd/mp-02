'use server';
import { cookies } from "next/headers";
import { revalidateTag } from 'next/cache';

export async function refreshPage() {
    revalidateTag('categories', 'max');
    revalidateTag('foods', 'max');
}

export async function setAuthCookie(token: string) {
    (await cookies()).set({
        name: "token",
        value: token,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
    });
}

export async function setUserCookie(user: object) {
    console.log(user);
    (await cookies()).set({
        name: "user",
        value: JSON.stringify(user),
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
    });
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    cookieStore.delete('user');
}