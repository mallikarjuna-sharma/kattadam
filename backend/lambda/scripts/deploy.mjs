/**
 * Build + upload to Lambda. Credentials from backend/lambda/.env.local only (KATTADAM_AWS_*).
 */
import { execSync } from "node:child_process";
import { readFileSync, unlinkSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  LambdaClient,
  UpdateFunctionCodeCommand,
  GetFunctionConfigurationCommand,
} from "@aws-sdk/client-lambda";
import { loadLambdaLocalEnv, readKattadamDeployCredentials, readDeployRegion } from "./load-env.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distFile = join(root, "dist", "index.js");
const zipPath = join(root, "dist", "function.zip");

loadLambdaLocalEnv();

const creds = readKattadamDeployCredentials();
if (!creds) {
  console.error(
    "Missing deploy credentials. Create backend/lambda/.env.local with:\n" +
      "  KATTADAM_AWS_ACCESS_KEY_ID=...\n" +
      "  KATTADAM_AWS_SECRET_ACCESS_KEY=...\n" +
      "(Uses Kattadam IAM user only — does not touch ~/.aws/credentials)"
  );
  process.exit(1);
}

const FUNCTION_NAME = process.env.LAMBDA_FUNCTION_NAME || "kattadam-api";
const REGION = readDeployRegion();

console.log("Building…");
execSync("npm run build", { cwd: root, stdio: "inherit" });

if (!existsSync(distFile)) {
  console.error("Build output missing:", distFile);
  process.exit(1);
}

if (existsSync(zipPath)) unlinkSync(zipPath);
execSync("zip -q function.zip index.js", { cwd: join(root, "dist") });

const zip = readFileSync(zipPath);
console.log(`Deploying to ${FUNCTION_NAME} (${REGION})…`);

const client = new LambdaClient({
  region: REGION,
  credentials: creds,
});

await client.send(
  new UpdateFunctionCodeCommand({
    FunctionName: FUNCTION_NAME,
    ZipFile: zip,
  })
);

console.log("Waiting for Lambda update…");
for (let i = 0; i < 45; i++) {
  const cfg = await client.send(new GetFunctionConfigurationCommand({ FunctionName: FUNCTION_NAME }));
  const state = cfg.State;
  const status = cfg.LastUpdateStatus;
  if (state === "Active" && status === "Successful") break;
  if (status === "Failed") {
    console.error(cfg.LastUpdateStatusReason ?? "Update failed");
    process.exit(1);
  }
  await new Promise((r) => setTimeout(r, 2000));
}

const url = process.env.LAMBDA_FUNCTION_URL || "";
console.log("Done.");
if (url) {
  console.log(`curl -s "${url.replace(/\/$/, "")}/health"`);
}
