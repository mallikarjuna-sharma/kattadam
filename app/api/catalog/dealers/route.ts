import { NextResponse } from "next/server";
import { isDataLayerConfigured } from "@kattadam/data-layer";
import { catalogListDealers } from "@kattadam/data-layer/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const configured = isDataLayerConfigured();
  if (!configured) {
    return NextResponse.json({
      ok: true,
      configured: false,
      source: "unconfigured" as const,
      dealers: [] as const,
    });
  }

  try {
    const dealers = await catalogListDealers();
    if (dealers == null) {
      return NextResponse.json({
        ok: true,
        configured: true,
        source: "unconfigured" as const,
        dealers: [],
      });
    }
    return NextResponse.json({
      ok: true,
      configured: true,
      source: "live" as const,
      dealers,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[api/catalog/dealers]", message);
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        source: "error" as const,
        dealers: [],
        error: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 503 }
    );
  }
}
