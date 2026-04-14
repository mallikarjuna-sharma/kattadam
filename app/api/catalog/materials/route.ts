import { NextResponse } from "next/server";
import { isDataLayerConfigured } from "@kattadam/data-layer";
import { catalogListMaterials } from "@kattadam/data-layer/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const configured = isDataLayerConfigured();
  if (!configured) {
    return NextResponse.json({
      ok: true,
      configured: false,
      source: "unconfigured" as const,
      materials: [] as const,
    });
  }

  try {
    const materials = await catalogListMaterials();
    if (materials == null) {
      return NextResponse.json({
        ok: true,
        configured: true,
        source: "unconfigured" as const,
        materials: [],
      });
    }
    return NextResponse.json({
      ok: true,
      configured: true,
      source: "live" as const,
      materials,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[api/catalog/materials]", message);
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        source: "error" as const,
        materials: [],
        error: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 503 }
    );
  }
}
