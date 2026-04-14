/**
 * Server-only entry: import this from Next.js Route Handlers, Server Actions, and Server Components.
 * Do not import from client components — keys are server-side.
 */
import { createClient } from "@supabase/supabase-js";
import { createBackendFromEnv } from "./internal/factory";
import { readSupabaseServerConfig } from "./internal/env";
import type { IDataBackend } from "./internal/ports";
import type {
  DashboardSummary,
  DealerRecord,
  EnquiryRecord,
  MaterialRecord,
  NotificationAudience,
  NotificationBroadcastRecord,
  ReviewRecord,
  UserRecord,
  ZoneRecord,
} from "./types";
import type { DealerStatus, EnquiryStatus, UserStatus } from "./types";

type DealerUpdatePatch = Partial<{
  shopName: string;
  ownerName: string | null;
  phone: string | null;
  materials: string[];
  location: string | null;
  district: string;
  area: string;
  lat: number | null;
  lng: number | null;
  verified: boolean;
  enabled: boolean;
  topDealer: boolean;
  status: DealerStatus;
  gstDocUrl: string | null;
  licenseDocUrl: string | null;
}>;

let backend: IDataBackend | null | undefined;

export function getServerBackend(): IDataBackend | null {
  if (backend === undefined) backend = createBackendFromEnv();
  return backend;
}

export async function catalogListDealers(): Promise<DealerRecord[] | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.listPublicDealers();
}

export async function catalogListMaterials(): Promise<MaterialRecord[] | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.listPublicMaterials();
}

export async function catalogCreateEnquiry(row: {
  customerName: string;
  materialLabel?: string | null;
  materialId?: string | null;
  quantity?: number | null;
  location?: string | null;
  notes?: string | null;
  assignedDealerId?: string | null;
  customerId?: string | null;
}): Promise<EnquiryRecord | null> {
  const b = getServerBackend();
  if (!b) return null;
  try {
    return await b.createEnquiry(row);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[@kattadam/data-layer] createEnquiry failed:", msg);
    return null;
  }
}

export async function adminGetDashboard(): Promise<DashboardSummary | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.getDashboardSummary();
}

export async function adminListUsers(): Promise<UserRecord[] | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.listUsers();
}

export async function adminUpdateUser(
  id: string,
  patch: Partial<{ status: UserStatus; name: string; phone: string | null; location: string | null }>
): Promise<UserRecord | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.updateUser(id, patch);
}

export async function adminListDealers(): Promise<DealerRecord[] | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.listDealers();
}

export async function adminUpsertDealer(row: Partial<DealerRecord> & { shopName: string }): Promise<DealerRecord | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.upsertDealer(row);
}

export async function adminUpdateDealer(id: string, patch: DealerUpdatePatch): Promise<DealerRecord | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.updateDealer(id, patch);
}

export async function adminDeleteDealer(id: string): Promise<boolean | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.deleteDealer(id);
}

export async function adminListMaterials(): Promise<MaterialRecord[] | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.listMaterials();
}

export async function adminUpsertMaterial(
  row: Partial<MaterialRecord> & { name: string; category: string }
): Promise<MaterialRecord | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.upsertMaterial(row);
}

export async function adminDeleteMaterial(id: string): Promise<boolean | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.deleteMaterial(id);
}

export async function adminListEnquiries(filters?: { status?: EnquiryStatus }): Promise<EnquiryRecord[] | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.listEnquiries(filters);
}

export async function adminUpdateEnquiry(
  id: string,
  patch: Partial<{ status: EnquiryStatus; assignedDealerId: string | null; notes: string | null }>
): Promise<EnquiryRecord | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.updateEnquiry(id, patch);
}

export async function adminListReviews(): Promise<ReviewRecord[] | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.listReviews();
}

export async function adminUpdateReview(id: string, patch: Partial<{ approved: boolean }>): Promise<ReviewRecord | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.updateReview(id, patch);
}

export async function adminListZones(): Promise<ZoneRecord[] | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.listZones();
}

export async function adminCreateZone(name: string, notes?: string | null): Promise<ZoneRecord | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.createZone(name, notes);
}

export async function adminSetDealerZones(dealerId: string, zoneIds: string[]): Promise<boolean | null> {
  const b = getServerBackend();
  if (!b) return null;
  try {
    await b.setDealerZones(dealerId, zoneIds);
    return true;
  } catch {
    return false;
  }
}

export async function adminCreateNotification(
  audience: NotificationAudience,
  title: string,
  body: string
): Promise<NotificationBroadcastRecord | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.createNotificationBroadcast(audience, title, body);
}

export async function adminListNotifications(): Promise<NotificationBroadcastRecord[] | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.listNotificationBroadcasts();
}

let devStartupProbeDone = false;

/**
 * Development only: one-time terminal message about env + Supabase reachability.
 * Does not print URLs, keys, or row data.
 */
export async function probeDataLayerOnStartup(): Promise<void> {
  if (process.env.NODE_ENV !== "development" || devStartupProbeDone) return;
  devStartupProbeDone = true;

  const tag = "[@kattadam/data-layer]";
  const cfg = readSupabaseServerConfig();
  if (!cfg) {
    console.info(
      `${tag} Database not configured — set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local (this app’s root).`
    );
    return;
  }

  console.info(`${tag} Env looks set; checking Supabase (no secrets logged)…`);
  try {
    const client = createClient(cfg.url, cfg.serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error } = await client.from("users").select("id", { head: true });
    if (error) {
      console.warn(`${tag} Supabase returned an error: ${error.message}`);
      const anyErr = error as { cause?: { message?: string; code?: string } };
      if (anyErr.cause && (anyErr.cause.message || anyErr.cause.code)) {
        console.warn(
          `${tag} Underlying cause: ${anyErr.cause.code ?? ""} ${anyErr.cause.message ?? ""}`.trim()
        );
      }
      if (/fetch failed/i.test(error.message)) {
        console.warn(
          `${tag} "fetch failed" in Node while curl works is often IPv6/DNS on macOS. Try restarting dev with:`
        );
        console.warn(`${tag}   export NODE_OPTIONS=--dns-result-order=ipv4first`);
        console.warn(`${tag} Also check .env.local: URL has no trailing slash, key has no extra quotes/spaces.`);
      } else {
        console.warn(
          `${tag} If you see "relation … does not exist", run packages/data-layer/supabase/migrations/001_initial.sql in Supabase SQL Editor.`
        );
      }
    } else {
      console.info(`${tag} Supabase OK — connected and \`users\` table is reachable.`);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn(`${tag} Connection check threw: ${msg}`);
    if (e instanceof Error && e.cause) {
      console.warn(`${tag} Cause:`, e.cause);
    }
  }
}
