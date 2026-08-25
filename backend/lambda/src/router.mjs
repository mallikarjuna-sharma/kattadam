import { randomUUID } from "node:crypto";
import {
  entityPk,
  getItem,
  itemSk,
  putItem,
  queryGsi1,
  queryPk,
  deleteItem,
  updateItem,
} from "./lib/dynamo.mjs";
import { hashPasswordPbkdf2, verifyPasswordPbkdf2 } from "./lib/password.mjs";
import { generateOtpCode, hashOtp, otpExpiresAt } from "./lib/otp.mjs";
import { sendOtpEmail } from "./lib/ses.mjs";

function nowIso() {
  return new Date().toISOString();
}

function parseJson(body) {
  if (!body) return {};
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

function requireInternal(headers) {
  const secret = process.env.KATTADAM_API_SECRET?.trim();
  if (!secret) return true;
  return headers?.["x-kattadam-internal"] === secret || headers?.["X-Kattadam-Internal"] === secret;
}

function mapUser(item) {
  if (!item) return null;
  return {
    id: item.id,
    name: item.name,
    phone: item.phone ?? null,
    email: item.email ?? null,
    role: item.role,
    status: item.status,
    location: item.location ?? null,
    lat: item.lat ?? null,
    lng: item.lng ?? null,
    kycStatus: item.kycStatus ?? null,
    createdAt: item.createdAt,
  };
}

function mapMaterial(item) {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    subcategory: item.subcategory ?? null,
    unit: item.unit ?? null,
    imageUrl: item.imageUrl ?? null,
    pricingType: item.pricingType ?? "dealer_quote",
    fixedPrice: item.fixedPrice ?? null,
    price: item.price ?? item.fixedPrice ?? 0,
    dealerName: item.dealerName ?? null,
    dealerId: item.dealerId ?? null,
    district: item.district ?? "Coimbatore",
    area: item.area ?? "",
    createdAt: item.createdAt,
  };
}

function mapDealer(item) {
  return {
    id: item.id,
    userId: item.userId ?? null,
    shopName: item.shopName,
    ownerName: item.ownerName ?? null,
    phone: item.phone ?? null,
    materials: item.materials ?? [],
    location: item.location ?? null,
    district: item.district ?? "Coimbatore",
    area: item.area ?? "",
    lat: item.lat ?? null,
    lng: item.lng ?? null,
    rating: item.rating ?? 0,
    verified: item.verified ?? false,
    enabled: item.enabled ?? true,
    topDealer: item.topDealer ?? false,
    status: item.status ?? "pending",
    gstDocUrl: item.gstDocUrl ?? null,
    licenseDocUrl: item.licenseDocUrl ?? null,
    createdAt: item.createdAt,
  };
}

function mapProperty(item) {
  return {
    id: item.id,
    title: item.title,
    listingType: item.listingType,
    propertySubtype: item.propertySubtype,
    price: item.price,
    district: item.district,
    area: item.area,
    description: item.description ?? null,
    published: item.published ?? true,
    createdAt: item.createdAt,
  };
}

function mapEnquiry(item) {
  return {
    id: item.id,
    customerId: item.customerId ?? null,
    customerName: item.customerName ?? null,
    materialId: item.materialId ?? null,
    materialLabel: item.materialLabel ?? null,
    quantity: item.quantity ?? null,
    location: item.location ?? null,
    lat: item.lat ?? null,
    lng: item.lng ?? null,
    status: item.status ?? "pending",
    assignedDealerId: item.assignedDealerId ?? null,
    notes: item.notes ?? null,
    createdAt: item.createdAt,
  };
}

async function listEntity(type, mapper, filterFn) {
  const rows = await queryPk(entityPk(type));
  const mapped = rows.map(mapper);
  return filterFn ? mapped.filter(filterFn) : mapped;
}

export async function routeRequest(method, path, bodyText, headers, queryString = "") {
  const body = parseJson(bodyText);
  if (bodyText && body === null) return { status: 400, data: { ok: false, error: "Invalid JSON" } };
  const q = new URLSearchParams(queryString.replace(/^\?/, ""));

  if (path === "/health" && method === "GET") {
    return {
      status: 200,
      data: { ok: true, service: "kattadam-lambda", table: process.env.TABLE_NAME },
    };
  }

  // ——— Catalog (public) ———
  if (path === "/catalog/materials" && method === "GET") {
    const materials = await listEntity("material", mapMaterial);
    return {
      status: 200,
      data: { ok: true, configured: true, source: "live", materials },
    };
  }

  if (path === "/catalog/dealers" && method === "GET") {
    const dealers = await listEntity("dealer", mapDealer, (d) => d.enabled && d.status === "approved");
    return {
      status: 200,
      data: { ok: true, configured: true, source: "live", dealers },
    };
  }

  if (path === "/catalog/properties" && method === "GET") {
    const listings = await listEntity("property", mapProperty, (p) => p.published);
    return { status: 200, data: { configured: true, source: "live", listings } };
  }

  // ——— Enquiries ———
  if (path === "/enquiries" && method === "POST") {
    const id = randomUUID();
    const t = nowIso();
    let notes = body.notes;
    if (!notes && body.message) {
      const phone = String(body.phone ?? "").replace(/\D/g, "");
      notes = [`Phone: +91 ${phone}`, ...(body.target ? [`Regarding: ${body.target}`] : []), "", body.message].join(
        "\n"
      );
    }
    const item = {
      PK: entityPk("enquiry"),
      SK: itemSk("ENQUIRY", id),
      id,
      customerName: body.customerName,
      materialId: body.materialId ?? null,
      materialLabel: body.materialLabel ?? body.target ?? null,
      notes: notes ?? null,
      assignedDealerId: body.assignedDealerId ?? body.dealerId ?? null,
      customerId: body.customerId ?? null,
      status: "pending",
      createdAt: t,
    };
    await putItem(item);
    return { status: 200, data: { ok: true, id, enquiry: mapEnquiry(item) } };
  }

  // ——— Auth OTP ———
  if (path === "/auth/otp/send" && method === "POST") {
    const email = String(body.email ?? "").trim().toLowerCase();
    const purpose = body.purpose === "password_reset" ? "password_reset" : "signup";
    if (!email.includes("@")) return { status: 400, data: { ok: false, error: "Invalid email" } };
    const exists = await queryGsi1(`EMAIL#${email}`);
    if (purpose === "signup" && exists.length > 0) {
      return { status: 409, data: { ok: false, error: "This email is already registered." } };
    }
    const code = generateOtpCode();
    const expiresAt = otpExpiresAt().toISOString();
    const created = nowIso();
    await putItem({
      PK: `OTP#${email}`,
      SK: `${purpose}#${created}`,
      email,
      purpose,
      codeHash: hashOtp(email, purpose, code),
      expiresAt,
      attempts: 0,
      createdAt: created,
    });
    const sent = await sendOtpEmail(email, code, purpose);
    if (!sent.ok) {
      return { status: 503, data: { ok: false, error: sent.reason ?? "Could not send email" } };
    }
    return { status: 200, data: { ok: true, emailed: true } };
  }

  if (path === "/auth/otp/store" && method === "POST" && requireInternal(headers)) {
    const email = String(body.email ?? "").trim().toLowerCase();
    await putItem({
      PK: `OTP#${email}`,
      SK: `${body.purpose}#${nowIso()}`,
      email,
      purpose: body.purpose,
      codeHash: body.codeHash,
      expiresAt: body.expiresAt,
      attempts: 0,
      createdAt: nowIso(),
    });
    return { status: 200, data: { ok: true } };
  }

  if (path === "/auth/otp/count" && method === "GET" && requireInternal(headers)) {
    const email = q.get("email")?.trim().toLowerCase() ?? "";
    const purpose = q.get("purpose") ?? "signup";
    const since = q.get("since") ?? "";
    const rows = await queryPk(`OTP#${email}`);
    const count = rows.filter((r) => r.purpose === purpose && (r.createdAt ?? "") >= since).length;
    return { status: 200, data: { count } };
  }

  if (path === "/auth/otp/verify" && method === "POST" && requireInternal(headers)) {
    const email = String(body.email ?? "").trim().toLowerCase();
    const purpose = body.purpose ?? "signup";
    const code = String(body.code ?? "").trim();
    const valid = await verifyOtpRecord(email, purpose, code);
    return { status: 200, data: { valid } };
  }

  if (path === "/auth/user-exists" && method === "GET" && requireInternal(headers)) {
    const email = q.get("email")?.trim().toLowerCase() ?? "";
    const exists = (await queryGsi1(`EMAIL#${email}`)).length > 0;
    return { status: 200, data: { exists } };
  }

  if (path === "/auth/register-internal" && method === "POST" && requireInternal(headers)) {
    try {
      const user = await createUser({
        name: body.name,
        email: body.email,
        password: body.password,
        mode: body.mode === "partner" ? "partner" : "user",
        emailVerified: body.emailVerified ?? false,
      });
      return { status: 200, data: { user: mapUser(user) } };
    } catch (e) {
      return { status: 400, data: { error: e instanceof Error ? e.message : String(e) } };
    }
  }

  if (path === "/auth/login-internal" && method === "POST" && requireInternal(headers)) {
    const email = String(body.email ?? "").trim().toLowerCase();
    const user = await findUserByEmail(email);
    if (!user || !(await verifyPasswordPbkdf2(body.password, user.passwordHash))) {
      return { status: 200, data: { user: null } };
    }
    return { status: 200, data: { user: mapUser(user) } };
  }

  if (path === "/auth/register" && method === "POST") {
    const otp = String(body.otp ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const name = String(body.name ?? "").trim();
    const password = String(body.password ?? "");
    const mode = body.mode === "partner" ? "partner" : "user";
    if (!otp || !email || !name || password.length < 6) {
      return { status: 400, data: { ok: false, error: "Invalid registration data" } };
    }
    const valid = await verifyOtpRecord(email, "signup", otp);
    if (!valid) return { status: 400, data: { ok: false, error: "Invalid or expired verification code." } };
    try {
      const user = await createUser({ name, email, password, mode, emailVerified: true });
      return { status: 200, data: { ok: true, user: mapUser(user) } };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/duplicate|exists/i.test(msg)) {
        return { status: 409, data: { ok: false, error: "This email is already registered." } };
      }
      return { status: 500, data: { ok: false, error: msg } };
    }
  }

  if (path === "/auth/login" && method === "POST") {
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const user = await findUserByEmail(email);
    if (!user || !(await verifyPasswordPbkdf2(password, user.passwordHash))) {
      return { status: 401, data: { ok: false, error: "Invalid email or password." } };
    }
    const session = await createSession(user.id, email, null);
    return {
      status: 200,
      data: {
        ok: true,
        sessionId: session.id,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
    };
  }

  if (path === "/session/ping" && method === "POST") {
    const sessionId = String(body.sessionId ?? "").trim();
    if (!sessionId) return { status: 400, data: { ok: false } };
    const s = await getItem(`SESSION#${sessionId}`, "META");
    if (!s) return { status: 200, data: { ok: false } };
    await updateItem(`SESSION#${sessionId}`, "META", { lastActiveAt: nowIso() });
    return { status: 200, data: { ok: true } };
  }

  if (path === "/session/create" && method === "POST" && requireInternal(headers)) {
    const session = await createSession(body.userId ?? null, body.email, body.userAgent ?? null);
    return { status: 200, data: { session } };
  }

  // ——— Admin (internal) ———
  if (path.startsWith("/admin") && !requireInternal(headers)) {
    return { status: 401, data: { ok: false, error: "Unauthorized" } };
  }

  if (path === "/admin/materials" && method === "GET") {
    const materials = await listEntity("material", mapMaterial);
    return { status: 200, data: { materials } };
  }

  if (path === "/admin/dealers" && method === "GET") {
    const dealers = await listEntity("dealer", mapDealer);
    return { status: 200, data: { dealers } };
  }

  if (path === "/admin/enquiries" && method === "GET") {
    let enquiries = await listEntity("enquiry", mapEnquiry);
    const statusFilter = q.get("status");
    if (statusFilter) enquiries = enquiries.filter((e) => e.status === statusFilter);
    return { status: 200, data: { enquiries } };
  }

  if (path === "/admin/users" && method === "GET") {
    const users = await listEntity("user", mapUser);
    return { status: 200, data: { users } };
  }

  if (path === "/admin/properties" && method === "GET") {
    const listings = await listEntity("property", mapProperty);
    return { status: 200, data: { listings } };
  }

  if (path === "/admin/dashboard" && method === "GET") {
    const users = await listEntity("user", mapUser);
    const dealers = await listEntity("dealer", mapDealer);
    const enquiries = await listEntity("enquiry", mapEnquiry);
    const totalUsers = users.length;
    const totalDealers = dealers.length;
    const totalEnquiries = enquiries.length;
    const activeDealers = dealers.filter((d) => d.enabled && d.status === "approved").length;
    const pendingUsers = users.filter((u) => u.status === "pending").length;
    const pendingDealers = dealers.filter((d) => d.status === "pending").length;
    const byDay = new Map();
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      byDay.set(d.toISOString().slice(0, 10), 0);
    }
    for (const e of enquiries) {
      const key = (e.createdAt ?? "").slice(0, 10);
      if (byDay.has(key)) byDay.set(key, (byDay.get(key) ?? 0) + 1);
    }
    const enquiriesLast7Days = [...byDay.entries()].map(([date, count]) => ({ date, count }));
    const weekBuckets = new Map();
    for (const u of users) {
      const t = new Date(u.createdAt ?? 0).getTime();
      if (!t) continue;
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
      status: 200,
      data: {
        totalUsers,
        totalDealers,
        activeDealers,
        pendingApprovals: pendingUsers + pendingDealers,
        totalEnquiries,
        enquiriesLast7Days,
        weeklyUserGrowth,
      },
    };
  }

  if (path === "/admin/experts" && method === "GET") {
    return { status: 200, data: { experts: await listEntity("expert", (i) => i) } };
  }

  if (path === "/admin/home-services" && method === "GET") {
    return { status: 200, data: { providers: await listEntity("home_service", (i) => i) } };
  }

  if (path === "/admin/reviews" && method === "GET") {
    return { status: 200, data: { reviews: await listEntity("review", (i) => i) } };
  }

  if (path === "/admin/zones" && method === "GET") {
    return { status: 200, data: { zones: await listEntity("zone", (i) => i) } };
  }

  if (path === "/admin/notifications" && method === "GET") {
    return { status: 200, data: { notifications: await listEntity("notification", (i) => i) } };
  }

  if (path === "/admin/events" && method === "GET") {
    return { status: 200, data: { events: await listEntity("admin_event", (i) => i) } };
  }

  if (path === "/admin/sessions" && method === "GET") {
    return { status: 200, data: { sessions: await listEntity("app_session", (i) => i) } };
  }

  // ——— Admin mutations ———
  const adminMatch = path.match(/^\/admin\/([^/]+)(?:\/([^/]+))?(?:\/([^/]+))?$/);
  if (adminMatch) {
    const [, resource, id, sub] = adminMatch;

    if (resource === "users" && id && method === "PATCH") {
      const user = await patchUser(id, body);
      return { status: 200, data: { user } };
    }

    if (resource === "materials" && method === "POST") {
      const material = await upsertMaterial(body);
      return { status: 200, data: { material } };
    }
    if (resource === "materials" && id && method === "DELETE") {
      const ok = await deleteEntity("material", "MATERIAL", id);
      return { status: 200, data: { ok } };
    }

    if (resource === "dealers" && method === "POST" && !id) {
      const dealer = await upsertDealer(body);
      return { status: 200, data: { dealer } };
    }
    if (resource === "dealers" && id && sub === "zones" && method === "PUT") {
      const dealer = await setDealerZones(id, body.zoneIds ?? []);
      return { status: 200, data: { dealer } };
    }
    if (resource === "dealers" && id && method === "PATCH") {
      const dealer = await patchDealer(id, body);
      return { status: 200, data: { dealer } };
    }
    if (resource === "dealers" && id && method === "DELETE") {
      const ok = await deleteEntity("dealer", "DEALER", id);
      return { status: 200, data: { ok } };
    }

    if (resource === "enquiries" && id && method === "PATCH") {
      const enquiry = await patchEnquiry(id, body);
      return { status: 200, data: { enquiry } };
    }

    if (resource === "properties" && method === "POST" && !id) {
      const listing = await insertProperty(body);
      return { status: 200, data: { listing } };
    }
    if (resource === "properties" && id && method === "DELETE") {
      const ok = await deleteEntity("property", "PROPERTY", id);
      return { status: 200, data: { ok } };
    }

    if (resource === "experts" && method === "POST" && !id) {
      const expert = await insertExpert(body);
      return { status: 200, data: { expert } };
    }

    if (resource === "home-services" && method === "POST" && !id) {
      const provider = await insertHomeService(body);
      return { status: 200, data: { provider } };
    }

    if (resource === "reviews" && id && method === "PATCH") {
      const review = await patchReview(id, body);
      return { status: 200, data: { review } };
    }

    if (resource === "zones" && method === "POST" && !id) {
      const zone = await createZone(body.name, body.notes);
      return { status: 200, data: { zone } };
    }

    if (resource === "notifications" && method === "POST" && !id) {
      const notification = await createNotification(body.audience, body.title, body.body);
      return { status: 200, data: { notification } };
    }

    if (resource === "events" && method === "POST" && !id) {
      const event = await insertAdminEvent(body.kind, body.title, body.body);
      return { status: 200, data: { event } };
    }
  }

  return { status: 404, data: { ok: false, error: "not found", path, method } };
}

async function getEntityItem(type, prefix, id) {
  return await getItem(entityPk(type), itemSk(prefix, id));
}

async function deleteEntity(type, prefix, id) {
  const item = await getEntityItem(type, prefix, id);
  if (!item) return false;
  await deleteItem(item.PK, item.SK);
  return true;
}

async function patchUser(id, patch) {
  const meta = await getItem(`USER#${id}`, "META");
  const entity = await getEntityItem("user", "USER", id);
  const base = meta ?? entity;
  if (!base) return null;
  const row = { ...base };
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.phone !== undefined) row.phone = patch.phone;
  if (patch.email !== undefined) row.email = patch.email?.trim().toLowerCase();
  if (patch.location !== undefined) row.location = patch.location;
  await putItem({ ...row, PK: entityPk("user"), SK: itemSk("USER", id) });
  if (meta) await putItem({ ...row, PK: `USER#${id}`, SK: "META" });
  return mapUser(row);
}

async function upsertMaterial(row) {
  const id = row.id || randomUUID();
  const existing = row.id ? await getEntityItem("material", "MATERIAL", id) : null;
  const t = existing?.createdAt ?? nowIso();
  const priceVal =
    row.price != null && Number.isFinite(Number(row.price))
      ? Number(row.price)
      : row.fixedPrice != null && Number.isFinite(Number(row.fixedPrice))
        ? Number(row.fixedPrice)
        : 0;
  const item = {
    PK: entityPk("material"),
    SK: itemSk("MATERIAL", id),
    id,
    name: row.name,
    category: row.category,
    subcategory: row.subcategory ?? null,
    unit: row.unit ?? null,
    imageUrl: row.imageUrl ?? null,
    pricingType: row.pricingType ?? "fixed",
    fixedPrice: priceVal,
    price: priceVal,
    dealerId: row.dealerId?.trim() || null,
    dealerName: row.dealerName?.trim() ?? "",
    district: row.district?.trim() || "Coimbatore",
    area: row.area?.trim() || "",
    createdAt: t,
  };
  await putItem(item);
  return mapMaterial(item);
}

async function upsertDealer(row) {
  const id = row.id || randomUUID();
  const existing = row.id ? await getEntityItem("dealer", "DEALER", id) : null;
  const district = row.district?.trim() || existing?.district?.trim() || "Coimbatore";
  const area = row.area?.trim() || existing?.area?.trim() || "";
  const status = row.status ?? existing?.status ?? "approved";
  const isApproved = status === "approved";
  const location = row.location?.trim() || (area ? `${area}, ${district}` : district);
  const item = {
    PK: entityPk("dealer"),
    SK: itemSk("DEALER", id),
    id,
    userId: row.userId ?? existing?.userId ?? null,
    shopName: row.shopName,
    ownerName: row.ownerName ?? existing?.ownerName ?? null,
    phone: row.phone ?? existing?.phone ?? null,
    materials: row.materials ?? existing?.materials ?? [],
    location,
    district,
    area,
    lat: row.lat ?? existing?.lat ?? null,
    lng: row.lng ?? existing?.lng ?? null,
    rating: existing?.rating ?? 0,
    verified: row.verified ?? existing?.verified ?? isApproved,
    enabled: row.enabled ?? existing?.enabled ?? true,
    topDealer: row.topDealer ?? existing?.topDealer ?? false,
    status,
    gstDocUrl: row.gstDocUrl ?? existing?.gstDocUrl ?? null,
    licenseDocUrl: row.licenseDocUrl ?? existing?.licenseDocUrl ?? null,
    zoneIds: existing?.zoneIds ?? [],
    createdAt: existing?.createdAt ?? nowIso(),
  };
  await putItem(item);
  return mapDealer(item);
}

async function patchDealer(id, patch) {
  const existing = await getEntityItem("dealer", "DEALER", id);
  if (!existing) return null;
  const district =
    patch.district !== undefined ? patch.district?.trim() || "Coimbatore" : existing.district;
  const area = patch.area !== undefined ? patch.area?.trim() || "" : existing.area;
  let location = existing.location;
  if (patch.location !== undefined) location = patch.location;
  else if (patch.district !== undefined || patch.area !== undefined) {
    location = area ? `${area}, ${district}` : district;
  }
  const merged = {
    ...existing,
    shopName: patch.shopName ?? existing.shopName,
    ownerName: patch.ownerName !== undefined ? patch.ownerName : existing.ownerName,
    phone: patch.phone !== undefined ? patch.phone : existing.phone,
    materials: patch.materials ?? existing.materials,
    location,
    district,
    area,
    lat: patch.lat !== undefined ? patch.lat : existing.lat,
    lng: patch.lng !== undefined ? patch.lng : existing.lng,
    verified: patch.verified !== undefined ? patch.verified : existing.verified,
    enabled: patch.enabled !== undefined ? patch.enabled : existing.enabled,
    topDealer: patch.topDealer !== undefined ? patch.topDealer : existing.topDealer,
    status: patch.status ?? existing.status,
    gstDocUrl: patch.gstDocUrl !== undefined ? patch.gstDocUrl : existing.gstDocUrl,
    licenseDocUrl: patch.licenseDocUrl !== undefined ? patch.licenseDocUrl : existing.licenseDocUrl,
  };
  await putItem(merged);
  return mapDealer(merged);
}

async function setDealerZones(dealerId, zoneIds) {
  const existing = await getEntityItem("dealer", "DEALER", dealerId);
  if (!existing) return null;
  const merged = { ...existing, zoneIds: Array.isArray(zoneIds) ? zoneIds : [] };
  await putItem(merged);
  return mapDealer(merged);
}

async function patchEnquiry(id, patch) {
  const existing = await getEntityItem("enquiry", "ENQUIRY", id);
  if (!existing) return null;
  const merged = {
    ...existing,
    status: patch.status ?? existing.status,
    assignedDealerId:
      patch.assignedDealerId !== undefined ? patch.assignedDealerId : existing.assignedDealerId,
    notes: patch.notes !== undefined ? patch.notes : existing.notes,
  };
  await putItem(merged);
  return mapEnquiry(merged);
}

async function insertProperty(row) {
  const id = randomUUID();
  const t = nowIso();
  const item = {
    PK: entityPk("property"),
    SK: itemSk("PROPERTY", id),
    id,
    title: row.title,
    listingType: row.listingType,
    propertySubtype: row.propertySubtype,
    price: row.price,
    district: row.district,
    area: row.area,
    description: row.description ?? null,
    published: row.published ?? true,
    createdAt: t,
  };
  await putItem(item);
  return mapProperty(item);
}

async function insertExpert(row) {
  const id = randomUUID();
  const t = nowIso();
  const item = {
    PK: entityPk("expert"),
    SK: itemSk("EXPERT", id),
    id,
    expertType: row.expertType,
    firmName: row.firmName,
    ownerName: row.ownerName,
    contactNumber: row.contactNumber,
    serviceableAreas: row.serviceableAreas,
    district: row.district,
    createdAt: t,
  };
  await putItem(item);
  return item;
}

async function insertHomeService(row) {
  const id = randomUUID();
  const t = nowIso();
  const item = {
    PK: entityPk("home_service"),
    SK: itemSk("HOME_SERVICE", id),
    id,
    serviceCategory: row.serviceCategory,
    firmName: row.firmName,
    ownerName: row.ownerName,
    contactNumber: row.contactNumber,
    serviceableAreas: row.serviceableAreas,
    district: row.district,
    createdAt: t,
  };
  await putItem(item);
  return item;
}

async function patchReview(id, patch) {
  const existing = await getEntityItem("review", "REVIEW", id);
  if (!existing) return null;
  const merged = { ...existing, approved: patch.approved ?? existing.approved };
  await putItem(merged);
  return merged;
}

async function createZone(name, notes) {
  const id = randomUUID();
  const t = nowIso();
  const item = {
    PK: entityPk("zone"),
    SK: itemSk("ZONE", id),
    id,
    name,
    notes: notes ?? null,
    createdAt: t,
  };
  await putItem(item);
  return item;
}

async function createNotification(audience, title, bodyText) {
  const id = randomUUID();
  const t = nowIso();
  const item = {
    PK: entityPk("notification"),
    SK: itemSk("NOTIFICATION", id),
    id,
    audience,
    title,
    body: bodyText,
    createdAt: t,
  };
  await putItem(item);
  return item;
}

async function insertAdminEvent(kind, title, bodyText) {
  const id = randomUUID();
  const t = nowIso();
  const item = {
    PK: entityPk("admin_event"),
    SK: itemSk("EVENT", id),
    id,
    kind,
    title,
    body: bodyText,
    createdAt: t,
  };
  await putItem(item);
  return item;
}


async function verifyOtpRecord(email, purpose, code) {
  const rows = await queryPk(`OTP#${email}`);
  const latest = rows
    .filter((r) => r.purpose === purpose)
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))[0];
  if (!latest) return false;
  if (new Date(latest.expiresAt).getTime() <= Date.now()) return false;
  if ((latest.attempts ?? 0) >= 5) return false;
  if (hashOtp(email, purpose, code) !== latest.codeHash) {
    await updateItem(latest.PK, latest.SK, { attempts: (latest.attempts ?? 0) + 1 });
    return false;
  }
  await deleteItem(latest.PK, latest.SK);
  return true;
}

async function findUserByEmail(email) {
  const rows = await queryGsi1(`EMAIL#${email.trim().toLowerCase()}`);
  const hit = rows[0];
  if (!hit) return null;
  return await getItem(hit.PK, hit.SK);
}

async function createUser({ name, email, password, mode, emailVerified }) {
  const normalized = email.trim().toLowerCase();
  const existing = await queryGsi1(`EMAIL#${normalized}`);
  if (existing.length > 0) throw new Error("duplicate email");
  const id = randomUUID();
  const t = nowIso();
  const passwordHash = await hashPasswordPbkdf2(password);
  const item = {
    PK: `USER#${id}`,
    SK: "META",
    GSI1PK: `EMAIL#${normalized}`,
    GSI1SK: `USER#${id}`,
    id,
    name,
    email: normalized,
    passwordHash,
    role: mode === "partner" ? "dealer" : "customer",
    status: mode === "partner" ? "pending" : "active",
    phone: null,
    location: null,
    lat: null,
    lng: null,
    kycStatus: null,
    emailVerifiedAt: emailVerified ? t : null,
    createdAt: t,
  };
  await putItem(item);
  await putItem({
    PK: entityPk("user"),
    SK: itemSk("USER", id),
    ...item,
  });
  return item;
}

async function createSession(userId, email, userAgent) {
  const id = randomUUID();
  const t = nowIso();
  const session = {
    PK: `SESSION#${id}`,
    SK: "META",
    id,
    userId,
    email: email?.trim().toLowerCase() ?? null,
    startedAt: t,
    lastActiveAt: t,
    userAgent: userAgent ?? null,
    endedAt: null,
  };
  await putItem(session);
  await putItem({ PK: entityPk("app_session"), SK: itemSk("SESSION", id), ...session });
  return {
    id,
    userId,
    email: session.email,
    startedAt: t,
    lastActiveAt: t,
    userAgent: session.userAgent,
    endedAt: null,
  };
}
