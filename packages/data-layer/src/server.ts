/**
 * Server-only entry: import this from Next.js Route Handlers, Server Actions, and Server Components.
 * Do not import from client components — keys are server-side.
 */
import { createBackendFromEnv } from "./internal/factory";
import type { IDataBackend } from "./internal/ports";
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
  patch: Partial<{
    status: UserStatus;
    name: string;
    phone: string | null;
    email: string | null;
    location: string | null;
  }>
): Promise<UserRecord | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.updateUser(id, patch);
}

export async function authRegisterCustomer(row: {
  name: string;
  email: string;
  password: string;
}): Promise<UserRecord | null> {
  const b = getServerBackend();
  if (!b) return null;
  try {
    return await b.registerCustomerUser(row);
  } catch (e) {
    console.error("[@kattadam/data-layer] registerCustomerUser:", e instanceof Error ? e.message : e);
    return null;
  }
}

export async function authRegisterPartner(row: {
  name: string;
  email: string;
  password: string;
}): Promise<UserRecord | null> {
  const b = getServerBackend();
  if (!b) return null;
  try {
    return await b.registerPartnerUser(row);
  } catch (e) {
    console.error("[@kattadam/data-layer] registerPartnerUser:", e instanceof Error ? e.message : e);
    return null;
  }
}

export async function authLoginEmail(email: string, password: string): Promise<UserRecord | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.authenticateByEmail(email, password);
}

export async function adminListAdminEvents(limit?: number): Promise<AdminEventRecord[] | null> {
  const b = getServerBackend();
  if (!b) return null;
  try {
    return await b.listAdminEvents(limit);
  } catch {
    return null;
  }
}

export async function adminListAppSessions(limit?: number): Promise<AppSessionRecord[] | null> {
  const b = getServerBackend();
  if (!b) return null;
  try {
    return await b.listAppSessions(limit);
  } catch {
    return null;
  }
}

export async function sessionCreate(userId: string | null, email: string, userAgent?: string | null) {
  const b = getServerBackend();
  if (!b) return null;
  try {
    return await b.createAppSession(userId, email, userAgent);
  } catch {
    return null;
  }
}

export async function sessionTouch(id: string): Promise<boolean | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.touchAppSession(id);
}

export async function adminInsertKattadamExpert(row: {
  expertType: ExpertType;
  firmName: string;
  ownerName: string;
  contactNumber: string;
  serviceableAreas: string;
  district: string;
}): Promise<KattadamExpertRecord | null> {
  const b = getServerBackend();
  if (!b) return null;
  try {
    return await b.insertKattadamExpert(row);
  } catch {
    return null;
  }
}

export async function adminListKattadamExperts(): Promise<KattadamExpertRecord[] | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.listKattadamExperts();
}

export async function adminInsertHomeServiceProvider(row: {
  serviceCategory: string;
  firmName: string;
  ownerName: string;
  contactNumber: string;
  serviceableAreas: string;
  district: string;
}): Promise<HomeServiceProviderRecord | null> {
  const b = getServerBackend();
  if (!b) return null;
  try {
    return await b.insertHomeServiceProvider(row);
  } catch {
    return null;
  }
}

export async function adminListHomeServiceProviders(): Promise<HomeServiceProviderRecord[] | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.listHomeServiceProviders();
}

export async function adminInsertPropertyListing(row: {
  title: string;
  listingType: "SELL" | "RENT";
  propertySubtype: string;
  price: number;
  district: string;
  area: string;
  description?: string | null;
  published?: boolean;
}): Promise<PropertyListingRecord | null> {
  const b = getServerBackend();
  if (!b) return null;
  try {
    return await b.insertPropertyListing(row);
  } catch {
    return null;
  }
}

export async function adminListPropertyListings(): Promise<PropertyListingRecord[] | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.listPropertyListings();
}

export async function adminDeletePropertyListing(id: string): Promise<boolean | null> {
  const b = getServerBackend();
  if (!b) return null;
  return b.deletePropertyListing(id);
}

export async function catalogListPropertyListings(): Promise<PropertyListingRecord[] | null> {
  const b = getServerBackend();
  if (!b) return null;
  try {
    return await b.listPublicPropertyListings();
  } catch {
    return null;
  }
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

/** @deprecated Import `@kattadam/data-layer/probe` from instrumentation instead. */
export { probeDataLayerOnStartup } from "./probe";
