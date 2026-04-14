"use client";

import { useEffect, useMemo, useState } from "react";
import ListingPageShell from "@/components/layout/ListingPageShell";
import DistrictAreaSelect from "@/components/ui/DistrictAreaSelect";
import EnquiryModal from "@/components/ui/EnquiryModal";
import { MapPin, Star, Phone, Package, CheckCircle } from "lucide-react";
import {
  DEALERS,
  MATERIAL_CATEGORIES,
  DISTRICT_FILTER_ALL,
  parseLocationToAreaDistrict,
} from "@/lib/mock-data";

type ApiCatalogMaterial = {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  unit: string | null;
  pricingType: "fixed" | "dealer_quote";
  fixedPrice: number | null;
};

type DealerCard = {
  id: string;
  shopName: string;
  district: string;
  area: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  categories: string[];
  /** Normalized keys (e.g. PAINT) for chip filters — includes categories from merged catalogue rows */
  filterCategoryKeys: string[];
  phone: string;
  materials: { name: string; price: string; inStock: boolean }[];
};

function normalizeCategoryKey(label: string): string {
  return label.trim().toUpperCase().replace(/\s+/g, "_");
}

function buildDealerMaterialLines(
  dealerTags: string[],
  catalog: ApiCatalogMaterial[]
): { name: string; price: string; inStock: boolean }[] {
  const lines = new Map<string, { name: string; price: string; inStock: boolean }>();
  const tagsLower = dealerTags.map((t) => t.toLowerCase());

  for (const m of catalog) {
    const catLower = m.category.trim().toLowerCase();
    if (!tagsLower.includes(catLower)) continue;
    const price =
      m.pricingType === "fixed" && m.fixedPrice != null && Number.isFinite(m.fixedPrice)
        ? `₹${m.fixedPrice}${m.unit ? `/${m.unit}` : ""}`
        : "Ask for quote";
    lines.set(m.id, { name: m.name, price, inStock: true });
  }

  for (const tag of dealerTags) {
    const t = tag.trim();
    if (!t) continue;
    const hasCatalogForTag = catalog.some((m) => m.category.trim().toLowerCase() === t.toLowerCase());
    if (!hasCatalogForTag) {
      lines.set(`tag:${t}`, { name: t, price: "Ask for quote", inStock: true });
    }
  }

  return [...lines.values()];
}

function mapApiDealer(
  d: {
    id: string;
    shopName: string;
    location: string | null;
    rating: number;
    verified: boolean;
    materials: string[];
    phone: string | null;
  },
  catalog: ApiCatalogMaterial[]
): DealerCard {
  const { area, district } = parseLocationToAreaDistrict(d.location);
  const dealerTags = (d.materials ?? []).map((x) => String(x).trim()).filter(Boolean);
  const materialLines = buildDealerMaterialLines(dealerTags, catalog);

  const matchedCatalogCategories = catalog
    .filter((m) => dealerTags.some((t) => t.toLowerCase() === m.category.trim().toLowerCase()))
    .map((m) => m.category.trim());
  const displayCategories = [...new Set([...dealerTags, ...matchedCatalogCategories])].slice(0, 8);

  const filterCategoryKeys = [
    ...new Set([...dealerTags.map(normalizeCategoryKey), ...matchedCatalogCategories.map(normalizeCategoryKey)]),
  ];

  return {
    id: d.id,
    shopName: d.shopName,
    district,
    area,
    rating: d.rating,
    reviewCount: 0,
    isVerified: d.verified,
    categories: displayCategories.length > 0 ? displayCategories : ["Materials"],
    filterCategoryKeys: filterCategoryKeys.length > 0 ? filterCategoryKeys : [normalizeCategoryKey("Materials")],
    phone: d.phone ?? "",
    materials: materialLines.length > 0 ? materialLines : [{ name: "Materials", price: "Ask for quote", inStock: true }],
  };
}

function mockDealerToCard(d: (typeof DEALERS)[number]): DealerCard {
  return {
    id: d.id,
    shopName: d.shopName,
    district: d.district,
    area: d.area,
    rating: d.rating,
    reviewCount: d.reviewCount,
    isVerified: d.isVerified,
    categories: d.categories,
    filterCategoryKeys: d.categories.map(normalizeCategoryKey),
    phone: d.phone,
    materials: d.materials,
  };
}

export default function MaterialsPage() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("ALL");
  const [district, setDistrict] = useState<string>(DISTRICT_FILTER_ALL);
  const [area, setArea] = useState("All Areas");
  const [enquiryOpen, setEnquiryOpen] = useState<{ target: string; dealerId?: string } | null>(null);
  const [dealers, setDealers] = useState<DealerCard[]>(() => DEALERS.map(mockDealerToCard));
  const [catalogMaterials, setCatalogMaterials] = useState<ApiCatalogMaterial[]>([]);
  const [catalogSource, setCatalogSource] = useState<"mock" | "live">("mock");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [dealerRes, matRes] = await Promise.all([
          fetch("/api/catalog/dealers"),
          fetch("/api/catalog/materials"),
        ]);
        const dealerJson = await dealerRes.json();
        const matJson = await matRes.json();
        if (cancelled) return;

        const mats: ApiCatalogMaterial[] =
          matJson?.source === "live" && Array.isArray(matJson.materials) ? matJson.materials : [];
        if (mats.length > 0) setCatalogMaterials(mats);

        const dealersLive = dealerJson?.dealers?.length > 0 && dealerJson.source === "live";
        const materialsLive = matJson?.source === "live";

        if (dealersLive) {
          setDealers(dealerJson.dealers.map((row: Parameters<typeof mapApiDealer>[0]) => mapApiDealer(row, mats)));
        }
        if (dealersLive || (materialsLive && mats.length > 0)) {
          setCatalogSource("live");
        }
      } catch {
        /* keep mock */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCatalogMaterials = useMemo(() => {
    const q = search.toLowerCase();
    return catalogMaterials.filter((m) => {
      const matchCat = cat === "ALL" || normalizeCategoryKey(m.category) === cat;
      const matchSearch = !q || m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [catalogMaterials, search, cat]);

  const filtered = useMemo(() => {
    return dealers.filter((d) => {
      const matchSearch =
        d.shopName.toLowerCase().includes(search.toLowerCase()) ||
        d.materials.some((m) => m.name.toLowerCase().includes(search.toLowerCase()));
      const matchCat = cat === "ALL" || d.filterCategoryKeys.includes(cat);
      const matchDistrict = district === DISTRICT_FILTER_ALL || d.district === district;
      const matchArea = area === "All Areas" || d.area === area;
      return matchSearch && matchCat && matchDistrict && matchArea;
    });
  }, [dealers, search, cat, district, area]);

  return (
    <ListingPageShell
      title="Construction Materials"
      searchPlaceholder="Search cement, steel, bricks…"
      search={search}
      onSearchChange={setSearch}
      backHref="/"
    >
      <div className="page-container py-6">
        {catalogSource === "live" && (
          <p className="text-xs text-brand-700 bg-brand-50 border border-brand-100 rounded-lg px-3 py-2 mb-4">
            Showing live catalogue from KATTADAM database. Admin materials appear below and under dealers whose tags
            match the material category (e.g. tag &quot;Paint&quot; for category Paint).
          </p>
        )}
        {catalogSource === "live" && filteredCatalogMaterials.length > 0 && (
          <div className="mb-6 rounded-xl border border-cement-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-cement-900 mb-2">Materials catalogue</h2>
            <p className="text-xs text-cement-500 mb-3">
              Items you add in Admin → Materials. Dealers list these when their material tags include the same category
              name.
            </p>
            <ul className="divide-y divide-cement-100 max-h-48 overflow-y-auto">
              {filteredCatalogMaterials.map((m) => (
                <li key={m.id} className="py-2 flex flex-wrap items-baseline justify-between gap-2 text-sm">
                  <span className="text-cement-800 font-medium">{m.name}</span>
                  <span className="text-xs text-cement-500">
                    {m.category}
                    {m.unit ? ` · ${m.unit}` : ""}
                    {m.pricingType === "fixed" && m.fixedPrice != null && Number.isFinite(m.fixedPrice)
                      ? ` · ₹${m.fixedPrice}`
                      : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <p className="text-sm text-cement-500">
            <span className="font-semibold text-cement-900">{filtered.length}</span> dealers found
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

        <div className="space-y-4">
          {filtered.map((dealer) => (
            <div key={dealer.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-cement-900">{dealer.shopName}</h3>
                      {dealer.isVerified && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-cement-500 text-xs mt-0.5">
                      <MapPin className="w-3 h-3" /> {dealer.area}, {dealer.district}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold text-cement-800">{dealer.rating}</span>
                  <span className="text-xs text-cement-400">({dealer.reviewCount})</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {dealer.categories.map((c) => (
                    <span key={c} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-cement-50 rounded-xl p-3 space-y-2 mb-4">
                {dealer.materials.map((m) => (
                  <div key={m.name} className="flex items-center justify-between text-sm">
                    <span className="text-cement-600">{m.name}</span>
                    <div className="flex items-center gap-2">
                      {!m.inStock && <span className="text-xs text-red-500">Out of stock</span>}
                      <span className="font-semibold text-cement-900">{m.price}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setEnquiryOpen({ target: dealer.shopName, dealerId: dealer.id })}
                className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm"
              >
                <Phone className="w-4 h-4" /> Send Enquiry
              </button>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-cement-300 mx-auto mb-3" />
              <p className="text-cement-500">No dealers found. Try a different filter.</p>
            </div>
          )}
        </div>
      </div>

      {enquiryOpen && (
        <EnquiryModal
          target={enquiryOpen.target}
          dealerId={enquiryOpen.dealerId}
          onClose={() => setEnquiryOpen(null)}
        />
      )}
    </ListingPageShell>
  );
}
