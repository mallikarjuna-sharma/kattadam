"use client";

import { useState, type ReactNode } from "react";
import ListingPageShell from "@/components/layout/ListingPageShell";
import DistrictAreaSearch from "@/components/ui/DistrictAreaSearch";
import EnquiryModal from "@/components/ui/EnquiryModal";
import {
  MapPin,
  Star,
  Phone,
  CheckCircle,
  Wrench,
  Zap,
  Paintbrush,
  Hammer,
  LayoutTemplate,
  Check,
} from "lucide-react";
import { SERVICES, SERVICE_CATEGORY_FILTERS, DISTRICT_FILTER_ALL } from "@/lib/mock-data";

const categoryIcon: Record<string, ReactNode> = {
  Electrical: <Zap className="w-5 h-5 text-yellow-500" />,
  Plumbing: <Wrench className="w-5 h-5 text-blue-500" />,
  Interiors: <Paintbrush className="w-5 h-5 text-purple-500" />,
  Renovations: <LayoutTemplate className="w-5 h-5 text-teal-600" />,
  Painting: <Paintbrush className="w-5 h-5 text-pink-500" />,
  "Masonry works": <Hammer className="w-5 h-5 text-orange-500" />,
};

const categoryBg: Record<string, string> = {
  Electrical: "bg-yellow-50",
  Plumbing: "bg-blue-50",
  Interiors: "bg-purple-50",
  Renovations: "bg-teal-50",
  Painting: "bg-pink-50",
  "Masonry works": "bg-orange-50",
};

const SERVICE_CATEGORY_META: Record<string, { emoji: string; image: string | null }> = {
  All: {
    emoji: "🛠️",
    image: "https://www.pngkey.com/png/full/55-556142_house-cleaning-services-cleaner.png",
  },
  Interiors: {
    emoji: "🛋️",
    image:
      "https://static.vecteezy.com/system/resources/previews/010/880/101/non_2x/3d-interior-design-free-png.png",
  },
  Renovations: {
    emoji: "🏠",
    image:
      "https://png.pngtree.com/png-vector/20240913/ourmid/pngtree-renovated-house-installers-png-image_13212913.png",
  },
  Painting: {
    emoji: "🎨",
    image:
      "https://e7.pngegg.com/pngimages/62/703/png-clipart-house-painter-and-decorator-painting-interior-design-services-painting-building-service-thumbnail.png",
  },
  Electrical: {
    emoji: "⚡",
    image:
      "https://png.pngtree.com/png-clipart/20250415/original/pngtree-electrician-connecting-wires-in-electrical-panel-isolated-on-transparent-background-png-image_20719215.png",
  },
  Plumbing: {
    emoji: "🔧",
    image:
      "https://png.pngtree.com/png-clipart/20241009/original/pngtree-water-pipeline-plumbing-service-plumber-worker-png-image_16250329.png",
  },
  "Masonry works": {
    emoji: "🧱",
    image: "https://3.imimg.com/data3/XR/YB/GLADMIN-176439/masonry-service-250x250.png",
  },
};

function ServiceCategoryImage({
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
      className="absolute inset-0 w-full h-full object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-105"
    />
  );
}

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [district, setDistrict] = useState<string>(DISTRICT_FILTER_ALL);
  const [area, setArea] = useState("All Areas");
  const [enquiry, setEnquiry] = useState<string | null>(null);

  const filtered = SERVICES.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === "All" || s.category === cat;
    const matchDistrict = district === DISTRICT_FILTER_ALL || s.district === district;
    const matchArea = area === "All Areas" || s.area === area;
    return matchSearch && matchCat && matchDistrict && matchArea;
  });

  return (
    <ListingPageShell
      title="Home services"
      subtitle="Interiors, renovations, painting, electrical, plumbing, masonry"
      searchPlaceholder="Search painting, plumbing, interiors…"
      search={search}
      onSearchChange={setSearch}
    >
      <div className="page-container py-6">
        <div className="mb-6">
          <div
            className="flex flex-wrap justify-center gap-[15px]"
            role="tablist"
            aria-label="Service categories"
          >
            {SERVICE_CATEGORY_FILTERS.map((c) => {
              const meta = SERVICE_CATEGORY_META[c] ?? { emoji: "🛠️", image: null };
              const active = cat === c;
              return (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Filter by ${c}`}
                  onClick={() => setCat(c)}
                  className="group flex w-[120px] flex-col items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                >
                  <div
                    className={`relative w-[120px] h-[120px] overflow-hidden transition-all duration-300 ease-out ${
                      active
                        ? "bg-[#CFE3DD] scale-[1.02]"
                        : "bg-[#E0EDE8] group-hover:bg-[#D2E2DC]"
                    }`}
                  >
                    {meta.image ? (
                      <ServiceCategoryImage src={meta.image} alt={c} emoji={meta.emoji} />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110">
                        <span className="text-5xl" aria-hidden="true">
                          {meta.emoji}
                        </span>
                      </div>
                    )}
                    {active && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-md">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-xs sm:text-sm leading-tight text-center w-full px-1 transition-colors ${
                      active
                        ? "text-brand-700 font-semibold"
                        : "text-cement-700 font-medium group-hover:text-cement-900"
                    }`}
                  >
                    {c}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <p className="text-sm text-earth-500">
            <span className="font-semibold text-earth-900">{filtered.length}</span> service providers found
          </p>
          <DistrictAreaSearch
            district={district}
            onDistrictChange={setDistrict}
            area={area}
            onAreaChange={setArea}
          />
        </div>

        <div className="space-y-4">
          {filtered.map((s) => (
            <div key={s.id} className="card p-5">
              <div className="flex items-start gap-4 mb-3">
                <div
                  className={`w-12 h-12 ${categoryBg[s.category] ?? "bg-earth-50"} rounded-xl flex items-center justify-center flex-shrink-0`}
                >
                  {categoryIcon[s.category] ?? <Wrench className="w-5 h-5 text-earth-400" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-earth-900">{s.name}</h3>
                    {s.isVerified && (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    )}
                    <span className="text-xs bg-earth-100 text-earth-600 px-2 py-0.5 rounded-full">{s.category}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-semibold text-earth-800">{s.rating}</span>
                      <span className="text-xs text-earth-400">({s.reviewCount})</span>
                    </div>
                    <span className="text-xs text-earth-400">·</span>
                    <div className="flex items-center gap-1 text-xs text-earth-500">
                      <MapPin className="w-3 h-3" /> {s.area}, {s.district}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs text-earth-400">From</div>
                  <div className="font-bold text-earth-900 text-sm">{s.priceFrom}</div>
                </div>
              </div>

              <p className="text-sm text-earth-600 leading-relaxed mb-3">{s.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {s.tags.map((t) => (
                  <span key={t} className="text-xs bg-earth-100 text-earth-600 px-2.5 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setEnquiry(s.name)}
                className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm"
              >
                <Phone className="w-4 h-4" /> Get Quote
              </button>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Wrench className="w-12 h-12 text-earth-300 mx-auto mb-3" />
              <p className="text-earth-500">No services found. Try a different filter.</p>
            </div>
          )}
        </div>
      </div>

      {enquiry && <EnquiryModal target={enquiry} onClose={() => setEnquiry(null)} />}
    </ListingPageShell>
  );
}
