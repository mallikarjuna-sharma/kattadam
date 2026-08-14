/**
 * Local smoke test without deploying.
 * Usage: npm run dev
 */
import { execSync } from "node:child_process";
import { mkdtempSync, copyFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distFile = join(root, "dist", "index.js");

try {
  createRequire(join(root, "package.json"))("./dist/index.js");
} catch {
  execSync("npm run build", { cwd: root, stdio: "inherit" });
}

// Lambda zip has only index.js (no package.json), so load the bundle the same way.
const tempDir = mkdtempSync(join(tmpdir(), "kattadam-lambda-"));
copyFileSync(distFile, join(tempDir, "index.js"));
const require = createRequire(join(tempDir, "index.js"));
const { handler } = require(join(tempDir, "index.js"));

const event = {
  rawPath: "/health",
  requestContext: { http: { method: "GET", path: "/health" } },
  headers: {},
};

const res = await handler(event);
console.log(JSON.stringify(res, null, 2));
rmSync(tempDir, { recursive: true, force: true });
