import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = cookieStore.get("user")?.value;

  const authenticated = Boolean(
    token && token !== "{}" && user && user !== "{}"
  );

  return NextResponse.json(
    { authenticated },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
