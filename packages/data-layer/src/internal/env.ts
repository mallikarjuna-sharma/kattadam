/**
 * Reads Supabase configuration from process.env.
 * Keep all env access here so application code never touches URLs or keys.
 */
function stripOuterQuotes(s: string): string {
  const t = s.trim();
  if (t.length >= 2) {
    const a = t[0];
    const b = t[t.length - 1];
    if ((a === '"' && b === '"') || (a === "'" && b === "'")) return t.slice(1, -1).trim();
  }
  return t;
}

export function readSupabaseServerConfig(): { url: string; serviceRoleKey: string } | null {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRoleKey) return null;
  url = stripOuterQuotes(url).replace(/\/+$/, "");
  serviceRoleKey = stripOuterQuotes(serviceRoleKey);
  if (!url || !serviceRoleKey) return null;
  return { url, serviceRoleKey };
}

export function readSupabaseAnonConfig(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) return null;
  return { url, anonKey };
}
