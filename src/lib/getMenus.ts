'use server'
import { URI } from "./const";

export default async function getMenus(user_id: string) {
    try {
        const res = await fetch(`${URI}/menu/get-menus/${user_id}`, {
            method: "GET",
            credentials: "include",
        });
        if (!res.ok) {
            throw new Error("Error al obtener los menús");
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error al obtener los menús:", error);
        return [];
    }
}