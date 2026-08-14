import { NextResponse } from "next/server";
import { forwardToKattadamApi } from "@/lib/lambda-proxy";

export const dynamic = "force-dynamic";

export async function GET() {
  const proxied = await forwardToKattadamApi("/catalog/dealers");
  return proxied ?? NextResponse.json({ ok: false, error: "KATTADAM_API_URL is not configured." }, { status: 503 });
}
