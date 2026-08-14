export const CORS = {
  "content-type": "application/json",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type",
};

export function json(statusCode, body) {
  return {
    statusCode,
    headers: CORS,
    body: JSON.stringify(body),
  };
}

export function routePath(event) {
  const raw = event.rawPath || event.requestContext?.http?.path || "/";
  return raw.replace(/^\/prod/, "") || "/";
}

export function httpMethod(event) {
  return event.requestContext?.http?.method || event.httpMethod || "GET";
}
