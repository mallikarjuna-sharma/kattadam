import type {
  DashboardSummary,
  DealerRecord,
  DealerStatus,
  EnquiryRecord,
  EnquiryStatus,
  MaterialRecord,
  NotificationAudience,
  NotificationBroadcastRecord,
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
    patch: Partial<{ status: UserStatus; name: string; phone: string | null; location: string | null }>
  ): Promise<UserRecord | null>;

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
