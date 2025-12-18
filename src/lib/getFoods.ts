'use server';
export async function getFoods(apiUrl: string) {
    try {
        const res = await fetch(`${apiUrl}api/foods`);
        const data = await res.json();
        return data?.foods ?? [];
    } catch (error) {
        console.log(error);
        return [];
    }
}