function stripOuterQuotes(s: string): string {
  const t = s.trim();
  if (t.length >= 2) {
    const a = t[0];
    const b = t[t.length - 1];
    if ((a === '"' && b === '"') || (a === "'" && b === "'")) return t.slice(1, -1).trim();
  }
  return t;
}

export function readKattadamApiUrl(): string | null {
  const raw = process.env.KATTADAM_API_URL?.trim();
  if (!raw) return null;
  return stripOuterQuotes(raw).replace(/\/+$/, "");
}

export function readKattadamApiSecret(): string | null {
  const raw = process.env.KATTADAM_API_SECRET?.trim();
  return raw ? stripOuterQuotes(raw) : null;
}
