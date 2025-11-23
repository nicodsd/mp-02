'use cache'
import axios from "axios";

export async function getCategories(apiUrl: string) {
    try {
        const res = await axios.get(apiUrl + "api/categories");
        console.log("CATEGORIES FETCHED:", res?.data);
        return res?.data?.categories; // ajusta según tu API
    } catch (error: unknown) {
        return console.log("ERROR CATCH", error);
    }
}