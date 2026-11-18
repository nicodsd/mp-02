'use server';
import { safeParseJson } from "./safeJson";

export async function getFoodsByUser(apiUrl: string, userId: string) {
    if (!userId) return [];
    try {
        const res = await fetch(`${apiUrl}/foods?user_id=${userId}`, {
            next: { tags: ['foods'], revalidate: 3600 }
        });
        if (!res.ok) return [];
        const data = await safeParseJson(res);
        if (data?.foods?.map((food: any) => food?.user_id).includes(userId)) {
            return data.foods
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
}