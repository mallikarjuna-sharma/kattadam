import Link from "next/link";
import { adminListDealers, adminListMaterials } from "@kattadam/data-layer/server";
import AddMaterialForm from "@/components/admin/AddMaterialForm";
import { actionDeleteMaterial } from "@/app/admin/actions";
import { materialCategoryLabel } from "@/lib/mock-data";

export default async function AdminMaterialsPage() {
  const [materials, dealers] = await Promise.all([adminListMaterials(), adminListDealers()]);
  const dealerOptions = (dealers ?? []).map((d) => ({ id: d.id, shopName: d.shopName }));
  const dealerShopById = new Map((dealers ?? []).map((d) => [d.id, d.shopName]));

  return (
    <div className="flex-1">
      <header className="bg-white border-b border-cement-200 px-4 md:px-6 py-4">
        <h1 className="font-semibold text-lg text-cement-900">Materials</h1>
        <p className="text-xs text-cement-500">Category keys, price, district & area — synced to the customer catalogue</p>
      </header>
      <div className="p-4 md:p-6 space-y-6">
        <div
          className="rounded-lg border border-brand-100 bg-brand-50/90 px-4 py-3 text-sm text-cement-800"
          role="note"
        >
          <p className="font-medium text-cement-900 mb-1">Dealers & categories</p>
          <p className="text-xs text-cement-700 leading-relaxed">
            Choose a <strong>saved dealer</strong> from{" "}
            <Link href="/admin/dealers" className="font-medium text-brand-700 underline underline-offset-2">
              Dealer management
            </Link>
            . Category keys on materials should overlap dealer category selections so listings stay consistent.
          </p>
          <p className="text-xs text-cement-600 mt-2">
            Run <code className="rounded bg-white px-1 py-0.5 text-[11px]">002_materials_catalog_fields.sql</code> and{" "}
            <code className="rounded bg-white px-1 py-0.5 text-[11px]">003_dealers_district_area_materials_dealer_fk.sql</code>{" "}
            in Supabase when upgrading.
          </p>
        </div>
        <div className="admin-card p-5">
          <h2 className="font-semibold text-sm text-cement-900 mb-3">Add material</h2>
          <AddMaterialForm dealers={dealerOptions} />
        </div>

        {!materials?.length ? (
          <p className="text-sm text-cement-500 admin-card p-6">No materials yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="w-full min-w-[880px]">
              <thead>
                <tr>
                  <th className="admin-th">Name</th>
                  <th className="admin-th">Category</th>
                  <th className="admin-th">Unit</th>
                  <th className="admin-th">Price</th>
                  <th className="admin-th">District / Area</th>
                  <th className="admin-th">Linked dealer</th>
                  <th className="admin-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m) => (
                  <tr key={m.id}>
                    <td className="admin-td font-medium">{m.name}</td>
                    <td className="admin-td">
                      {materialCategoryLabel(m.category)}
                      {m.subcategory ? ` · ${m.subcategory}` : ""}
                      <div className="text-[10px] text-cement-400 font-mono mt-0.5">{m.category}</div>
                    </td>
                    <td className="admin-td">{m.unit ?? "—"}</td>
                    <td className="admin-td text-xs">₹{m.price?.toLocaleString?.() ?? m.price}</td>
                    <td className="admin-td text-xs">
                      {m.district}
                      {m.area ? ` · ${m.area}` : ""}
                    </td>
                    <td className="admin-td text-xs font-medium text-cement-800">
                      {m.dealerId ? dealerShopById.get(m.dealerId) ?? m.dealerName ?? "—" : m.dealerName ?? "—"}
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
