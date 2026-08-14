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

  const notes = [
    `Phone: +91 ${phone}`,
    ...(target ? [`Regarding: ${target}`] : []),
    "",
    message,
  ].join("\n");

  const created = await catalogCreateEnquiry({
    customerName,
    materialLabel: target || null,
    materialId,
    notes,
    assignedDealerId,
  });

  if (!created) {
    const dev =
      process.env.NODE_ENV === "development"
        ? "Could not save your enquiry. Check the terminal for [@kattadam/data-layer] logs — fix NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local, run the SQL migrations, or rely on the dev file store (.data/enquiries.json)."
        : "Could not save your enquiry right now. Please try again later.";
    return NextResponse.json({ ok: false, error: dev }, { status: 503 });
  }

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");

  return NextResponse.json({ ok: true, id: created.id });
}
