#!/usr/bin/env node
/**
 * Checks Supabase env + DNS + REST reachability (loads .env.local from project root).
 * Usage: npm run supabase:test
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { lookup } from "node:dns/promises";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env.local");

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadEnvFile(envPath);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

const ref = url?.match(/^https:\/\/([^.]+)\.supabase\.co/i)?.[1] ?? null;
const host = ref ? `${ref}.supabase.co` : null;

console.log("=== Kattodam Supabase connection test ===\n");

if (!url || !serviceKey) {
  console.log("FAIL — Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

console.log(`Env file:     ${existsSync(envPath) ? ".env.local found" : ".env.local missing"}`);
console.log(`Project ref:  ${ref ?? "(could not parse URL)"}`);
console.log(`URL set:      yes`);
console.log(`Service key:  ${serviceKey ? "yes" : "no"}`);
console.log(`Anon key:     ${anonKey ? "yes" : "no"}\n`);

if (!host) {
  console.log("FAIL — URL should look like https://YOUR_REF.supabase.co");
  process.exit(1);
}

console.log("--- DNS ---");
try {
  const r = await lookup(host);
  console.log(`OK — ${host} → ${r.address}`);
} catch (e) {
  console.log(`FAIL — ${host} does not resolve (${e.code ?? e.message})`);
  console.log(
    "\nThis is not an app bug: the project ref in .env.local does not match a live Supabase project."
  );
  console.log("Fix: supabase.com → your project → Settings → API → copy Project URL + service_role key.\n");
  process.exit(1);
}

console.log("\n--- REST (service role) ---");
const client = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const tables = ["users", "dealers", "materials", "enquiries"];
let failed = 0;
for (const table of tables) {
  const { error } = await client.from(table).select("id", { head: true, count: "exact" });
  if (error) {
    failed++;
    const cause = error.cause;
    const extra =
      cause && typeof cause === "object" && "message" in cause
        ? ` (${cause.code ?? ""} ${cause.message})`.trim()
        : "";
    console.log(`${table}: FAIL — ${error.message}${extra}`);
  } else {
    console.log(`${table}: OK`);
  }
}

if (failed === tables.length) {
  console.log("\nAll tables failed — check keys, migrations, or network.");
  process.exit(1);
}
if (failed > 0) {
  console.log(`\n${failed} table(s) missing — run packages/data-layer/supabase/migrations/*.sql in SQL Editor.`);
  process.exit(1);
}

console.log("\nSupabase connection OK.");
