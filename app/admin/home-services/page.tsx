import { adminListHomeServiceProviders } from "@kattadam/data-layer/server";
import AddHomeServiceForm from "@/components/admin/AddHomeServiceForm";

export default async function HomeServicesAdminPage() {
  const rows = await adminListHomeServiceProviders();

  return (
    <div className="flex-1">
      <header className="bg-white border-b border-cement-200 px-4 md:px-6 py-4">
        <h1 className="font-semibold text-lg text-cement-900">Home services</h1>
        <p className="text-xs text-cement-500">Interiors, renovations, painting, electrical, plumbing, masonry works.</p>
      </header>
      <div className="p-4 md:p-6 space-y-6">
        <div className="admin-card p-5">
          <h2 className="font-semibold text-sm text-cement-900 mb-3">Add provider</h2>
          <AddHomeServiceForm />
        </div>
        {!rows?.length ? (
          <p className="text-sm text-cement-500 admin-card p-6">No home service providers yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr>
                  <th className="admin-th">Category</th>
                  <th className="admin-th">Firm</th>
                  <th className="admin-th">Owner</th>
                  <th className="admin-th">Phone</th>
                  <th className="admin-th">District</th>
                  <th className="admin-th">Areas</th>
                  <th className="admin-th">Added</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="admin-td text-xs font-medium">{r.serviceCategory}</td>
                    <td className="admin-td font-medium">{r.firmName}</td>
                    <td className="admin-td">{r.ownerName}</td>
                    <td className="admin-td">{r.contactNumber}</td>
                    <td className="admin-td text-xs">{r.district}</td>
                    <td className="admin-td text-xs text-cement-600 max-w-[220px]">{r.serviceableAreas}</td>
                    <td className="admin-td text-xs text-cement-500">
                      {new Date(r.createdAt).toLocaleString()}
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
