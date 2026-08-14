/**
 * Lightweight startup probe — safe to import from Next.js `instrumentation.ts`
 * without pulling in the full Supabase backend (avoids bundling `crypto` for the probe chunk).
 */
import { createClient } from "@supabase/supabase-js";
import { useLocalEnquiryFallback } from "./internal/enquiry-fallback";
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
        console.warn(
          `${tag} If the project ref in the URL is wrong or the project was deleted, the host will not resolve (NXDOMAIN) — create a project at supabase.com and paste the new URL + keys.`
        );
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
    if (/ENOTFOUND|NXDOMAIN|getaddrinfo/i.test(msg)) {
      console.warn(
        `${tag} Supabase host not found — verify NEXT_PUBLIC_SUPABASE_URL matches an active project (Dashboard → Project Settings → API).`
      );
    }
  }

  if (useLocalEnquiryFallback()) {
    console.info(
      `${tag} Dev enquiry fallback is on: if Supabase fails, enquiries are stored in .data/enquiries.json (visible in /admin/enquiries).`
    );
  }
}
