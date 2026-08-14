import { createHash, randomInt } from "node:crypto";

export function generateOtpCode() {
  return String(randomInt(100000, 1000000));
}

export function hashOtp(email, purpose, code) {
  const pepper = process.env.OTP_HASH_SECRET?.trim() || "kattadam-dev-otp-pepper";
  const normalized = email.trim().toLowerCase();
  return createHash("sha256").update(`${pepper}:${normalized}:${purpose}:${code}`).digest("hex");
}

export function otpExpiresAt() {
  return new Date(Date.now() + 10 * 60 * 1000);
}
