import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import type { OtpPurpose } from "./otp";

export type SesSendResult = { ok: true } | { ok: false; reason: string };

function sesRegion(): string {
  return process.env.SES_REGION?.trim() || "ap-south-1";
}

function readEnv(keys: string[]): string | null {
  for (const key of keys) {
    const v = process.env[key]?.trim();
    if (v) return v;
  }
  return null;
}

function sesCredentials(): { accessKeyId: string; secretAccessKey: string } | null {
  // Netlify reserves AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY — use KATTADAM_* there.
  const accessKey = readEnv([
    "KATTADAM_AWS_ACCESS_KEY_ID",
    "SES_ACCESS_KEY_ID",
    "AWS_ACCESS_KEY_ID",
  ]);
  const secretKey = readEnv([
    "KATTADAM_AWS_SECRET_ACCESS_KEY",
    "SES_SECRET_ACCESS_KEY",
    "AWS_SECRET_ACCESS_KEY",
  ]);
  if (!accessKey || !secretKey) return null;
  return { accessKeyId: accessKey, secretAccessKey: secretKey };
}

function sesFromEmail(): string | null {
  return readEnv(["SES_FROM_EMAIL"]);
}

function getSesClient(): SESv2Client | null {
  const creds = sesCredentials();
  if (!creds) return null;
  return new SESv2Client({
    region: sesRegion(),
    credentials: creds,
  });
}

function otpEmailContent(purpose: OtpPurpose, code: string): { subject: string; text: string } {
  if (purpose === "password_reset") {
    return {
      subject: "Kattadam password reset code",
      text: `Your Kattadam password reset code is: ${code}\n\nThis code expires in 10 minutes. If you did not request this, ignore this email.`,
    };
  }
  return {
    subject: "Verify your Kattadam email",
    text: `Your Kattadam verification code is: ${code}\n\nEnter this code to complete your registration. It expires in 10 minutes.`,
  };
}

/** What is missing or misconfigured for SES (for logs / API hints). */
export function getSesConfigIssues(): string[] {
  const issues: string[] = [];
  if (!sesFromEmail()) issues.push("SES_FROM_EMAIL is not set");
  if (!sesCredentials()) {
    issues.push(
      "AWS credentials missing — set KATTADAM_AWS_ACCESS_KEY_ID and KATTADAM_AWS_SECRET_ACCESS_KEY on Netlify (scope: All, not Builds only)"
    );
  }
  return issues;
}

export function isSesFullyConfigured(): boolean {
  return getSesConfigIssues().length === 0;
}

export function isSesConfigured(): boolean {
  return sesFromEmail() !== null;
}

export async function sendOtpEmail(to: string, purpose: OtpPurpose, code: string): Promise<SesSendResult> {
  const from = sesFromEmail();
  if (!from) {
    return { ok: false, reason: "SES_FROM_EMAIL is not set on the server." };
  }

  const creds = sesCredentials();
  if (!creds) {
    return {
      ok: false,
      reason:
        "AWS credentials are not set. Add KATTADAM_AWS_ACCESS_KEY_ID and KATTADAM_AWS_SECRET_ACCESS_KEY in Netlify env (scope: All).",
    };
  }

  const client = getSesClient();
  if (!client) {
    return { ok: false, reason: "Could not initialize SES client." };
  }

  const { subject, text } = otpEmailContent(purpose, code);
  const region = sesRegion();

  try {
    await client.send(
      new SendEmailCommand({
        FromEmailAddress: from,
        Destination: { ToAddresses: [to.trim().toLowerCase()] },
        Content: {
          Simple: {
            Subject: { Data: subject, Charset: "utf-8" },
            Body: { Text: { Data: text, Charset: "utf-8" } },
          },
        },
      })
    );
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[ses-email] send failed (region=${region}, from=${from}):`, msg);
    if (/InvalidClientTokenId|SignatureDoesNotMatch|UnrecognizedClientException/i.test(msg)) {
      return { ok: false, reason: "Invalid AWS credentials. Check KATTADAM_AWS_ACCESS_KEY_ID and secret on Netlify." };
    }
    if (/AccessDenied|not authorized/i.test(msg)) {
      return {
        ok: false,
        reason: "IAM user lacks ses:SendEmail permission in ap-south-1.",
      };
    }
    if (/MessageRejected|not verified/i.test(msg)) {
      return { ok: false, reason: "SES rejected the message. Confirm kattadam.in is verified in ap-south-1." };
    }
    return { ok: false, reason: `SES error: ${msg}` };
  }
}
