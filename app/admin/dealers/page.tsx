import { adminListDealers } from "@kattadam/data-layer/server";
import {
  actionUpsertDealer,
  actionDealerApprove,
  actionDealerReject,
  actionDealerToggleEnabled,
  actionUpdateDealerMaterials,
} from "@/app/admin/actions";

export default async function DealersPage() {
  const dealers = await adminListDealers();

  return (
    <div className="flex-1">
      <header className="bg-white border-b border-cement-200 px-4 md:px-6 py-4">
        <h1 className="font-semibold text-lg text-cement-900">Dealer management</h1>
        <p className="text-xs text-cement-500">
          Approve, verify, enable/disable. Use <strong className="text-cement-700">material tags</strong> so the
          customer app lists catalogue SKUs under each dealer (tag text must match the material <em>category</em>,
          e.g. <code className="text-[11px] bg-cement-100 px-1 rounded">paint</code>).
        </p>
      </header>
      <div className="p-4 md:p-6 space-y-6">
        <div className="admin-card p-5">
          <h2 className="font-semibold text-sm text-cement-900 mb-3">Add / edit dealer</h2>
          <form action={actionUpsertDealer} className="grid sm:grid-cols-2 gap-3">
            <input type="hidden" name="id" />
            <div>
              <label className="text-xs text-cement-500 block mb-1">Shop name *</label>
              <input className="admin-input" name="shopName" required placeholder="Sri Ram Cement Depot" />
            </div>
            <div>
              <label className="text-xs text-cement-500 block mb-1">Owner name</label>
              <input className="admin-input" name="ownerName" placeholder="Owner" />
            </div>
            <div>
              <label className="text-xs text-cement-500 block mb-1">Phone</label>
              <input className="admin-input" name="phone" placeholder="9876543210" />
            </div>
            <div>
              <label className="text-xs text-cement-500 block mb-1">Location</label>
              <input className="admin-input" name="location" placeholder="RS Puram, Coimbatore" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-cement-500 block mb-1">
                Material tags (comma-separated) — match Admin → Materials <strong>category</strong>
              </label>
              <input
                className="admin-input"
                name="materials"
                placeholder="Cement, Paint, TMT Steel"
              />
              <p className="text-[11px] text-cement-400 mt-1">
                Example: category &quot;paint&quot; in Materials pairs with tag &quot;paint&quot; here (case ignored).
              </p>
            </div>
            <div>
              <label className="text-xs text-cement-500 block mb-1">Initial status</label>
              <select className="admin-input" name="status" defaultValue="pending">
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="admin-btn">
                Save dealer
              </button>
            </div>
          </form>
        </div>

        {!dealers?.length ? (
          <p className="text-sm text-cement-500 admin-card p-6">No dealers yet.</p>
        ) : (
          <div className="space-y-2">
            <div
              className="rounded-lg border border-brand-100 bg-brand-50/90 px-3 py-2.5 text-[11px] text-cement-700 leading-relaxed"
              role="note"
            >
              <strong className="text-cement-900">Material tags column</strong> is next to Shop. Use comma-separated words
              that match <strong>Materials</strong> catalogue <em>category</em> (e.g.{' '}
              <code className="rounded bg-white px-1 py-0.5 text-[10px]">paint</code>), then click{' '}
              <strong>Save tags</strong>. On narrow screens, scroll the table horizontally.
            </div>
            <div className="admin-table-wrap">
              <table className="w-full min-w-[960px]">
              <thead>
                <tr>
                  <th className="admin-th">Shop</th>
                  <th className="admin-th min-w-[240px]">Material tags</th>
                  <th className="admin-th">Owner</th>
                  <th className="admin-th">Phone</th>
                  <th className="admin-th">Rating</th>
                  <th className="admin-th">Status</th>
                  <th className="admin-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dealers.map((d) => (
                  <tr key={d.id}>
                    <td className="admin-td font-medium">{d.shopName}</td>
                    <td className="admin-td align-top">
                      <form action={actionUpdateDealerMaterials} className="space-y-1.5">
                        <input type="hidden" name="dealerId" value={d.id} />
                        <input
                          className="admin-input text-xs py-1.5 w-full min-w-[200px]"
                          name="materials"
                          defaultValue={d.materials.join(", ")}
                          placeholder="Cement, paint, Sand"
                          aria-label={`Material tags for ${d.shopName}`}
                        />
                        <button
                          type="submit"
                          className="text-[10px] px-2 py-1 rounded-lg bg-brand-600 text-white border border-brand-700 hover:bg-brand-700"
                        >
                          Save tags
                        </button>
                      </form>
                    </td>
                    <td className="admin-td">{d.ownerName ?? "—"}</td>
                    <td className="admin-td">{d.phone ?? "—"}</td>
                    <td className="admin-td">{d.rating.toFixed(1)}</td>
                    <td className="admin-td text-xs">
                      <span className="block">{d.status}</span>
                      <span className="text-cement-400">
                        {d.verified ? "Verified" : "Not verified"} · {d.enabled ? "On" : "Off"}
                      </span>
                    </td>
                    <td className="admin-td">
                      <div className="flex flex-wrap gap-1">
                        <form action={actionDealerApprove.bind(null, d.id)}>
                          <button
                            type="submit"
                            className="text-[10px] px-2 py-1 rounded-lg bg-brand-50 text-brand-800 border border-brand-200"
                          >
                            Approve
                          </button>
                        </form>
                        <form action={actionDealerReject.bind(null, d.id)}>
                          <button type="submit" className="text-[10px] px-2 py-1 rounded-lg border border-cement-200">
                            Reject
                          </button>
                        </form>
                        <form action={actionDealerToggleEnabled.bind(null, d.id, !d.enabled)}>
                          <button type="submit" className="text-[10px] px-2 py-1 rounded-lg border border-cement-200">
                            {d.enabled ? "Disable" : "Enable"}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
