// app/api/dealers/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const area = searchParams.get("area");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = { isActive: true };

    if (area && area !== "All Areas") {
      where.area = area;
    }

    if (category) {
      where.materials = { some: { category } };
    }

    if (search) {
      where.OR = [
        { shopName: { contains: search, mode: "insensitive" } },
        { materials: { some: { name: { contains: search, mode: "insensitive" } } } },
      ];
    }

    const [dealers, total] = await Promise.all([
      db.dealer.findMany({
        where,
        include: {
          materials: { orderBy: { category: "asc" } },
        },
        orderBy: [{ isVerified: "desc" }, { rating: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.dealer.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: dealers,
        total,
        page,
        limit,
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch dealers" }, { status: 500 });
  }
}
