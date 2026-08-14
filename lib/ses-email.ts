import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import type { OtpPurpose } from "./otp";

function sesRegion(): string {
  return process.env.SES_REGION?.trim() || "ap-south-1";
}

function sesCredentials(): { accessKeyId: string; secretAccessKey: string } | null {
  // Netlify reserves AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_REGION — use KATTADAM_* on Netlify.
  const accessKey =
    process.env.KATTADAM_AWS_ACCESS_KEY_ID?.trim() || process.env.AWS_ACCESS_KEY_ID?.trim();
  const secretKey =
    process.env.KATTADAM_AWS_SECRET_ACCESS_KEY?.trim() || process.env.AWS_SECRET_ACCESS_KEY?.trim();
  if (!accessKey || !secretKey) return null;
  return { accessKeyId: accessKey, secretAccessKey: secretKey };
}

function sesFromEmail(): string | null {
  const from = process.env.SES_FROM_EMAIL?.trim();
  return from || null;
}

function getSesClient(): SESv2Client | null {
  const creds = sesCredentials();
  const region = sesRegion();
  if (creds) {
    return new SESv2Client({
      region,
      credentials: creds,
    });
  }
  // Instance role / default credential chain (e.g. AWS Lambda, EC2)
  try {
    return new SESv2Client({ region });
  } catch {
    return null;
  }
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

export async function sendOtpEmail(to: string, purpose: OtpPurpose, code: string): Promise<boolean> {
  const from = sesFromEmail();
  if (!from) {
    console.warn("[ses-email] SES_FROM_EMAIL not set — OTP not sent via email.");
    return false;
  }

  const client = getSesClient();
  if (!client) {
    console.error(
      "[ses-email] Could not create SES client. Set KATTADAM_AWS_ACCESS_KEY_ID and KATTADAM_AWS_SECRET_ACCESS_KEY."
    );
    return false;
  }

  const { subject, text } = otpEmailContent(purpose, code);

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
    return true;
  } catch (e) {
    console.error("[ses-email] send failed:", e instanceof Error ? e.message : e);
    return false;
  }
}

export function isSesConfigured(): boolean {
  return sesFromEmail() !== null;
}
