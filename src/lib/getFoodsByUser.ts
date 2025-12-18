'use server';
export async function getFoodsByUser(apiUrl: string, userId: string) {
    try {
        const res = await fetch(`${apiUrl}api/foods?user_id=${userId}`, {
            next: { tags: ['foods'], revalidate: 2 }
        });
        let data = await res?.json();
        if (data?.foods?.map((food: any) => food?.user_id).includes(userId)) {
            return data.foods
        } else {
            return data.foods = [];
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}