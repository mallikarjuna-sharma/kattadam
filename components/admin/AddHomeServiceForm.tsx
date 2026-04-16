"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { actionInsertHomeService } from "@/app/admin/actions";
import { DISTRICTS } from "@/lib/mock-data";

const CATEGORIES = [
  "Interiors",
  "Renovations",
  "Painting",
  "Electrical",
  "Plumbing",
  "Masonry works",
] as const;

const initial = {
  serviceCategory: "Interiors" as (typeof CATEGORIES)[number],
  firmName: "",
  ownerName: "",
  contactNumber: "",
  serviceableAreas: "",
  district: "" as string,
};

export default function AddHomeServiceForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fields, setFields] = useState(initial);

  const canSave =
    fields.firmName.trim().length > 0 &&
    fields.ownerName.trim().length > 0 &&
    fields.contactNumber.replace(/\D/g, "").length >= 10 &&
    fields.serviceableAreas.trim().length > 0 &&
    fields.district.length > 0;

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!canSave || isPending) return;
      const fd = new FormData();
      fd.set("serviceCategory", fields.serviceCategory);
      fd.set("firmName", fields.firmName.trim());
      fd.set("ownerName", fields.ownerName.trim());
      fd.set("contactNumber", fields.contactNumber.trim());
      fd.set("serviceableAreas", fields.serviceableAreas.trim());
      fd.set("district", fields.district.trim());
      startTransition(async () => {
        await actionInsertHomeService(fd);
        setFields(initial);
        router.refresh();
      });
    },
    [canSave, fields, isPending, router]
  );

  return (
    <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-3">
      <div>
        <label className="text-xs text-cement-500 block mb-1">Category *</label>
        <select
          className="admin-input"
          value={fields.serviceCategory}
          onChange={(e) =>
            setFields((f) => ({ ...f, serviceCategory: e.target.value as (typeof CATEGORIES)[number] }))
          }
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs text-cement-500 block mb-1">District *</label>
        <select
          className="admin-input"
          value={fields.district}
          onChange={(e) => setFields((f) => ({ ...f, district: e.target.value }))}
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
      <div className="sm:col-span-2">
        <label className="text-xs text-cement-500 block mb-1">Firm name *</label>
        <input
          className="admin-input"
          value={fields.firmName}
          onChange={(e) => setFields((f) => ({ ...f, firmName: e.target.value }))}
          required
        />
      </div>
      <div>
        <label className="text-xs text-cement-500 block mb-1">Owner name *</label>
        <input
          className="admin-input"
          value={fields.ownerName}
          onChange={(e) => setFields((f) => ({ ...f, ownerName: e.target.value }))}
          required
        />
      </div>
      <div>
        <label className="text-xs text-cement-500 block mb-1">Contact number *</label>
        <input
          className="admin-input"
          value={fields.contactNumber}
          onChange={(e) =>
            setFields((f) => ({ ...f, contactNumber: e.target.value.replace(/\D/g, "").slice(0, 15) }))
          }
          inputMode="numeric"
          required
        />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs text-cement-500 block mb-1">Serviceable areas *</label>
        <textarea
          className="admin-input min-h-[72px]"
          value={fields.serviceableAreas}
          onChange={(e) => setFields((f) => ({ ...f, serviceableAreas: e.target.value }))}
          placeholder="Areas or towns you serve"
          required
        />
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className="admin-btn" disabled={!canSave || isPending}>
          {isPending ? "Saving…" : "Save provider"}
        </button>
      </div>
    </form>
  );
}
