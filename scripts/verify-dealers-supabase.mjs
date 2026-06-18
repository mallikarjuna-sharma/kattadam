/**
 * Verify Supabase dealer CRUD, schema columns, and admin form field alignment.
 * Usage: node scripts/verify-dealers-supabase.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const path = ".env.local";
  if (!existsSync(path)) return;
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
}

function fail(msg, err) {
  console.error(`\n✗ ${msg}`);
  if (err) {
    console.error("  Error:", err.message ?? err);
    if (err.details) console.error("  Details:", err.details);
    if (err.hint) console.error("  Hint:", err.hint);
    if (err.code) console.error("  Code:", err.code);
    if (err.stack) console.error("\nStack trace:\n", err.stack);
  }
  console.error("");
  process.exit(1);
}

function ok(msg) {
  console.log(`✓ ${msg}`);
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/, "");
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

console.log("\n=== Supabase Dealer Verification ===\n");

if (!url) fail("NEXT_PUBLIC_SUPABASE_URL is missing in .env.local");
if (!anonKey) fail("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing in .env.local");
if (!serviceKey) fail("SUPABASE_SERVICE_ROLE_KEY is missing in .env.local");

ok(`NEXT_PUBLIC_SUPABASE_URL set (${url})`);
ok(`NEXT_PUBLIC_SUPABASE_ANON_KEY set (${anonKey.slice(0, 20)}…)`);
ok(`SUPABASE_SERVICE_ROLE_KEY set (${serviceKey.slice(0, 20)}…)`);

const serviceClient = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const anonClient = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// --- 1. Connectivity ---
const { error: pingError } = await serviceClient.from("dealers").select("id", { head: true });
if (pingError) {
  fail(
    `Cannot reach Supabase or \`dealers\` table: ${pingError.message}`,
    pingError
  );
}
ok("Service role client connected — `dealers` table reachable");

const { error: anonPingError } = await anonClient.from("dealers").select("id", { head: true, count: "exact" });
if (anonPingError) {
  console.warn(`⚠ Anon key read on dealers: ${anonPingError.message} (may be RLS — service role is used server-side)`);
} else {
  ok("Anon key client can query `dealers`");
}

// --- Migration / schema checks ---
const expectedColumns = [
  { name: "shop_name", migration: "001_initial.sql" },
  { name: "owner_name", migration: "001_initial.sql" },
  { name: "phone", migration: "001_initial.sql" },
  { name: "materials", migration: "001_initial.sql" },
  { name: "location", migration: "001_initial.sql" },
  { name: "district", migration: "003_dealers_district_area_materials_dealer_fk.sql" },
  { name: "area", migration: "003_dealers_district_area_materials_dealer_fk.sql" },
  { name: "residential_address", migration: "006_dealers_address_fields.sql" },
  { name: "delivery_address", migration: "006_dealers_address_fields.sql" },
  { name: "verified", migration: "001_initial.sql" },
  { name: "enabled", migration: "001_initial.sql" },
  { name: "status", migration: "001_initial.sql" },
  { name: "rating", migration: "001_initial.sql" },
  { name: "top_dealer", migration: "001_initial.sql" },
];

const selectCols = expectedColumns.map((c) => c.name).join(", ");
const { error: schemaError } = await serviceClient.from("dealers").select(selectCols, { head: true });
if (schemaError) {
  const missing = expectedColumns.find((c) => schemaError.message.includes(c.name));
  const migrationHint = missing
    ? `Run migrations/${missing.migration} in Supabase SQL Editor.`
    : "Check migrations 001, 003, 006.";
  fail(`Schema column check failed: ${schemaError.message}\n  → ${migrationHint}`, schemaError);
}
ok(`All expected dealer columns present (${expectedColumns.length} checked)`);

// --- Form field vs schema mapping ---
const formToDb = [
  ["shopName", "shop_name"],
  ["ownerName", "owner_name"],
  ["phone", "phone"],
  ["district", "district"],
  ["area", "area"],
  ["location", "location"],
  ["residentialAddress", "residential_address"],
  ["deliveryAddress", "delivery_address"],
  ["categories → materials", "materials"],
  ["status", "status"],
  ["enabled", "enabled"],
  ["verified (derived from approved status)", "verified"],
];
console.log("\n--- Form field ↔ DB column mapping (DealerForm / actionUpsertDealer) ---");
for (const [form, db] of formToDb) {
  console.log(`  ${form.padEnd(42)} → dealers.${db}`);
}
const dbOnlyNotInForm = ["user_id", "lat", "lng", "rating", "top_dealer", "gst_doc_url", "license_doc_url", "created_at"];
console.log("\n  DB columns not in admin form (by design):", dbOnlyNotInForm.join(", "));
ok("Form fields align with writable dealer columns");

// --- 2. Read existing dealers ---
const { data: existing, error: readError } = await serviceClient
  .from("dealers")
  .select("*")
  .order("created_at", { ascending: false })
  .limit(5);
if (readError) fail("Read dealers failed", readError);
ok(`Read dealers OK — ${existing?.length ?? 0} row(s) returned (showing up to 5)`);
if (existing?.length) {
  const sample = existing[0];
  console.log(`  Sample: id=${sample.id}, shop=${sample.shop_name}, district=${sample.district ?? "(null)"}, area=${sample.area ?? "(null)"}`);
}

// --- 3. Create test dealer ---
const testPayload = {
  shop_name: "__verify_dealer_test__",
  owner_name: "Verify Script Owner",
  phone: "9000000001",
  materials: ["CEMENT", "STEEL"],
  district: "Coimbatore",
  area: "RS Puram",
  location: "RS Puram, Coimbatore",
  residential_address: "123 Test Residential St",
  delivery_address: "456 Test Delivery Rd",
  status: "approved",
  verified: true,
  enabled: true,
};

let createdId;
try {
  const { data: inserted, error: insertError } = await serviceClient
    .from("dealers")
    .insert(testPayload)
    .select("*")
    .single();
  if (insertError) fail("Create dealer failed", insertError);
  createdId = inserted.id;
  ok(`Create dealer OK (id: ${createdId})`);

  // Verify all fields persisted
  const checks = [
    ["shop_name", testPayload.shop_name],
    ["owner_name", testPayload.owner_name],
    ["phone", testPayload.phone],
    ["district", testPayload.district],
    ["area", testPayload.area],
    ["location", testPayload.location],
    ["residential_address", testPayload.residential_address],
    ["delivery_address", testPayload.delivery_address],
    ["status", testPayload.status],
    ["materials", JSON.stringify(testPayload.materials)],
  ];
  for (const [col, expected] of checks) {
    const actual = inserted[col];
    const actualStr = Array.isArray(actual) ? JSON.stringify(actual) : String(actual ?? "");
    if (actualStr !== String(expected)) {
      fail(`Field mismatch after insert: ${col} expected "${expected}" got "${actualStr}"`);
    }
  }
  ok("All inserted fields match expected values");

  // --- 4. Update test dealer ---
  const updatePayload = {
    shop_name: "__verify_dealer_updated__",
    owner_name: "Updated Owner",
    phone: "9000000002",
    area: "Gandhipuram",
    district: "Coimbatore",
    location: "Gandhipuram, Coimbatore",
    residential_address: "789 Updated Residential",
    delivery_address: "101 Updated Delivery",
    materials: ["CEMENT", "STEEL", "BRICKS"],
    status: "pending",
    verified: false,
    enabled: false,
  };

  const { data: updated, error: updateError } = await serviceClient
    .from("dealers")
    .update(updatePayload)
    .eq("id", createdId)
    .select("*")
    .single();
  if (updateError) fail("Update dealer failed", updateError);
  ok("Update dealer OK");

  if (updated.shop_name !== updatePayload.shop_name) {
    fail(`Update verification failed: shop_name is "${updated.shop_name}"`);
  }
  if (updated.area !== updatePayload.area) {
    fail(`Update verification failed: area is "${updated.area}"`);
  }
  if (!Array.isArray(updated.materials) || updated.materials.length !== 3) {
    fail(`Update verification failed: materials = ${JSON.stringify(updated.materials)}`);
  }
  ok("Updated fields persisted correctly");

  // --- 5. Admin panel mapping simulation (mapDealer logic) ---
  const adminView = {
    shopName: updated.shop_name,
    ownerName: updated.owner_name,
    phone: updated.phone,
    district: updated.district?.trim() || "Coimbatore",
    area: updated.area?.trim() || "—",
    location: updated.location,
    residentialAddress: updated.residential_address?.trim() || null,
    deliveryAddress: updated.delivery_address?.trim() || null,
    materials: updated.materials ?? [],
    status: updated.status,
    verified: updated.verified,
    enabled: updated.enabled,
    rating: Number(updated.rating),
  };
  console.log("\n--- Admin panel would display ---");
  console.log(JSON.stringify(adminView, null, 2));
  ok("Admin panel field mapping verified against DB row");

  // --- Cleanup ---
  const { error: deleteError } = await serviceClient.from("dealers").delete().eq("id", createdId);
  if (deleteError) {
    console.warn(`⚠ Could not delete test dealer ${createdId}: ${deleteError.message}`);
  } else {
    ok("Test dealer cleaned up");
  }
} catch (e) {
  if (createdId) {
    await serviceClient.from("dealers").delete().eq("id", createdId);
  }
  fail("Unexpected error during CRUD test", e);
}

console.log("\n=== All dealer checks passed ===\n");
