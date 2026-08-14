import { NextResponse } from "next/server";
import { authRegisterCustomer, authRegisterPartner, getServerBackend } from "@kattadam/data-layer/server";

export async function POST(req: Request) {
  const b = getServerBackend();
  if (!b) {
    return NextResponse.json({ ok: false, error: "Database is not configured." }, { status: 503 });
  }

  let body: { mode?: string; name?: string; email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const mode = body.mode === "partner" ? "partner" : "user";

  if (!name || !email || !email.includes("@")) {
    return NextResponse.json({ ok: false, error: "Enter your name and a valid email." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ ok: false, error: "Password must be at least 6 characters." }, { status: 400 });
  }

  try {
    const user =
      mode === "partner"
        ? await authRegisterPartner({ name, email, password })
        : await authRegisterCustomer({ name, email, password });
    if (!user) {
      return NextResponse.json({ ok: false, error: "Could not create account. Email may already be in use." }, { status: 400 });
    }
    return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/duplicate|unique|23505/i.test(msg)) {
      return NextResponse.json({ ok: false, error: "This email is already registered." }, { status: 409 });
    }
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
