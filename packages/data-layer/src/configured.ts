import { readSupabaseServerConfig, missingSupabaseEnvVars } from "./internal/env";

/** True when server-side Supabase credentials are present (does not validate connectivity). */
export function isDataLayerConfigured(): boolean {
  return readSupabaseServerConfig() !== null;
}

export function getDataLayerConfigError(): string | null {
  const missing = missingSupabaseEnvVars();
  if (!missing.length) return null;
  return `Missing environment variable(s): ${missing.join(", ")}. Add them to .env.local at the project root and restart the dev server.`;
}
