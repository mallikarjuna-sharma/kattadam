import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

export async function sendOtpEmail(to, code, purpose = "signup") {
  const from = process.env.SES_FROM_EMAIL?.trim();
  if (!from) return { ok: false, reason: "SES_FROM_EMAIL not set" };
  const region = process.env.SES_REGION || "ap-south-1";
  const client = new SESv2Client({ region });
  const subject = purpose === "password_reset" ? "Kattadam password reset code" : "Verify your Kattadam email";
  const text =
    purpose === "password_reset"
      ? `Your password reset code is: ${code}\n\nExpires in 10 minutes.`
      : `Your verification code is: ${code}\n\nExpires in 10 minutes.`;
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
    return { ok: false, reason: e instanceof Error ? e.message : String(e) };
  }
}
