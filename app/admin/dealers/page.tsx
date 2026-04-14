import { adminListDealers } from "@kattadam/data-layer/server";
import AddDealerForm from "@/components/admin/AddDealerForm";
import { actionDeleteDealer } from "@/app/admin/actions";
import { materialCategoryLabel } from "@/lib/mock-data";

export default async function DealersPage() {
  const dealers = await adminListDealers();

  return (
    <div className="flex-1">
      <header className="bg-white border-b border-cement-200 px-4 md:px-6 py-4">
        <h1 className="font-semibold text-lg text-cement-900">Dealer management</h1>
        <p className="text-xs text-cement-500">
          New dealers default to <strong>Approved</strong>. Categories are stored as keys (e.g. CEMENT) to match
          Materials. Run{" "}
          <code className="rounded bg-cement-100 px-1 py-0.5 text-[10px]">003_dealers_district_area_materials_dealer_fk.sql</code>{" "}
          in Supabase if district/area columns are missing.
        </p>
      </header>
      <div className="p-4 md:p-6 space-y-6">
        <div className="admin-card p-5">
          <h2 className="font-semibold text-sm text-cement-900 mb-3">Add dealer</h2>
          <AddDealerForm />
        </div>

        {!dealers?.length ? (
          <p className="text-sm text-cement-500 admin-card p-6">No dealers yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr>
                  <th className="admin-th">Shop</th>
                  <th className="admin-th">Owner</th>
                  <th className="admin-th">Phone</th>
                  <th className="admin-th">District</th>
                  <th className="admin-th">Area</th>
                  <th className="admin-th">Location</th>
                  <th className="admin-th min-w-[200px]">Categories</th>
                  <th className="admin-th">Rating</th>
                  <th className="admin-th">Status</th>
                  <th className="admin-th">Flags</th>
                  <th className="admin-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dealers.map((d) => (
                  <tr key={d.id}>
                    <td className="admin-td font-medium">{d.shopName}</td>
                    <td className="admin-td">{d.ownerName ?? "—"}</td>
                    <td className="admin-td">{d.phone ?? "—"}</td>
                    <td className="admin-td text-xs">{d.district}</td>
                    <td className="admin-td text-xs">{d.area}</td>
                    <td className="admin-td text-xs text-cement-600">{d.location ?? "—"}</td>
                    <td className="admin-td">
                      <div className="flex flex-wrap gap-1">
                        {(d.materials ?? []).map((key) => (
                          <span
                            key={key}
                            className="text-[10px] bg-brand-50 text-brand-800 px-2 py-0.5 rounded-full font-medium"
                          >
                            {materialCategoryLabel(key)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="admin-td">{d.rating.toFixed(1)}</td>
                    <td className="admin-td text-xs">{d.status}</td>
                    <td className="admin-td text-xs text-cement-500">
                      {d.verified ? "Verified" : "Not verified"} · {d.enabled ? "On" : "Off"}
                    </td>
                    <td className="admin-td">
                      <form action={actionDeleteDealer.bind(null, d.id)}>
                        <button type="submit" className="text-xs text-red-600 hover:underline font-medium">
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
