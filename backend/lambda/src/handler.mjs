import { CORS, routePath, httpMethod } from "./lib/http.mjs";
import { routeRequest } from "./router.mjs";

function headerMap(event) {
  const raw = event.headers ?? {};
  const out = {};
  for (const [k, v] of Object.entries(raw)) {
    out[k.toLowerCase()] = v;
  }
  return out;
}

export const handler = async (event) => {
  const method = httpMethod(event);
  const path = routePath(event);
  const headers = headerMap(event);

  if (method === "OPTIONS") {
    return { statusCode: 204, headers: CORS, body: "" };
  }

  const bodyText = event.body ?? "";
  const queryString = event.rawQueryString ?? "";

  try {
    const { status, data } = await routeRequest(method, path, bodyText, headers, queryString);
    return {
      statusCode: status,
      headers: CORS,
      body: JSON.stringify(data),
    };
  } catch (e) {
    console.error("[handler]", e);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }),
    };
  }
};
