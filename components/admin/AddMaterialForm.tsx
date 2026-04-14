"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { actionUpsertMaterial } from "@/app/admin/actions";
import {
  DISTRICTS,
  DISTRICT_AREAS,
  MATERIAL_CATEGORIES,
  MATERIAL_SUBCATEGORY_PRESETS,
  materialCategoryUsesSubcategoryDropdown,
} from "@/lib/mock-data";
import type { District } from "@/lib/mock-data";

export type DealerOption = { id: string; shopName: string };

const initial = {
  name: "",
  categoryKey: "" as string,
  subcategory: "",
  unit: "",
  price: "",
  dealerId: "",
  district: "" as string,
  area: "" as string,
};

export default function AddMaterialForm({ dealers }: { dealers: DealerOption[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fields, setFields] = useState(initial);

  const areaOptions = useMemo(() => {
    if (!fields.district || !(DISTRICTS as readonly string[]).includes(fields.district)) return [];
    return DISTRICT_AREAS[fields.district as District] ?? [];
  }, [fields.district]);

  const subPreset = fields.categoryKey ? MATERIAL_SUBCATEGORY_PRESETS[fields.categoryKey] : undefined;
  const useSubDropdown = materialCategoryUsesSubcategoryDropdown(fields.categoryKey);

  const canSave = useMemo(() => {
    const priceNum = Number.parseFloat(fields.price);
    return (
      fields.name.trim().length > 0 &&
      fields.categoryKey.length > 0 &&
      fields.subcategory.trim().length > 0 &&
      fields.unit.trim().length > 0 &&
      fields.dealerId.length > 0 &&
      fields.district.length > 0 &&
      fields.area.length > 0 &&
      Number.isFinite(priceNum) &&
      priceNum >= 0
    );
  }, [fields]);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!canSave || isPending) return;

      const fd = new FormData();
      fd.set("name", fields.name.trim());
      fd.set("categoryKey", fields.categoryKey.trim());
      fd.set("subcategory", fields.subcategory.trim());
      fd.set("unit", fields.unit.trim());
      fd.set("price", fields.price.trim());
      fd.set("dealerId", fields.dealerId.trim());
      const shop = dealers.find((d) => d.id === fields.dealerId)?.shopName ?? "";
      fd.set("dealerName", shop);
      fd.set("district", fields.district.trim());
      fd.set("area", fields.area.trim());

      startTransition(async () => {
        try {
          await actionUpsertMaterial(fd);
          setFields(initial);
          router.refresh();
        } catch (err) {
          console.error(err);
        }
      });
    },
    [canSave, dealers, fields, isPending, router]
  );

  return (
    <form onSubmit={onSubmit} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div>
        <label className="text-xs text-cement-500 block mb-1">Name *</label>
        <input
          className="admin-input"
          name="name"
          value={fields.name}
          onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
          placeholder="Ultratech OPC 53"
          autoComplete="off"
          required
        />
      </div>
      <div>
        <label className="text-xs text-cement-500 block mb-1">Category *</label>
        <select
          className="admin-input"
          name="categoryKey"
          value={fields.categoryKey}
          onChange={(e) =>
            setFields((f) => ({
              ...f,
              categoryKey: e.target.value,
              subcategory: "",
            }))
          }
          required
        >
          <option value="">Select category</option>
          {MATERIAL_CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>
              {c.emoji} {c.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs text-cement-500 block mb-1">Subcategory *</label>
        {useSubDropdown && subPreset ? (
          <select
            className="admin-input"
            name="subcategory"
            value={fields.subcategory}
            onChange={(e) => setFields((f) => ({ ...f, subcategory: e.target.value }))}
            required
          >
            <option value="">Select</option>
            {subPreset.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            className="admin-input"
            name="subcategory"
            value={fields.subcategory}
            onChange={(e) => setFields((f) => ({ ...f, subcategory: e.target.value }))}
            placeholder="Required"
            disabled={!fields.categoryKey}
            required
            autoComplete="off"
          />
        )}
      </div>
      <div>
        <label className="text-xs text-cement-500 block mb-1">Unit *</label>
        <input
          className="admin-input"
          name="unit"
          value={fields.unit}
          onChange={(e) => setFields((f) => ({ ...f, unit: e.target.value }))}
          placeholder="bag, tonne, piece"
          required
          autoComplete="off"
        />
      </div>
      <div>
        <label className="text-xs text-cement-500 block mb-1">Price (₹) *</label>
        <input
          className="admin-input"
          name="price"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          value={fields.price}
          onChange={(e) => setFields((f) => ({ ...f, price: e.target.value }))}
          placeholder="390"
          required
        />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs text-cement-500 block mb-1">Dealer *</label>
        <select
          className="admin-input"
          name="dealerId"
          value={fields.dealerId}
          onChange={(e) => setFields((f) => ({ ...f, dealerId: e.target.value }))}
          required
          disabled={dealers.length === 0}
        >
          <option value="">{dealers.length ? "Select saved dealer" : "Add a dealer in Dealer management first"}</option>
          {dealers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.shopName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs text-cement-500 block mb-1">District *</label>
        <select
          className="admin-input"
          name="district"
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
          name="area"
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
      <div className="flex items-end">
        <button type="submit" className="admin-btn" disabled={!canSave || isPending}>
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
