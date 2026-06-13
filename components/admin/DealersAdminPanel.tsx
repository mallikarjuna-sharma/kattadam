"use client";

import { useMemo, useState } from "react";
import type { DealerRecord } from "@kattadam/data-layer";
import DealerForm from "@/components/admin/DealerForm";
import DistrictAreaSelect from "@/components/ui/DistrictAreaSelect";
import { actionDeleteDealer } from "@/app/admin/actions";
import { materialCategoryLabel } from "@/lib/mock-data";
import {
  matchesAreaFilter,
  matchesDealerLocationFilter,
  matchesDistrictFilter,
} from "@/lib/location-filters";
import { DISTRICT_FILTER_ALL } from "@/lib/mock-data";

type Props = {
  dealers: DealerRecord[];
};

export default function DealersAdminPanel({ dealers }: Props) {
  const [editingDealer, setEditingDealer] = useState<DealerRecord | null>(null);
  const [filterDistrict, setFilterDistrict] = useState<string>(DISTRICT_FILTER_ALL);
  const [filterArea, setFilterArea] = useState("All Areas");
  const [filterLocation, setFilterLocation] = useState("");

  const filteredDealers = useMemo(() => {
    return dealers.filter((d) => {
      const matchDistrict = matchesDistrictFilter(filterDistrict, d.district);
      const matchArea = matchesAreaFilter(filterArea, d.area);
      const matchLocation = matchesDealerLocationFilter(filterLocation, d.location, d.area, d.district);
      return matchDistrict && matchArea && matchLocation;
    });
  }, [dealers, filterDistrict, filterArea, filterLocation]);

  return (
    <div className="space-y-6">
      <div className="admin-card p-5">
        <h2 className="font-semibold text-sm text-cement-900 mb-1">
          {editingDealer ? `Edit dealer — ${editingDealer.shopName}` : "Add dealer"}
        </h2>
        {editingDealer ? (
          <p className="text-xs text-cement-500 mb-3">
            Update location, addresses, and categories. Changes are saved to the database immediately.
          </p>
        ) : (
          <p className="text-xs text-cement-500 mb-3">
            New dealers default to <strong>Approved</strong>. Use district and searchable area fields for location.
          </p>
        )}
        <DealerForm
          dealer={editingDealer}
          onCancel={() => setEditingDealer(null)}
          onSaved={() => setEditingDealer(null)}
        />
      </div>

      {!dealers.length ? (
        <p className="text-sm text-cement-500 admin-card p-6">No dealers yet.</p>
      ) : (
        <div className="space-y-3">
          <div className="admin-card p-4">
            <h2 className="font-semibold text-sm text-cement-900 mb-3">Filter dealers</h2>
            <div className="flex flex-col lg:flex-row lg:items-end gap-3">
              <DistrictAreaSelect
                district={filterDistrict}
                onDistrictChange={setFilterDistrict}
                area={filterArea}
                onAreaChange={setFilterArea}
                className="flex flex-col sm:flex-row flex-wrap gap-2"
                selectClassName="admin-input text-sm min-w-[160px]"
              />
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs text-cement-500 block mb-1" htmlFor="dealer-location-filter">
                  Location search
                </label>
                <input
                  id="dealer-location-filter"
                  className="admin-input w-full"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  placeholder="Area, district, or PIN…"
                />
              </div>
              {(filterDistrict !== DISTRICT_FILTER_ALL ||
                filterArea !== "All Areas" ||
                filterLocation.trim()) && (
                <button
                  type="button"
                  className="admin-btn-outline text-sm shrink-0"
                  onClick={() => {
                    setFilterDistrict(DISTRICT_FILTER_ALL);
                    setFilterArea("All Areas");
                    setFilterLocation("");
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
            <p className="text-xs text-cement-500 mt-2">
              Showing {filteredDealers.length} of {dealers.length} dealers
            </p>
          </div>

          <div className="admin-table-wrap">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr>
                  <th className="admin-th">Shop</th>
                  <th className="admin-th">Owner</th>
                  <th className="admin-th">Phone</th>
                  <th className="admin-th">District</th>
                  <th className="admin-th">Area</th>
                  <th className="admin-th">Location</th>
                  <th className="admin-th min-w-[140px]">Addresses</th>
                  <th className="admin-th min-w-[200px]">Categories</th>
                  <th className="admin-th">Rating</th>
                  <th className="admin-th">Status</th>
                  <th className="admin-th">Flags</th>
                  <th className="admin-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDealers.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="admin-td text-center text-cement-500 py-8">
                      No dealers match the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredDealers.map((d) => (
                    <tr key={d.id} className={editingDealer?.id === d.id ? "bg-brand-50/40" : undefined}>
                      <td className="admin-td font-medium">{d.shopName}</td>
                      <td className="admin-td">{d.ownerName ?? "—"}</td>
                      <td className="admin-td">{d.phone ?? "—"}</td>
                      <td className="admin-td text-xs">{d.district}</td>
                      <td className="admin-td text-xs">{d.area}</td>
                      <td className="admin-td text-xs text-cement-600">{d.location ?? "—"}</td>
                      <td className="admin-td text-xs text-cement-600 max-w-[180px]">
                        {d.residentialAddress || d.deliveryAddress ? (
                          <div className="space-y-1">
                            {d.residentialAddress ? (
                              <p className="truncate" title={d.residentialAddress}>
                                <span className="text-cement-400">R:</span> {d.residentialAddress}
                              </p>
                            ) : null}
                            {d.deliveryAddress ? (
                              <p className="truncate" title={d.deliveryAddress}>
                                <span className="text-cement-400">D:</span> {d.deliveryAddress}
                              </p>
                            ) : null}
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="admin-td">
                        <div className="flex flex-wrap gap-1">
                          {(d.materials ?? []).map((key) => (
                            <span
                              key={key}
                              className="text-[10px] bg-brand-50 text-brand-800 px-2 py-0.5 rounded-full font-medium"
                            >
                              {materialCategoryLabel(key)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="admin-td">{d.rating.toFixed(1)}</td>
                      <td className="admin-td text-xs">{d.status}</td>
                      <td className="admin-td text-xs text-cement-500">
                        {d.verified ? "Verified" : "Not verified"} · {d.enabled ? "On" : "Off"}
                      </td>
                      <td className="admin-td">
                        <div className="flex flex-col gap-1 items-start">
                          <button
                            type="button"
                            className="text-xs text-brand-700 hover:underline font-medium"
                            onClick={() => {
                              setEditingDealer(d);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          >
                            Edit
                          </button>
                          <form action={actionDeleteDealer.bind(null, d.id)}>
                            <button type="submit" className="text-xs text-red-600 hover:underline font-medium">
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
