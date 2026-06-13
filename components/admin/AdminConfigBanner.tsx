type Props = {
  /** Passed from a Server Component — server-only env vars are not visible in the client bundle. */
  configError: string | null;
};

export default function AdminConfigBanner({ configError }: Props) {
  if (!configError) return null;
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-950 px-4 py-3 text-sm">
      <strong className="font-semibold">Database not configured.</strong> {configError} See{" "}
      <code className="bg-amber-100/80 px-1 rounded">.env.example</code>. Run SQL migrations in{" "}
      <code className="bg-amber-100/80 px-1 rounded">packages/data-layer/supabase/migrations</code>{" "}
      (001 → 005), then <code className="bg-amber-100/80 px-1 rounded">npm run verify:supabase</code>.
    </div>
  );
}
