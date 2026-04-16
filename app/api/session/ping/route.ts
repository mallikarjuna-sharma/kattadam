import { NextResponse } from "next/server";
import { getServerBackend } from "@kattadam/data-layer/server";

export async function POST(req: Request) {
  const b = getServerBackend();
  if (!b) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  let body: { sessionId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const sessionId = String(body.sessionId ?? "").trim();
  if (!sessionId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const ok = await b.touchAppSession(sessionId);
  return NextResponse.json({ ok: !!ok });
}
