"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import type { KattadamExpertRecord } from "@kattadam/data-layer";
import { actionUpsertExpert } from "@/app/admin/actions";
import { DISTRICTS } from "@/lib/mock-data";

type FormFields = {
  expertType: "builder" | "architect" | "engineer";
  firmName: string;
  ownerName: string;
  contactNumber: string;
  serviceableAreas: string;
  district: string;
};

const emptyFields = (): FormFields => ({
  expertType: "builder",
  firmName: "",
  ownerName: "",
  contactNumber: "",
  serviceableAreas: "",
  district: "",
});

function fieldsFromExpert(expert: KattadamExpertRecord): FormFields {
  return {
    expertType: expert.expertType,
    firmName: expert.firmName,
    ownerName: expert.ownerName,
    contactNumber: expert.contactNumber,
    serviceableAreas: expert.serviceableAreas,
    district: expert.district,
  };
}

type Props = {
  expert?: KattadamExpertRecord | null;
  onCancel?: () => void;
  onSaved?: () => void;
};

export default function AddExpertForm({ expert, onCancel, onSaved }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fields, setFields] = useState<FormFields>(() => (expert ? fieldsFromExpert(expert) : emptyFields()));
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(expert?.id);

  useEffect(() => {
    setFields(expert ? fieldsFromExpert(expert) : emptyFields());
    setError(null);
  }, [expert]);

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
      if (expert?.id) fd.set("id", expert.id);
      fd.set("expertType", fields.expertType);
      fd.set("firmName", fields.firmName.trim());
      fd.set("ownerName", fields.ownerName.trim());
      fd.set("contactNumber", fields.contactNumber.trim());
      fd.set("serviceableAreas", fields.serviceableAreas.trim());
      fd.set("district", fields.district.trim());
      startTransition(async () => {
        const result = await actionUpsertExpert(fd);
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
    [canSave, expert?.id, fields, isEdit, isPending, onSaved, router]
  );

  return (
    <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-3">
      {error ? (
        <div role="alert" className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      <div>
        <label className="text-xs text-cement-500 block mb-1">Expert type *</label>
        <select
          className="admin-input"
          value={fields.expertType}
          onChange={(e) =>
            setFields((f) => ({ ...f, expertType: e.target.value as FormFields["expertType"] }))
          }
        >
          <option value="builder">Builder</option>
          <option value="architect">Architect</option>
          <option value="engineer">Engineer</option>
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
          placeholder="e.g. RS Puram, Peelamedu, Gandhipuram"
          required
        />
      </div>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-2">
        <button type="submit" className="admin-btn" disabled={!canSave || isPending}>
          {isPending ? "Saving…" : isEdit ? "Update expert" : "Save expert"}
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
