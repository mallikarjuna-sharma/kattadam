"use client";

import { useState, type ReactNode } from "react";
import ListingPageShell from "@/components/layout/ListingPageShell";
import DistrictAreaSelect from "@/components/ui/DistrictAreaSelect";
import EnquiryModal from "@/components/ui/EnquiryModal";
import { MapPin, Star, Phone, CheckCircle, Wrench, Zap, Paintbrush, Hammer } from "lucide-react";
import { SERVICES, SERVICE_CATEGORY_FILTERS, DISTRICT_FILTER_ALL } from "@/lib/mock-data";

const categoryIcon: Record<string, ReactNode> = {
  Electrical: <Zap className="w-5 h-5 text-yellow-500" />,
  Plumbing: <Wrench className="w-5 h-5 text-blue-500" />,
  Interior: <Paintbrush className="w-5 h-5 text-purple-500" />,
  Painting: <Paintbrush className="w-5 h-5 text-pink-500" />,
  Civil: <Hammer className="w-5 h-5 text-orange-500" />,
};

const categoryBg: Record<string, string> = {
  Electrical: "bg-yellow-50",
  Plumbing: "bg-blue-50",
  Interior: "bg-purple-50",
  Painting: "bg-pink-50",
  Civil: "bg-orange-50",
};

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
      title="Services"
      subtitle="Skilled professionals for every stage of your project"
      searchPlaceholder="Search electrical, plumbing, interior…"
      search={search}
      onSearchChange={setSearch}
    >
      <div className="page-container py-6">
        <div className="flex gap-2 overflow-x-auto pb-3 mb-5 -mx-4 px-4">
          {SERVICE_CATEGORY_FILTERS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                cat === c
                  ? "bg-brand-500 text-white border-brand-500"
                  : "bg-white text-earth-600 border-earth-200 hover:border-brand-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <p className="text-sm text-earth-500">
            <span className="font-semibold text-earth-900">{filtered.length}</span> service providers found
          </p>
          <DistrictAreaSelect
            district={district}
            onDistrictChange={setDistrict}
            area={area}
            onAreaChange={setArea}
            selectClassName="text-sm border border-earth-200 rounded-lg px-3 py-1.5 bg-white text-earth-700 focus:outline-none focus:ring-2 focus:ring-brand-400 min-w-0 sm:min-w-[130px]"
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
