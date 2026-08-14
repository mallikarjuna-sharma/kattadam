"use client";

import { useState } from "react";
import ListingPageShell from "@/components/layout/ListingPageShell";
import DistrictAreaSelect from "@/components/ui/DistrictAreaSelect";
import EnquiryModal from "@/components/ui/EnquiryModal";
import { MapPin, Star, Phone, Briefcase, CheckCircle } from "lucide-react";
import { BUILDERS, DISTRICT_FILTER_ALL } from "@/lib/mock-data";

const TYPES = ["All", "Builder", "Architect", "Engineer"];

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
      searchPlaceholder="Search by name or company…"
      search={search}
      onSearchChange={setSearch}
    >
      <div className="page-container py-6">
        <div className="flex gap-2 mb-4">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                type === t
                  ? "bg-brand-500 text-white border-brand-500"
                  : "bg-white text-earth-600 border-earth-200 hover:border-brand-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-earth-500">
            <span className="font-semibold text-earth-900">{filtered.length}</span> found
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
          {filtered.map((b) => (
            <div key={b.id} className="card p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-7 h-7 text-blue-500" />
                </div>
                <div className="flex-1">
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
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-semibold text-earth-800">{b.rating}</span>
                      <span className="text-xs text-earth-400">({b.reviewCount})</span>
                    </div>
                    <span className="text-xs text-earth-400">·</span>
                    <div className="flex items-center gap-1 text-xs text-earth-500">
                      <MapPin className="w-3 h-3" /> {b.area}, {b.district}
                    </div>
                    <span className="text-xs text-earth-400">·</span>
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
