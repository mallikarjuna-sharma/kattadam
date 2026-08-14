import type { IDataBackend } from "./ports";
import { createHttpApiBackend } from "./http-api-backend";

/** Primary backend: Kattadam Lambda API (DynamoDB). Supabase is no longer used. */
export function createBackendFromEnv(): IDataBackend | null {
  return createHttpApiBackend();
}
