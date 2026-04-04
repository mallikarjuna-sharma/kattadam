"use client";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import EnquiryModal from "@/components/ui/EnquiryModal";
import { Search, MapPin, Star, Phone, CheckCircle, Wrench, Zap, Paintbrush, Hammer } from "lucide-react";

const SERVICES = [
  {
    id: "1",
    name: "Vel Electrical Works",
    category: "Electrical",
    area: "Gandhipuram",
    rating: 4.7,
    reviewCount: 112,
    isVerified: true,
    description: "Licensed electrical contractor for residential and commercial wiring, panel upgrades, and safety audits.",
    tags: ["Wiring", "Panel Upgrade", "Safety Audit"],
    priceFrom: "₹500/hr",
  },
  {
    id: "2",
    name: "AK Plumbing Solutions",
    category: "Plumbing",
    area: "RS Puram",
    rating: 4.5,
    reviewCount: 78,
    isVerified: true,
    description: "Expert plumbing for new construction, bathroom fittings, pipeline repairs, and water tank installation.",
    tags: ["Pipeline", "Bathroom Fittings", "Water Tank"],
    priceFrom: "₹400/hr",
  },
  {
    id: "3",
    name: "Dream Interior Studio",
    category: "Interior",
    area: "Peelamedu",
    rating: 4.8,
    reviewCount: 95,
    isVerified: true,
    description: "Full interior design and execution — modular kitchens, false ceilings, wardrobes, and complete home interiors.",
    tags: ["Modular Kitchen", "False Ceiling", "Wardrobes"],
    priceFrom: "₹800/sq.ft",
  },
  {
    id: "4",
    name: "Coimbatore Painting Works",
    category: "Painting",
    area: "Singanallur",
    rating: 4.3,
    reviewCount: 64,
    isVerified: false,
    description: "Interior and exterior painting, texture finishes, waterproofing, and wall putty application.",
    tags: ["Interior Paint", "Exterior Paint", "Texture"],
    priceFrom: "₹12/sq.ft",
  },
  {
    id: "5",
    name: "Ravi Civil & Masonry",
    category: "Civil",
    area: "Kalapatti",
    rating: 4.4,
    reviewCount: 48,
    isVerified: true,
    description: "Masonry, brickwork, compound walls, flooring, and tile fixing for residential projects.",
    tags: ["Masonry", "Flooring", "Tile Fixing"],
    priceFrom: "₹350/hr",
  },
];

const CATEGORIES = ["All", "Electrical", "Plumbing", "Interior", "Painting", "Civil"];

const categoryIcon: Record<string, React.ReactNode> = {
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
  const [enquiry, setEnquiry] = useState<string | null>(null);

  const filtered = SERVICES.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === "All" || s.category === cat;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-earth-50">
      <Navbar />

      <div className="bg-earth-900 text-white">
        <div className="page-container py-8">
          <h1 className="font-display text-3xl font-bold mb-1">Services</h1>
          <p className="text-earth-400 text-sm mb-4">Skilled professionals for every stage of your project</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
            <input
              className="w-full bg-white/10 border border-white/20 text-white placeholder-earth-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:bg-white/15"
              placeholder="Search electrical, plumbing, interior…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="page-container py-6">
        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-5 -mx-4 px-4">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                cat === c
                  ? "bg-brand-500 text-white border-brand-500"
                  : "bg-white text-earth-600 border-earth-200 hover:border-brand-300"
              }`}>
              {c}
            </button>
          ))}
        </div>

        <p className="text-sm text-earth-500 mb-5">
          <span className="font-semibold text-earth-900">{filtered.length}</span> service providers found
        </p>

        <div className="space-y-4">
          {filtered.map(s => (
            <div key={s.id} className="card p-5">
              <div className="flex items-start gap-4 mb-3">
                <div className={`w-12 h-12 ${categoryBg[s.category] ?? "bg-earth-50"} rounded-xl flex items-center justify-center flex-shrink-0`}>
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
                      <MapPin className="w-3 h-3" /> {s.area}, Coimbatore
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
                {s.tags.map(t => (
                  <span key={t} className="text-xs bg-earth-100 text-earth-600 px-2.5 py-1 rounded-full">{t}</span>
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
    </div>
  );
}
