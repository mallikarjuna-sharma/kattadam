import { adminListAdminEvents, adminListAppSessions } from "@kattadam/data-layer/server";

function durationMs(start: string, end: string): string {
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  const ms = Math.max(0, b - a);
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

export default async function ActivityAdminPage() {
  const [events, sessions] = await Promise.all([adminListAdminEvents(80), adminListAppSessions(120)]);

  return (
    <div className="flex-1">
      <header className="bg-white border-b border-cement-200 px-4 md:px-6 py-4">
        <h1 className="font-semibold text-lg text-cement-900">Activity & sessions</h1>
        <p className="text-xs text-cement-500">
          Registration alerts and app session heartbeats. Requires migration{" "}
          <code className="rounded bg-cement-100 px-1 py-0.5 text-[10px]">004_auth_experts_properties.sql</code>.
        </p>
      </header>
      <div className="p-4 md:p-6 space-y-8">
        <section>
          <h2 className="font-semibold text-sm text-cement-900 mb-3">Admin feed</h2>
          {!events?.length ? (
            <p className="text-sm text-cement-500 admin-card p-4">No events yet.</p>
          ) : (
            <ul className="space-y-2">
              {events.map((e) => (
                <li key={e.id} className="admin-card p-4 text-sm">
                  <div className="flex flex-wrap justify-between gap-2">
                    <span className="font-medium text-cement-900">{e.title}</span>
                    <span className="text-xs text-cement-400">{new Date(e.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-cement-600 text-xs mt-1">{e.body}</p>
                  <span className="text-[10px] uppercase text-cement-400 mt-2 inline-block">{e.kind}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="font-semibold text-sm text-cement-900 mb-3">App sessions (recent)</h2>
          <p className="text-xs text-cement-500 mb-3">
            Duration uses last ping vs start. Clients should ping <code className="text-[10px]">/api/session/ping</code>{" "}
            while the app is open.
          </p>
          {!sessions?.length ? (
            <p className="text-sm text-cement-500 admin-card p-4">No sessions logged yet.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr>
                    <th className="admin-th">Email</th>
                    <th className="admin-th">User ID</th>
                    <th className="admin-th">Started</th>
                    <th className="admin-th">Last active</th>
                    <th className="admin-th">Duration</th>
                    <th className="admin-th">User agent</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr key={s.id}>
                      <td className="admin-td text-xs">{s.email ?? "—"}</td>
                      <td className="admin-td font-mono text-[10px]">{s.userId ?? "—"}</td>
                      <td className="admin-td text-xs text-cement-600">{new Date(s.startedAt).toLocaleString()}</td>
                      <td className="admin-td text-xs text-cement-600">{new Date(s.lastActiveAt).toLocaleString()}</td>
                      <td className="admin-td text-xs">{durationMs(s.startedAt, s.lastActiveAt)}</td>
                      <td className="admin-td text-[10px] text-cement-500 max-w-[200px] truncate" title={s.userAgent ?? ""}>
                        {s.userAgent ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
