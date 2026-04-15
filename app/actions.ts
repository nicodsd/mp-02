'use server';
import { cookies } from "next/headers";
import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from "next/navigation";

export async function refreshPage() {
    // Marcamos los tags como "stale" usando el perfil recomendado
    revalidateTag('foods', 'max');
    revalidateTag('categories', 'max');

    // Forzamos la revalidación del path del dashboard para que el 
    // Server Component vuelva a ejecutarse y mande la data nueva al cliente
    revalidatePath('/dashboard', 'page');
    revalidatePath('/', 'layout');
    revalidatePath('/panel-de-usuario', 'page');
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
    return { success: true };
}

export async function updateTemplate(templateId: string) {
    const cookieStore = await cookies();
    const currentUserCookie = cookieStore.get("user");

    if (currentUserCookie) {
        try {
            const currentUser = JSON.parse(currentUserCookie.value);

            const updatedUser = {
                ...currentUser,
                template_id: templateId
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

export async function activateRestaurantSubscription(data: { status: string, qMenuId?: string, email?: string, transactionId?: number | string }) {
    // Al no tener Prisma u ORM aquí (porque separas Front y Back), mandamos una petición a tu backend de datos.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/';
    console.log("🚀 Enviando activación de suscripción al Backend:", data);

    try {
        const response = await fetch(`${apiUrl}auth/subscription/webhook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // IMPORTANTE: Si tu backend necesita validación de que esta petición viene de tu front de confianza, manda un header aquí, por ejemplo:
                // 'x-webhook-secret': process.env.INTERNAL_WEBHOOK_SECRET || '',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            console.error(`❌ Error actualizando la DB en el Backend: ${response.status}`);
        } else {
            console.log('✅ Base de datos actualizada con éxito en el Backend.');
        }

    } catch (error) {
        console.error("❌ Error de comunicación con la API del Backend:", error);
    }
}
