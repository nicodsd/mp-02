'use cache'
import axios from "axios";
export async function getCategories(apiUrl: string) {
    try {
        const res = await axios.get(apiUrl + "api/categories");
        return res?.data?.categories;
    } catch (error: unknown) {
        return console.log("ERROR CATCH", error);
    }
}