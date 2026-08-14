import { NextResponse } from "next/server";
import { authLoginEmail, getServerBackend, sessionCreate } from "@kattadam/data-layer/server";

export async function POST(req: Request) {
  const b = getServerBackend();
  if (!b) {
    return NextResponse.json({ ok: false, error: "Database is not configured." }, { status: 503 });
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");
  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "Email and password are required." }, { status: 400 });
  }

  const user = await authLoginEmail(email, password);
  if (!user) {
    return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
  }

  const ua = req.headers.get("user-agent");
  const session = await sessionCreate(user.id, user.email ?? email, ua);
  if (!session) {
    return NextResponse.json(
      { ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role }, sessionId: null }
    );
  }

  return NextResponse.json({
    ok: true,
    sessionId: session.id,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}
