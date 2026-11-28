import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type { PresenceStatus } from "@/src/lib/presenceStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function safeJsonParse<T>(raw?: string): T | null {
  if (!raw || raw === "{}") return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const rawUser = cookieStore.get("user")?.value;
  const rawMenu = cookieStore.get("menu")?.value;

  if (!token || token === "{}" || !rawUser || rawUser === "{}") {
    return NextResponse.json(
      { tracked: false },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const user = safeJsonParse<Record<string, unknown>>(rawUser);
  const menu = safeJsonParse<Record<string, unknown>>(rawMenu);

  if (!user || (!user.id && !user._id && !user.email)) {
    return NextResponse.json(
      { tracked: false },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  let body: { path?: string; tabId?: string; status?: PresenceStatus } = {};
  try {
    body = await req.json();
  } catch {
    // Allow empty body
  }

  const email = String(user.email || "").trim();
  const name = String(user.name || menu?.name || email || "Usuario").trim();
  const role = String(user.role || "client").trim();
  const plan = String(user.plan || "free").trim().toLowerCase();
  const path =
    typeof body.path === "string" && body.path.startsWith("/")
      ? body.path.slice(0, 200)
      : "/";
  const tabId =
    typeof body.tabId === "string" && body.tabId.trim()
      ? body.tabId.trim().slice(0, 64)
      : "default";
  const status: PresenceStatus = body.status === "idle" ? "idle" : "active";

  try {
    const upstream = await fetch(`${API_URL}/presence/heartbeat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      body: JSON.stringify({
        email,
        name,
        role,
        plan,
        path,
        tabId,
        status,
      }),
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { tracked: false },
        { status: upstream.status, headers: { "Cache-Control": "no-store" } }
      );
    }

    const data = await upstream.json().catch(() => ({ tracked: true, status }));
    return NextResponse.json(
      { tracked: Boolean(data?.tracked), status: data?.status || status },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[Presence] Error forwarding heartbeat to backend:", error);
    return NextResponse.json(
      { tracked: false },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
