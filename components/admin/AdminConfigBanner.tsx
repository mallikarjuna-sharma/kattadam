import { isDataLayerConfigured } from "@kattadam/data-layer";

export default function AdminConfigBanner() {
  if (isDataLayerConfigured()) return null;
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-950 px-4 py-3 text-sm">
      <strong className="font-semibold">Backend not configured.</strong> Set{" "}
      <code className="bg-amber-100/80 px-1 rounded">KATTADAM_API_URL</code> to your Lambda Function URL in{" "}
      <code className="bg-amber-100/80 px-1 rounded">.env.local</code> or Netlify env.
    </div>
  );
}
