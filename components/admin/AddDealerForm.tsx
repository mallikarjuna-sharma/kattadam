"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { actionUpsertDealer } from "@/app/admin/actions";
import { DISTRICTS, DISTRICT_AREAS, MATERIAL_CATEGORIES } from "@/lib/mock-data";
import type { District } from "@/lib/mock-data";

const initial = {
  shopName: "",
  ownerName: "",
  phone: "",
  district: "" as string,
  area: "" as string,
  status: "approved" as "pending" | "approved" | "rejected",
  categories: [] as string[],
};

export default function AddDealerForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fields, setFields] = useState(initial);

  const areaOptions = useMemo(() => {
    if (!fields.district || !(DISTRICTS as readonly string[]).includes(fields.district)) return [];
    return DISTRICT_AREAS[fields.district as District] ?? [];
  }, [fields.district]);

  const toggleCategory = (key: string) => {
    setFields((f) => ({
      ...f,
      categories: f.categories.includes(key) ? f.categories.filter((k) => k !== key) : [...f.categories, key],
    }));
  };

  const canSave = useMemo(() => {
    const phoneOk = fields.phone.replace(/\D/g, "").length >= 10;
    return (
      fields.shopName.trim().length > 0 &&
      fields.ownerName.trim().length > 0 &&
      phoneOk &&
      fields.district.length > 0 &&
      fields.area.length > 0 &&
      fields.categories.length > 0
    );
  }, [fields]);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!canSave || isPending) return;

      const fd = new FormData();
      fd.set("shopName", fields.shopName.trim());
      fd.set("ownerName", fields.ownerName.trim());
      fd.set("phone", fields.phone.trim());
      fd.set("district", fields.district.trim());
      fd.set("area", fields.area.trim());
      fd.set("status", fields.status);
      for (const k of fields.categories) {
        fd.append("categories", k);
      }

      startTransition(async () => {
        try {
          await actionUpsertDealer(fd);
          setFields(initial);
          router.refresh();
        } catch (err) {
          console.error(err);
        }
      });
    },
    [canSave, fields, isPending, router]
  );

  return (
    <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-3">
      <div>
        <label className="text-xs text-cement-500 block mb-1">Dealer (shop name) *</label>
        <input
          className="admin-input"
          value={fields.shopName}
          onChange={(e) => setFields((f) => ({ ...f, shopName: e.target.value }))}
          placeholder="Sri Ram Cement Depot"
          autoComplete="organization"
          required
        />
      </div>
      <div>
        <label className="text-xs text-cement-500 block mb-1">Owner name *</label>
        <input
          className="admin-input"
          value={fields.ownerName}
          onChange={(e) => setFields((f) => ({ ...f, ownerName: e.target.value }))}
          placeholder="Full name"
          autoComplete="name"
          required
        />
      </div>
      <div>
        <label className="text-xs text-cement-500 block mb-1">Phone number *</label>
        <input
          className="admin-input"
          value={fields.phone}
          onChange={(e) => setFields((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 15) }))}
          placeholder="9876543210"
          inputMode="numeric"
          required
        />
      </div>
      <div>
        <label className="text-xs text-cement-500 block mb-1">Initial status</label>
        <select
          className="admin-input"
          value={fields.status}
          onChange={(e) =>
            setFields((f) => ({
              ...f,
              status: e.target.value as "pending" | "approved" | "rejected",
            }))
          }
        >
          <option value="approved">Approved (default)</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div>
        <label className="text-xs text-cement-500 block mb-1">District *</label>
        <select
          className="admin-input"
          value={fields.district}
          onChange={(e) => setFields((f) => ({ ...f, district: e.target.value, area: "" }))}
          required
        >
          <option value="">Select district</option>
          {DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs text-cement-500 block mb-1">Area *</label>
        <select
          className="admin-input"
          value={fields.area}
          onChange={(e) => setFields((f) => ({ ...f, area: e.target.value }))}
          required
          disabled={!fields.district}
        >
          <option value="">{fields.district ? "Select area" : "Choose district first"}</option>
          {areaOptions.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs text-cement-500 block mb-2">Material categories * (multi-select)</label>
        <p className="text-[11px] text-cement-400 mb-2">
          Stored as catalogue keys (e.g. CEMENT) so they match Admin → Materials category keys.
        </p>
        <div className="flex flex-wrap gap-2">
          {MATERIAL_CATEGORIES.map((c) => {
            const on = fields.categories.includes(c.key);
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => toggleCategory(c.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  on
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white text-cement-600 border-cement-200 hover:border-brand-300"
                }`}
              >
                <span className="mr-1">{c.emoji}</span>
                {c.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex items-end sm:col-span-2">
        <button type="submit" className="admin-btn" disabled={!canSave || isPending}>
          {isPending ? "Saving…" : "Save dealer"}
        </button>
      </div>
    </form>
  );
}
