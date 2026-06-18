import Link from "next/link";
import { adminListDealers, adminListMaterials } from "@kattadam/data-layer/server";
import MaterialsAdminPanel from "@/components/admin/MaterialsAdminPanel";

export default async function AdminMaterialsPage() {
  const [materials, dealers] = await Promise.all([adminListMaterials(), adminListDealers()]);
  const dealerOptions = (dealers ?? []).map((d) => ({ id: d.id, shopName: d.shopName }));

  return (
    <div className="flex-1">
      <header className="bg-white border-b border-cement-200 px-4 md:px-6 py-4">
        <h1 className="font-semibold text-lg text-cement-900">Materials</h1>
        <p className="text-xs text-cement-500">Add and edit materials — synced to the customer catalogue</p>
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
        </div>
        <MaterialsAdminPanel materials={materials ?? []} dealers={dealerOptions} />
      </div>
    </div>
  );
}
