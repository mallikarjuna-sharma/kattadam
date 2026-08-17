"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import ListingPageShell from "@/components/layout/ListingPageShell";
import DistrictAreaSearch from "@/components/ui/DistrictAreaSearch";
import EnquiryModal from "@/components/ui/EnquiryModal";
import BannerCarousel from "@/components/ui/BannerCarousel";
import {
  MapPin,
  Phone,
  Home,
  BedDouble,
  Bath,
  Maximize2,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  PROPERTIES,
  formatPrice,
  formatLocationLine,
  normalizeAreaName,
  parseLocationToAreaDistrict,
  DISTRICTS,
  DISTRICT_FILTER_ALL,
  type District,
  type PropertyListingSubtype,
} from "@/lib/mock-data";
import { matchesAreaFilter, matchesLocationSearch } from "@/lib/location-filters";

const PROPERTY_BANNER_SLIDES = [
  {
    src: "/banners/banner-property-home.png",
    alt: "Home buy — secure your future — best price · safety house · peace of mind",
  },
];

const TYPES = ["All", "SELL", "RENT"] as const;
type TypeKey = (typeof TYPES)[number];
const TYPE_META: Record<TypeKey, { label: string; emoji: string; image: string }> = {
  All: {
    label: "All",
    emoji: "🏘️",
    image:
      "https://png.pngtree.com/png-clipart/20241005/original/pngtree-home-buyers-meet-and-negotiate-with-real-estate-agents-about-renting-png-image_16201107.png",
  },
  SELL: {
    label: "Buy",
    emoji: "🏷️",
    image:
      "https://png.pngtree.com/png-vector/20231116/ourmid/pngtree-real-estate-agent-transparent-background-png-image_10613803.png",
  },
  RENT: {
    label: "Rent",
    emoji: "🔑",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTldujQGIRWkzcCAv58yDSxlOvWggdW9eKV2A&s",
  },
};

const BUY_SUB = ["All", "Flat", "Plot"] as const;
const RENT_SUB = ["All", "Flat", "Empty land"] as const;

function PropertyTypeImage({
  src,
  alt,
  emoji,
}: {
  src: string;
  alt: string;
  emoji: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl sm:text-5xl" aria-hidden="true">
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
      className="absolute inset-0 w-full h-full object-contain p-1 transition-transform duration-500 ease-out group-hover:scale-105"
    />
  );
}

type PropertyCard = Omit<(typeof PROPERTIES)[number], "district" | "listingSubtype"> & {
  district: District;
  listingSubtype: PropertyListingSubtype;
};

function mapApiListing(p: {
  id: string;
  title: string;
  listingType: string;
  propertySubtype: string;
  price: number;
  district: string;
  area: string;
}): PropertyCard {
  const d = (DISTRICTS as readonly string[]).includes(p.district)
    ? (p.district as District)
    : "Coimbatore";
  return {
    id: p.id,
    title: p.title,
    type: p.listingType === "RENT" ? "RENT" : "SELL",
    listingSubtype: p.propertySubtype as PropertyListingSubtype,
    price: p.price,
    area: 0,
    bedrooms: null,
    bathrooms: null,
    district: d,
    location: formatLocationLine(p.area, p.district),
    postedBy: "Kattadam listing",
    daysAgo: 0,
    tag: "Listed",
  };
}

export default function PropertiesPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<(typeof TYPES)[number]>("All");
  const [subtype, setSubtype] = useState<string>("All");
  const [district, setDistrict] = useState<string>(DISTRICT_FILTER_ALL);
  const [area, setArea] = useState("All Areas");
  const [enquiry, setEnquiry] = useState<string | null>(null);
  const [apiExtras, setApiExtras] = useState<PropertyCard[]>([]);

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const timer = setTimeout(checkScroll, 100);
    const el = categoryScrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
        clearTimeout(timer);
      };
    }
  }, []);

  const scrollCategories = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({ left: direction === "left" ? -280 : 280, behavior: "smooth" });
    }
  };

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1000);

    (async () => {
      try {
        const res = await fetch("/api/catalog/properties", { signal: controller.signal });
        clearTimeout(timer);
        const j = await res.json();
        if (cancelled || !j?.configured || j?.source !== "live" || !Array.isArray(j.listings)) return;
        setApiExtras(j.listings.map(mapApiListing));
      } catch {
        /* mock fallback */
      }
    })();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    setSubtype("All");
  }, [type]);

  const allListings = useMemo(() => {
    const seen = new Set<string>();
    const out: PropertyCard[] = [];
    for (const p of [...apiExtras, ...PROPERTIES]) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      out.push(p);
    }
    return out;
  }, [apiExtras]);

  const subtypeOptions = type === "RENT" ? RENT_SUB : type === "SELL" ? BUY_SUB : null;

  const filtered = allListings.filter((p) => {
    const locality = normalizeAreaName(parseLocationToAreaDistrict(p.location).area);
    const matchSearch = matchesLocationSearch(search, locality, [p.title, p.location, p.district]);
    const matchType = type === "All" || p.type === type;
    const matchDistrict = district === DISTRICT_FILTER_ALL || p.district === district;
    const matchArea = matchesAreaFilter(area, locality);
    const matchSubtype =
      !subtypeOptions || subtype === "All" || p.listingSubtype === subtype || type === "All";
    return matchSearch && matchType && matchDistrict && matchArea && matchSubtype;
  });

  return (
    <ListingPageShell
      title="Real estate"
      searchPlaceholder="Search by area, PIN, title…"
      search={search}
      onSearchChange={setSearch}
      hideSearch
      hideHeader
    >
      <div className="page-container pt-0 pb-6">
        <BannerCarousel slides={PROPERTY_BANNER_SLIDES} className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen mb-6" />

        {/* Category Tabs Carousel */}
        <div className="relative mb-4 px-10 md:px-12">
          <button
            type="button"
            onClick={() => scrollCategories("left")}
            className={`hidden md:flex absolute left-0 top-[44px] -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-cement-200 dark:border-white/10 shadow-lg items-center justify-center text-cement-700 dark:text-zinc-200 hover:text-primary hover:scale-110 transition-all duration-200 ${
              canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={categoryScrollRef}
            className="flex items-center gap-3 overflow-x-auto scrollbar-none py-4 px-2 scroll-smooth"
            role="tablist"
            aria-label="Listing types"
          >
            <div className="w-1.5 shrink-0" aria-hidden="true" />
            {TYPES.map((t) => {
              const meta = TYPE_META[t];
              const active = type === t;
              return (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Filter by ${meta.label}`}
                  onClick={() => setType(t)}
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
                      <PropertyTypeImage src={meta.image} alt={meta.label} emoji={meta.emoji} />
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
                        ? "text-primary font-bold"
                        : "text-cement-700 dark:text-zinc-300 font-medium group-hover:text-cement-900 dark:group-hover:text-white"
                    }`}
                  >
                    {meta.label}
                  </span>
                </button>
              );
            })}
            <div className="w-1.5 shrink-0" aria-hidden="true" />
          </div>

          <button
            type="button"
            onClick={() => scrollCategories("right")}
            className={`hidden md:flex absolute right-0 top-[44px] -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-cement-200 dark:border-white/10 shadow-lg items-center justify-center text-cement-700 dark:text-zinc-200 hover:text-primary hover:scale-110 transition-all duration-200 ${
              canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          {subtypeOptions && type !== "All" ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-cement-500 dark:text-zinc-500 uppercase tracking-wider w-full sm:w-auto">
                {type === "SELL" ? "Buy" : "Rent"} · type
              </span>
              {subtypeOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubtype(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    subtype === s
                      ? "bg-cement-900 dark:bg-white text-white dark:text-cement-900 border-cement-900 dark:border-white"
                      : "bg-white dark:bg-white/5 text-cement-600 dark:text-zinc-300 border-cement-200 dark:border-white/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          ) : <div />}
          <DistrictAreaSearch
            district={district}
            onDistrictChange={setDistrict}
            area={area}
            onAreaChange={setArea}
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by area, PIN, title…"
          />
        </div>

        <p className="text-sm text-cement-500 dark:text-zinc-400 mb-5">
          <span className="font-semibold text-cement-900 dark:text-white">{filtered.length}</span> listings found
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-card text-card-foreground rounded-3xl border border-border/80 dark:border-zinc-800 overflow-hidden shadow-[6px_6px_20px_rgba(0,0,0,0.08)] dark:shadow-[6px_6px_25px_rgba(0,0,0,0.9)] hover:shadow-[8px_8px_25px_rgba(34,197,94,0.25)] dark:hover:shadow-[8px_8px_30px_rgba(74,222,128,0.35)] hover:border-primary/60 dark:hover:border-primary/60 hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group/card"
            >
              <div>
                <div className="h-44 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-zinc-800 dark:to-zinc-900 relative flex items-center justify-center border-b border-border/40">
                  <Home className="w-12 h-12 text-slate-400 dark:text-zinc-600" />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm ${
                        p.type === "RENT"
                          ? "bg-blue-600 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {p.type === "RENT" ? "RENT" : "SALE"}
                    </span>
                    <span className="text-[11px] font-bold bg-zinc-900/80 dark:bg-zinc-800/90 text-white dark:text-zinc-200 px-2.5 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">
                      {p.listingSubtype}
                    </span>
                    {p.tag && (
                      <span className="text-[11px] font-extrabold bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full shadow-sm">
                        {p.tag}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-foreground dark:text-white text-base sm:text-lg mb-1.5 leading-snug truncate">
                    {p.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300 text-xs font-medium mb-3">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />{" "}
                    {formatLocationLine(
                      normalizeAreaName(parseLocationToAreaDistrict(p.location).area),
                      p.district
                    )}
                  </div>

                  {(p.bedrooms || p.area) && (
                    <div className="flex items-center gap-3 text-xs text-zinc-700 dark:text-zinc-200 font-semibold mb-4 bg-muted/40 dark:bg-zinc-800/60 p-2.5 rounded-2xl border border-border/40 dark:border-zinc-700/50">
                      {p.bedrooms != null && p.bedrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <BedDouble className="w-3.5 h-3.5 text-primary" /> {p.bedrooms} BHK
                        </span>
                      )}
                      {p.bathrooms != null && p.bathrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5 text-primary" /> {p.bathrooms} Bath
                        </span>
                      )}
                      {p.area > 0 && (
                        <span className="flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5 text-primary" /> {p.area.toLocaleString()} sq.ft
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-end justify-between gap-2 pt-1">
                    <div className="min-w-0">
                      <div className="text-xl sm:text-2xl font-extrabold text-primary leading-tight">
                        {formatPrice(p.price, p.type)}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">
                        {p.daysAgo === 0 ? "Just listed" : p.daysAgo === 1 ? "1 day ago" : `${p.daysAgo} days ago`} ·{" "}
                        {p.postedBy}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-0">
                <button
                  type="button"
                  onClick={() => setEnquiry(p.title)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-primary text-primary-foreground font-extrabold text-sm hover:bg-[#5ee06a] hover:scale-[1.01] active:scale-95 transition-all shadow-md shadow-primary/20"
                >
                  <Phone className="w-4 h-4 fill-current" /> Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {enquiry && <EnquiryModal target={enquiry} onClose={() => setEnquiry(null)} />}
    </ListingPageShell>
  );
}
