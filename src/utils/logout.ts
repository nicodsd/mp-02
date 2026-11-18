import { URI } from "@/src/lib/const";

/**
 * Signs the user out on the backend and clears local session cookies
 * via the /api/auth/logout Route Handler.
 */
export async function logoutUser(userId: string): Promise<void> {
  const response = await fetch(`${URI}/auth/signout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
    throw new Error("Error al cerrar sesión");
  }

  const clearResponse = await fetch("/api/auth/logout", {
    method: "POST",
  });

  if (!clearResponse.ok) {
    throw new Error("Error al limpiar cookies de sesión");
  }
}
