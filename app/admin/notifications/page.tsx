import { adminListNotifications } from "@kattadam/data-layer/server";
import { actionSendBroadcast } from "@/app/admin/actions";

export default async function NotificationsPage() {
  const list = await adminListNotifications();

  return (
    <div className="flex-1">
      <header className="bg-white border-b border-cement-200 px-4 md:px-6 py-4">
        <h1 className="font-semibold text-lg text-cement-900">Notifications</h1>
        <p className="text-xs text-cement-500">Broadcast log · push delivery is phase 2 (FCM / web push)</p>
      </header>
      <div className="p-4 md:p-6 space-y-6">
        <div className="admin-card p-5">
          <h2 className="font-semibold text-sm text-cement-900 mb-3">New broadcast</h2>
          <form action={actionSendBroadcast} className="space-y-3 max-w-xl">
            <div>
              <label className="text-xs text-cement-500 block mb-1">Audience</label>
              <select className="admin-input" name="audience" defaultValue="all">
                <option value="all">All users</option>
                <option value="dealers">Dealers only</option>
                <option value="customers">Customers only</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-cement-500 block mb-1">Title</label>
              <input className="admin-input" name="title" required placeholder="Price alert: cement" />
            </div>
            <div>
              <label className="text-xs text-cement-500 block mb-1">Message</label>
              <textarea className="admin-input min-h-[88px]" name="body" required placeholder="Offer details…" />
            </div>
            <button type="submit" className="admin-btn">
              Record broadcast
            </button>
          </form>
        </div>

        <div className="admin-card overflow-hidden">
          <div className="px-4 py-3 border-b border-cement-100 font-semibold text-sm">Recent</div>
          {!list?.length ? (
            <p className="p-6 text-sm text-cement-500">No broadcasts yet.</p>
          ) : (
            <ul className="divide-y divide-cement-100">
              {list.map((n) => (
                <li key={n.id} className="px-4 py-3 text-sm">
                  <div className="font-medium text-cement-900">{n.title}</div>
                  <div className="text-cement-600 text-xs mt-1">{n.body}</div>
                  <div className="text-cement-400 text-[10px] mt-2">
                    {n.audience} · {new Date(n.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
