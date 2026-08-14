import { createHash, randomInt } from "node:crypto";

export type OtpPurpose = "signup" | "password_reset";

const OTP_LENGTH = 6;
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_VERIFY_ATTEMPTS = 5;

export function generateOtpCode(): string {
  return String(randomInt(100000, 1000000));
}

export function otpExpiresAt(): Date {
  return new Date(Date.now() + OTP_TTL_MS);
}

export function hashOtp(email: string, purpose: OtpPurpose, code: string): string {
  const pepper = process.env.OTP_HASH_SECRET?.trim() || "kattadam-dev-otp-pepper";
  const normalized = email.trim().toLowerCase();
  return createHash("sha256").update(`${pepper}:${normalized}:${purpose}:${code}`).digest("hex");
}

export function verifyOtpHash(email: string, purpose: OtpPurpose, code: string, storedHash: string): boolean {
  return hashOtp(email, purpose, code) === storedHash;
}

export function isOtpExpired(expiresAt: string | Date): boolean {
  return new Date(expiresAt).getTime() <= Date.now();
}

export function maxOtpVerifyAttempts(): number {
  return MAX_VERIFY_ATTEMPTS;
}

export function isDevExposeOtp(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  const flag = process.env.AUTH_DEV_EXPOSE_OTP?.trim();
  if (flag === "1" || flag === "true") return true;
  return !process.env.SES_FROM_EMAIL?.trim();
}

export function fixedDevOtp(): string | null {
  const fixed = process.env.AUTH_FIXED_OTP?.trim();
  if (!fixed || process.env.NODE_ENV === "production") return null;
  return fixed;
}
