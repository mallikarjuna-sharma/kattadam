"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import type { DealerRecord } from "@kattadam/data-layer";
import { actionUpsertDealer } from "@/app/admin/actions";
import AdminAreaSearchSelect from "@/components/admin/AdminAreaSearchSelect";
import { defaultLocationLine, validateDealerForm } from "@/lib/dealer-validation";
import { DISTRICTS, MATERIAL_CATEGORIES } from "@/lib/mock-data";

type FormFields = {
  shopName: string;
  ownerName: string;
  phone: string;
  district: string;
  area: string;
  location: string;
  residentialAddress: string;
  deliveryAddress: string;
  status: "pending" | "approved" | "rejected";
  categories: string[];
  enabled: boolean;
};

const emptyFields = (): FormFields => ({
  shopName: "",
  ownerName: "",
  phone: "",
  district: "",
  area: "",
  location: "",
  residentialAddress: "",
  deliveryAddress: "",
  status: "approved",
  categories: [],
  enabled: true,
});

function fieldsFromDealer(dealer: DealerRecord): FormFields {
  return {
    shopName: dealer.shopName,
    ownerName: dealer.ownerName ?? "",
    phone: dealer.phone ?? "",
    district: dealer.district,
    area: dealer.area === "—" ? "" : dealer.area,
    location: dealer.location ?? defaultLocationLine(dealer.area, dealer.district),
    residentialAddress: dealer.residentialAddress ?? "",
    deliveryAddress: dealer.deliveryAddress ?? "",
    status: dealer.status,
    categories: dealer.materials ?? [],
    enabled: dealer.enabled,
  };
}

type Props = {
  dealer?: DealerRecord | null;
  onCancel?: () => void;
  onSaved?: () => void;
};

export default function DealerForm({ dealer, onCancel, onSaved }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fields, setFields] = useState<FormFields>(() => (dealer ? fieldsFromDealer(dealer) : emptyFields()));
  const [locationTouched, setLocationTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(dealer?.id);

  useEffect(() => {
    if (dealer) {
      setFields(fieldsFromDealer(dealer));
      setLocationTouched(false);
      setError(null);
    } else {
      setFields(emptyFields());
      setLocationTouched(false);
      setError(null);
    }
  }, [dealer]);

  useEffect(() => {
    if (locationTouched) return;
    if (!fields.district && !fields.area) return;
    setFields((f) => ({
      ...f,
      location: defaultLocationLine(f.area, f.district),
    }));
  }, [fields.district, fields.area, locationTouched]);

  const toggleCategory = (key: string) => {
    setFields((f) => ({
      ...f,
      categories: f.categories.includes(key) ? f.categories.filter((k) => k !== key) : [...f.categories, key],
    }));
  };

  const validation = useMemo(() => validateDealerForm(fields), [fields]);
  const canSave = validation.ok;

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!canSave || isPending) {
        if (!validation.ok) setError(validation.error);
        return;
      }

      const fd = new FormData();
      if (dealer?.id) fd.set("id", dealer.id);
      fd.set("shopName", fields.shopName.trim());
      fd.set("ownerName", fields.ownerName.trim());
      fd.set("phone", fields.phone.trim());
      fd.set("district", fields.district.trim());
      fd.set("area", fields.area.trim());
      fd.set("location", fields.location.trim());
      fd.set("residentialAddress", fields.residentialAddress.trim());
      fd.set("deliveryAddress", fields.deliveryAddress.trim());
      fd.set("status", fields.status);
      fd.set("enabled", fields.enabled ? "true" : "false");
      for (const k of fields.categories) {
        fd.append("categories", k);
      }

      startTransition(async () => {
        const result = await actionUpsertDealer(fd);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setError(null);
        if (!isEdit) {
          setFields(emptyFields());
          setLocationTouched(false);
        }
        onSaved?.();
        router.refresh();
      });
    },
    [canSave, dealer?.id, fields, isEdit, isPending, onSaved, router, validation]
  );

  const handleCancel = () => {
    setFields(emptyFields());
    setLocationTouched(false);
    setError(null);
    onCancel?.();
  };

  return (
    <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-3">
      {error ? (
        <div
          role="alert"
          className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      <div>
        <label className="text-xs text-cement-500 block mb-1" htmlFor="dealer-shop-name">
          Dealer (shop name) *
        </label>
        <input
          id="dealer-shop-name"
          className="admin-input"
          value={fields.shopName}
          onChange={(e) => setFields((f) => ({ ...f, shopName: e.target.value }))}
          placeholder="Sri Ram Cement Depot"
          autoComplete="organization"
          required
        />
      </div>
      <div>
        <label className="text-xs text-cement-500 block mb-1" htmlFor="dealer-owner-name">
          Owner name *
        </label>
        <input
          id="dealer-owner-name"
          className="admin-input"
          value={fields.ownerName}
          onChange={(e) => setFields((f) => ({ ...f, ownerName: e.target.value }))}
          placeholder="Full name"
          autoComplete="name"
          required
        />
      </div>
      <div>
        <label className="text-xs text-cement-500 block mb-1" htmlFor="dealer-phone">
          Phone number *
        </label>
        <input
          id="dealer-phone"
          className="admin-input"
          value={fields.phone}
          onChange={(e) =>
            setFields((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 15) }))
          }
          placeholder="9876543210"
          inputMode="numeric"
          required
        />
      </div>
      <div>
        <label className="text-xs text-cement-500 block mb-1" htmlFor="dealer-status">
          Status
        </label>
        <select
          id="dealer-status"
          className="admin-input"
          value={fields.status}
          onChange={(e) =>
            setFields((f) => ({
              ...f,
              status: e.target.value as FormFields["status"],
            }))
          }
        >
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div>
        <label className="text-xs text-cement-500 block mb-1" htmlFor="dealer-district">
          District *
        </label>
        <select
          id="dealer-district"
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
        <label className="text-xs text-cement-500 block mb-1" htmlFor="dealer-area">
          Area * <span className="text-cement-400">(search or select)</span>
        </label>
        <AdminAreaSearchSelect
          id="dealer-area"
          district={fields.district}
          value={fields.area}
          onChange={(area) => setFields((f) => ({ ...f, area }))}
          required
        />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs text-cement-500 block mb-1" htmlFor="dealer-location">
          Location
        </label>
        <input
          id="dealer-location"
          className="admin-input"
          value={fields.location}
          onChange={(e) => {
            setLocationTouched(true);
            setFields((f) => ({ ...f, location: e.target.value }));
          }}
          placeholder="e.g. RS Puram, Coimbatore"
        />
        <p className="text-[11px] text-cement-400 mt-1">
          Auto-filled from area and district; edit to override the display location.
        </p>
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs text-cement-500 block mb-1" htmlFor="dealer-residential-address">
          Residential address
        </label>
        <textarea
          id="dealer-residential-address"
          className="admin-input min-h-[72px] resize-y"
          value={fields.residentialAddress}
          onChange={(e) => setFields((f) => ({ ...f, residentialAddress: e.target.value }))}
          placeholder="Shop / office address"
          rows={2}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs text-cement-500 block mb-1" htmlFor="dealer-delivery-address">
          Delivery address
        </label>
        <textarea
          id="dealer-delivery-address"
          className="admin-input min-h-[72px] resize-y"
          value={fields.deliveryAddress}
          onChange={(e) => setFields((f) => ({ ...f, deliveryAddress: e.target.value }))}
          placeholder="Dispatch / delivery address (if different)"
          rows={2}
        />
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
      {isEdit ? (
        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            id="dealer-enabled"
            type="checkbox"
            checked={fields.enabled}
            onChange={(e) => setFields((f) => ({ ...f, enabled: e.target.checked }))}
            className="rounded border-cement-300 text-brand-600 focus:ring-brand-400"
          />
          <label htmlFor="dealer-enabled" className="text-sm text-cement-700">
            Dealer enabled (visible when approved)
          </label>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
        <button type="submit" className="admin-btn" disabled={!canSave || isPending}>
          {isPending ? "Saving…" : isEdit ? "Update dealer" : "Save dealer"}
        </button>
        {isEdit ? (
          <button type="button" className="admin-btn-outline" onClick={handleCancel} disabled={isPending}>
            Cancel edit
          </button>
        ) : null}
      </div>
    </form>
  );
}
