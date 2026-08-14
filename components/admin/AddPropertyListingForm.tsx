"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { actionInsertPropertyListing } from "@/app/admin/actions";
import { DISTRICTS, DISTRICT_AREAS } from "@/lib/mock-data";
import type { District } from "@/lib/mock-data";

const initial = {
  title: "",
  listingType: "SELL" as "SELL" | "RENT",
  propertySubtype: "",
  price: "",
  district: "" as string,
  area: "" as string,
  description: "",
  published: true,
};

export default function AddPropertyListingForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fields, setFields] = useState(initial);

  const subtypeOptions = useMemo(() => {
    if (fields.listingType === "SELL") return ["Flat", "Plot"] as const;
    return ["Flat", "Empty land"] as const;
  }, [fields.listingType]);

  const areaOptions = useMemo(() => {
    if (!fields.district || !(DISTRICTS as readonly string[]).includes(fields.district)) return [];
    return DISTRICT_AREAS[fields.district as District] ?? [];
  }, [fields.district]);

  const canSave =
    fields.title.trim().length > 0 &&
    fields.propertySubtype.length > 0 &&
    fields.district.length > 0 &&
    fields.area.length > 0 &&
    Number.parseFloat(fields.price) > 0;

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!canSave || isPending) return;
      const fd = new FormData();
      fd.set("title", fields.title.trim());
      fd.set("listingType", fields.listingType);
      fd.set("propertySubtype", fields.propertySubtype);
      fd.set("price", fields.price);
      fd.set("district", fields.district.trim());
      fd.set("area", fields.area.trim());
      fd.set("description", fields.description.trim());
      fd.set("published", fields.published ? "true" : "false");
      startTransition(async () => {
        await actionInsertPropertyListing(fd);
        setFields(initial);
        router.refresh();
      });
    },
    [canSave, fields, isPending, router]
  );

  return (
    <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-3">
      <div className="sm:col-span-2">
        <label className="text-xs text-cement-500 block mb-1">Title *</label>
        <input
          className="admin-input"
          value={fields.title}
          onChange={(e) => setFields((f) => ({ ...f, title: e.target.value }))}
          required
        />
      </div>
      <div>
        <label className="text-xs text-cement-500 block mb-1">Listing type *</label>
        <select
          className="admin-input"
          value={fields.listingType}
          onChange={(e) =>
            setFields((f) => ({
              ...f,
              listingType: e.target.value as "SELL" | "RENT",
              propertySubtype: "",
            }))
          }
        >
          <option value="SELL">Buy (sale)</option>
          <option value="RENT">Rent</option>
        </select>
      </div>
      <div>
        <label className="text-xs text-cement-500 block mb-1">Property subtype *</label>
        <select
          className="admin-input"
          value={fields.propertySubtype}
          onChange={(e) => setFields((f) => ({ ...f, propertySubtype: e.target.value }))}
          required
        >
          <option value="">Select</option>
          {subtypeOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs text-cement-500 block mb-1">Price (₹) *</label>
        <input
          className="admin-input"
          type="number"
          min={1}
          step="1"
          value={fields.price}
          onChange={(e) => setFields((f) => ({ ...f, price: e.target.value }))}
          required
        />
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
        <label className="text-xs text-cement-500 block mb-1">Description</label>
        <textarea
          className="admin-input min-h-[64px]"
          value={fields.description}
          onChange={(e) => setFields((f) => ({ ...f, description: e.target.value }))}
        />
      </div>
      <div className="sm:col-span-2 flex items-center gap-2">
        <input
          type="checkbox"
          id="pub"
          checked={fields.published}
          onChange={(e) => setFields((f) => ({ ...f, published: e.target.checked }))}
        />
        <label htmlFor="pub" className="text-xs text-cement-600">
          Published (visible on site)
        </label>
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className="admin-btn" disabled={!canSave || isPending}>
          {isPending ? "Saving…" : "Save listing"}
        </button>
      </div>
    </form>
  );
}
