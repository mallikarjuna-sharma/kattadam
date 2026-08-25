import type { IDataBackend } from "./ports";
import { readKattadamApiSecret, readKattadamApiUrl } from "./kattadam-api-env";
import type {
  AdminEventRecord,
  AppSessionRecord,
  DashboardSummary,
  DealerRecord,
  EnquiryRecord,
  ExpertType,
  HomeServiceProviderRecord,
  KattadamExpertRecord,
  MaterialRecord,
  NotificationAudience,
  NotificationBroadcastRecord,
  PropertyListingRecord,
  ReviewRecord,
  UserRecord,
  ZoneRecord,
  EmailOtpPurpose,
  DealerStatus,
  EnquiryStatus,
  UserStatus,
} from "../types";

/** HTTP client to Kattadam Lambda Function URL. */
export class HttpApiBackend implements IDataBackend {
  private readonly base: string;
  private readonly secret: string | null;

  constructor(baseUrl: string, secret?: string | null) {
    this.base = baseUrl.replace(/\/+$/, "");
    this.secret = secret ?? null;
  }

  isReady(): boolean {
    return true;
  }

  private headers(): Record<string, string> {
    const h: Record<string, string> = { accept: "application/json", "content-type": "application/json" };
    if (this.secret) h["x-kattadam-internal"] = this.secret;
    return h;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.base}${path}`, {
      ...init,
      headers: { ...this.headers(), ...(init?.headers as Record<string, string> | undefined) },
    });
    const text = await res.text();
    let data: unknown;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      throw new Error(`Invalid JSON from API ${path}: ${text.slice(0, 200)}`);
    }
    if (!res.ok) {
      const err = (data as { error?: string })?.error ?? res.statusText;
      throw new Error(err);
    }
    return data as T;
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    return this.request("/admin/dashboard");
  }

  async listUsers(): Promise<UserRecord[]> {
    const r = await this.request<{ users: UserRecord[] }>("/admin/users");
    return r.users ?? [];
  }

  async updateUser(
    id: string,
    patch: Partial<{ status: UserStatus; name: string; phone: string | null; email: string | null; location: string | null }>
  ): Promise<UserRecord | null> {
    const r = await this.request<{ user: UserRecord | null }>("/admin/users/" + encodeURIComponent(id), {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    return r.user;
  }

  async registerCustomerUser(row: {
    name: string;
    email: string;
    password: string;
    emailVerified?: boolean;
  }): Promise<UserRecord> {
    const r = await this.request<{ user: UserRecord }>("/auth/register-internal", {
      method: "POST",
      body: JSON.stringify({ ...row, mode: "user" }),
    });
    return r.user;
  }

  async registerPartnerUser(row: {
    name: string;
    email: string;
    password: string;
    emailVerified?: boolean;
  }): Promise<UserRecord> {
    const r = await this.request<{ user: UserRecord }>("/auth/register-internal", {
      method: "POST",
      body: JSON.stringify({ ...row, mode: "partner" }),
    });
    return r.user;
  }

  async authenticateByEmail(email: string, password: string): Promise<UserRecord | null> {
    const r = await this.request<{ user: UserRecord | null }>("/auth/login-internal", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return r.user;
  }

  async userExistsByEmail(email: string): Promise<boolean> {
    const r = await this.request<{ exists: boolean }>(
      `/auth/user-exists?email=${encodeURIComponent(email)}`
    );
    return r.exists;
  }

  async storeEmailOtp(email: string, purpose: EmailOtpPurpose, codeHash: string, expiresAt: string): Promise<void> {
    await this.request("/auth/otp/store", {
      method: "POST",
      body: JSON.stringify({ email, purpose, codeHash, expiresAt }),
    });
  }

  async countEmailOtpsSince(email: string, purpose: EmailOtpPurpose, sinceIso: string): Promise<number> {
    const r = await this.request<{ count: number }>(
      `/auth/otp/count?email=${encodeURIComponent(email)}&purpose=${purpose}&since=${encodeURIComponent(sinceIso)}`
    );
    return r.count;
  }

  async verifyEmailOtp(email: string, purpose: EmailOtpPurpose, code: string): Promise<boolean> {
    const r = await this.request<{ valid: boolean }>("/auth/otp/verify", {
      method: "POST",
      body: JSON.stringify({ email, purpose, code }),
    });
    return r.valid;
  }

  async insertAdminEvent(kind: string, title: string, body: string): Promise<AdminEventRecord> {
    const r = await this.request<{ event: AdminEventRecord }>("/admin/events", {
      method: "POST",
      body: JSON.stringify({ kind, title, body }),
    });
    return r.event;
  }

  async listAdminEvents(limit = 100): Promise<AdminEventRecord[]> {
    const r = await this.request<{ events: AdminEventRecord[] }>(`/admin/events?limit=${limit}`);
    return r.events ?? [];
  }

  async createAppSession(userId: string | null, email: string, userAgent?: string | null): Promise<AppSessionRecord> {
    const r = await this.request<{ session: AppSessionRecord }>("/session/create", {
      method: "POST",
      body: JSON.stringify({ userId, email, userAgent }),
    });
    return r.session;
  }

  async touchAppSession(id: string): Promise<boolean> {
    const r = await this.request<{ ok: boolean }>("/session/ping", {
      method: "POST",
      body: JSON.stringify({ sessionId: id }),
    });
    return r.ok;
  }

  async listAppSessions(limit = 200): Promise<AppSessionRecord[]> {
    const r = await this.request<{ sessions: AppSessionRecord[] }>(`/admin/sessions?limit=${limit}`);
    return r.sessions ?? [];
  }

  async insertKattadamExpert(row: {
    expertType: ExpertType;
    firmName: string;
    ownerName: string;
    contactNumber: string;
    serviceableAreas: string;
    district: string;
  }): Promise<KattadamExpertRecord> {
    const r = await this.request<{ expert: KattadamExpertRecord }>("/admin/experts", {
      method: "POST",
      body: JSON.stringify(row),
    });
    return r.expert;
  }

  async listKattadamExperts(): Promise<KattadamExpertRecord[]> {
    const r = await this.request<{ experts: KattadamExpertRecord[] }>("/admin/experts");
    return r.experts ?? [];
  }

  async insertHomeServiceProvider(row: {
    serviceCategory: string;
    firmName: string;
    ownerName: string;
    contactNumber: string;
    serviceableAreas: string;
    district: string;
  }): Promise<HomeServiceProviderRecord> {
    const r = await this.request<{ provider: HomeServiceProviderRecord }>("/admin/home-services", {
      method: "POST",
      body: JSON.stringify(row),
    });
    return r.provider;
  }

  async listHomeServiceProviders(): Promise<HomeServiceProviderRecord[]> {
    const r = await this.request<{ providers: HomeServiceProviderRecord[] }>("/admin/home-services");
    return r.providers ?? [];
  }

  async insertPropertyListing(row: {
    title: string;
    listingType: "SELL" | "RENT";
    propertySubtype: string;
    price: number;
    district: string;
    area: string;
    description?: string | null;
    published?: boolean;
  }): Promise<PropertyListingRecord> {
    const r = await this.request<{ listing: PropertyListingRecord }>("/admin/properties", {
      method: "POST",
      body: JSON.stringify(row),
    });
    return r.listing;
  }

  async listPropertyListings(): Promise<PropertyListingRecord[]> {
    const r = await this.request<{ listings: PropertyListingRecord[] }>("/admin/properties");
    return r.listings ?? [];
  }

  async listPublicPropertyListings(): Promise<PropertyListingRecord[]> {
    const r = await this.request<{ listings: PropertyListingRecord[] }>("/catalog/properties");
    return r.listings ?? [];
  }

  async deletePropertyListing(id: string): Promise<boolean> {
    const r = await this.request<{ ok: boolean }>(`/admin/properties/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return r.ok;
  }

  async listDealers(): Promise<DealerRecord[]> {
    const r = await this.request<{ dealers: DealerRecord[] }>("/admin/dealers");
    return r.dealers ?? [];
  }

  async listPublicDealers(): Promise<DealerRecord[]> {
    const r = await this.request<{ dealers: DealerRecord[] }>("/catalog/dealers");
    return r.dealers ?? [];
  }

  async listPublicMaterials(): Promise<MaterialRecord[]> {
    const r = await this.request<{ materials: MaterialRecord[] }>("/catalog/materials");
    return r.materials ?? [];
  }

  async upsertDealer(row: Partial<DealerRecord> & { shopName: string }): Promise<DealerRecord> {
    const r = await this.request<{ dealer: DealerRecord }>("/admin/dealers", {
      method: "POST",
      body: JSON.stringify(row),
    });
    return r.dealer;
  }

  async updateDealer(
    id: string,
    patch: Partial<{
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
    }>
  ): Promise<DealerRecord | null> {
    const r = await this.request<{ dealer: DealerRecord | null }>(`/admin/dealers/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    return r.dealer;
  }

  async deleteDealer(id: string): Promise<boolean> {
    const r = await this.request<{ ok: boolean }>(`/admin/dealers/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return r.ok;
  }

  async listMaterials(): Promise<MaterialRecord[]> {
    const r = await this.request<{ materials: MaterialRecord[] }>("/admin/materials");
    return r.materials ?? [];
  }

  async deleteMaterial(id: string): Promise<boolean> {
    const r = await this.request<{ ok: boolean }>(`/admin/materials/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return r.ok;
  }

  async upsertMaterial(row: Partial<MaterialRecord> & { name: string; category: string }): Promise<MaterialRecord> {
    const r = await this.request<{ material: MaterialRecord }>("/admin/materials", {
      method: "POST",
      body: JSON.stringify(row),
    });
    return r.material;
  }

  async listEnquiries(filters?: { status?: EnquiryStatus }): Promise<EnquiryRecord[]> {
    const q = filters?.status ? `?status=${filters.status}` : "";
    const r = await this.request<{ enquiries: EnquiryRecord[] }>(`/admin/enquiries${q}`);
    return r.enquiries ?? [];
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
    const r = await this.request<{ enquiry: EnquiryRecord }>("/enquiries", {
      method: "POST",
      body: JSON.stringify(row),
    });
    return r.enquiry;
  }

  async updateEnquiry(
    id: string,
    patch: Partial<{ status: EnquiryStatus; assignedDealerId: string | null; notes: string | null }>
  ): Promise<EnquiryRecord | null> {
    const r = await this.request<{ enquiry: EnquiryRecord | null }>(`/admin/enquiries/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    return r.enquiry;
  }

  async listReviews(): Promise<ReviewRecord[]> {
    const r = await this.request<{ reviews: ReviewRecord[] }>("/admin/reviews");
    return r.reviews ?? [];
  }

  async updateReview(id: string, patch: Partial<{ approved: boolean }>): Promise<ReviewRecord | null> {
    const r = await this.request<{ review: ReviewRecord | null }>(`/admin/reviews/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    return r.review;
  }

  async listZones(): Promise<ZoneRecord[]> {
    const r = await this.request<{ zones: ZoneRecord[] }>("/admin/zones");
    return r.zones ?? [];
  }

  async createZone(name: string, notes?: string | null): Promise<ZoneRecord> {
    const r = await this.request<{ zone: ZoneRecord }>("/admin/zones", {
      method: "POST",
      body: JSON.stringify({ name, notes }),
    });
    return r.zone;
  }

  async setDealerZones(dealerId: string, zoneIds: string[]): Promise<void> {
    await this.request(`/admin/dealers/${encodeURIComponent(dealerId)}/zones`, {
      method: "PUT",
      body: JSON.stringify({ zoneIds }),
    });
  }

  async createNotificationBroadcast(
    audience: NotificationAudience,
    title: string,
    body: string
  ): Promise<NotificationBroadcastRecord> {
    const r = await this.request<{ notification: NotificationBroadcastRecord }>("/admin/notifications", {
      method: "POST",
      body: JSON.stringify({ audience, title, body }),
    });
    return r.notification;
  }

  async listNotificationBroadcasts(): Promise<NotificationBroadcastRecord[]> {
    const r = await this.request<{ notifications: NotificationBroadcastRecord[] }>("/admin/notifications");
    return r.notifications ?? [];
  }
}

export function createHttpApiBackend(): IDataBackend | null {
  const url = readKattadamApiUrl();
  if (!url) return null;
  return new HttpApiBackend(url, readKattadamApiSecret());
}
