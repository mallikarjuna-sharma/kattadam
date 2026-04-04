"use client";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import EnquiryModal from "@/components/ui/EnquiryModal";
import { Search, MapPin, Phone, Home, BedDouble, Bath, Maximize2 } from "lucide-react";
import { PROPERTIES, AREAS, formatPrice } from "@/lib/mock-data";

const TYPES = ["All", "SELL", "RENT"];

export default function PropertiesPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [area, setArea] = useState("All Areas");
  const [enquiry, setEnquiry] = useState<string | null>(null);

  const filtered = PROPERTIES.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchType = type === "All" || p.type === type;
    const matchArea = area === "All Areas" || p.location.includes(area);
    return matchSearch && matchType && matchArea;
  });

  return (
    <div className="min-h-screen bg-earth-50">
      <Navbar />

      <div className="bg-earth-900 text-white">
        <div className="page-container py-8">
          <h1 className="font-display text-3xl font-bold mb-4">Properties</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
            <input className="w-full bg-white/10 border border-white/20 text-white placeholder-earth-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:bg-white/15"
              placeholder="Search by area, type…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="page-container py-6">
        {/* Filters row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-2">
            {TYPES.map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  type === t ? "bg-brand-500 text-white border-brand-500" : "bg-white text-earth-600 border-earth-200 hover:border-brand-300"}`}>
                {t === "All" ? "All" : t === "SELL" ? "Buy" : "Rent"}
              </button>
            ))}
          </div>
          <select className="text-sm border border-earth-200 rounded-lg px-3 py-1.5 bg-white text-earth-700 focus:outline-none"
            value={area} onChange={e => setArea(e.target.value)}>
            {AREAS.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>

        <p className="text-sm text-earth-500 mb-5"><span className="font-semibold text-earth-900">{filtered.length}</span> properties found</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="card overflow-hidden group">
              {/* Image placeholder */}
              <div className="h-44 bg-gradient-to-br from-earth-200 to-earth-300 relative flex items-center justify-center">
                <Home className="w-12 h-12 text-earth-400" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`badge font-semibold ${p.type === "RENT" ? "bg-blue-500 text-white" : "bg-green-500 text-white"}`}>
                    {p.type === "RENT" ? "RENT" : "SALE"}
                  </span>
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
                    {p.bedrooms && (
                      <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" /> {p.bedrooms} BHK</span>
                    )}
                    {p.bathrooms && (
                      <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {p.bathrooms} Bath</span>
                    )}
                    <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" /> {p.area.toLocaleString()} sq.ft</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold text-earth-900">{formatPrice(p.price, p.type)}</div>
                    <div className="text-xs text-earth-400">{p.daysAgo === 1 ? "1 day ago" : `${p.daysAgo} days ago`} · {p.postedBy}</div>
                  </div>
                  <button onClick={() => setEnquiry(p.title)}
                    className="flex items-center gap-1.5 bg-brand-50 text-brand-600 border border-brand-200 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-brand-100 transition-colors">
                    <Phone className="w-3.5 h-3.5" /> Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {enquiry && <EnquiryModal target={enquiry} onClose={() => setEnquiry(null)} />}
    </div>
  );
}
