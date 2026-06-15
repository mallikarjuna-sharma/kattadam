import { adminListKattadamExperts } from "@kattadam/data-layer/server";
import ExpertsAdminPanel from "@/components/admin/ExpertsAdminPanel";

export default async function ExpertsAdminPage() {
  const experts = await adminListKattadamExperts();

  return (
    <div className="flex-1">
      <header className="bg-white border-b border-cement-200 px-4 md:px-6 py-4">
        <h1 className="font-semibold text-lg text-cement-900">Kattadam Experts</h1>
        <p className="text-xs text-cement-500">
          Add and edit engineers, architects, and builders. Run{" "}
          <code className="rounded bg-cement-100 px-1 py-0.5 text-[10px]">004_auth_experts_properties.sql</code> in
          Supabase if this page errors.
        </p>
      </header>
      <div className="p-4 md:p-6 space-y-6">
        <ExpertsAdminPanel experts={experts ?? []} />
      </div>
    </div>
  );
}
