import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { IDataBackend } from "./ports";
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
} from "../types";
import type { DealerStatus, EnquiryStatus, UserStatus } from "../types";

type UserRow = {
  id: string;
  name: string;
  phone: string | null;
  role: string;
  status: string;
  location: string | null;
  lat: number | null;
  lng: number | null;
  kyc_status: string | null;
  created_at: string;
};

type DealerRow = {
  id: string;
  user_id: string | null;
  shop_name: string;
  owner_name: string | null;
  phone: string | null;
  materials: string[] | null;
  location: string | null;
  district: string | null;
  area: string | null;
  lat: number | null;
  lng: number | null;
  rating: number;
  verified: boolean;
  enabled: boolean;
  top_dealer: boolean;
  status: string;
  gst_doc_url: string | null;
  license_doc_url: string | null;
  created_at: string;
};

type MaterialRow = {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  unit: string | null;
  image_url: string | null;
  pricing_type: string;
  fixed_price: number | null;
  price: number | null;
  dealer_id: string | null;
  dealer_name: string | null;
  district: string | null;
  area: string | null;
  created_at: string;
};

type EnquiryRow = {
  id: string;
  customer_id: string | null;
  customer_name: string | null;
  material_id: string | null;
  material_label: string | null;
  quantity: number | null;
  location: string | null;
  lat: number | null;
  lng: number | null;
  status: string;
  assigned_dealer_id: string | null;
  notes: string | null;
  created_at: string;
};

type ReviewRow = {
  id: string;
  user_id: string;
  dealer_id: string;
  rating: number;
  comment: string | null;
  approved: boolean;
  complaint: boolean;
  created_at: string;
};

type ZoneRow = { id: string; name: string; notes: string | null; created_at: string };

type NotifRow = {
  id: string;
  audience: string;
  title: string;
  body: string;
  created_at: string;
};

function mapUser(r: UserRow): UserRecord {
  return {
    id: r.id,
    name: r.name,
    phone: r.phone,
    role: r.role as UserRecord["role"],
    status: r.status as UserStatus,
    location: r.location,
    lat: r.lat,
    lng: r.lng,
    kycStatus: r.kyc_status,
    createdAt: r.created_at,
  };
}

function mapDealer(r: DealerRow): DealerRecord {
  let district = (r.district ?? "").trim();
  let area = (r.area ?? "").trim();
  const loc = r.location?.trim() ?? "";
  if ((!district || !area) && loc.includes(",")) {
    const parts = loc.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      if (!area) area = parts[0] ?? "";
      if (!district) district = parts[parts.length - 1] ?? "";
    }
  }
  if (!district) district = "Coimbatore";
  if (!area) area = loc && !loc.includes(",") ? loc : "—";
  return {
    id: r.id,
    userId: r.user_id,
    shopName: r.shop_name,
    ownerName: r.owner_name,
    phone: r.phone,
    materials: r.materials ?? [],
    location: r.location,
    district,
    area,
    lat: r.lat,
    lng: r.lng,
    rating: Number(r.rating),
    verified: r.verified,
    enabled: r.enabled,
    topDealer: r.top_dealer,
    status: r.status as DealerStatus,
    gstDocUrl: r.gst_doc_url,
    licenseDocUrl: r.license_doc_url,
    createdAt: r.created_at,
  };
}

function mapMaterial(r: MaterialRow): MaterialRecord {
  const fixed = r.fixed_price != null ? Number(r.fixed_price) : null;
  const priceCol = r.price != null ? Number(r.price) : null;
  const price = Number.isFinite(priceCol as number) ? (priceCol as number) : Number.isFinite(fixed as number) ? (fixed as number) : 0;
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    subcategory: r.subcategory,
    unit: r.unit,
    imageUrl: r.image_url,
    pricingType: r.pricing_type as MaterialRecord["pricingType"],
    fixedPrice: fixed,
    price,
    dealerName: r.dealer_name ?? null,
    dealerId: r.dealer_id ?? null,
    district: r.district?.trim() || "Coimbatore",
    area: r.area?.trim() || "",
    createdAt: r.created_at,
  };
}

function mapEnquiry(r: EnquiryRow): EnquiryRecord {
  return {
    id: r.id,
    customerId: r.customer_id,
    customerName: r.customer_name,
    materialId: r.material_id,
    materialLabel: r.material_label,
    quantity: r.quantity,
    location: r.location,
    lat: r.lat,
    lng: r.lng,
    status: r.status as EnquiryStatus,
    assignedDealerId: r.assigned_dealer_id,
    notes: r.notes,
    createdAt: r.created_at,
  };
}

function mapReview(r: ReviewRow): ReviewRecord {
  return {
    id: r.id,
    userId: r.user_id,
    dealerId: r.dealer_id,
    rating: r.rating,
    comment: r.comment,
    approved: r.approved,
    complaint: r.complaint,
    createdAt: r.created_at,
  };
}

function mapZone(r: ZoneRow): ZoneRecord {
  return { id: r.id, name: r.name, notes: r.notes, createdAt: r.created_at };
}

function mapNotif(r: NotifRow): NotificationBroadcastRecord {
  return {
    id: r.id,
    audience: r.audience as NotificationAudience,
    title: r.title,
    body: r.body,
    createdAt: r.created_at,
  };
}

function isLikelyTransientNetworkError(message: string): boolean {
  return /fetch failed|failed to fetch|networkerror|econnreset|etimedout|socket|enotfound|eafnosupport/i.test(
    message
  );
}

function formatSupabaseClientError(err: {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
  cause?: unknown;
}): string {
  const parts = [err.message];
  if (err.details) parts.push(`Details: ${err.details}`);
  if (err.hint) parts.push(`Hint: ${err.hint}`);
  if (err.code) parts.push(`Code: ${err.code}`);
  if (err.cause instanceof Error) parts.push(`Cause: ${err.cause.message}`);
  else if (err.cause != null) parts.push(`Cause: ${String(err.cause)}`);
  return parts.join(" | ");
}

async function fetchAllMaterialsOrdered(client: SupabaseClient) {
  return client.from("materials").select("*").order("category", { ascending: true });
}

async function listMaterialsWithNetworkRetry(client: SupabaseClient): Promise<MaterialRecord[]> {
  let res = await fetchAllMaterialsOrdered(client);
  if (res.error && isLikelyTransientNetworkError(res.error.message)) {
    await new Promise((r) => setTimeout(r, 700));
    res = await fetchAllMaterialsOrdered(client);
  }
  if (res.error) {
    throw new Error(formatSupabaseClientError(res.error as { message: string; cause?: unknown }));
  }
  return ((res.data ?? []) as MaterialRow[]).map(mapMaterial);
}

export class SupabaseDataBackend implements IDataBackend {
  constructor(private readonly client: SupabaseClient) {}

  isReady(): boolean {
    return true;
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    const [
      usersC,
      dealersC,
      enquiriesC,
      usersRows,
      enquiriesRows,
      dealersRows,
    ] = await Promise.all([
      this.client.from("users").select("id", { count: "exact", head: true }),
      this.client.from("dealers").select("id", { count: "exact", head: true }),
      this.client.from("enquiries").select("id", { count: "exact", head: true }),
      this.client.from("users").select("created_at"),
      this.client.from("enquiries").select("created_at"),
      this.client.from("dealers").select("id, enabled, status, verified"),
    ]);

    const totalUsers = usersC.count ?? 0;
    const totalDealers = dealersC.count ?? 0;
    const totalEnquiries = enquiriesC.count ?? 0;

    const drows = (dealersRows.data ?? []) as Partial<DealerRow>[];
    const activeDealers = drows.filter((d) => d.enabled && d.status === "approved").length;

    const pendingUsersRes = await this.client
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");
    const pendingUsers = pendingUsersRes.count ?? 0;
    const pendingDealers = drows.filter((d) => d.status === "pending").length;
    const pendingTotal = pendingUsers + pendingDealers;

    const enqList = (enquiriesRows.data ?? []) as { created_at: string }[];
    const byDay = new Map<string, number>();
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      byDay.set(key, 0);
    }
    for (const e of enqList) {
      const key = e.created_at.slice(0, 10);
      if (byDay.has(key)) byDay.set(key, (byDay.get(key) ?? 0) + 1);
    }
    const enquiriesLast7Days = [...byDay.entries()].map(([date, count]) => ({ date, count }));

    const urows = (usersRows.data ?? []) as { created_at: string }[];
    const weekBuckets = new Map<string, number>();
    for (const u of urows) {
      const t = new Date(u.created_at).getTime();
      const w = new Date(t);
      w.setDate(w.getDate() - w.getDay());
      const ws = w.toISOString().slice(0, 10);
      weekBuckets.set(ws, (weekBuckets.get(ws) ?? 0) + 1);
    }
    const weeklyUserGrowth = [...weekBuckets.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-8)
      .map(([weekStart, count]) => ({ weekStart, count }));

    return {
      totalUsers,
      totalDealers,
      activeDealers,
      pendingApprovals: pendingTotal,
      totalEnquiries,
      enquiriesLast7Days,
      weeklyUserGrowth,
    };
  }

  async listUsers(): Promise<UserRecord[]> {
    const { data, error } = await this.client.from("users").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return ((data ?? []) as UserRow[]).map(mapUser);
  }

  async updateUser(
    id: string,
    patch: Partial<{ status: UserStatus; name: string; phone: string | null; location: string | null }>
  ): Promise<UserRecord | null> {
    const row: Record<string, unknown> = {};
    if (patch.status !== undefined) row.status = patch.status;
    if (patch.name !== undefined) row.name = patch.name;
    if (patch.phone !== undefined) row.phone = patch.phone;
    if (patch.location !== undefined) row.location = patch.location;
    const { data, error } = await this.client.from("users").update(row).eq("id", id).select().single();
    if (error) return null;
    return mapUser(data as UserRow);
  }

  async listDealers(): Promise<DealerRecord[]> {
    const { data, error } = await this.client.from("dealers").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return ((data ?? []) as DealerRow[]).map(mapDealer);
  }

  async listPublicDealers(): Promise<DealerRecord[]> {
    const { data, error } = await this.client
      .from("dealers")
      .select("*")
      .eq("enabled", true)
      .eq("status", "approved")
      .order("rating", { ascending: false });
    if (error) throw new Error(error.message);
    return ((data ?? []) as DealerRow[]).map(mapDealer);
  }

  async listPublicMaterials(): Promise<MaterialRecord[]> {
    return listMaterialsWithNetworkRetry(this.client);
  }

  async upsertDealer(row: Partial<DealerRecord> & { shopName: string }): Promise<DealerRecord> {
    const district = row.district?.trim() || "Coimbatore";
    const area = row.area?.trim() || "";
    const location =
      row.location?.trim() || (area ? `${area}, ${district}` : district);
    const status = row.status ?? "approved";
    const isApproved = status === "approved";
    const payload: Record<string, unknown> = {
      shop_name: row.shopName,
      owner_name: row.ownerName ?? null,
      phone: row.phone ?? null,
      materials: row.materials ?? [],
      location,
      district,
      area,
      lat: row.lat ?? null,
      lng: row.lng ?? null,
      user_id: row.userId ?? null,
      verified: row.verified ?? isApproved,
      enabled: row.enabled ?? true,
      top_dealer: row.topDealer ?? false,
      status,
      gst_doc_url: row.gstDocUrl ?? null,
      license_doc_url: row.licenseDocUrl ?? null,
    };
    if (row.id) {
      const { data, error } = await this.client.from("dealers").update(payload).eq("id", row.id).select().single();
      if (error) throw new Error(error.message);
      return mapDealer(data as DealerRow);
    }
    const { data, error } = await this.client.from("dealers").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return mapDealer(data as DealerRow);
  }

  async updateDealer(id: string, patch: Parameters<IDataBackend["updateDealer"]>[1]): Promise<DealerRecord | null> {
    const row: Record<string, unknown> = {};
    if (patch.shopName !== undefined) row.shop_name = patch.shopName;
    if (patch.ownerName !== undefined) row.owner_name = patch.ownerName;
    if (patch.phone !== undefined) row.phone = patch.phone;
    if (patch.materials !== undefined) row.materials = patch.materials;
    if (patch.location !== undefined) row.location = patch.location;
    if (patch.district !== undefined) row.district = patch.district;
    if (patch.area !== undefined) row.area = patch.area;
    if (patch.district !== undefined || patch.area !== undefined) {
      const { data: cur } = await this.client.from("dealers").select("district,area").eq("id", id).maybeSingle();
      const curRow = cur as { district?: string | null; area?: string | null } | null;
      const d = (patch.district !== undefined ? patch.district : curRow?.district)?.toString().trim() || "Coimbatore";
      const a = (patch.area !== undefined ? patch.area : curRow?.area)?.toString().trim() || "";
      row.location = a ? `${a}, ${d}` : d;
    }
    if (patch.lat !== undefined) row.lat = patch.lat;
    if (patch.lng !== undefined) row.lng = patch.lng;
    if (patch.verified !== undefined) row.verified = patch.verified;
    if (patch.enabled !== undefined) row.enabled = patch.enabled;
    if (patch.topDealer !== undefined) row.top_dealer = patch.topDealer;
    if (patch.status !== undefined) row.status = patch.status;
    if (patch.gstDocUrl !== undefined) row.gst_doc_url = patch.gstDocUrl;
    if (patch.licenseDocUrl !== undefined) row.license_doc_url = patch.licenseDocUrl;
    const { data, error } = await this.client.from("dealers").update(row).eq("id", id).select().single();
    if (error) return null;
    return mapDealer(data as DealerRow);
  }

  async deleteDealer(id: string): Promise<boolean> {
    const { error } = await this.client.from("dealers").delete().eq("id", id);
    return !error;
  }

  async listMaterials(): Promise<MaterialRecord[]> {
    return listMaterialsWithNetworkRetry(this.client);
  }

  async deleteMaterial(id: string): Promise<boolean> {
    const { error } = await this.client.from("materials").delete().eq("id", id);
    return !error;
  }

  async upsertMaterial(row: Partial<MaterialRecord> & { name: string; category: string }): Promise<MaterialRecord> {
    const priceVal =
      row.price != null && Number.isFinite(Number(row.price))
        ? Number(row.price)
        : row.fixedPrice != null && Number.isFinite(Number(row.fixedPrice))
          ? Number(row.fixedPrice)
          : 0;
    const payload: Record<string, unknown> = {
      name: row.name,
      category: row.category,
      subcategory: row.subcategory ?? null,
      unit: row.unit ?? null,
      image_url: row.imageUrl ?? null,
      pricing_type: "fixed",
      fixed_price: priceVal,
      price: priceVal,
      dealer_id: row.dealerId?.trim() || null,
      dealer_name: row.dealerName?.trim() ?? "",
      district: row.district?.trim() || "Coimbatore",
      area: row.area?.trim() || "",
    };
    if (row.id) {
      const { data, error } = await this.client.from("materials").update(payload).eq("id", row.id).select().single();
      if (error) throw new Error(error.message);
      return mapMaterial(data as MaterialRow);
    }
    const { data, error } = await this.client.from("materials").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return mapMaterial(data as MaterialRow);
  }

  async listEnquiries(filters?: { status?: EnquiryStatus }): Promise<EnquiryRecord[]> {
    let q = this.client.from("enquiries").select("*").order("created_at", { ascending: false });
    if (filters?.status) q = q.eq("status", filters.status);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return ((data ?? []) as EnquiryRow[]).map(mapEnquiry);
  }

  async createEnquiry(row: {
    customerName: string;
    materialLabel?: string | null;
    materialId?: string | null;
    quantity?: number | null;
    location?: string | null;
    notes?: string | null;
    assignedDealerId?: string | null;
    customerId?: string | null;
  }): Promise<EnquiryRecord> {
    const payload = {
      customer_id: row.customerId ?? null,
      customer_name: row.customerName,
      material_id: row.materialId ?? null,
      material_label: row.materialLabel ?? null,
      quantity: row.quantity ?? null,
      location: row.location ?? null,
      notes: row.notes ?? null,
      assigned_dealer_id: row.assignedDealerId ?? null,
      status: "pending" as const,
    };
    const { data, error } = await this.client.from("enquiries").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return mapEnquiry(data as EnquiryRow);
  }

  async updateEnquiry(
    id: string,
    patch: Partial<{ status: EnquiryStatus; assignedDealerId: string | null; notes: string | null }>
  ): Promise<EnquiryRecord | null> {
    const row: Record<string, unknown> = {};
    if (patch.status !== undefined) row.status = patch.status;
    if (patch.assignedDealerId !== undefined) row.assigned_dealer_id = patch.assignedDealerId;
    if (patch.notes !== undefined) row.notes = patch.notes;
    const { data, error } = await this.client.from("enquiries").update(row).eq("id", id).select().single();
    if (error) return null;
    return mapEnquiry(data as EnquiryRow);
  }

  async listReviews(): Promise<ReviewRecord[]> {
    const { data, error } = await this.client.from("reviews").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return ((data ?? []) as ReviewRow[]).map(mapReview);
  }

  async updateReview(id: string, patch: Partial<{ approved: boolean }>): Promise<ReviewRecord | null> {
    const row: Record<string, unknown> = {};
    if (patch.approved !== undefined) row.approved = patch.approved;
    const { data, error } = await this.client.from("reviews").update(row).eq("id", id).select().single();
    if (error) return null;
    return mapReview(data as ReviewRow);
  }

  async listZones(): Promise<ZoneRecord[]> {
    const { data, error } = await this.client.from("service_zones").select("*").order("name");
    if (error) throw new Error(error.message);
    return ((data ?? []) as ZoneRow[]).map(mapZone);
  }

  async createZone(name: string, notes?: string | null): Promise<ZoneRecord> {
    const { data, error } = await this.client
      .from("service_zones")
      .insert({ name, notes: notes ?? null })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return mapZone(data as ZoneRow);
  }

  async setDealerZones(dealerId: string, zoneIds: string[]): Promise<void> {
    await this.client.from("dealer_zones").delete().eq("dealer_id", dealerId);
    if (zoneIds.length === 0) return;
    const rows = zoneIds.map((zone_id) => ({ dealer_id: dealerId, zone_id }));
    const { error } = await this.client.from("dealer_zones").insert(rows);
    if (error) throw new Error(error.message);
  }

  async createNotificationBroadcast(
    audience: NotificationAudience,
    title: string,
    body: string
  ): Promise<NotificationBroadcastRecord> {
    const { data, error } = await this.client
      .from("notification_broadcasts")
      .insert({ audience, title, body })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return mapNotif(data as NotifRow);
  }

  async listNotificationBroadcasts(): Promise<NotificationBroadcastRecord[]> {
    const { data, error } = await this.client
      .from("notification_broadcasts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return ((data ?? []) as NotifRow[]).map(mapNotif);
  }
}

export function createSupabaseDataBackend(url: string, serviceRoleKey: string): IDataBackend {
  const client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return new SupabaseDataBackend(client);
}
