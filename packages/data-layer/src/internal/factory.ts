import type { IDataBackend } from "./ports";
import { createHttpApiBackend } from "./http-api-backend";

/** Primary backend: Kattadam Lambda API (DynamoDB). */
export function createBackendFromEnv(): IDataBackend | null {
  return createHttpApiBackend();
}
