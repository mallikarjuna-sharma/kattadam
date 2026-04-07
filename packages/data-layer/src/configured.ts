import { readSupabaseServerConfig } from "./internal/env";

/** True when server-side Supabase credentials are present (does not validate connectivity). */
export function isDataLayerConfigured(): boolean {
  return readSupabaseServerConfig() !== null;
}
