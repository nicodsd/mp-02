import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Clears authentication and menu session cookies on logout.
 * Implemented as a Route Handler (under /api/) so it bypasses proxy.ts redirects
 * and avoids Next.js Server Action re-rendering of protected pages.
 */
export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token && token !== "{}") {
    try {
      await fetch(`${API_URL}/presence/offline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
        body: JSON.stringify({ allTabs: true }),
      });
    } catch {
      // Ignore network errors on logout
    }
  }

  cookieStore.delete("token");
  cookieStore.delete("user");
  cookieStore.delete("menu");

  return NextResponse.json({ success: true });
}
