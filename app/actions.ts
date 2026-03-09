'use server';
import { cookies } from "next/headers";
import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from "next/navigation";

export async function refreshPage() {
    revalidateTag('categories', 'max');
    revalidateTag('foods', 'max');
    revalidateTag('sub_categories', 'max');
    revalidatePath('/', 'layout');
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
    (await cookies()).set({
        name: "user",
        value: JSON.stringify(user),
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
    });
}

export async function updateUserCookie(updatedFields: object) {
    const cookieStore = await cookies();
    const currentUserCookie = cookieStore.get("user");

    if (currentUserCookie) {
        try {
            const currentUser = JSON.parse(currentUserCookie.value);

            const updatedUser = {
                ...currentUser,
                ...updatedFields
            };

            cookieStore.set({
                name: "user",
                value: JSON.stringify(updatedUser),
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                path: "/",
            });

            revalidatePath('/', 'layout');
        } catch (error) {
            console.error("Error al parsear la cookie de usuario:", error);
        }
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    cookieStore.delete("user");
    redirect("/");
}