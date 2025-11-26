'use server';
import { revalidateTag } from 'next/cache';
export async function refreshPage() {
    revalidateTag('categories', 'max');
    revalidateTag('foods', 'max');
}