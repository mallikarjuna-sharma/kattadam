"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import type { HomeServiceProviderRecord } from "@kattadam/data-layer";
import { actionUpsertHomeService } from "@/app/admin/actions";
import { DISTRICTS } from "@/lib/mock-data";

const CATEGORIES = [
  "Interiors",
  "Renovations",
  "Painting",
  "Electrical",
  "Plumbing",
  "Masonry works",
] as const;

type FormFields = {
  serviceCategory: (typeof CATEGORIES)[number];
  firmName: string;
  ownerName: string;
  contactNumber: string;
  serviceableAreas: string;
  district: string;
};

const emptyFields = (): FormFields => ({
  serviceCategory: "Interiors",
  firmName: "",
  ownerName: "",
  contactNumber: "",
  serviceableAreas: "",
  district: "",
});

function fieldsFromProvider(provider: HomeServiceProviderRecord): FormFields {
  const category = CATEGORIES.includes(provider.serviceCategory as (typeof CATEGORIES)[number])
    ? (provider.serviceCategory as (typeof CATEGORIES)[number])
    : "Interiors";
  return {
    serviceCategory: category,
    firmName: provider.firmName,
    ownerName: provider.ownerName,
    contactNumber: provider.contactNumber,
    serviceableAreas: provider.serviceableAreas,
    district: provider.district,
  };
}

type Props = {
  provider?: HomeServiceProviderRecord | null;
  onCancel?: () => void;
  onSaved?: () => void;
};

export default function AddHomeServiceForm({ provider, onCancel, onSaved }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fields, setFields] = useState<FormFields>(() =>
    provider ? fieldsFromProvider(provider) : emptyFields()
  );
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(provider?.id);

  useEffect(() => {
    setFields(provider ? fieldsFromProvider(provider) : emptyFields());
    setError(null);
  }, [provider]);

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
      if (provider?.id) fd.set("id", provider.id);
      fd.set("serviceCategory", fields.serviceCategory);
      fd.set("firmName", fields.firmName.trim());
      fd.set("ownerName", fields.ownerName.trim());
      fd.set("contactNumber", fields.contactNumber.trim());
      fd.set("serviceableAreas", fields.serviceableAreas.trim());
      fd.set("district", fields.district.trim());
      startTransition(async () => {
        const result = await actionUpsertHomeService(fd);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setError(null);
        if (!isEdit) setFields(emptyFields());
        onSaved?.();
        router.refresh();
      });
    },
    [canSave, fields, isEdit, isPending, onSaved, provider?.id, router]
  );

  return (
    <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-3">
      {error ? (
        <div role="alert" className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}
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
      <div className="sm:col-span-2 flex flex-wrap items-center gap-2">
        <button type="submit" className="admin-btn" disabled={!canSave || isPending}>
          {isPending ? "Saving…" : isEdit ? "Update provider" : "Save provider"}
        </button>
        {isEdit ? (
          <button type="button" className="admin-btn-outline" onClick={onCancel} disabled={isPending}>
            Cancel edit
          </button>
        ) : null}
      </div>
    </form>
  );
}
