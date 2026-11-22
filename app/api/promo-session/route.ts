import { NextResponse } from "next/server";
import { syncPromoSession } from "@/src/utils/promoServerAction";

export async function GET() {
  const data = await syncPromoSession();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
