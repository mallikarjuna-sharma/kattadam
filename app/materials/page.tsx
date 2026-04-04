"use client";

import { useState } from "react";
import ListingPageShell from "@/components/layout/ListingPageShell";
import AreaSelect from "@/components/ui/AreaSelect";
import EnquiryModal from "@/components/ui/EnquiryModal";
import { MapPin, Star, Phone, Package, CheckCircle } from "lucide-react";
import { DEALERS, MATERIAL_CATEGORIES } from "@/lib/mock-data";

export default function MaterialsPage() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("ALL");
  const [area, setArea] = useState("All Areas");
  const [enquiry, setEnquiry] = useState<string | null>(null);

  const filtered = DEALERS.filter((d) => {
    const matchSearch =
      d.shopName.toLowerCase().includes(search.toLowerCase()) ||
      d.materials.some((m) => m.name.toLowerCase().includes(search.toLowerCase()));
    const matchCat = cat === "ALL" || d.categories.some((c) => c.toUpperCase().replace(" ", "_") === cat);
    const matchArea = area === "All Areas" || d.area === area;
    return matchSearch && matchCat && matchArea;
  });

  return (
    <ListingPageShell
      title="Construction Materials"
      searchPlaceholder="Search cement, steel, bricks…"
      search={search}
      onSearchChange={setSearch}
      backHref="/"
    >
      <div className="page-container py-6">
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-4 px-4">
          {[{ key: "ALL", label: "All", emoji: "🏠" }, ...MATERIAL_CATEGORIES].map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                cat === c.key
                  ? "bg-brand-500 text-white border-brand-500"
                  : "bg-white text-earth-600 border-earth-200 hover:border-brand-300"
              }`}
            >
              <span>{c.emoji}</span> {c.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-earth-500">
            <span className="font-semibold text-earth-900">{filtered.length}</span> dealers found
          </p>
          <AreaSelect value={area} onChange={setArea} />
        </div>

        <div className="space-y-4">
          {filtered.map((dealer) => (
            <div key={dealer.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-brand-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-earth-900">{dealer.shopName}</h3>
                      {dealer.isVerified && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-earth-500 text-xs mt-0.5">
                      <MapPin className="w-3 h-3" /> {dealer.area}, Coimbatore
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold text-earth-800">{dealer.rating}</span>
                  <span className="text-xs text-earth-400">({dealer.reviewCount})</span>
                </div>
                <div className="flex gap-1.5">
                  {dealer.categories.map((c) => (
                    <span key={c} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-earth-50 rounded-xl p-3 space-y-2 mb-4">
                {dealer.materials.map((m) => (
                  <div key={m.name} className="flex items-center justify-between text-sm">
                    <span className="text-earth-600">{m.name}</span>
                    <div className="flex items-center gap-2">
                      {!m.inStock && <span className="text-xs text-red-500">Out of stock</span>}
                      <span className="font-semibold text-earth-900">{m.price}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setEnquiry(dealer.shopName)}
                className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm"
              >
                <Phone className="w-4 h-4" /> Send Enquiry
              </button>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-earth-300 mx-auto mb-3" />
              <p className="text-earth-500">No dealers found. Try a different filter.</p>
            </div>
          )}
        </div>
      </div>

      {enquiry && <EnquiryModal target={enquiry} onClose={() => setEnquiry(null)} />}
    </ListingPageShell>
  );
}
