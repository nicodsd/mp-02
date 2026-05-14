'use server'
import { URI } from "./const";

export default async function getMenus(user_id: string) {
    if (!user_id) return { menus: [] };
    try {
        // Añadimos configuración de cache y tags
        const res = await fetch(`${URI}/menu/get-menus/${user_id}`, {
            method: "GET",
            // 'include' en server components a veces no es necesario si usas el header manual, 
            // pero lo mantenemos si tu backend lo requiere.
            credentials: "include",
            next: {
                tags: ['menus'], // <--- CLAVE: Etiqueta para revalidateTag
                revalidate: 3600 // Opcional: Cache por 1 hora como fallback
            }
        });

        if (!res.ok) {
            // Si el backend devuelve 404 o similar, no queremos que rompa la app
            return { menus: [] };
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error al obtener los menús:", error);
        return { menus: [] }; // Retornamos estructura consistente
    }
}