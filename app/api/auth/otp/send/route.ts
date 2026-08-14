import { NextResponse } from "next/server";
import {
  authCountEmailOtpsSince,
  authStoreEmailOtp,
  authUserExistsByEmail,
  getServerBackend,
} from "@kattadam/data-layer/server";
import { isDevExposeOtp, fixedDevOtp, generateOtpCode, hashOtp, otpExpiresAt, type OtpPurpose } from "@/lib/otp";
import { isSesFullyConfigured, sendOtpEmail } from "@/lib/ses-email";

const OTP_RATE_LIMIT = 5;
const OTP_RATE_WINDOW_MS = 15 * 60 * 1000;

function parsePurpose(raw: string | undefined): OtpPurpose | null {
  if (raw === "signup" || raw === "password_reset") return raw;
  return null;
}

export async function POST(req: Request) {
  const b = getServerBackend();
  if (!b) {
    return NextResponse.json({ ok: false, error: "Database is not configured." }, { status: 503 });
  }

  let body: { email?: string; purpose?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const purpose = parsePurpose(body.purpose);

  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }
  if (!purpose) {
    return NextResponse.json({ ok: false, error: "Invalid purpose." }, { status: 400 });
  }

  if (purpose === "signup") {
    const exists = await authUserExistsByEmail(email);
    if (exists) {
      return NextResponse.json({ ok: false, error: "This email is already registered." }, { status: 409 });
    }
    if (exists === null) {
      return NextResponse.json({ ok: false, error: "Could not verify email availability." }, { status: 503 });
    }
  }

  const sinceIso = new Date(Date.now() - OTP_RATE_WINDOW_MS).toISOString();
  const recentCount = await authCountEmailOtpsSince(email, purpose, sinceIso);
  if (recentCount === null) {
    return NextResponse.json({ ok: false, error: "Could not send verification code." }, { status: 503 });
  }
  if (recentCount >= OTP_RATE_LIMIT) {
    return NextResponse.json(
      { ok: false, error: "Too many codes sent. Wait a few minutes and try again." },
      { status: 429 }
    );
  }

  const code = fixedDevOtp() ?? generateOtpCode();
  const expiresAt = otpExpiresAt();
  const codeHash = hashOtp(email, purpose, code);
  const stored = await authStoreEmailOtp(email, purpose, codeHash, expiresAt.toISOString());
  if (!stored) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Could not store verification code. Run migration 005_email_otp.sql in Supabase if this is a new setup.",
      },
      { status: 503 }
    );
  }

  let emailed = false;
  let sendError: string | undefined;

  if (isSesFullyConfigured()) {
    const sent = await sendOtpEmail(email, purpose, code);
    if (sent.ok) {
      emailed = true;
    } else {
      sendError = sent.reason;
      console.error("[auth/otp/send]", sendError);
    }
  } else {
    sendError = "SES is not fully configured on the server.";
    console.warn(`[auth/otp/send] ${sendError} OTP for ${email}: ${code}`);
  }

  const payload: { ok: true; emailed: boolean; devOtp?: string } = { ok: true, emailed };
  if (isDevExposeOtp()) {
    payload.devOtp = code;
  }

  if (!emailed && !isDevExposeOtp()) {
    return NextResponse.json(
      {
        ok: false,
        error: sendError ?? "Could not send verification email. Check SES configuration.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json(payload);
}
