import { NextResponse } from "next/server";
import { catalogListDealers } from "@kattadam/data-layer/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await catalogListDealers();
  return NextResponse.json({ ok: true, source: data ? "live" : "unconfigured", dealers: data ?? [] });
}
