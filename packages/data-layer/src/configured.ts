import { readKattadamApiUrl } from "./internal/kattadam-api-env";

/** True when KATTADAM_API_URL points at the Lambda backend. */
export function isDataLayerConfigured(): boolean {
  return readKattadamApiUrl() !== null;
}
