/**
 * Lightweight startup probe — safe to import from Next.js `instrumentation.ts`
 * without pulling in the full Supabase backend (avoids bundling `crypto` for the probe chunk).
 */
import { createClient } from "@supabase/supabase-js";
import { readSupabaseServerConfig } from "./internal/env";

let devStartupProbeDone = false;

export async function probeDataLayerOnStartup(): Promise<void> {
  if (process.env.NODE_ENV !== "development" || devStartupProbeDone) return;
  devStartupProbeDone = true;

  const tag = "[@kattadam/data-layer]";
  const cfg = readSupabaseServerConfig();
  if (!cfg) {
    console.info(
      `${tag} Database not configured — set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local (this app’s root).`
    );
    return;
  }

  console.info(`${tag} Env looks set; checking Supabase (no secrets logged)…`);
  try {
    const client = createClient(cfg.url, cfg.serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error } = await client.from("users").select("id", { head: true });
    if (error) {
      console.warn(`${tag} Supabase returned an error: ${error.message}`);
      const anyErr = error as { cause?: { message?: string; code?: string } };
      if (anyErr.cause && (anyErr.cause.message || anyErr.cause.code)) {
        console.warn(
          `${tag} Underlying cause: ${anyErr.cause.code ?? ""} ${anyErr.cause.message ?? ""}`.trim()
        );
      }
      if (/fetch failed/i.test(error.message)) {
        console.warn(
          `${tag} "fetch failed" in Node while curl works is often IPv6/DNS on macOS. Try restarting dev with:`
        );
        console.warn(`${tag}   export NODE_OPTIONS=--dns-result-order=ipv4first`);
        console.warn(`${tag} Also check .env.local: URL has no trailing slash, key has no extra quotes/spaces.`);
      } else {
        console.warn(
          `${tag} If you see "relation … does not exist", run packages/data-layer/supabase/migrations/001_initial.sql in Supabase SQL Editor.`
        );
        console.warn(
          `${tag} For email auth, experts, and listings, also run 004_auth_experts_properties.sql.`
        );
      }
    } else {
      console.info(`${tag} Supabase OK — connected and \`users\` table is reachable.`);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn(`${tag} Connection check threw: ${msg}`);
    if (e instanceof Error && e.cause) {
      console.warn(`${tag} Cause:`, e.cause);
    }
  }
}
