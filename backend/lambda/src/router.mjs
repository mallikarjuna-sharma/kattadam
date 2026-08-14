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
    const enquiries = await listEntity("enquiry", mapEnquiry);
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
    return {
      status: 200,
      data: {
        totalUsers: 0,
        totalDealers: 0,
        activeDealers: 0,
        pendingApprovals: 0,
        totalEnquiries: 0,
        enquiriesLast7Days: [],
        weeklyUserGrowth: [],
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

  return { status: 404, data: { ok: false, error: "not found", path, method } };
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
