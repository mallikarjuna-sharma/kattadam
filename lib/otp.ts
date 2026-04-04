// lib/otp.ts — OTP generation and SMS dispatch

import { db } from "@/lib/db";
import { generateOtp } from "@/lib/utils";

const OTP_EXPIRY_MINUTES = 10;

export async function sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
  // Rate limiting: max 3 OTPs per phone in 10 minutes
  const recentCount = await db.otpCode.count({
    where: {
      phone,
      createdAt: { gt: new Date(Date.now() - 10 * 60 * 1000) },
    },
  });

  if (recentCount >= 3) {
    return { success: false, message: "Too many OTP requests. Please wait 10 minutes." };
  }

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await db.otpCode.create({ data: { phone, code, expiresAt } });

  // In development, just log the OTP
  if (process.env.NODE_ENV === "development") {
    console.log(`📱 OTP for ${phone}: ${code}`);
    return { success: true, message: "OTP sent (check server logs in dev)" };
  }

  // Production: Send via Twilio (or MSG91 / Fast2SMS for India)
  try {
    // Using Twilio
    const twilio = require("twilio");
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    await client.messages.create({
      body: `Your Kattodam OTP is ${code}. Valid for ${OTP_EXPIRY_MINUTES} minutes. Do not share this with anyone.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`,
    });

    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("SMS Error:", error);
    return { success: false, message: "Failed to send OTP. Please try again." };
  }
}

export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  const record = await db.otpCode.findFirst({
    where: {
      phone,
      code,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  return !!record;
}
