import { adminListDealers, adminListZones } from "@kattadam/data-layer/server";
import { actionCreateZone, actionSetDealerZonesFromForm } from "@/app/admin/actions";

export default async function ZonesPage() {
  const [zones, dealers] = await Promise.all([adminListZones(), adminListDealers()]);

  return (
    <div className="flex-1">
      <header className="bg-white border-b border-cement-200 px-4 md:px-6 py-4">
        <h1 className="font-semibold text-lg text-cement-900">Zones & dealer mapping</h1>
        <p className="text-xs text-cement-500">Service areas · manual zone UUIDs (comma-separated) per dealer</p>
      </header>
      <div className="p-4 md:p-6 space-y-6">
        <div className="admin-card p-5">
          <h2 className="font-semibold text-sm text-cement-900 mb-3">Create zone</h2>
          <form action={actionCreateZone} className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <input className="admin-input flex-1" name="name" required placeholder="North Coimbatore" />
            <input className="admin-input flex-1" name="notes" placeholder="Notes (optional)" />
            <button type="submit" className="admin-btn flex-shrink-0">
              Add zone
            </button>
          </form>
        </div>

        <div className="admin-card p-5">
          <h2 className="font-semibold text-sm text-cement-900 mb-2">Zones</h2>
          {!zones?.length ? (
            <p className="text-sm text-cement-500">No zones yet.</p>
          ) : (
            <ul className="text-sm space-y-2">
              {zones.map((z) => (
                <li key={z.id} className="flex justify-between gap-4 border-b border-cement-50 pb-2">
                  <span className="font-medium">{z.name}</span>
                  <span className="text-xs text-cement-400 font-mono break-all">{z.id}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="admin-card p-5">
          <h2 className="font-semibold text-sm text-cement-900 mb-3">Map dealer → zones</h2>
          <p className="text-xs text-cement-500 mb-3">
            Paste comma-separated zone UUIDs from the list above. Replaces existing mapping.
          </p>
          {!dealers?.length ? (
            <p className="text-sm text-cement-500">No dealers.</p>
          ) : (
            <div className="space-y-4">
              {dealers.map((d) => (
                <form
                  key={d.id}
                  action={actionSetDealerZonesFromForm}
                  className="flex flex-col md:flex-row gap-2 md:items-center border-b border-cement-50 pb-3"
                >
                  <span className="text-sm font-medium w-48 flex-shrink-0">{d.shopName}</span>
                  <input type="hidden" name="dealerId" value={d.id} />
                  <input
                    className="admin-input flex-1 font-mono text-xs"
                    name="zoneIds"
                    placeholder="uuid-1, uuid-2"
                  />
                  <button type="submit" className="admin-btn-outline text-xs">
                    Save map
                  </button>
                </form>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
