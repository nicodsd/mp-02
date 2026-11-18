'use server';
import { safeParseJson } from "./safeJson";

export async function getSubCategoriesByUser(apiUrl: string, userId: string) {
    try {
        const res = await fetch(`${apiUrl}categories/sub/${userId}`, {
            next: { tags: ['sub_categories'], revalidate: 120 }
        });
        if (!res.ok) return [];
        const data = await safeParseJson(res);
        if (data?.subCategories?.map((category: any) => category?.user_id).includes(userId)) {
            return data.subCategories.filter((category: any) => category?.user_id === userId)
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
}