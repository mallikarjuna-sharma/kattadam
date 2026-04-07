import { isDataLayerConfigured } from "@kattadam/data-layer";

export default function AdminConfigBanner() {
  if (isDataLayerConfigured()) return null;
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-950 px-4 py-3 text-sm">
      <strong className="font-semibold">Database not configured.</strong> Set{" "}
      <code className="bg-amber-100/80 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
      <code className="bg-amber-100/80 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> in{" "}
      <code className="bg-amber-100/80 px-1 rounded">.env.local</code> at the project root. Run the SQL migration in{" "}
      <code className="bg-amber-100/80 px-1 rounded">packages/data-layer/supabase/migrations</code>.
    </div>
  );
}
