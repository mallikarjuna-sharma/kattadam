import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { catalogCreateEnquiry } from "@kattadam/data-layer/server";

export const dynamic = "force-dynamic";

function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const customerName = typeof o.customerName === "string" ? o.customerName.trim() : "";
  const phone = typeof o.phone === "string" ? o.phone.replace(/\D/g, "").slice(0, 15) : "";
  const rawAltPhone = typeof o.altPhone === "string" ? o.altPhone.replace(/\D/g, "").slice(0, 15) : "";
  const altPhone = rawAltPhone.length >= 10 ? rawAltPhone : null;
  const rawEmail = typeof o.email === "string" ? o.email.trim() : "";
  const email = rawEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail) ? rawEmail : null;
  const message = typeof o.message === "string" ? o.message.trim() : "";
  const target = typeof o.target === "string" ? o.target.trim() : "";
  const rawDealerId = typeof o.dealerId === "string" ? o.dealerId.trim() : "";
  const assignedDealerId = rawDealerId && isUuid(rawDealerId) ? rawDealerId : null;
  const rawMaterialId = typeof o.materialId === "string" ? o.materialId.trim() : "";
  const materialId = rawMaterialId && isUuid(rawMaterialId) ? rawMaterialId : null;

  if (!customerName || phone.length < 10 || !message) {
    return NextResponse.json(
      { ok: false, error: "Name, a valid phone number, and requirement text are required." },
      { status: 400 }
    );
  }

  if (rawEmail && !email) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address or leave it blank." },
      { status: 400 }
    );
  }

  if (rawAltPhone && !altPhone) {
    return NextResponse.json(
      { ok: false, error: "Alternate phone must be a valid 10-digit number or left blank." },
      { status: 400 }
    );
  }

  const notes = target ? `Regarding: ${target}\n\n${message}` : message;

  const created = await catalogCreateEnquiry({
    customerName,
    phone,
    altPhone,
    email,
    materialLabel: target || null,
    materialId,
    notes,
    assignedDealerId,
  });

  if (!created) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Could not save your enquiry. Ensure Supabase env vars are set (see .env.example) and the enquiries table exists.",
      },
      { status: 503 }
    );
  }

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");

  return NextResponse.json({ ok: true, id: created.id });
}
