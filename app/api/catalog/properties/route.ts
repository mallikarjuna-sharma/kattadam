import { NextResponse } from "next/server";
import { forwardToKattadamApi } from "@/lib/lambda-proxy";

export async function GET() {
  const proxied = await forwardToKattadamApi("/catalog/properties");
  return proxied ?? NextResponse.json({ ok: false, error: "KATTADAM_API_URL is not configured." }, { status: 503 });
}
