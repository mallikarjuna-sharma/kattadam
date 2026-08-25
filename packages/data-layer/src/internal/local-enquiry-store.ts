import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { EnquiryRecord, EnquiryStatus } from "../types";

export type LocalEnquiryInput = {
  customerName: string;
  materialLabel?: string | null;
  materialId?: string | null;
  quantity?: number | null;
  location?: string | null;
  notes?: string | null;
  assignedDealerId?: string | null;
  customerId?: string | null;
};

function storePath(): string {
  return join(process.cwd(), ".data", "enquiries.json");
}

async function readAll(): Promise<EnquiryRecord[]> {
  try {
    const raw = await readFile(storePath(), "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as EnquiryRecord[]) : [];
  } catch (e) {
    const code = (e as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return [];
    throw e;
  }
}

async function writeAll(rows: EnquiryRecord[]): Promise<void> {
  const dir = join(process.cwd(), ".data");
  await mkdir(dir, { recursive: true });
  await writeFile(storePath(), JSON.stringify(rows, null, 2), "utf8");
}

export async function appendLocalEnquiry(row: LocalEnquiryInput): Promise<EnquiryRecord> {
  const record: EnquiryRecord = {
    id: randomUUID(),
    customerId: row.customerId ?? null,
    customerName: row.customerName,
    materialId: row.materialId ?? null,
    materialLabel: row.materialLabel ?? null,
    quantity: row.quantity ?? null,
    location: row.location ?? null,
    lat: null,
    lng: null,
    status: "pending",
    assignedDealerId: row.assignedDealerId ?? null,
    notes: row.notes ?? null,
    createdAt: new Date().toISOString(),
  };
  const all = await readAll();
  all.unshift(record);
  await writeAll(all);
  return record;
}

export async function listLocalEnquiries(filters?: { status?: EnquiryStatus }): Promise<EnquiryRecord[]> {
  let all = await readAll();
  if (filters?.status) all = all.filter((e) => e.status === filters.status);
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateLocalEnquiry(
  id: string,
  patch: Partial<{ status: EnquiryStatus; assignedDealerId: string | null; notes: string | null }>
): Promise<EnquiryRecord | null> {
  const all = await readAll();
  const idx = all.findIndex((e) => e.id === id);
  if (idx < 0) return null;
  const cur = all[idx]!;
  const next: EnquiryRecord = {
    ...cur,
    ...(patch.status !== undefined ? { status: patch.status } : {}),
    ...(patch.assignedDealerId !== undefined ? { assignedDealerId: patch.assignedDealerId } : {}),
    ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
  };
  all[idx] = next;
  await writeAll(all);
  return next;
}
