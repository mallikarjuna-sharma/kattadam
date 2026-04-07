import { adminGetDashboard } from "@kattadam/data-layer/server";
import { Bell } from "lucide-react";

export default async function AdminDashboardPage() {
  const s = await adminGetDashboard();
  const maxEnq = Math.max(1, ...(s?.enquiriesLast7Days.map((d) => d.count) ?? [1]));

  return (
    <div className="flex-1">
      <header className="bg-white border-b border-cement-200 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-semibold text-cement-900 text-lg">Dashboard</h1>
          <p className="text-xs text-cement-500">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative w-9 h-9 bg-cement-100 border border-cement-200 rounded-xl flex items-center justify-center">
            <Bell className="w-4 h-4 text-cement-600" />
          </span>
        </div>
      </header>

      <div className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {[
            { label: "Total users", v: s?.totalUsers ?? "—" },
            { label: "Total dealers", v: s?.totalDealers ?? "—" },
            { label: "Active dealers", v: s?.activeDealers ?? "—" },
            { label: "Pending approvals", v: s?.pendingApprovals ?? "—" },
            { label: "Total enquiries", v: s?.totalEnquiries ?? "—" },
          ].map((x) => (
            <div key={x.label} className="admin-card p-4 md:p-5">
              <div className="text-2xl font-bold text-cement-900">{x.v}</div>
              <div className="text-xs text-cement-500 mt-1">{x.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="admin-card p-5">
            <h2 className="font-semibold text-cement-900 mb-4 text-sm">Daily enquiries (7 days)</h2>
            <div className="flex items-end gap-2 h-36">
              {(s?.enquiriesLast7Days ?? []).map((d) => (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-brand-500/90 rounded-t-md min-h-[4px] transition-all"
                    style={{ height: `${(d.count / maxEnq) * 100}%` }}
                    title={`${d.date}: ${d.count}`}
                  />
                  <span className="text-[10px] text-cement-400 rotate-0 truncate w-full text-center">
                    {d.date.slice(5)}
                  </span>
                </div>
              ))}
              {!s?.enquiriesLast7Days?.length && (
                <p className="text-sm text-cement-400">No data yet. Connect Supabase and add enquiries.</p>
              )}
            </div>
          </div>

          <div className="admin-card p-5">
            <h2 className="font-semibold text-cement-900 mb-4 text-sm">User sign-ups by week</h2>
            <div className="space-y-2">
              {(s?.weeklyUserGrowth ?? []).map((w) => (
                <div key={w.weekStart} className="flex items-center gap-3 text-sm">
                  <span className="text-cement-500 w-28 flex-shrink-0">{w.weekStart}</span>
                  <div className="flex-1 h-2 bg-cement-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-600 rounded-full"
                      style={{
                        width: `${Math.min(100, w.count * 10)}%`,
                      }}
                    />
                  </div>
                  <span className="text-cement-800 font-medium w-8">{w.count}</span>
                </div>
              ))}
              {!s?.weeklyUserGrowth?.length && (
                <p className="text-sm text-cement-400">No user rows yet.</p>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-cement-400">
          Revenue & advanced analytics are phase 2. Manual assignment and approvals are supported under Enquiries
          and Dealers.
        </p>
      </div>
    </div>
  );
}
