"use client";

import { useState } from "react";
import type { MaterialRecord } from "@kattadam/data-layer";
import AddMaterialForm, { type DealerOption } from "@/components/admin/AddMaterialForm";
import { actionDeleteMaterial } from "@/app/admin/actions";
import { materialCategoryLabel } from "@/lib/mock-data";

type Props = {
  materials: MaterialRecord[];
  dealers: DealerOption[];
};

export default function MaterialsAdminPanel({ materials, dealers }: Props) {
  const [editingMaterial, setEditingMaterial] = useState<MaterialRecord | null>(null);
  const dealerShopById = new Map(dealers.map((d) => [d.id, d.shopName]));

  return (
    <div className="space-y-6">
      <div className="admin-card p-5">
        <h2 className="font-semibold text-sm text-cement-900 mb-3">
          {editingMaterial ? `Edit material — ${editingMaterial.name}` : "Add material"}
        </h2>
        <AddMaterialForm
          dealers={dealers}
          material={editingMaterial}
          onCancel={() => setEditingMaterial(null)}
          onSaved={() => setEditingMaterial(null)}
        />
      </div>

      {!materials.length ? (
        <p className="text-sm text-cement-500 admin-card p-6">No materials yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="w-full min-w-[880px]">
            <thead>
              <tr>
                <th className="admin-th">Name</th>
                <th className="admin-th">Category</th>
                <th className="admin-th">Unit</th>
                <th className="admin-th">Price</th>
                <th className="admin-th">District / Area</th>
                <th className="admin-th">Linked dealer</th>
                <th className="admin-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => (
                <tr key={m.id} className={editingMaterial?.id === m.id ? "bg-brand-50/40" : undefined}>
                  <td className="admin-td font-medium">{m.name}</td>
                  <td className="admin-td">
                    {materialCategoryLabel(m.category)}
                    {m.subcategory ? ` · ${m.subcategory}` : ""}
                    <div className="text-[10px] text-cement-400 font-mono mt-0.5">{m.category}</div>
                  </td>
                  <td className="admin-td">{m.unit ?? "—"}</td>
                  <td className="admin-td text-xs">₹{m.price?.toLocaleString?.() ?? m.price}</td>
                  <td className="admin-td text-xs">
                    {m.district}
                    {m.area ? ` · ${m.area}` : ""}
                  </td>
                  <td className="admin-td text-xs font-medium text-cement-800">
                    {m.dealerId ? dealerShopById.get(m.dealerId) ?? m.dealerName ?? "—" : m.dealerName ?? "—"}
                  </td>
                  <td className="admin-td">
                    <div className="flex flex-col gap-1 items-start">
                      <button
                        type="button"
                        className="text-xs text-brand-700 hover:underline font-medium"
                        onClick={() => {
                          setEditingMaterial(m);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        Edit
                      </button>
                      <form action={actionDeleteMaterial.bind(null, m.id)}>
                        <button type="submit" className="text-xs text-red-600 hover:underline">
                          Delete
                        </button>
                      </form>
                    </div>
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
