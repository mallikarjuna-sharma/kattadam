import { adminListKattadamExperts } from "@kattadam/data-layer/server";
import AddExpertForm from "@/components/admin/AddExpertForm";

export default async function ExpertsAdminPage() {
  const experts = await adminListKattadamExperts();

  return (
    <div className="flex-1">
      <header className="bg-white border-b border-cement-200 px-4 md:px-6 py-4">
        <h1 className="font-semibold text-lg text-cement-900">Kattadam Experts</h1>
        <p className="text-xs text-cement-500">
          Add engineers, architects, and builders. Run{" "}
          <code className="rounded bg-cement-100 px-1 py-0.5 text-[10px]">004_auth_experts_properties.sql</code> in
          Supabase if this page errors.
        </p>
      </header>
      <div className="p-4 md:p-6 space-y-6">
        <div className="admin-card p-5">
          <h2 className="font-semibold text-sm text-cement-900 mb-3">Add expert</h2>
          <AddExpertForm />
        </div>
        {!experts?.length ? (
          <p className="text-sm text-cement-500 admin-card p-6">No experts yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr>
                  <th className="admin-th">Type</th>
                  <th className="admin-th">Firm</th>
                  <th className="admin-th">Owner</th>
                  <th className="admin-th">Phone</th>
                  <th className="admin-th">District</th>
                  <th className="admin-th">Serviceable areas</th>
                  <th className="admin-th">Added</th>
                </tr>
              </thead>
              <tbody>
                {experts.map((e) => (
                  <tr key={e.id}>
                    <td className="admin-td capitalize">{e.expertType}</td>
                    <td className="admin-td font-medium">{e.firmName}</td>
                    <td className="admin-td">{e.ownerName}</td>
                    <td className="admin-td">{e.contactNumber}</td>
                    <td className="admin-td text-xs">{e.district}</td>
                    <td className="admin-td text-xs text-cement-600 max-w-[240px]">{e.serviceableAreas}</td>
                    <td className="admin-td text-xs text-cement-500">
                      {new Date(e.createdAt).toLocaleString()}
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
