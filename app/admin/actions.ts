"use server";

import { revalidatePath } from "next/cache";
import {
  adminCreateNotification,
  adminCreateZone,
  adminSetDealerZones,
  adminDeleteMaterial,
  adminUpdateDealer,
  adminUpdateEnquiry,
  adminUpdateReview,
  adminUpdateUser,
  adminUpsertDealer,
  adminUpsertMaterial,
} from "@kattadam/data-layer/server";
import type { EnquiryStatus, NotificationAudience, UserStatus } from "@kattadam/data-layer";

const A = (path: string) => revalidatePath(path);

export async function actionSetUserStatus(id: string, status: UserStatus) {
  await adminUpdateUser(id, { status });
  A("/admin/users");
}

export async function actionUpsertDealer(formData: FormData) {
  const idRaw = formData.get("id");
  const id = typeof idRaw === "string" && idRaw.length > 0 ? idRaw : undefined;
  const materialsRaw = String(formData.get("materials") || "");
  const materials = materialsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  await adminUpsertDealer({
    id,
    shopName: String(formData.get("shopName") || "").trim() || "Unnamed shop",
    ownerName: String(formData.get("ownerName") || "").trim() || null,
    phone: String(formData.get("phone") || "").trim() || null,
    location: String(formData.get("location") || "").trim() || null,
    materials,
    status: (String(formData.get("status") || "pending") as "pending" | "approved" | "rejected") || "pending",
  });
  A("/admin/dealers");
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
  const fixed = formData.get("fixedPrice");
  const fixedPrice =
    fixed != null && String(fixed).trim() !== "" ? Number.parseFloat(String(fixed)) : null;
  await adminUpsertMaterial({
    id,
    name: String(formData.get("name") || "").trim() || "Material",
    category: String(formData.get("category") || "").trim() || "General",
    subcategory: String(formData.get("subcategory") || "").trim() || null,
    unit: String(formData.get("unit") || "").trim() || null,
    pricingType: (String(formData.get("pricingType") || "dealer_quote") as "fixed" | "dealer_quote") || "dealer_quote",
    fixedPrice: Number.isFinite(fixedPrice) ? fixedPrice : null,
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
