// app/api/auth/send-otp/route.ts

import { NextRequest, NextResponse } from "next/server";
import { sendOtp } from "@/lib/otp";
import { z } from "zod";

const schema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Must be a 10-digit number"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = schema.parse(body);

    const result = await sendOtp(phone);

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
