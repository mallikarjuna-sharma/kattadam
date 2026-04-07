import { NextResponse } from "next/server";
import { catalogListMaterials } from "@kattadam/data-layer/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await catalogListMaterials();
  return NextResponse.json({ ok: true, source: data ? "live" : "unconfigured", materials: data ?? [] });
}
