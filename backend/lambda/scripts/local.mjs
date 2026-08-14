/**
 * Local smoke test without deploying.
 * Usage: npm run dev
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distFile = join(root, "dist", "index.mjs");

if (!existsSync(distFile)) {
  execSync("npm run build", { cwd: root, stdio: "inherit" });
}

const { handler } = await import(distFile);

const event = {
  rawPath: "/health",
  requestContext: { http: { method: "GET", path: "/health" } },
  headers: {},
};

const res = await handler(event);
console.log(JSON.stringify(res, null, 2));
