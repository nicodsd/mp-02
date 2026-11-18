import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Clears authentication and menu session cookies on logout.
 * Implemented as a Route Handler (under /api/) so it bypasses proxy.ts redirects
 * and avoids Next.js Server Action re-rendering of protected pages.
 */
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("user");
  cookieStore.delete("menu");

  return NextResponse.json({ success: true });
}
