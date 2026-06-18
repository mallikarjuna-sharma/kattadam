/**
 * Dealer table connectivity + schema + insert test.
 * Usage: node scripts/test-dealer-db.mjs
 */
import { readFileSync, existsSync } from "node:fs";

function loadEnvLocal() {
  const path = ".env.local";
  if (!existsSync(path)) return false;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
  return true;
}

function mask(s, show = 8) {
  if (!s || s.length <= show) return s ? "(set, short)" : "(missing)";
  return `${s.slice(0, show)}…${s.slice(-4)} (len=${s.length})`;
}

function printErr(label, err) {
  console.error(`\n✗ ${label}`);
  if (err?.message) console.error(`  message: ${err.message}`);
  if (err?.details) console.error(`  details: ${err.details}`);
  if (err?.hint) console.error(`  hint: ${err.hint}`);
  if (err?.code) console.error(`  code: ${err.code}`);
  if (err?.cause) console.error(`  cause:`, err.cause);
  if (err?.stack) console.error(`  stack:\n${err.stack}`);
}

const DEALER_FORM_COLUMNS = [
  "shop_name",
  "owner_name",
  "phone",
  "district",
  "area",
  "location",
  "residential_address",
  "delivery_address",
  "materials",
  "status",
  "verified",
  "enabled",
];

console.log("=== Kattadam dealer DB connectivity test ===\n");

const envLoaded = loadEnvLocal();
console.log(`1. .env.local exists: ${existsSync(".env.local")}`);
console.log(`   env loaded into process: ${envLoaded}`);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${url ? mask(url) : "MISSING"}`);
console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${key ? mask(key, 12) : "MISSING"}`);

if (!url || !key) {
  console.error("\n✗ ROOT CAUSE: Environment configuration — missing URL or service role key.");
  process.exit(1);
}
if (url.includes("YOUR_PROJECT_REF") || key.includes("your-service-role-key")) {
  console.error("\n✗ ROOT CAUSE: Environment configuration — .env.local still has placeholder values.");
  process.exit(1);
}

const { createClient } = await import("@supabase/supabase-js");
const client = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log("\n2. Connect to Supabase (users table head request)…");
try {
  const { error } = await client.from("users").select("id", { head: true });
  if (error) {
    printErr("Database connectivity failed", error);
    console.error("\n✗ ROOT CAUSE: Database connectivity");
    process.exit(1);
  }
  console.log("   ✓ Connected");
} catch (e) {
  printErr("Database connectivity threw", e);
  console.error("\n✗ ROOT CAUSE: Database connectivity (network/DNS)");
  process.exit(1);
}

console.log("\n3. Fetch sample from dealers table…");
let sample = null;
try {
  const { data, error } = await client.from("dealers").select("*").limit(1);
  if (error) {
    printErr("dealers SELECT failed", error);
    if (/relation.*dealers.*does not exist/i.test(error.message)) {
      console.error("\n✗ ROOT CAUSE: Schema mismatch — run 001_initial.sql");
    } else if (/column/i.test(error.message)) {
      console.error("\n✗ ROOT CAUSE: Schema mismatch — missing column on dealers");
    } else {
      console.error("\n✗ ROOT CAUSE: Database connectivity or permissions");
    }
    process.exit(1);
  }
  sample = data?.[0] ?? null;
  console.log(`   ✓ dealers table readable (${data?.length ?? 0} row(s) in sample)`);
  if (sample) {
    console.log(`   sample id: ${sample.id}`);
    console.log(`   sample shop: ${sample.shop_name}`);
  }
} catch (e) {
  printErr("dealers SELECT threw", e);
  process.exit(1);
}

console.log("\n4. Schema check — dealer form columns vs database…");
const { data: probeRow, error: probeErr } = await client
  .from("dealers")
  .select(DEALER_FORM_COLUMNS.join(", "))
  .limit(0);
if (probeErr) {
  printErr("Schema probe failed (form columns)", probeErr);
  const missing = [];
  if (/residential_address|delivery_address/.test(probeErr.message)) {
    missing.push("006_dealers_address_fields.sql");
  }
  if (/district|area/.test(probeErr.message)) {
    missing.push("003_dealers_district_area_materials_dealer_fk.sql");
  }
  console.error("\n✗ ROOT CAUSE: Schema mismatch");
  if (missing.length) console.error(`   Run migration(s): ${missing.join(", ")}`);
  process.exit(1);
}
console.log("   ✓ All dealer form columns exist:", DEALER_FORM_COLUMNS.join(", "));

console.log("\n5. Insert test dealer record…");
const testShop = `__verify_dealer_test_${Date.now()}`;
const insertPayload = {
  shop_name: testShop,
  owner_name: "DB Test Owner",
  phone: "9876543210",
  district: "Coimbatore",
  area: "RS Puram",
  location: "RS Puram, Coimbatore",
  residential_address: "123 Test Street, RS Puram",
  delivery_address: "456 Delivery Lane, Coimbatore",
  materials: ["CEMENT"],
  status: "approved",
  verified: true,
  enabled: true,
};

let insertedId = null;
try {
  const { data, error } = await client.from("dealers").insert(insertPayload).select().single();
  if (error) {
    printErr("dealer INSERT failed", error);
    if (/column/i.test(error.message)) {
      console.error("\n✗ ROOT CAUSE: Schema mismatch — insert payload has columns DB does not accept");
    } else {
      console.error("\n✗ ROOT CAUSE: Application code or DB constraints");
    }
    process.exit(1);
  }
  insertedId = data.id;
  console.log(`   ✓ Inserted test dealer id: ${insertedId}`);
  console.log(`   shop_name: ${data.shop_name}`);
  console.log(`   residential_address: ${data.residential_address ?? "(null)"}`);
  console.log(`   delivery_address: ${data.delivery_address ?? "(null)"}`);
} catch (e) {
  printErr("dealer INSERT threw", e);
  process.exit(1);
}

console.log("\n6. Cleanup test dealer…");
const { error: delErr } = await client.from("dealers").delete().eq("id", insertedId);
if (delErr) {
  console.warn(`   ⚠ Could not delete test dealer ${insertedId}: ${delErr.message}`);
} else {
  console.log("   ✓ Test dealer deleted");
}

console.log("\n=== All dealer DB checks passed ===\n");
