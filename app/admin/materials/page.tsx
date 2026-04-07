import Link from "next/link";
import { adminListMaterials } from "@kattadam/data-layer/server";
import { actionUpsertMaterial, actionDeleteMaterial } from "@/app/admin/actions";

export default async function AdminMaterialsPage() {
  const materials = await adminListMaterials();

  return (
    <div className="flex-1">
      <header className="bg-white border-b border-cement-200 px-4 md:px-6 py-4">
        <h1 className="font-semibold text-lg text-cement-900">Materials</h1>
        <p className="text-xs text-cement-500">Categories & units · fixed price or dealer quote (MVP)</p>
      </header>
      <div className="p-4 md:p-6 space-y-6">
        <div
          className="rounded-lg border border-brand-100 bg-brand-50/90 px-4 py-3 text-sm text-cement-800"
          role="note"
        >
          <p className="font-medium text-cement-900 mb-1">How catalogue links to dealers</p>
          <p className="text-xs text-cement-700 leading-relaxed">
            The <strong>Category</strong> field here (example:{' '}
            <code className="rounded bg-white px-1.5 py-0.5 text-[11px] text-cement-800">paint</code>) must match each
            dealer&apos;s tags on{' '}
            <Link href="/admin/dealers" className="font-medium text-brand-700 underline underline-offset-2">
              Dealer management
            </Link>{' '}
            (second column, comma-separated). Then those SKUs show under that dealer on the customer Materials page.
          </p>
        </div>
        <div className="admin-card p-5">
          <h2 className="font-semibold text-sm text-cement-900 mb-3">Add material</h2>
          <form action={actionUpsertMaterial} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-cement-500 block mb-1">Name *</label>
              <input className="admin-input" name="name" required placeholder="Ultratech OPC 53" />
            </div>
            <div>
              <label className="text-xs text-cement-500 block mb-1">Category *</label>
              <input className="admin-input" name="category" required placeholder="Cement" />
            </div>
            <div>
              <label className="text-xs text-cement-500 block mb-1">Subcategory</label>
              <input className="admin-input" name="subcategory" placeholder="OPC" />
            </div>
            <div>
              <label className="text-xs text-cement-500 block mb-1">Unit</label>
              <input className="admin-input" name="unit" placeholder="bag, tonne, piece" />
            </div>
            <div>
              <label className="text-xs text-cement-500 block mb-1">Pricing</label>
              <select className="admin-input" name="pricingType" defaultValue="dealer_quote">
                <option value="dealer_quote">Dealer quote</option>
                <option value="fixed">Fixed (admin)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-cement-500 block mb-1">Fixed price (optional)</label>
              <input className="admin-input" name="fixedPrice" type="number" step="0.01" placeholder="390" />
            </div>
            <div className="flex items-end">
              <button type="submit" className="admin-btn">
                Save
              </button>
            </div>
          </form>
        </div>

        {!materials?.length ? (
          <p className="text-sm text-cement-500 admin-card p-6">No materials yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr>
                  <th className="admin-th">Name</th>
                  <th className="admin-th">Category</th>
                  <th className="admin-th">Unit</th>
                  <th className="admin-th">Pricing</th>
                  <th className="admin-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m) => (
                  <tr key={m.id}>
                    <td className="admin-td font-medium">{m.name}</td>
                    <td className="admin-td">
                      {m.category}
                      {m.subcategory ? ` · ${m.subcategory}` : ""}
                    </td>
                    <td className="admin-td">{m.unit ?? "—"}</td>
                    <td className="admin-td text-xs">
                      {m.pricingType}
                      {m.fixedPrice != null ? ` · ₹${m.fixedPrice}` : ""}
                    </td>
                    <td className="admin-td">
                      <form action={actionDeleteMaterial.bind(null, m.id)}>
                        <button type="submit" className="text-xs text-red-600 hover:underline">
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
