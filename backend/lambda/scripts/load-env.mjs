import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Load backend/lambda/.env.local only (gitignored). Does not read ~/.aws/credentials.
 * Existing process.env values win (shell exports override the file).
 */
export function loadLambdaLocalEnv() {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const path = join(root, ".env.local");
  if (!existsSync(path)) return false;

  const text = readFileSync(path, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined || process.env[key] === "") {
      process.env[key] = val;
    }
  }
  return true;
}

/** Kattadam-scoped keys only — never uses global AWS_ACCESS_KEY_ID. */
export function readKattadamDeployCredentials() {
  const accessKeyId = process.env.KATTADAM_AWS_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.KATTADAM_AWS_SECRET_ACCESS_KEY?.trim();
  if (!accessKeyId || !secretAccessKey) return null;
  return { accessKeyId, secretAccessKey };
}

export function readDeployRegion() {
  return process.env.AWS_REGION?.trim() || process.env.SES_REGION?.trim() || "ap-south-1";
}
