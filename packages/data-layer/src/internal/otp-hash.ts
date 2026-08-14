import { createHash } from "node:crypto";
import type { EmailOtpPurpose } from "../types";

export function hashEmailOtp(email: string, purpose: EmailOtpPurpose, code: string): string {
  const pepper = process.env.OTP_HASH_SECRET?.trim() || "kattadam-dev-otp-pepper";
  const normalized = email.trim().toLowerCase();
  return createHash("sha256").update(`${pepper}:${normalized}:${purpose}:${code}`).digest("hex");
}
