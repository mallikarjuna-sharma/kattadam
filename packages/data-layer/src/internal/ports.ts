import type {
  AdminEventRecord,
  AppSessionRecord,
  DashboardSummary,
  DealerRecord,
  DealerStatus,
  EnquiryRecord,
  EnquiryStatus,
  ExpertType,
  HomeServiceProviderRecord,
  KattadamExpertRecord,
  MaterialRecord,
  NotificationAudience,
  NotificationBroadcastRecord,
  PropertyListingRecord,
  ReviewRecord,
  UserRecord,
  UserStatus,
  ZoneRecord,
} from "../types";

/** Backend contract: implement this for DynamoDB, Firestore, etc. */
export interface IDataBackend {
  isReady(): boolean;

  getDashboardSummary(): Promise<DashboardSummary>;

  listUsers(): Promise<UserRecord[]>;
  updateUser(
    id: string,
    patch: Partial<{
      status: UserStatus;
      name: string;
      phone: string | null;
      email: string | null;
      location: string | null;
    }>
  ): Promise<UserRecord | null>;

  registerCustomerUser(row: { name: string; email: string; password: string }): Promise<UserRecord>;
  registerPartnerUser(row: { name: string; email: string; password: string }): Promise<UserRecord>;
  authenticateByEmail(email: string, password: string): Promise<UserRecord | null>;

  insertAdminEvent(kind: string, title: string, body: string): Promise<AdminEventRecord>;
  listAdminEvents(limit?: number): Promise<AdminEventRecord[]>;

  createAppSession(userId: string | null, email: string, userAgent?: string | null): Promise<AppSessionRecord>;
  touchAppSession(id: string): Promise<boolean>;
  listAppSessions(limit?: number): Promise<AppSessionRecord[]>;

  insertKattadamExpert(row: {
    expertType: ExpertType;
    firmName: string;
    ownerName: string;
    contactNumber: string;
    serviceableAreas: string;
    district: string;
  }): Promise<KattadamExpertRecord>;
  listKattadamExperts(): Promise<KattadamExpertRecord[]>;

  insertHomeServiceProvider(row: {
    serviceCategory: string;
    firmName: string;
    ownerName: string;
    contactNumber: string;
    serviceableAreas: string;
    district: string;
  }): Promise<HomeServiceProviderRecord>;
  listHomeServiceProviders(): Promise<HomeServiceProviderRecord[]>;

  insertPropertyListing(row: {
    title: string;
    listingType: "SELL" | "RENT";
    propertySubtype: string;
    price: number;
    district: string;
    area: string;
    description?: string | null;
    published?: boolean;
  }): Promise<PropertyListingRecord>;
  listPropertyListings(): Promise<PropertyListingRecord[]>;
  listPublicPropertyListings(): Promise<PropertyListingRecord[]>;
  deletePropertyListing(id: string): Promise<boolean>;

  listDealers(): Promise<DealerRecord[]>;
  /** Customer-facing catalogue */
  listPublicDealers(): Promise<DealerRecord[]>;
  listPublicMaterials(): Promise<MaterialRecord[]>;
  upsertDealer(
    row: Partial<DealerRecord> & { shopName: string }
  ): Promise<DealerRecord>;
  updateDealer(
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
  ): Promise<DealerRecord | null>;
  deleteDealer(id: string): Promise<boolean>;

  listMaterials(): Promise<MaterialRecord[]>;
  deleteMaterial(id: string): Promise<boolean>;
  upsertMaterial(
    row: Partial<MaterialRecord> & { name: string; category: string }
  ): Promise<MaterialRecord>;

  listEnquiries(filters?: { status?: EnquiryStatus }): Promise<EnquiryRecord[]>;
  createEnquiry(row: {
    customerName: string;
    materialLabel?: string | null;
    materialId?: string | null;
    quantity?: number | null;
    location?: string | null;
    notes?: string | null;
    assignedDealerId?: string | null;
    customerId?: string | null;
  }): Promise<EnquiryRecord>;
  updateEnquiry(
    id: string,
    patch: Partial<{
      status: EnquiryStatus;
      assignedDealerId: string | null;
      notes: string | null;
    }>
  ): Promise<EnquiryRecord | null>;

  listReviews(): Promise<ReviewRecord[]>;
  updateReview(id: string, patch: Partial<{ approved: boolean }>): Promise<ReviewRecord | null>;

  listZones(): Promise<ZoneRecord[]>;
  createZone(name: string, notes?: string | null): Promise<ZoneRecord>;
  setDealerZones(dealerId: string, zoneIds: string[]): Promise<void>;

  createNotificationBroadcast(
    audience: NotificationAudience,
    title: string,
    body: string
  ): Promise<NotificationBroadcastRecord>;
  listNotificationBroadcasts(): Promise<NotificationBroadcastRecord[]>;
}
