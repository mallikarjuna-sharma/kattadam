import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { catalogCreateEnquiry } from "@kattadam/data-layer/server";

export const dynamic = "force-dynamic";

function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

function migrationHint(message: string): string | null {
  if (/relation.*enquiries.*does not exist/i.test(message)) {
    return "Run packages/data-layer/supabase/migrations/001_initial.sql in the Supabase SQL Editor.";
  }
  if (/phone|alt_phone|email/.test(message) && /column|does not exist|schema cache/i.test(message)) {
    return "Run packages/data-layer/supabase/migrations/005_enquiries_contact_fields.sql in the Supabase SQL Editor.";
  }
  if (/delivery_address/.test(message) && /column|does not exist|schema cache/i.test(message)) {
    return "Run packages/data-layer/supabase/migrations/007_enquiries_delivery_address.sql in the Supabase SQL Editor.";
  }
  return null;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON", code: "INVALID_JSON" }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const customerName = typeof o.customerName === "string" ? o.customerName.trim() : "";
  const phone = typeof o.phone === "string" ? o.phone.replace(/\D/g, "").slice(0, 15) : "";
  const rawAltPhone = typeof o.altPhone === "string" ? o.altPhone.replace(/\D/g, "").slice(0, 15) : "";
  const altPhone = rawAltPhone.length >= 10 ? rawAltPhone : null;
  const rawEmail = typeof o.email === "string" ? o.email.trim() : "";
  const email = rawEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail) ? rawEmail : null;
  const message = typeof o.message === "string" ? o.message.trim() : "";
  const currentAddress = typeof o.currentAddress === "string" ? o.currentAddress.trim() : "";
  const deliveryAddress = typeof o.deliveryAddress === "string" ? o.deliveryAddress.trim() : "";
  const target = typeof o.target === "string" ? o.target.trim() : "";
  const rawDealerId = typeof o.dealerId === "string" ? o.dealerId.trim() : "";
  const assignedDealerId = rawDealerId && isUuid(rawDealerId) ? rawDealerId : null;
  const rawMaterialId = typeof o.materialId === "string" ? o.materialId.trim() : "";
  const materialId = rawMaterialId && isUuid(rawMaterialId) ? rawMaterialId : null;

  if (!customerName || phone.length < 10 || !message || !currentAddress || !deliveryAddress) {
    return NextResponse.json(
      {
        ok: false,
        error: "Name, phone, current address, delivery address, and requirement text are required.",
        code: "VALIDATION",
      },
      { status: 400 }
    );
  }

  if (currentAddress.length > 500 || deliveryAddress.length > 500) {
    return NextResponse.json(
      { ok: false, error: "Each address must be at most 500 characters.", code: "VALIDATION" },
      { status: 400 }
    );
  }

  if (rawEmail && !email) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address or leave it blank.", code: "VALIDATION" },
      { status: 400 }
    );
  }

  if (rawAltPhone && !altPhone) {
    return NextResponse.json(
      { ok: false, error: "Alternate phone must be a valid 10-digit number or left blank.", code: "VALIDATION" },
      { status: 400 }
    );
  }

  const result = await catalogCreateEnquiry({
    customerName,
    phone,
    altPhone,
    email,
    materialLabel: target || null,
    materialId,
    location: currentAddress,
    deliveryAddress,
    notes: message,
    assignedDealerId,
  });

  if (!result.ok) {
    const hint = result.code === "DB_ERROR" ? migrationHint(result.message) : null;
    console.error("[api/enquiries] Save failed:", {
      code: result.code,
      message: result.message,
      hint,
    });

    const isDev = process.env.NODE_ENV === "development";
    const userMessage =
      result.code === "NOT_CONFIGURED"
        ? result.message
        : hint
          ? `Database error: ${hint}`
          : "Could not save your enquiry. Check server logs for details.";

    return NextResponse.json(
      {
        ok: false,
        error: userMessage,
        code: result.code,
        ...(isDev ? { detail: result.message, hint } : {}),
      },
      { status: result.code === "NOT_CONFIGURED" ? 503 : 500 }
    );
  }

  console.info("[api/enquiries] Saved enquiry:", result.record.id);

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");

  return NextResponse.json({ ok: true, id: result.record.id });
}
