'use server';
export async function getCategories(apiUrl: string) {
    try {
        const res = await fetch(`${apiUrl}categories`);
        const data = await res?.json();
        return data?.categories ?? [];
    } catch (error) {
        console.log(error);
        return [];
    }
}