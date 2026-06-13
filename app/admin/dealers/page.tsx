import { isDataLayerConfigured } from "@kattadam/data-layer";
import { adminListDealers } from "@kattadam/data-layer/server";
import DealersAdminPanel from "@/components/admin/DealersAdminPanel";

export default async function DealersPage() {
  const configured = isDataLayerConfigured();
  const dealerRows = configured ? await adminListDealers() : null;
  const loadFailed = configured && dealerRows === null;
  const dealers = dealerRows ?? [];

  return (
    <div className="flex-1">
      <header className="bg-white border-b border-cement-200 px-4 md:px-6 py-4">
        <h1 className="font-semibold text-lg text-cement-900">Dealer management</h1>
        <p className="text-xs text-cement-500">
          Add and edit dealers with district, area, and location. Filter the list below. Run{" "}
          <code className="rounded bg-cement-100 px-1 py-0.5 text-[10px]">
            006_dealers_address_fields.sql
          </code>{" "}
          in Supabase if residential/delivery address columns are missing.
        </p>
      </header>
      <div className="p-4 md:p-6 space-y-4">
        {!configured ? (
          <div
            role="alert"
            className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            <p className="font-medium">Supabase not configured</p>
            <p className="text-xs mt-1 text-amber-800">
              Set <code className="bg-white/80 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="bg-white/80 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> in{" "}
              <code className="bg-white/80 px-1 rounded">.env.local</code>, then restart the dev server.
            </p>
          </div>
        ) : loadFailed ? (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            <p className="font-medium text-red-900">Could not load dealers from Supabase</p>
            <p className="text-xs mt-1 leading-relaxed">
              The database request failed (often <code className="bg-white/80 px-1 rounded">fetch failed</code> on
              Windows when Node prefers IPv6). Stop the server and start with{" "}
              <code className="bg-white/80 px-1 rounded">npm run dev</code> (not{" "}
              <code className="bg-white/80 px-1 rounded">npx next dev</code>) so IPv4 DNS is used. Or run:{" "}
              <code className="bg-white/80 px-1 rounded block mt-1">
                $env:NODE_OPTIONS=&quot;--dns-result-order=ipv4first&quot;; npx next dev
              </code>
            </p>
          </div>
        ) : null}
        <DealersAdminPanel dealers={dealers} />
      </div>
    </div>
  );
}
