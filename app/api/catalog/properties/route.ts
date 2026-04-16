import { NextResponse } from "next/server";
import { isDataLayerConfigured } from "@kattadam/data-layer";
import { catalogListPropertyListings } from "@kattadam/data-layer/server";

export async function GET() {
  if (!isDataLayerConfigured()) {
    return NextResponse.json({ configured: false, source: "unconfigured", listings: [] });
  }
  try {
    const listings = await catalogListPropertyListings();
    if (!listings) {
      return NextResponse.json({ configured: true, source: "error", listings: [], error: "Could not load listings." });
    }
    return NextResponse.json({ configured: true, source: "live", listings });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ configured: true, source: "error", listings: [], error: msg });
  }
}
