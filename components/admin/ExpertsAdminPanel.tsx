"use client";

import { useState } from "react";
import type { KattadamExpertRecord } from "@kattadam/data-layer";
import AddExpertForm from "@/components/admin/AddExpertForm";

type Props = {
  experts: KattadamExpertRecord[];
};

export default function ExpertsAdminPanel({ experts }: Props) {
  const [editingExpert, setEditingExpert] = useState<KattadamExpertRecord | null>(null);

  return (
    <div className="space-y-6">
      <div className="admin-card p-5">
        <h2 className="font-semibold text-sm text-cement-900 mb-1">
          {editingExpert ? `Edit expert — ${editingExpert.firmName}` : "Add expert"}
        </h2>
        <AddExpertForm
          expert={editingExpert}
          onCancel={() => setEditingExpert(null)}
          onSaved={() => setEditingExpert(null)}
        />
      </div>

      {!experts.length ? (
        <p className="text-sm text-cement-500 admin-card p-6">No experts yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr>
                <th className="admin-th">Type</th>
                <th className="admin-th">Firm</th>
                <th className="admin-th">Owner</th>
                <th className="admin-th">Phone</th>
                <th className="admin-th">District</th>
                <th className="admin-th">Serviceable areas</th>
                <th className="admin-th">Added</th>
                <th className="admin-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {experts.map((e) => (
                <tr key={e.id} className={editingExpert?.id === e.id ? "bg-brand-50/40" : undefined}>
                  <td className="admin-td capitalize">{e.expertType}</td>
                  <td className="admin-td font-medium">{e.firmName}</td>
                  <td className="admin-td">{e.ownerName}</td>
                  <td className="admin-td">{e.contactNumber}</td>
                  <td className="admin-td text-xs">{e.district}</td>
                  <td className="admin-td text-xs text-cement-600 max-w-[240px]">{e.serviceableAreas}</td>
                  <td className="admin-td text-xs text-cement-500">{new Date(e.createdAt).toLocaleString()}</td>
                  <td className="admin-td">
                    <button
                      type="button"
                      className="text-xs text-brand-700 hover:underline font-medium"
                      onClick={() => {
                        setEditingExpert(e);
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
