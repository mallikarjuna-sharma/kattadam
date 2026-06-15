import { adminListPropertyListings } from "@kattadam/data-layer/server";
import PropertiesAdminPanel from "@/components/admin/PropertiesAdminPanel";

export default async function PropertiesAdminPage() {
  const listings = await adminListPropertyListings();

  return (
    <div className="flex-1">
      <header className="bg-white border-b border-cement-200 px-4 md:px-6 py-4">
        <h1 className="font-semibold text-lg text-cement-900">Real estate listings</h1>
        <p className="text-xs text-cement-500">
          Add and edit buy and rent listings shown on the customer Real estate page when published.
        </p>
      </header>
      <div className="p-4 md:p-6 space-y-6">
        <PropertiesAdminPanel listings={listings ?? []} />
      </div>
    </div>
  );
}
