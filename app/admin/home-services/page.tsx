import { adminListHomeServiceProviders } from "@kattadam/data-layer/server";
import HomeServicesAdminPanel from "@/components/admin/HomeServicesAdminPanel";

export default async function HomeServicesAdminPage() {
  const rows = await adminListHomeServiceProviders();

  return (
    <div className="flex-1">
      <header className="bg-white border-b border-cement-200 px-4 md:px-6 py-4">
        <h1 className="font-semibold text-lg text-cement-900">Home services</h1>
        <p className="text-xs text-cement-500">
          Add and edit providers for interiors, renovations, painting, electrical, plumbing, and masonry works.
        </p>
      </header>
      <div className="p-4 md:p-6 space-y-6">
        <HomeServicesAdminPanel providers={rows ?? []} />
      </div>
    </div>
  );
}
