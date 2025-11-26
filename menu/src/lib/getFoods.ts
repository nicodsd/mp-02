'use server';
export async function getFoods(apiUrl: string) {
    const res = await fetch(`${apiUrl}api/foods`, {
        next: { tags: ['foods'], revalidate: 120 }
    });
    if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
    }
    const data = await res.json();
    return data?.foods ?? [];
}