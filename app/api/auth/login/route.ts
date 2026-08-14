import { NextResponse } from "next/server";
import { forwardToKattadamApi } from "@/lib/lambda-proxy";

export async function POST(req: Request) {
  const proxied = await forwardToKattadamApi("/auth/login", req);
  return proxied ?? NextResponse.json({ ok: false, error: "KATTADAM_API_URL is not configured." }, { status: 503 });
}
