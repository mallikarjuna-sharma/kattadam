/**
 * Lightweight startup probe — checks Kattadam Lambda API reachability in dev.
 */
import { useLocalEnquiryFallback } from "./internal/enquiry-fallback";
import { readKattadamApiUrl } from "./internal/kattadam-api-env";

let devStartupProbeDone = false;

export async function probeDataLayerOnStartup(): Promise<void> {
  if (process.env.NODE_ENV !== "development" || devStartupProbeDone) return;
  devStartupProbeDone = true;

  const tag = "[@kattadam/data-layer]";
  const apiUrl = readKattadamApiUrl();
  if (!apiUrl) {
    console.info(
      `${tag} Backend not configured — set KATTADAM_API_URL in .env.local (Lambda Function URL).`
    );
    if (useLocalEnquiryFallback()) {
      console.info(
        `${tag} Dev enquiry fallback is on: enquiries may be stored in .data/enquiries.json.`
      );
    }
    return;
  }

  console.info(`${tag} Checking Kattadam API at ${apiUrl}/health …`);
  try {
    const res = await fetch(`${apiUrl}/health`, { headers: { accept: "application/json" } });
    const text = await res.text();
    if (!res.ok) {
      console.warn(`${tag} API health check failed (${res.status}): ${text.slice(0, 200)}`);
      return;
    }
    console.info(`${tag} Kattadam API OK — ${text.slice(0, 120)}`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn(`${tag} API connection check threw: ${msg}`);
  }

  if (useLocalEnquiryFallback()) {
    console.info(
      `${tag} Dev enquiry fallback is on: if the API fails, enquiries are stored in .data/enquiries.json.`
    );
  }
}
