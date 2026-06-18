"use client";

import { useState } from "react";
import type { HomeServiceProviderRecord } from "@kattadam/data-layer";
import AddHomeServiceForm from "@/components/admin/AddHomeServiceForm";

type Props = {
  providers: HomeServiceProviderRecord[];
};

export default function HomeServicesAdminPanel({ providers }: Props) {
  const [editingProvider, setEditingProvider] = useState<HomeServiceProviderRecord | null>(null);

  return (
    <div className="space-y-6">
      <div className="admin-card p-5">
        <h2 className="font-semibold text-sm text-cement-900 mb-1">
          {editingProvider ? `Edit provider — ${editingProvider.firmName}` : "Add provider"}
        </h2>
        <AddHomeServiceForm
          provider={editingProvider}
          onCancel={() => setEditingProvider(null)}
          onSaved={() => setEditingProvider(null)}
        />
      </div>

      {!providers.length ? (
        <p className="text-sm text-cement-500 admin-card p-6">No home service providers yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr>
                <th className="admin-th">Category</th>
                <th className="admin-th">Firm</th>
                <th className="admin-th">Owner</th>
                <th className="admin-th">Phone</th>
                <th className="admin-th">District</th>
                <th className="admin-th">Areas</th>
                <th className="admin-th">Added</th>
                <th className="admin-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((r) => (
                <tr key={r.id} className={editingProvider?.id === r.id ? "bg-brand-50/40" : undefined}>
                  <td className="admin-td text-xs font-medium">{r.serviceCategory}</td>
                  <td className="admin-td font-medium">{r.firmName}</td>
                  <td className="admin-td">{r.ownerName}</td>
                  <td className="admin-td">{r.contactNumber}</td>
                  <td className="admin-td text-xs">{r.district}</td>
                  <td className="admin-td text-xs text-cement-600 max-w-[220px]">{r.serviceableAreas}</td>
                  <td className="admin-td text-xs text-cement-500">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="admin-td">
                    <button
                      type="button"
                      className="text-xs text-brand-700 hover:underline font-medium"
                      onClick={() => {
                        setEditingProvider(r);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
