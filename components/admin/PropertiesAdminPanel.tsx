"use client";

import { useState } from "react";
import type { PropertyListingRecord } from "@kattadam/data-layer";
import AddPropertyListingForm from "@/components/admin/AddPropertyListingForm";
import { actionDeletePropertyListing } from "@/app/admin/actions";

type Props = {
  listings: PropertyListingRecord[];
};

export default function PropertiesAdminPanel({ listings }: Props) {
  const [editingListing, setEditingListing] = useState<PropertyListingRecord | null>(null);

  return (
    <div className="space-y-6">
      <div className="admin-card p-5">
        <h2 className="font-semibold text-sm text-cement-900 mb-1">
          {editingListing ? `Edit listing — ${editingListing.title}` : "Add listing"}
        </h2>
        <AddPropertyListingForm
          listing={editingListing}
          onCancel={() => setEditingListing(null)}
          onSaved={() => setEditingListing(null)}
        />
      </div>

      {!listings.length ? (
        <p className="text-sm text-cement-500 admin-card p-6">No listings yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="w-full min-w-[960px]">
            <thead>
              <tr>
                <th className="admin-th">Title</th>
                <th className="admin-th">Type</th>
                <th className="admin-th">Subtype</th>
                <th className="admin-th">Price</th>
                <th className="admin-th">District</th>
                <th className="admin-th">Area</th>
                <th className="admin-th">Pub</th>
                <th className="admin-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((p) => (
                <tr key={p.id} className={editingListing?.id === p.id ? "bg-brand-50/40" : undefined}>
                  <td className="admin-td font-medium max-w-[200px]">{p.title}</td>
                  <td className="admin-td text-xs">{p.listingType}</td>
                  <td className="admin-td text-xs">{p.propertySubtype}</td>
                  <td className="admin-td text-xs">₹{p.price.toLocaleString()}</td>
                  <td className="admin-td text-xs">{p.district}</td>
                  <td className="admin-td text-xs">{p.area}</td>
                  <td className="admin-td text-xs">{p.published ? "Yes" : "No"}</td>
                  <td className="admin-td">
                    <div className="flex flex-col gap-1 items-start">
                      <button
                        type="button"
                        className="text-xs text-brand-700 hover:underline font-medium"
                        onClick={() => {
                          setEditingListing(p);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        Edit
                      </button>
                      <form action={actionDeletePropertyListing.bind(null, p.id)}>
                        <button type="submit" className="text-xs text-red-600 hover:underline font-medium">
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
