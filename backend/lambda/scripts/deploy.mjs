/**
 * Build + upload to Lambda. No manual zip — run: npm run deploy
 */
import { execSync } from "node:child_process";
import { readFileSync, unlinkSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { LambdaClient, UpdateFunctionCodeCommand } from "@aws-sdk/client-lambda";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distFile = join(root, "dist", "index.mjs");
const zipPath = join(root, "dist", "function.zip");

const FUNCTION_NAME = process.env.LAMBDA_FUNCTION_NAME || "kattadam-api";
const REGION = process.env.AWS_REGION || "ap-south-1";

console.log("Building…");
execSync("npm run build", { cwd: root, stdio: "inherit" });

if (!existsSync(distFile)) {
  console.error("Build output missing:", distFile);
  process.exit(1);
}

if (existsSync(zipPath)) unlinkSync(zipPath);
execSync(`zip -q function.zip index.mjs`, { cwd: join(root, "dist") });

const zip = readFileSync(zipPath);
console.log(`Deploying to ${FUNCTION_NAME} (${REGION})…`);

const client = new LambdaClient({ region: REGION });
await client.send(
  new UpdateFunctionCodeCommand({
    FunctionName: FUNCTION_NAME,
    ZipFile: zip,
  })
);

console.log("Waiting for Lambda update…");
execSync(
  `aws lambda wait function-updated-v2 --function-name ${FUNCTION_NAME} --region ${REGION}`,
  { stdio: "inherit" }
);

const url = process.env.LAMBDA_FUNCTION_URL || "";
console.log("Done.");
if (url) {
  console.log(`curl -s "${url.replace(/\/$/, "")}/health"`);
}
