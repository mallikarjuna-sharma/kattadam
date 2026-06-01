"use client";

import { useEffect, useMemo, useState } from "react";
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
  Search,
  Check,
} from "lucide-react";
import {
  PROPERTIES,
  formatPrice,
  DISTRICT_FILTER_ALL,
  type District,
  type PropertyListingSubtype,
} from "@/lib/mock-data";

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
      className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
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
  const d = (["Coimbatore", "Tirupur", "Erode", "Namakkal", "Salem"] as const).includes(p.district as District)
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
    location: `${p.area}, ${p.district}`,
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/catalog/properties");
        const j = await res.json();
        if (cancelled || !j?.configured || j?.source !== "live" || !Array.isArray(j.listings)) return;
        setApiExtras(j.listings.map(mapApiListing));
      } catch {
        /* mock only */
      }
    })();
    return () => {
      cancelled = true;
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
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchType = type === "All" || p.type === type;
    const matchDistrict = district === DISTRICT_FILTER_ALL || p.district === district;
    const locality = p.location.split(",")[0]?.trim() ?? "";
    const matchArea = area === "All Areas" || locality === area;
    const matchSubtype =
      !subtypeOptions || subtype === "All" || p.listingSubtype === subtype || type === "All";
    return matchSearch && matchType && matchDistrict && matchArea && matchSubtype;
  });

  return (
    <ListingPageShell
      title="Real estate"
      searchPlaceholder="Search by area, title…"
      search={search}
      onSearchChange={setSearch}
      hideSearch
      hideHeader
    >
      <div className="page-container pt-0 pb-6">
        <BannerCarousel slides={PROPERTY_BANNER_SLIDES} className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen mb-6" />

        <div className="mb-4 flex justify-end">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cement-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by area, title…"
              aria-label="Search properties"
              className="w-full bg-white border border-cement-200 text-cement-900 placeholder-cement-400 rounded-xl pl-9 pr-3 py-2.5 text-sm shadow-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-5">
          <div
            className="flex flex-wrap justify-center gap-2.5 sm:gap-[15px]"
            role="tablist"
            aria-label="Listing types"
          >
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
                  onClick={() => {
                    setType(t);
                    setEnquiry(meta.label);
                  }}
                  className="group flex w-[90px] sm:w-[120px] flex-col items-center gap-1.5 sm:gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                >
                  <div
                    className={`relative w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] overflow-hidden transition-all duration-300 ease-out ${
                      active
                        ? "bg-[#CFE3DD] scale-[1.02]"
                        : "bg-[#E0EDE8] group-hover:bg-[#D2E2DC]"
                    }`}
                  >
                    <PropertyTypeImage src={meta.image} alt={meta.label} emoji={meta.emoji} />
                    {active && (
                      <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-md">
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-xs sm:text-sm leading-tight text-center truncate w-full transition-colors ${
                      active
                        ? "text-brand-700 font-semibold"
                        : "text-cement-700 font-medium group-hover:text-cement-900"
                    }`}
                  >
                    {meta.label}
                  </span>
                </button>
              );
            })}
          </div>

          {subtypeOptions && type !== "All" && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-earth-500 uppercase tracking-wider w-full sm:w-auto">
                {type === "SELL" ? "Buy" : "Rent"} · type
              </span>
              {subtypeOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubtype(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    subtype === s
                      ? "bg-earth-900 text-white border-earth-900"
                      : "bg-white text-earth-600 border-earth-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="flex justify-end">
            <DistrictAreaSearch
              district={district}
              onDistrictChange={setDistrict}
              area={area}
              onAreaChange={setArea}
            />
          </div>
        </div>

        <p className="text-sm text-earth-500 mb-5">
          <span className="font-semibold text-earth-900">{filtered.length}</span> listings found
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="card overflow-hidden group">
              <div className="h-44 bg-gradient-to-br from-earth-200 to-earth-300 relative flex items-center justify-center">
                <Home className="w-12 h-12 text-earth-400" />
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span
                    className={`badge font-semibold ${p.type === "RENT" ? "bg-blue-500 text-white" : "bg-green-500 text-white"}`}
                  >
                    {p.type === "RENT" ? "RENT" : "SALE"}
                  </span>
                  <span className="badge bg-cement-800 text-white text-[10px]">{p.listingSubtype}</span>
                  {p.tag && <span className="badge bg-brand-500 text-white">{p.tag}</span>}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-earth-900 mb-1 leading-snug">{p.title}</h3>
                <div className="flex items-center gap-1 text-earth-500 text-xs mb-3">
                  <MapPin className="w-3 h-3" /> {p.location}
                </div>

                {(p.bedrooms || p.area) && (
                  <div className="flex items-center gap-3 text-xs text-earth-500 mb-3">
                    {p.bedrooms != null && p.bedrooms > 0 && (
                      <span className="flex items-center gap-1">
                        <BedDouble className="w-3.5 h-3.5" /> {p.bedrooms} BHK
                      </span>
                    )}
                    {p.bathrooms != null && p.bathrooms > 0 && (
                      <span className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5" /> {p.bathrooms} Bath
                      </span>
                    )}
                    {p.area > 0 && (
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5" /> {p.area.toLocaleString()} sq.ft
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-lg sm:text-xl font-bold text-earth-900">{formatPrice(p.price, p.type)}</div>
                    <div className="text-xs text-earth-400">
                      {p.daysAgo === 0 ? "Just listed" : p.daysAgo === 1 ? "1 day ago" : `${p.daysAgo} days ago`} ·{" "}
                      {p.postedBy}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnquiry(p.title)}
                    className="flex items-center gap-1.5 bg-brand-50 text-brand-600 border border-brand-200 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-brand-100 transition-colors flex-shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5" /> Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {enquiry && <EnquiryModal target={enquiry} onClose={() => setEnquiry(null)} />}
    </ListingPageShell>
  );
}
