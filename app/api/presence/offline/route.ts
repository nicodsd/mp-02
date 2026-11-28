import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token || token === "{}") {
    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  let tabId: string | undefined;
  let allTabs = false;

  try {
    const text = await req.text();
    if (text) {
      const parsed = JSON.parse(text);
      if (typeof parsed?.tabId === "string" && parsed.tabId.trim()) {
        tabId = parsed.tabId.trim().slice(0, 64);
      }
      if (parsed?.allTabs === true) {
        allTabs = true;
      }
    }
  } catch {
    // Ignore malformed sendBeacon payload
  }

  try {
    await fetch(`${API_URL}/presence/offline`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      body: JSON.stringify({ tabId, allTabs }),
    });
  } catch (error) {
    console.error("[Presence] Error forwarding offline to backend:", error);
  }

  return NextResponse.json(
    { success: true },
    { headers: { "Cache-Control": "no-store" } }
  );
}
