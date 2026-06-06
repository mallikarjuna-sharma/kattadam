"use client";

import { useEffect, useMemo, useState } from "react";
import ListingPageShell from "@/components/layout/ListingPageShell";
import DistrictAreaSelect from "@/components/ui/DistrictAreaSelect";
import EnquiryModal from "@/components/ui/EnquiryModal";
import BannerCarousel from "@/components/ui/BannerCarousel";
import Link from "next/link";
import { MapPin, Phone, Package, Check, Search, ArrowLeft } from "lucide-react";
import {
  MATERIAL_CATEGORIES,
  DISTRICT_FILTER_ALL,
  materialCategoryLabel,
} from "@/lib/mock-data";

const MATERIALS_BANNER_SLIDES = [
  { src: "/banners/banner-cement.png", alt: "Lowest prices on cement — best rates in your area" },
  { src: "/banners/banner-tmt.png", alt: "Best prices on TMT — best rates in your area" },
  { src: "/banners/banner-paint.png", alt: "Best prices on paint — best rates in your area" },
  { src: "/banners/banner-bricks.png", alt: "Best prices on bricks — best rates in your area" },
];

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

function CategoryImage({ src, alt, emoji }: { src: string; alt: string; emoji: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-5xl" aria-hidden="true">
          {emoji}
        </span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      style={{ mixBlendMode: "multiply" }}
      className="absolute inset-0 w-full h-full object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-105"
    />
  );
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
      hideSearch
      hideHeader
    >
      <div className="page-container py-6">
        <Link
          href="/"
          aria-label="Back"
          className="inline-flex items-center gap-1.5 text-sm text-cement-600 hover:text-cement-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <BannerCarousel slides={MATERIALS_BANNER_SLIDES} className="mb-6" />

        <div className="mb-4 flex justify-end">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cement-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, category, unit…"
              aria-label="Search materials"
              className="w-full bg-white border border-cement-200 text-cement-900 placeholder-cement-400 rounded-xl pl-9 pr-3 py-2.5 text-sm shadow-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        <div className="mb-6">
          <div
            className="grid grid-cols-10 gap-2 sm:gap-3 md:gap-[15px] w-full"
            role="tablist"
            aria-label="Material categories"
          >
            {[
              { key: "ALL", label: "All", emoji: "🏠", image: null as string | null },
              ...MATERIAL_CATEGORIES,
            ].map((c) => {
              const active = cat === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Filter by ${c.label}`}
                  onClick={() => setCat(c.key)}
                  className="group flex w-full min-w-0 flex-col items-center gap-1.5 sm:gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                >
                  <div
                    className={`relative w-full aspect-square overflow-hidden transition-all duration-300 ease-out ${
                      active
                        ? "bg-[#CFE3DD] scale-[1.02]"
                        : "bg-[#E0EDE8] group-hover:bg-[#D2E2DC]"
                    }`}
                  >
                    {c.image ? (
                      <CategoryImage src={c.image} alt={c.label} emoji={c.emoji} />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110">
                        <span className="text-5xl" aria-hidden="true">
                          {c.emoji}
                        </span>
                      </div>
                    )}
                    {active && (
                      <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-md">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs md:text-sm leading-tight text-center truncate w-full transition-colors ${
                      active
                        ? "text-brand-700 font-semibold"
                        : "text-cement-700 font-medium group-hover:text-cement-900"
                    }`}
                  >
                    {c.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

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
