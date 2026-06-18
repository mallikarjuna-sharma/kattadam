"use server";

import { revalidatePath } from "next/cache";
import {
  adminCreateNotification,
  adminCreateZone,
  adminSetDealerZones,
  adminDeleteDealer,
  adminDeleteMaterial,
  adminDeletePropertyListing,
  adminInsertHomeServiceProvider,
  adminInsertKattadamExpert,
  adminInsertPropertyListing as dataInsertPropertyListing,
  adminUpdateHomeServiceProvider,
  adminUpdateKattadamExpert,
  adminUpdatePropertyListing,
  adminUpdateDealer,
  adminUpdateEnquiry,
  adminUpdateReview,
  adminUpdateUser,
  adminUpsertDealer,
  adminUpsertMaterial,
} from "@kattadam/data-layer/server";
import type { EnquiryStatus, NotificationAudience, UserStatus } from "@kattadam/data-layer";
import { defaultLocationLine, validateDealerForm } from "@/lib/dealer-validation";

const A = (path: string) => revalidatePath(path);

export type AdminActionResult = { ok: true } | { ok: false; error: string };

export async function actionSetUserStatus(id: string, status: UserStatus) {
  await adminUpdateUser(id, { status });
  A("/admin/users");
}

function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s.trim());
}

export async function actionUpsertDealer(formData: FormData): Promise<AdminActionResult> {
  const idRaw = formData.get("id");
  const id = typeof idRaw === "string" && idRaw.length > 0 ? idRaw : undefined;
  const categories = formData.getAll("categories").map((x) => String(x).trim()).filter(Boolean);
  const status =
    (String(formData.get("status") || "approved") as "pending" | "approved" | "rejected") || "approved";
  const district = String(formData.get("district") || "").trim();
  const area = String(formData.get("area") || "").trim();
  const locationInput = String(formData.get("location") || "").trim();

  const validation = validateDealerForm({
    shopName: String(formData.get("shopName") || ""),
    ownerName: String(formData.get("ownerName") || ""),
    phone: String(formData.get("phone") || ""),
    district,
    area,
    location: locationInput,
    categories,
  });
  if (!validation.ok) return validation;

  const location = locationInput || defaultLocationLine(area, district);
  const isApproved = status === "approved";
  const enabledRaw = formData.get("enabled");
  const enabled =
    typeof enabledRaw === "string" ? enabledRaw === "true" : id ? undefined : true;

  try {
    await adminUpsertDealer({
      id,
      shopName: String(formData.get("shopName") || "").trim(),
      ownerName: String(formData.get("ownerName") || "").trim() || null,
      phone: String(formData.get("phone") || "").trim() || null,
      district,
      area,
      location,
      materials: categories,
      status,
      verified: isApproved,
      ...(enabled !== undefined ? { enabled } : {}),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to save dealer.";
    return { ok: false, error: message };
  }

  A("/admin/dealers");
  A("/admin/materials");
  return { ok: true };
}

export async function actionDeleteDealer(id: string) {
  const ok = await adminDeleteDealer(id);
  if (ok) {
    A("/admin/dealers");
    A("/admin/materials");
  }
}

export async function actionDealerApprove(id: string) {
  await adminUpdateDealer(id, { status: "approved", verified: true, enabled: true });
  A("/admin/dealers");
}

export async function actionDealerReject(id: string) {
  await adminUpdateDealer(id, { status: "rejected", enabled: false });
  A("/admin/dealers");
}

export async function actionDealerToggleEnabled(id: string, enabled: boolean) {
  await adminUpdateDealer(id, { enabled });
  A("/admin/dealers");
}

export async function actionUpdateDealerMaterials(formData: FormData) {
  const id = String(formData.get("dealerId") || "").trim();
  if (!id) return;
  const materialsRaw = String(formData.get("materials") || "");
  const materials = materialsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  await adminUpdateDealer(id, { materials });
  A("/admin/dealers");
  A("/materials");
}

export async function actionUpsertMaterial(formData: FormData) {
  const idRaw = formData.get("id");
  const id = typeof idRaw === "string" && idRaw.length > 0 ? idRaw : undefined;
  const priceRaw = formData.get("price");
  const parsed =
    priceRaw != null && String(priceRaw).trim() !== "" ? Number.parseFloat(String(priceRaw)) : NaN;
  const price = Number.isFinite(parsed) ? parsed : 0;
  const rawDealerId = String(formData.get("dealerId") || "").trim();
  const dealerId = isUuid(rawDealerId) ? rawDealerId : null;
  await adminUpsertMaterial({
    id,
    name: String(formData.get("name") || "").trim() || "Material",
    category: String(formData.get("categoryKey") || "").trim() || "GENERAL",
    subcategory: String(formData.get("subcategory") || "").trim() || null,
    unit: String(formData.get("unit") || "").trim() || null,
    pricingType: "fixed",
    fixedPrice: price,
    price,
    dealerId,
    dealerName: String(formData.get("dealerName") || "").trim() || null,
    district: String(formData.get("district") || "").trim() || "Coimbatore",
    area: String(formData.get("area") || "").trim() || "",
  });
  A("/admin/materials");
}

export async function actionDeleteMaterial(id: string) {
  await adminDeleteMaterial(id);
  A("/admin/materials");
}

export async function actionSetEnquiryStatus(id: string, status: EnquiryStatus) {
  await adminUpdateEnquiry(id, { status });
  A("/admin/enquiries");
}

export async function actionAssignEnquiry(formData: FormData) {
  const id = String(formData.get("enquiryId") || "");
  const dealerId = String(formData.get("dealerId") || "").trim();
  await adminUpdateEnquiry(id, {
    assignedDealerId: dealerId.length > 0 ? dealerId : null,
    status: dealerId ? "assigned" : "pending",
  });
  A("/admin/enquiries");
}

export async function actionSendBroadcast(formData: FormData) {
  const audience = String(formData.get("audience") || "all") as NotificationAudience;
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  if (!title || !body) return;
  await adminCreateNotification(audience, title, body);
  A("/admin/notifications");
}

export async function actionSetReviewApproved(id: string, approved: boolean) {
  await adminUpdateReview(id, { approved });
  A("/admin/reviews");
}

export async function actionCreateZone(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  const notes = String(formData.get("notes") || "").trim() || null;
  await adminCreateZone(name, notes);
  A("/admin/zones");
}

export async function actionSetDealerZonesFromForm(formData: FormData) {
  const dealerId = String(formData.get("dealerId") || "").trim();
  const raw = String(formData.get("zoneIds") || "");
  const zoneIds = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!dealerId) return;
  await adminSetDealerZones(dealerId, zoneIds);
  A("/admin/zones");
}

export async function actionUpsertExpert(formData: FormData): Promise<AdminActionResult> {
  const idRaw = formData.get("id");
  const id = typeof idRaw === "string" && idRaw.length > 0 ? idRaw : undefined;
  const row = {
    expertType: String(formData.get("expertType") || "builder") as "builder" | "architect" | "engineer",
    firmName: String(formData.get("firmName") || "").trim(),
    ownerName: String(formData.get("ownerName") || "").trim(),
    contactNumber: String(formData.get("contactNumber") || "").trim(),
    serviceableAreas: String(formData.get("serviceableAreas") || "").trim(),
    district: String(formData.get("district") || "").trim(),
  };
  if (!row.firmName || !row.ownerName || !row.contactNumber || !row.serviceableAreas || !row.district) {
    return { ok: false, error: "All required fields must be filled." };
  }
  if (id) {
    const updated = await adminUpdateKattadamExpert(id, row);
    if (!updated) return { ok: false, error: "Failed to update expert." };
  } else {
    await adminInsertKattadamExpert(row);
  }
  A("/admin/experts");
  return { ok: true };
}

/** @deprecated Use actionUpsertExpert */
export async function actionInsertExpert(formData: FormData) {
  await actionUpsertExpert(formData);
}

export async function actionUpsertHomeService(formData: FormData): Promise<AdminActionResult> {
  const idRaw = formData.get("id");
  const id = typeof idRaw === "string" && idRaw.length > 0 ? idRaw : undefined;
  const row = {
    serviceCategory: String(formData.get("serviceCategory") || "").trim(),
    firmName: String(formData.get("firmName") || "").trim(),
    ownerName: String(formData.get("ownerName") || "").trim(),
    contactNumber: String(formData.get("contactNumber") || "").trim(),
    serviceableAreas: String(formData.get("serviceableAreas") || "").trim(),
    district: String(formData.get("district") || "").trim(),
  };
  if (!row.firmName || !row.ownerName || !row.contactNumber || !row.serviceableAreas || !row.district) {
    return { ok: false, error: "All required fields must be filled." };
  }
  if (id) {
    const updated = await adminUpdateHomeServiceProvider(id, row);
    if (!updated) return { ok: false, error: "Failed to update provider." };
  } else {
    await adminInsertHomeServiceProvider(row);
  }
  A("/admin/home-services");
  return { ok: true };
}

/** @deprecated Use actionUpsertHomeService */
export async function actionInsertHomeService(formData: FormData) {
  await actionUpsertHomeService(formData);
}

export async function actionUpsertPropertyListing(formData: FormData): Promise<AdminActionResult> {
  const idRaw = formData.get("id");
  const id = typeof idRaw === "string" && idRaw.length > 0 ? idRaw : undefined;
  const priceRaw = Number.parseFloat(String(formData.get("price") || ""));
  const price = Number.isFinite(priceRaw) ? priceRaw : 0;
  const row = {
    title: String(formData.get("title") || "").trim(),
    listingType: String(formData.get("listingType") || "SELL") === "RENT" ? ("RENT" as const) : ("SELL" as const),
    propertySubtype: String(formData.get("propertySubtype") || "").trim(),
    price,
    district: String(formData.get("district") || "").trim(),
    area: String(formData.get("area") || "").trim(),
    description: String(formData.get("description") || "").trim() || null,
    published: String(formData.get("published") || "true") !== "false",
  };
  if (!row.title || !row.propertySubtype || !row.district || !row.area || price <= 0) {
    return { ok: false, error: "All required fields must be filled." };
  }
  if (id) {
    const updated = await adminUpdatePropertyListing(id, row);
    if (!updated) return { ok: false, error: "Failed to update listing." };
  } else {
    await dataInsertPropertyListing(row);
  }
  A("/admin/properties");
  return { ok: true };
}

/** @deprecated Use actionUpsertPropertyListing */
export async function actionInsertPropertyListing(formData: FormData) {
  await actionUpsertPropertyListing(formData);
}

export async function actionDeletePropertyListing(id: string) {
  await adminDeletePropertyListing(id);
  A("/admin/properties");
}
