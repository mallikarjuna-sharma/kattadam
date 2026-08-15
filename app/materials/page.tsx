"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ListingPageShell from "@/components/layout/ListingPageShell";
import DistrictAreaSearch from "@/components/ui/DistrictAreaSearch";
import EnquiryModal from "@/components/ui/EnquiryModal";
import BannerCarousel from "@/components/ui/BannerCarousel";
import { MapPin, Phone, Package, Check, Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  MATERIAL_CATEGORIES,
  DISTRICT_FILTER_ALL,
  formatAreaWithPin,
  materialCategoryLabel,
} from "@/lib/mock-data";
import { matchesAreaFilter, matchesLocationSearch } from "@/lib/location-filters";

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
  dealerId?: string | null;
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
        <span className="text-3xl sm:text-4xl" aria-hidden="true">
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
      className="absolute inset-0 w-full h-full object-contain p-1 transition-transform duration-500 ease-out group-hover:scale-110"
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
    dealerId?: string;
  } | null>(null);
  const [catalogMaterials, setCatalogMaterials] = useState<ApiCatalogMaterial[]>([]);
  const [listStatus, setListStatus] = useState<"live" | "empty" | "error">("empty");
  const [errorHint, setErrorHint] = useState<string | null>(null);

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      setCanScrollLeft(scrollLeft > 20);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 20);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = categoryScrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
      // Run once more after a short delay to catch layout shifts
      const timer = setTimeout(checkScroll, 100);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
        clearTimeout(timer);
      };
    }
  }, []);

  const scrollCategories = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const amount = direction === "left" ? -280 : 280;
      categoryScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1000);

    (async () => {
      try {
        const matRes = await fetch("/api/catalog/materials", { signal: controller.signal });
        clearTimeout(timer);
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
          setListStatus("empty");
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
          setListStatus("empty");
          setErrorHint(null);
        }
      }
    })();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  const filteredMaterials = useMemo(() => {
    return catalogMaterials.filter((m) => {
      const matchCat = cat === "ALL" || normalizeCategoryKey(m.category) === cat;
      const matchDistrict = district === DISTRICT_FILTER_ALL || (m.district ?? "") === district;
      const matchArea = matchesAreaFilter(area, m.area);
      const matchSearch = matchesLocationSearch(search, m.area, [
        m.name,
        m.category,
        m.subcategory ?? "",
        m.unit ?? "",
        m.district ?? "",
      ]);
      return matchCat && matchDistrict && matchArea && matchSearch;
    });
  }, [catalogMaterials, search, cat, district, area]);

  return (
    <ListingPageShell
      title="Materials catalogue"
      searchPlaceholder="Search by name, area, PIN…"
      search={search}
      onSearchChange={setSearch}
      backHref="/"
      hideSearch
      hideHeader
    >
      <div className="page-container pt-0 pb-6">
        <BannerCarousel slides={MATERIALS_BANNER_SLIDES} className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen mb-6" />

        {/* Category Tabs Carousel */}
        <div className="relative mb-6 px-10 md:px-12">
          <button
            type="button"
            onClick={() => scrollCategories("left")}
            className={`hidden md:flex absolute left-0 top-[44px] -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-cement-200 dark:border-white/10 shadow-lg items-center justify-center text-cement-700 dark:text-zinc-200 hover:text-primary dark:hover:text-primary hover:scale-110 transition-all duration-200 ${
              canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={categoryScrollRef}
            className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none py-4 px-2 scroll-smooth"
            role="tablist"
            aria-label="Material categories"
          >
            <div className="w-1.5 shrink-0" aria-hidden="true" />
            {[
              {
                key: "ALL",
                label: "All",
                emoji: "🏠",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvu9U6XYDX4wGGTYIfAtU3NLd6cXqtv7nDEg&s" as string | null,
              },
              ...MATERIAL_CATEGORIES,
            ].map((c) => {
              const active = cat === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={
                    c.key === "ALL"
                      ? "Show all materials"
                      : `Filter by ${c.label}`
                  }
                  onClick={() => {
                    setCat(c.key);
                  }}
                  className="group flex flex-col items-center gap-2 shrink-0 w-20 sm:w-24 focus:outline-none"
                >
                  <div
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-2xl transition-all duration-300 ease-out border-2 p-1.5 ${
                      active
                        ? "bg-white dark:bg-zinc-800 border-primary shadow-md shadow-primary/20 ring-2 ring-primary/20"
                        : "bg-white dark:bg-zinc-900 border-cement-200 dark:border-white/10 group-hover:border-primary/50"
                    }`}
                  >
                    <div
                      className={`relative w-full h-full rounded-xl bg-slate-50 dark:bg-zinc-800/80 overflow-hidden flex items-center justify-center transition-transform duration-300 ${
                        active ? "scale-105" : "group-hover:scale-105"
                      }`}
                    >
                      {c.image ? (
                        <CategoryImage src={c.image} alt={c.label} emoji={c.emoji} />
                      ) : (
                        <span className="text-3xl sm:text-4xl" aria-hidden="true">
                          {c.emoji}
                        </span>
                      )}
                    </div>
                    {active && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md z-10">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-xs leading-tight text-center truncate w-full transition-colors ${
                      active
                        ? "text-primary dark:text-primary font-bold"
                        : "text-cement-700 dark:text-zinc-300 font-medium group-hover:text-cement-900 dark:group-hover:text-white"
                    }`}
                  >
                    {c.label}
                  </span>
                </button>
              );
            })}
            <div className="w-1.5 shrink-0" aria-hidden="true" />
          </div>

          <button
            type="button"
            onClick={() => scrollCategories("right")}
            className={`hidden md:flex absolute right-0 top-[44px] -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-cement-200 dark:border-white/10 shadow-lg items-center justify-center text-cement-700 dark:text-zinc-200 hover:text-primary dark:hover:text-primary hover:scale-110 transition-all duration-200 ${
              canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {listStatus === "error" && (
          <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-900 dark:text-red-300 mb-6">
            Could not load the catalogue.{errorHint ? ` ${errorHint}` : ""}
          </div>
        )}

        {(listStatus === "live" || listStatus === "empty") && (
          <>
            {/* Unified Filter Bar: Search + District + Area */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
              <p className="text-sm text-cement-500 dark:text-zinc-400 shrink-0">
                <span className="font-semibold text-cement-900 dark:text-white">{filteredMaterials.length}</span>
                {listStatus === "live" ? " materials match filters" : " materials"}
              </p>
              <DistrictAreaSearch
                district={district}
                onDistrictChange={setDistrict}
                area={area}
                onAreaChange={setArea}
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search by name, area, PIN…"
              />
            </div>

            <p className="text-xs text-cement-500 dark:text-zinc-500 mb-4">Listed items and prices come from Admin → Materials.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredMaterials.map((m) => {
                const priceLabel = formatMaterialPrice(m);
                const catLabel = materialCategoryLabel(m.category);
                return (
                  <div
                    key={m.id}
                    className="bg-card text-card-foreground rounded-3xl border border-border/80 dark:border-zinc-800 p-5 sm:p-6 shadow-[6px_6px_20px_rgba(0,0,0,0.08)] dark:shadow-[6px_6px_25px_rgba(0,0,0,0.9)] hover:shadow-[8px_8px_25px_rgba(34,197,94,0.25)] dark:hover:shadow-[8px_8px_30px_rgba(74,222,128,0.35)] hover:border-primary/60 dark:hover:border-primary/60 hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group/card"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-primary/20">
                            <Package className="w-6 h-6 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-foreground dark:text-white text-base sm:text-lg leading-snug truncate">{m.name}</h3>
                            <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300 text-xs mt-1 font-medium">
                              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
                              {formatAreaWithPin(m.area)}, {m.district || "—"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-xl sm:text-2xl font-extrabold text-primary leading-tight">{priceLabel}</div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-5">
                        <span className="text-[11px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
                          {catLabel}
                        </span>
                        {m.subcategory ? (
                          <span className="text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700">
                            {m.subcategory}
                          </span>
                        ) : null}
                        {m.unit ? (
                          <span className="text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700">
                            Unit: {m.unit}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setEnquiryOpen({
                          target: m.name,
                          materialId: m.id,
                          ...(m.dealerId ? { dealerId: m.dealerId } : {}),
                        })
                      }
                      className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-primary text-primary-foreground font-extrabold text-sm hover:bg-[#5ee06a] hover:scale-[1.01] active:scale-95 transition-all shadow-md shadow-primary/20"
                    >
                      <Phone className="w-4 h-4 fill-current" /> Send Enquiry
                    </button>
                  </div>
                );
              })}
            </div>

            {listStatus === "empty" && (
              <div className="text-center py-14 card p-8">
                <Package className="w-12 h-12 text-cement-300 mx-auto mb-3" />
                <p className="text-cement-600 font-medium">No materials yet</p>
                <p className="text-sm text-cement-500 mt-1">Materials will appear here once they are available.</p>
              </div>
            )}

            {listStatus === "live" && filteredMaterials.length === 0 && (
              <div className="text-center py-16 card p-8">
                <Package className="w-12 h-12 text-cement-300 mx-auto mb-3" />
                <p className="text-cement-600 font-medium">No materials match your filters</p>
                <p className="text-sm text-cement-500 mt-1">Try another category, district, or search.</p>
              </div>
            )}
          </>
        )}
      </div>

      {enquiryOpen && (
        <EnquiryModal
          target={enquiryOpen.target}
          materialId={enquiryOpen.materialId}
          dealerId={enquiryOpen.dealerId}
          onClose={() => setEnquiryOpen(null)}
        />
      )}
    </ListingPageShell>
  );
}
