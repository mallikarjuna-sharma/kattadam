/**
 * Lightweight startup probe — safe to import from Next.js `instrumentation.ts`
 * without pulling in the full Supabase backend (avoids bundling `crypto` for the probe chunk).
 */
import { createClient } from "@supabase/supabase-js";
import { missingSupabaseEnvVars, readSupabaseServerConfig } from "./internal/env";

let devStartupProbeDone = false;

export async function probeDataLayerOnStartup(): Promise<void> {
  if (process.env.NODE_ENV !== "development" || devStartupProbeDone) return;
  devStartupProbeDone = true;

  const tag = "[@kattadam/data-layer]";
  const missing = missingSupabaseEnvVars();
  if (missing.length) {
    console.error(
      `${tag} Database not configured — missing: ${missing.join(", ")}. Create .env.local at the project root (see .env.example) and restart \`npm run dev\`.`
    );
    return;
  }

  console.info(`${tag} Env looks set; checking Supabase (no secrets logged)…`);
  try {
    const cfg = readSupabaseServerConfig()!;
    const client = createClient(cfg.url, cfg.serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error: usersError } = await client.from("users").select("id", { head: true });
    if (usersError) {
      console.warn(`${tag} Supabase \`users\` check failed: ${usersError.message}`);
      logSupabaseHints(tag, usersError.message);
      return;
    }
    console.info(`${tag} Supabase OK — \`users\` table is reachable.`);

    const { error: enquiriesError } = await client
      .from("enquiries")
      .select("id, phone, alt_phone, email", { head: true });
    if (enquiriesError) {
      console.error(`${tag} \`enquiries\` table check failed: ${enquiriesError.message}`);
      logSupabaseHints(tag, enquiriesError.message);
      return;
    }
    console.info(
      `${tag} \`enquiries\` table OK — contact columns (phone, alt_phone, email) from migration 005 are present.`
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`${tag} Connection check threw: ${msg}`);
    if (e instanceof Error && e.cause) {
      console.error(`${tag} Cause:`, e.cause);
    }
  }
}

function logSupabaseHints(tag: string, message: string): void {
  if (/fetch failed/i.test(message)) {
    console.warn(`${tag} "fetch failed" in Node is often DNS/IPv6. Restart with NODE_OPTIONS=--dns-result-order=ipv4first`);
    console.warn(`${tag} Also check .env.local: URL has no trailing slash, key has no extra quotes/spaces.`);
    return;
  }
  if (/relation.*enquiries.*does not exist/i.test(message)) {
    console.error(`${tag} Fix: run packages/data-layer/supabase/migrations/001_initial.sql in Supabase SQL Editor.`);
    return;
  }
  if (/phone|alt_phone|email/.test(message) && /column|does not exist|schema cache/i.test(message)) {
    console.error(
      `${tag} Fix: run packages/data-layer/supabase/migrations/005_enquiries_contact_fields.sql in Supabase SQL Editor.`
    );
    return;
  }
  console.warn(`${tag} Run all SQL files in packages/data-layer/supabase/migrations/ in order (001 → 005).`);
}
