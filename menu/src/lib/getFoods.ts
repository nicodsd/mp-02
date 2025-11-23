'use cache'
import axios from "axios";

export async function getFoods(apiUrl: string) {
    try {
        const res = await axios.get(apiUrl + "api/foods");
        // console.log(res.data.foods)
        return res.data.foods; // ajusta según tu API
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            console.log("ERROR 1", error.response);
            return error.response
        }
        if (error instanceof Error) {
            console.log("ERROR 2", error.message);
            return error.message
        }
        console.log("ERROR 3", error);
        return error
    }
} 