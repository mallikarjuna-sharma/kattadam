import { adminListUsers } from "@kattadam/data-layer/server";
import type { UserStatus } from "@kattadam/data-layer";
import { actionSetUserStatus } from "@/app/admin/actions";

const STATUSES: UserStatus[] = ["pending", "approved", "rejected", "blocked", "active"];

export default async function UsersPage() {
  const users = await adminListUsers();

  return (
    <div className="flex-1">
      <header className="bg-white border-b border-cement-200 px-4 md:px-6 py-4">
        <h1 className="font-semibold text-lg text-cement-900">User management</h1>
        <p className="text-xs text-cement-500">Customers, dealers, and service providers · KYC field ready in schema</p>
      </header>
      <div className="p-4 md:p-6">
        {!users?.length ? (
          <p className="text-sm text-cement-500 admin-card p-6">No users in database yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr>
                  <th className="admin-th">Name</th>
                  <th className="admin-th">Email</th>
                  <th className="admin-th">Phone</th>
                  <th className="admin-th">Role</th>
                  <th className="admin-th">Location</th>
                  <th className="admin-th">Registered</th>
                  <th className="admin-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="admin-td font-medium">{u.name}</td>
                    <td className="admin-td text-cement-600 text-xs">{u.email ?? "—"}</td>
                    <td className="admin-td text-cement-600">{u.phone ?? "—"}</td>
                    <td className="admin-td capitalize">{u.role.replace(/_/g, " ")}</td>
                    <td className="admin-td text-cement-600">{u.location ?? "—"}</td>
                    <td className="admin-td text-cement-500 text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="admin-td">
                      <span className="text-xs text-cement-500 block mb-2">Current: {u.status}</span>
                      <div className="flex flex-wrap gap-1">
                        {STATUSES.map((st) => (
                          <form key={st} action={actionSetUserStatus.bind(null, u.id, st)}>
                            <button
                              type="submit"
                              className={`text-[10px] px-2 py-1 rounded-lg border ${
                                u.status === st
                                  ? "bg-brand-50 border-brand-200 text-brand-800"
                                  : "border-cement-200 text-cement-600 hover:bg-cement-50"
                              }`}
                            >
                              {st}
                            </button>
                          </form>
                        ))}
                      </div>
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
