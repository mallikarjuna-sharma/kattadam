import Image from "next/image";

export default function AdminSettingsPage() {
  return (
    <div className="flex-1">
      <header className="bg-white border-b border-cement-200 px-4 md:px-6 py-4">
        <h1 className="font-semibold text-lg text-cement-900">Settings</h1>
        <p className="text-xs text-cement-500">Branding, language, payments — wire in phase 2</p>
      </header>
      <div className="p-4 md:p-6 space-y-6 max-w-lg">
        <div className="admin-card p-5 space-y-3">
          <h2 className="font-semibold text-sm text-cement-900">App identity</h2>
          <div className="flex items-center gap-3">
            <Image src="/logo.jpeg" alt="" width={48} height={48} className="rounded-lg object-cover" />
            <div>
              <p className="font-bold text-cement-900">Kattadam</p>
              <p className="text-xs text-cement-500">கட்டடம் · Construction materials & services</p>
            </div>
          </div>
          <p className="text-xs text-cement-500">
            Customer site and admin both run on this app. Admin is at <code className="bg-cement-100 px-1 rounded">/admin</code>.
          </p>
        </div>
        <div className="admin-card p-5 space-y-2">
          <h2 className="font-semibold text-sm text-cement-900">Languages</h2>
          <p className="text-sm text-cement-600">Tamil / English toggles will live here; UI strings can follow next.</p>
        </div>
        <div className="admin-card p-5 space-y-2">
          <h2 className="font-semibold text-sm text-cement-900">Payment gateway</h2>
          <p className="text-sm text-cement-500">Reserved for commission & subscriptions (phase 2).</p>
        </div>
      </div>
    </div>
  );
}
