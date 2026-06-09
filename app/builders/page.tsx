"use client";

import { useState } from "react";
import ListingPageShell from "@/components/layout/ListingPageShell";
import DistrictAreaSearch from "@/components/ui/DistrictAreaSearch";
import EnquiryModal from "@/components/ui/EnquiryModal";
import BannerCarousel from "@/components/ui/BannerCarousel";
import {
  MapPin,
  Star,
  Phone,
  Briefcase,
  CheckCircle,
  Search,
  Check,
} from "lucide-react";
import { BUILDERS, DISTRICT_FILTER_ALL, formatLocationLine } from "@/lib/mock-data";
import { matchesAreaFilter, matchesLocationSearch } from "@/lib/location-filters";

type ExpertType = {
  key: string;
  label: string;
  emoji: string;
  image: string | null;
};

const TYPES: ExpertType[] = [
  {
    key: "All",
    label: "All",
    emoji: "👥",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6-tAqxu6dU86-vBN7I8HXfs-EUMFRcNOAWA&s",
  },
  {
    key: "Builder",
    label: "Builder",
    emoji: "👷",
    image:
      "https://img.magnific.com/free-photo/workman-with-his-arms-crossed-white-background_1368-5759.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    key: "Architect",
    label: "Architect",
    emoji: "📐",
    image:
      "https://img.magnific.com/free-photo/young-engineer-smiling-holding-white-safety-hat-by-hand_7502-5405.jpg",
  },
  {
    key: "Engineer",
    label: "Engineer",
    emoji: "⚙️",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSraUxswtFrtyXn2Dh1kKjqG6mY8lUX6bJMOQ&s",
  },
];

const BUILDERS_BANNER_SLIDES = [
  { src: "/banners/banner-builder.png", alt: "Best — Build with confidence — premium materials & expert advice" },
  { src: "/banners/banner-architect.png", alt: "Best — Design with precision — architectural planning & visualisation" },
  { src: "/banners/banner-engineer.png", alt: "Engineer — Execute with confidence — structural strength & project management" },
];

function ExpertImage({ src, alt, emoji }: { src: string; alt: string; emoji: string }) {
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

export default function BuildersPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [district, setDistrict] = useState<string>(DISTRICT_FILTER_ALL);
  const [area, setArea] = useState("All Areas");
  const [enquiry, setEnquiry] = useState<string | null>(null);

  const filtered = BUILDERS.filter((b) => {
    const matchSearch =
      b.companyName.toLowerCase().includes(search.toLowerCase()) ||
      b.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchType = type === "All" || b.type === type;
    const matchDistrict = district === DISTRICT_FILTER_ALL || b.district === district;
    const matchArea = area === "All Areas" || b.area === area;
    return matchSearch && matchType && matchDistrict && matchArea;
  });

  return (
    <ListingPageShell
      title="Kattadam Experts"
      searchPlaceholder="Search name, area, PIN…"
      search={search}
      onSearchChange={setSearch}
      hideSearch
      hideHeader
    >
      <div className="page-container pt-0 pb-6">
        <BannerCarousel slides={BUILDERS_BANNER_SLIDES} className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen mb-6" />

        <div className="mb-4 flex justify-end">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cement-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, area, PIN…"
              aria-label="Search experts"
              className="w-full bg-white border border-cement-200 text-cement-900 placeholder-cement-400 rounded-xl pl-9 pr-3 py-2.5 text-sm shadow-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        <div className="mb-6">
          <div
            className="flex flex-wrap justify-center gap-2.5 sm:gap-[15px]"
            role="tablist"
            aria-label="Expert types"
          >
            {TYPES.map((t) => {
              const active = type === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Filter by ${t.label}`}
                  onClick={() => {
                    setType(t.key);
                    setEnquiry(t.label);
                  }}
                  className="group flex w-[78px] sm:w-[120px] flex-col items-center gap-1.5 sm:gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                >
                  <div
                    className={`relative w-[78px] h-[78px] sm:w-[120px] sm:h-[120px] overflow-hidden transition-all duration-300 ease-out ${
                      active
                        ? "bg-[#CFE3DD] scale-[1.02]"
                        : "bg-[#E0EDE8] group-hover:bg-[#D2E2DC]"
                    }`}
                  >
                    {t.image ? (
                      <ExpertImage src={t.image} alt={t.label} emoji={t.emoji} />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110">
                        <span className="text-4xl sm:text-5xl" aria-hidden="true">
                          {t.emoji}
                        </span>
                      </div>
                    )}
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
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <p className="text-sm text-earth-500">
            <span className="font-semibold text-earth-900">{filtered.length}</span> found
          </p>
          <DistrictAreaSearch
            district={district}
            onDistrictChange={setDistrict}
            area={area}
            onAreaChange={setArea}
          />
        </div>

        <div className="space-y-4">
          {filtered.map((b) => (
            <div key={b.id} className="card p-4 sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-earth-900">{b.companyName}</h3>
                    {b.isVerified && (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    )}
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{b.type}</span>
                  </div>
                  <p className="text-sm text-earth-500 mt-0.5">{b.ownerName}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-semibold text-earth-800">{b.rating}</span>
                      <span className="text-xs text-earth-400">({b.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-earth-500">
                      <MapPin className="w-3 h-3" /> {formatLocationLine(b.area, b.district)}
                    </div>
                    <span className="text-xs text-earth-500">{b.experience} yrs exp</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-earth-600 leading-relaxed mb-4">{b.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {b.tags.map((t) => (
                  <span key={t} className="text-xs bg-earth-100 text-earth-600 px-2.5 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>

              <div className="bg-earth-50 rounded-xl p-3 mb-4 space-y-1.5">
                <p className="text-xs font-semibold text-earth-500 uppercase tracking-wider mb-2">Past Projects</p>
                {b.projects.map((p) => (
                  <div key={p.title} className="flex items-center justify-between text-sm">
                    <span className="text-earth-700">{p.title}</span>
                    <span className="text-xs text-earth-400">
                      {p.sqft.toLocaleString()} sq.ft · {p.year}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setEnquiry(b.companyName)}
                className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm"
              >
                <Phone className="w-4 h-4" /> Get Quote
              </button>
            </div>
          ))}
        </div>
      </div>

      {enquiry && <EnquiryModal target={enquiry} onClose={() => setEnquiry(null)} />}
    </ListingPageShell>
  );
}
