'use server';
export async function getCategories(apiUrl: string) {
    const res = await fetch(`${apiUrl}api/categories`, {
        next: { tags: ['categories'], revalidate: 120 }
    });
    if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
    }
    const data = await res?.json();
    return data?.categories ?? [];
}
