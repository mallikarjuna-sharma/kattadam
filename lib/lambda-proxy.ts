import { NextResponse } from "next/server";

export function getKattadamApiUrl(): string | null {
  const raw = process.env.KATTADAM_API_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/+$/, "");
}

/** Map Next.js /api/... path to Lambda Function URL path (no /api prefix). */
export function lambdaPathFromApiRoute(apiPath: string): string {
  const p = apiPath.replace(/^\/api/, "");
  return p.startsWith("/") ? p : `/${p}`;
}

export async function forwardToKattadamApi(
  lambdaPath: string,
  req?: Request
): Promise<NextResponse | null> {
  const base = getKattadamApiUrl();
  if (!base) return null;

  const method = req?.method ?? "GET";
  const headers: Record<string, string> = {
    accept: "application/json",
  };
  const secret = process.env.KATTADAM_API_SECRET?.trim();
  if (secret) headers["x-kattadam-internal"] = secret;

  const init: RequestInit = { method, headers };

  if (req && method !== "GET" && method !== "HEAD") {
    const ct = req.headers.get("content-type");
    if (ct) headers["content-type"] = ct;
    init.body = await req.text();
    init.headers = headers;
  }

  const url = `${base}${lambdaPath.startsWith("/") ? lambdaPath : `/${lambdaPath}`}`;
  const res = await fetch(url, init);
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
  });
}
