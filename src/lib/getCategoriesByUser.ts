'use server';
import { safeParseJson } from "./safeJson";

export async function getCategoriesByUser(apiUrl: string, userId: string) {
    try {
        const res = await fetch(`${apiUrl}categories/${userId}`, {
            next: { tags: ['categories'], revalidate: 120 }
        });
        if (!res.ok) return [];
        const data = await safeParseJson(res);
        if (data?.categories?.map((category: any) => category?.user_id).includes(userId)) {
            return data.categories
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
}