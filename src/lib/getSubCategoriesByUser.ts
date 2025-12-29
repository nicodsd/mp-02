'use server';
export async function getSubCategoriesByUser(apiUrl: string, userId: string) {
    try {
        const res = await fetch(`${apiUrl}api/categories/sub/${userId}`, {
            next: { tags: ['sub_categories'], revalidate: 120 }
        });
        let data = await res?.json();
        if (data?.subCategories?.map((category: any) => category?.user_id).includes(userId)) {
            return data.subCategories
        } else {
            return data.subCategories = [];
        }
    } catch (error) {
        return [];
    }
}