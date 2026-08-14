"use client";

import { useEffect, useMemo, useState } from "react";
import ListingPageShell from "@/components/layout/ListingPageShell";
import DistrictAreaSelect from "@/components/ui/DistrictAreaSelect";
import EnquiryModal from "@/components/ui/EnquiryModal";
import { MapPin, Phone, Home, BedDouble, Bath, Maximize2 } from "lucide-react";
import {
  PROPERTIES,
  formatPrice,
  DISTRICT_FILTER_ALL,
  type District,
  type PropertyListingSubtype,
} from "@/lib/mock-data";

const TYPES = ["All", "SELL", "RENT"] as const;
const BUY_SUB = ["All", "Flat", "Plot"] as const;
const RENT_SUB = ["All", "Flat", "Empty land"] as const;

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
    >
      <div className="page-container py-6">
        <div className="flex flex-col gap-4 mb-5">
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  type === t
                    ? "bg-brand-500 text-white border-brand-500"
                    : "bg-white text-earth-600 border-earth-200 hover:border-brand-300"
                }`}
              >
                {t === "All" ? "All" : t === "SELL" ? "Buy" : "Rent"}
              </button>
            ))}
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
            <DistrictAreaSelect
              district={district}
              onDistrictChange={setDistrict}
              area={area}
              onAreaChange={setArea}
              selectClassName="text-sm border border-earth-200 rounded-lg px-3 py-1.5 bg-white text-earth-700 focus:outline-none focus:ring-2 focus:ring-brand-400 min-w-0 sm:min-w-[130px]"
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

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold text-earth-900">{formatPrice(p.price, p.type)}</div>
                    <div className="text-xs text-earth-400">
                      {p.daysAgo === 0 ? "Just listed" : p.daysAgo === 1 ? "1 day ago" : `${p.daysAgo} days ago`} ·{" "}
                      {p.postedBy}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnquiry(p.title)}
                    className="flex items-center gap-1.5 bg-brand-50 text-brand-600 border border-brand-200 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-brand-100 transition-colors"
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
