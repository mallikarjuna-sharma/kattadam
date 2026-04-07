import type { IDataBackend } from "./ports";
import { readSupabaseServerConfig } from "./env";
import { createSupabaseDataBackend } from "./supabase-backend";

export function createBackendFromEnv(): IDataBackend | null {
  const cfg = readSupabaseServerConfig();
  if (!cfg) return null;
  return createSupabaseDataBackend(cfg.url, cfg.serviceRoleKey);
}
