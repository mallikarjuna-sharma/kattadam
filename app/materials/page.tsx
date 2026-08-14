"use client";

import { useEffect, useMemo, useState } from "react";
import ListingPageShell from "@/components/layout/ListingPageShell";
import DistrictAreaSelect from "@/components/ui/DistrictAreaSelect";
import EnquiryModal from "@/components/ui/EnquiryModal";
import { MapPin, Phone, Package } from "lucide-react";
import {
  MATERIAL_CATEGORIES,
  DISTRICT_FILTER_ALL,
  materialCategoryLabel,
} from "@/lib/mock-data";

type ApiCatalogMaterial = {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  unit: string | null;
  pricingType?: "fixed" | "dealer_quote";
  fixedPrice?: number | null;
  price?: number;
  dealerName?: string | null;
  district?: string;
  area?: string;
};

function normalizeCategoryKey(label: string): string {
  return label.trim().toUpperCase().replace(/\s+/g, "_");
}

function formatMaterialPrice(m: ApiCatalogMaterial): string {
  const p =
    typeof m.price === "number" && Number.isFinite(m.price)
      ? m.price
      : m.pricingType === "fixed" && m.fixedPrice != null && Number.isFinite(m.fixedPrice)
        ? m.fixedPrice
        : null;
  if (p == null || p < 0) return "Price on request";
  return `₹${p.toLocaleString()}${m.unit ? ` / ${m.unit}` : ""}`;
}

export default function MaterialsPage() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("ALL");
  const [district, setDistrict] = useState<string>(DISTRICT_FILTER_ALL);
  const [area, setArea] = useState("All Areas");
  const [enquiryOpen, setEnquiryOpen] = useState<{
    target: string;
    materialId?: string;
  } | null>(null);
  const [catalogMaterials, setCatalogMaterials] = useState<ApiCatalogMaterial[]>([]);
  const [listStatus, setListStatus] = useState<"loading" | "live" | "empty" | "unconfigured" | "error">("loading");
  const [errorHint, setErrorHint] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const matRes = await fetch("/api/catalog/materials");
        const matJson = await matRes.json();
        if (cancelled) return;

        if (process.env.NODE_ENV === "development") {
          if (matJson?.configured === false) {
            console.info(
              "[materials] Supabase env missing for server. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local (project root), then restart `npm run dev`."
            );
          }
          if (!matRes.ok || matJson?.source === "error") {
            console.warn("[materials] /api/catalog/materials:", matJson?.error ?? matRes.status);
          }
        }

        if (!matJson?.configured) {
          setCatalogMaterials([]);
          setListStatus("unconfigured");
          setErrorHint(null);
          return;
        }

        if (!matRes.ok || matJson?.source === "error") {
          setCatalogMaterials([]);
          setListStatus("error");
          setErrorHint(typeof matJson?.error === "string" ? matJson.error : `HTTP ${matRes.status}`);
          return;
        }

        const mats: ApiCatalogMaterial[] =
          matJson?.source === "live" && Array.isArray(matJson.materials) ? matJson.materials : [];
        setCatalogMaterials(mats);
        setListStatus(mats.length === 0 ? "empty" : "live");
        setErrorHint(null);
      } catch {
        if (!cancelled) {
          setCatalogMaterials([]);
          setListStatus("error");
          setErrorHint("Network error while loading catalogue.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredMaterials = useMemo(() => {
    const q = search.toLowerCase().trim();
    return catalogMaterials.filter((m) => {
      const matchCat = cat === "ALL" || normalizeCategoryKey(m.category) === cat;
      const matchDistrict = district === DISTRICT_FILTER_ALL || (m.district ?? "") === district;
      const matchArea = area === "All Areas" || (m.area ?? "") === area;
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        (m.subcategory ?? "").toLowerCase().includes(q) ||
        (m.unit ?? "").toLowerCase().includes(q);
      return matchCat && matchDistrict && matchArea && matchSearch;
    });
  }, [catalogMaterials, search, cat, district, area]);

  return (
    <ListingPageShell
      title="Materials catalogue"
      searchPlaceholder="Search by name, category, unit…"
      search={search}
      onSearchChange={setSearch}
      backHref="/"
    >
      <div className="page-container py-6">
        {listStatus === "loading" && (
          <p className="text-sm text-cement-500 mb-6">Loading catalogue…</p>
        )}

        {listStatus === "unconfigured" && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 mb-6">
            Database is not connected for this environment. Set{" "}
            <code className="rounded bg-white/80 px-1.5 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="rounded bg-white/80 px-1.5 py-0.5 text-xs">SUPABASE_SERVICE_ROLE_KEY</code> to load
            materials from Admin.
          </div>
        )}

        {listStatus === "error" && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 mb-6">
            Could not load the catalogue.{errorHint ? ` ${errorHint}` : ""}
          </div>
        )}

        {(listStatus === "live" || listStatus === "empty") && (
          <>
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-4 px-4">
              {[{ key: "ALL", label: "All", emoji: "🏠" }, ...MATERIAL_CATEGORIES].map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCat(c.key)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                    cat === c.key
                      ? "bg-brand-600 text-white border-brand-600"
                      : "bg-white text-cement-600 border-cement-200 hover:border-brand-300"
                  }`}
                >
                  <span>{c.emoji}</span> {c.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
              <p className="text-sm text-cement-500">
                <span className="font-semibold text-cement-900">{filteredMaterials.length}</span>
                {listStatus === "live" ? " materials match filters" : " materials (add items in Admin)"}
              </p>
              <DistrictAreaSelect
                district={district}
                onDistrictChange={setDistrict}
                area={area}
                onAreaChange={setArea}
                className="flex flex-wrap items-stretch sm:justify-end gap-2"
                selectClassName="text-sm border border-cement-200 rounded-lg px-3 py-1.5 bg-white text-cement-700 focus:outline-none focus:ring-2 focus:ring-brand-400 min-w-0 flex-1 sm:flex-none sm:min-w-[140px]"
              />
            </div>

            <p className="text-xs text-cement-500 mb-4">Listed items and prices come from Admin → Materials.</p>

            <div className="space-y-4">
              {filteredMaterials.map((m) => {
                const priceLabel = formatMaterialPrice(m);
                const catLabel = materialCategoryLabel(m.category);
                return (
                  <div key={m.id} className="card p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Package className="w-6 h-6 text-brand-600" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-cement-900 text-lg leading-snug">{m.name}</h3>
                          <div className="flex items-center gap-1 text-cement-500 text-xs mt-1">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            {m.area || "—"}, {m.district || "—"}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-brand-700 leading-tight">{priceLabel}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="text-xs bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full font-medium">
                        {catLabel}
                      </span>
                      {m.subcategory ? (
                        <span className="text-xs bg-cement-100 text-cement-700 px-2.5 py-1 rounded-full font-medium">
                          {m.subcategory}
                        </span>
                      ) : null}
                      {m.unit ? (
                        <span className="text-xs bg-cement-100 text-cement-600 px-2.5 py-1 rounded-full font-medium">
                          Unit: {m.unit}
                        </span>
                      ) : null}
                    </div>

                    <div className="bg-cement-50 rounded-xl p-3 mb-4 text-sm text-cement-700">
                      <div className="flex justify-between gap-2">
                        <span className="text-cement-500">Category key</span>
                        <span className="font-mono text-xs text-cement-800">{m.category}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEnquiryOpen({ target: m.name, materialId: m.id })}
                      className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm"
                    >
                      <Phone className="w-4 h-4" /> Send Enquiry
                    </button>
                  </div>
                );
              })}

              {listStatus === "empty" && (
                <div className="text-center py-14 card p-8">
                  <Package className="w-12 h-12 text-cement-300 mx-auto mb-3" />
                  <p className="text-cement-600 font-medium">No materials yet</p>
                  <p className="text-sm text-cement-500 mt-1">Add your first row in Admin → Materials.</p>
                </div>
              )}

              {listStatus === "live" && filteredMaterials.length === 0 && (
                <div className="text-center py-16 card p-8">
                  <Package className="w-12 h-12 text-cement-300 mx-auto mb-3" />
                  <p className="text-cement-600 font-medium">No materials match your filters</p>
                  <p className="text-sm text-cement-500 mt-1">Try another category, district, or search.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {enquiryOpen && (
        <EnquiryModal
          target={enquiryOpen.target}
          materialId={enquiryOpen.materialId}
          onClose={() => setEnquiryOpen(null)}
        />
      )}
    </ListingPageShell>
  );
}
