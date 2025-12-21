'use server';
export async function getCategoriesByUser(apiUrl: string, userId: string) {
    try {
        const res = await fetch(`${apiUrl}api/categories?user_id=${userId}`, {
            next: { tags: ['categories'], revalidate: 120 }
        });
        let data = await res?.json();
        if (data?.categories?.map((category: any) => category?.user_id).includes(userId)) {
            return data.categories
        } else {
            return data.categories = [];
        }
    } catch (error) {
        return [];
    }
}