/**
 * Temporary client-only admin gate (hardcoded credentials).
 * Replace with server session / Supabase Auth before production.
 */

export const ADMIN_AUTH_STORAGE_KEY = "kattadam_admin_session_v1";

/** Match exactly (case-sensitive password as requested). */
export const ADMIN_USERNAME = "kattadam";
export const ADMIN_PASSWORD = "Kattadam#123";

export function isAdminClientAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === "1";
}

export function setAdminClientAuthed(): void {
  localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, "1");
}

export function clearAdminClientAuthed(): void {
  localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
}

export function validateAdminCredentials(username: string, password: string): boolean {
  return username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}
