import { adminListDealers, adminListEnquiries } from "@kattadam/data-layer/server";
import type { EnquiryRecord, EnquiryStatus } from "@kattadam/data-layer";
import { actionSetEnquiryStatus, actionAssignEnquiry } from "@/app/admin/actions";

const STATUSES: EnquiryStatus[] = ["pending", "assigned", "accepted", "delivered", "cancelled"];

function parseLegacyPhone(notes: string | null): string | null {
  const m = notes?.match(/^Phone:\s*\+?91?\s*(\d{10})/m);
  return m ? m[1] : null;
}

function parseLegacyAltPhone(notes: string | null): string | null {
  const m = notes?.match(/^Alt phone:\s*\+?91?\s*(\d{10})/m);
  return m ? m[1] : null;
}

function parseLegacyEmail(notes: string | null): string | null {
  const m = notes?.match(/^Email:\s*(\S+@\S+)/m);
  return m ? m[1] : null;
}

function parseLegacyDeliveryAddress(notes: string | null): string | null {
  const m = notes?.match(/^Delivery:\s*(.+)$/m);
  return m ? m[1].trim() : null;
}

function displayRequirement(notes: string | null): string | null {
  if (!notes) return null;
  let text = notes
    .replace(/^Phone:\s*\+?91?\s*\d{10}\s*\n?/m, "")
    .replace(/^Alt phone:\s*\+?91?\s*\d{10}\s*\n?/m, "")
    .replace(/^Email:\s*.+\s*\n?/m, "")
    .replace(/^Delivery:\s*.+\s*\n?/m, "");
  const regarding = text.match(/^Regarding:\s*.+\n\n([\s\S]*)$/);
  if (regarding) return regarding[1].trim() || null;
  return text.trim() || null;
}

function contactForEnquiry(e: EnquiryRecord) {
  return {
    phone: e.phone ?? parseLegacyPhone(e.notes),
    altPhone: e.altPhone ?? parseLegacyAltPhone(e.notes),
    email: e.email ?? parseLegacyEmail(e.notes),
  };
}

export default async function EnquiriesPage() {
  const [enquiries, dealers] = await Promise.all([adminListEnquiries(), adminListDealers()]);

  return (
    <div className="flex-1">
      <header className="bg-white border-b border-cement-200 px-4 md:px-6 py-4">
        <h1 className="font-semibold text-lg text-cement-900">Enquiries & orders</h1>
        <p className="text-xs text-cement-500">Manual assignment · admin override at any stage</p>
      </header>
      <div className="p-4 md:p-6">
        {!enquiries?.length ? (
          <p className="text-sm text-cement-500 admin-card p-6">No enquiries yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr>
                  <th className="admin-th">Customer / material</th>
                  <th className="admin-th">Contact</th>
                  <th className="admin-th">Qty</th>
                  <th className="admin-th">Location</th>
                  <th className="admin-th">Date</th>
                  <th className="admin-th">Status</th>
                  <th className="admin-th">Assign dealer</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((e) => {
                  const contact = contactForEnquiry(e);
                  const requirement = displayRequirement(e.notes);
                  return (
                  <tr key={e.id}>
                    <td className="admin-td max-w-[280px]">
                      <div className="font-medium">{e.customerName ?? "—"}</div>
                      <div className="text-xs text-cement-500">{e.materialLabel ?? e.materialId ?? "—"}</div>
                      {requirement ? (
                        <div className="text-[11px] text-cement-600 mt-1 whitespace-pre-wrap break-words border-t border-cement-100 pt-1">
                          <span className="text-cement-400 font-medium">Requirement: </span>
                          {requirement}
                        </div>
                      ) : null}
                    </td>
                    <td className="admin-td max-w-[200px]">
                      <div className="text-xs space-y-0.5">
                        {contact.phone ? (
                          <div>
                            <span className="text-cement-400">📞</span>{" "}
                            <a href={`tel:+91${contact.phone}`} className="text-cement-800 hover:underline">
                              +91 {contact.phone}
                            </a>
                          </div>
                        ) : (
                          <div className="text-cement-400">—</div>
                        )}
                        {contact.altPhone ? (
                          <div>
                            <span className="text-cement-400">📱 alt:</span>{" "}
                            <a href={`tel:+91${contact.altPhone}`} className="text-cement-700 hover:underline">
                              +91 {contact.altPhone}
                            </a>
                          </div>
                        ) : null}
                        {contact.email ? (
                          <div className="break-all">
                            <span className="text-cement-400">✉</span>{" "}
                            <a href={`mailto:${contact.email}`} className="text-cement-700 hover:underline">
                              {contact.email}
                            </a>
                          </div>
                        ) : null}
                      </div>
                    </td>
                    <td className="admin-td">{e.quantity ?? "—"}</td>
                    <td className="admin-td text-cement-600 max-w-[220px]">
                      {e.location || e.deliveryAddress || parseLegacyDeliveryAddress(e.notes) ? (
                        <div className="text-xs space-y-1">
                          {e.location ? (
                            <p className="whitespace-pre-wrap break-words">
                              <span className="text-cement-400 font-medium">Current: </span>
                              {e.location}
                            </p>
                          ) : null}
                          {(e.deliveryAddress ?? parseLegacyDeliveryAddress(e.notes)) ? (
                            <p className="whitespace-pre-wrap break-words">
                              <span className="text-cement-400 font-medium">Delivery: </span>
                              {e.deliveryAddress ?? parseLegacyDeliveryAddress(e.notes)}
                            </p>
                          ) : null}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="admin-td text-xs text-cement-500">
                      {new Date(e.createdAt).toLocaleString()}
                    </td>
                    <td className="admin-td">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {STATUSES.map((st) => (
                          <form key={st} action={actionSetEnquiryStatus.bind(null, e.id, st)}>
                            <button
                              type="submit"
                              className={`text-[10px] px-2 py-1 rounded-lg border ${
                                e.status === st
                                  ? "bg-brand-50 border-brand-200 text-brand-800"
                                  : "border-cement-200 text-cement-600"
                              }`}
                            >
                              {st}
                            </button>
                          </form>
                        ))}
                      </div>
                    </td>
                    <td className="admin-td">
                      <form action={actionAssignEnquiry} className="flex flex-col gap-1 max-w-[200px]">
                        <input type="hidden" name="enquiryId" value={e.id} />
                        <select
                          className="admin-input text-xs py-1"
                          name="dealerId"
                          defaultValue={e.assignedDealerId ?? ""}
                        >
                          <option value="">— None —</option>
                          {(dealers ?? []).map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.shopName}
                            </option>
                          ))}
                        </select>
                        <button type="submit" className="admin-btn text-xs py-1">
                          Assign
                        </button>
                      </form>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
