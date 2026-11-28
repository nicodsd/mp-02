import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = "nilonb7@gmail.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function getAuthorizedAdminToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const rawUser = cookieStore.get("user")?.value;

  if (!token || token === "{}" || !rawUser || rawUser === "{}") {
    return null;
  }

  try {
    const user = JSON.parse(rawUser);
    return user?.email === ADMIN_EMAIL ? token : null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const token = await getAuthorizedAdminToken();
  if (!token) {
    return NextResponse.json(
      { success: false, message: "No autorizado" },
      { status: 403 }
    );
  }

  const wantsStream =
    req.nextUrl.searchParams.get("stream") === "1" ||
    req.headers.get("accept")?.includes("text/event-stream");

  const upstreamUrl = `${API_URL}/admin/online-users${wantsStream ? "?stream=1" : ""}`;

  try {
    const upstream = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(wantsStream ? { Accept: "text/event-stream" } : {}),
      },
      cache: "no-store",
      signal: req.signal,
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { success: false, message: "Error al conectar con presencia del backend" },
        { status: upstream.status, headers: { "Cache-Control": "no-store" } }
      );
    }

    if (wantsStream && upstream.body) {
      return new Response(upstream.body, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "X-Accel-Buffering": "no",
        },
      });
    }

    const data = await upstream.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (req.signal.aborted) {
      return new Response(null, { status: 499 });
    }
    console.error("[Presence] Error proxying admin online-users:", error);
    return NextResponse.json(
      { success: false, message: "Backend de presencia no disponible" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
