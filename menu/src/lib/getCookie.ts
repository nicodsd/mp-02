import { cookies } from "next/headers";
export const getCookie = async (name: string) => {
    const cookieStore = await cookies();
    console.log("GetCookie", cookieStore.get(name)?.value);
    return cookieStore.get(name)?.value;
};