"use client";

// app/materials/page.tsx — Material Marketplace

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, MapPin, Star, Phone, ChevronRight, Package } from "lucide-react";
import { MATERIAL_CATEGORIES, MaterialCategory } from "@/types";

// Mock data — replace with real API calls
const MOCK_DEALERS = [
  {
    id: "1",
    shopName: "Sri Ram Cement Depot",
    area: "RS Puram",
    city: "Coimbatore",
    rating: 4.8,
    reviewCount: 124,
    isVerified: true,
    categories: ["CEMENT", "SAND"] as MaterialCategory[],
    materials: [
      { name: "Ultratech OPC 53", priceMin: 380, priceMax: 400, unit: "bag" },
      { name: "Dalmia PPC", priceMin: 360, priceMax: 380, unit: "bag" },
    ],
  },
  {
    id: "2",
    shopName: "Murugan Steel Traders",
    area: "Gandhipuram",
    city: "Coimbatore",
    rating: 4.5,
    reviewCount: 89,
    isVerified: true,
    categories: ["TMT_STEEL"] as MaterialCategory[],
    materials: [
      { name: "JSW TMT Fe500", priceMin: 58000, priceMax: 61000, unit: "tonne" },
      { name: "TATA Tiscon Fe500D", priceMin: 60000, priceMax: 63000, unit: "tonne" },
    ],
  },
  {
    id: "3",
    shopName: "Coimbatore Bricks & Aggregates",
    area: "Singanallur",
    city: "Coimbatore",
    rating: 4.3,
    reviewCount: 56,
    isVerified: false,
    categories: ["BRICKS", "AGGREGATES", "SAND"] as MaterialCategory[],
    materials: [
      { name: "Country Bricks (1st quality)", priceMin: 4500, priceMax: 5000, unit: "1000 pcs" },
      { name: "20mm Aggregate", priceMin: 1200, priceMax: 1400, unit: "tonne" },
    ],
  },
];

const ALL_CATEGORIES = Object.entries(MATERIAL_CATEGORIES) as [MaterialCategory, { label: string; icon: string }][];

export default function MaterialsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | "ALL">("ALL");
  const [selectedArea, setSelectedArea] = useState("All Areas");

  const filtered = MOCK_DEALERS.filter((d) => {
    const matchSearch = d.shopName.toLowerCase().includes(search.toLowerCase()) ||
      d.materials.some(m => m.name.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = selectedCategory === "ALL" || d.categories.includes(selectedCategory);
    const matchArea = selectedArea === "All Areas" || d.area === selectedArea;
    return matchSearch && matchCategory && matchArea;
  });

  return (
    <div className="min-h-screen bg-earth-50 pb-24 md:pb-0">
      {/* Header */}
      <div className="bg-earth-900 text-white">
        <div className="page-container py-6">
          <Link href="/home" className="text-earth-400 text-sm flex items-center gap-1 mb-3 hover:text-white transition-colors">
            ← Back
          </Link>
          <h1 className="font-display text-2xl font-bold mb-4">Construction Materials</h1>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
            <input
              type="text"
              placeholder="Search cement, steel, bricks..."
              className="w-full bg-white/10 border border-white/20 text-white placeholder-earth-400 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:bg-white/20 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="page-container py-6">
        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === "ALL"
                ? "bg-brand-500 text-white"
                : "bg-white border border-earth-200 text-earth-600 hover:border-brand-300"
            }`}
          >
            All
          </button>
          {ALL_CATEGORIES.map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === key
                  ? "bg-brand-500 text-white"
                  : "bg-white border border-earth-200 text-earth-600 hover:border-brand-300"
              }`}
            >
              <span>{val.icon}</span>
              {val.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-earth-500">{filtered.length} dealers found</p>
          <button className="flex items-center gap-1.5 text-sm text-earth-600 bg-white border border-earth-200 px-3 py-1.5 rounded-lg hover:border-earth-300 transition-colors">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
        </div>

        {/* Dealer cards */}
        <div className="space-y-4">
          {filtered.map((dealer) => (
            <Link key={dealer.id} href={`/materials/${dealer.id}`} className="card block p-5 hover:border-brand-200 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-brand-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-earth-900">{dealer.shopName}</h3>
                      {dealer.isVerified && (
                        <span className="badge badge-green">✓ Verified</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-earth-500 text-sm mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {dealer.area}, {dealer.city}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-earth-300 mt-1" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium text-earth-700">{dealer.rating}</span>
                <span className="text-xs text-earth-400">({dealer.reviewCount} reviews)</span>
              </div>

              {/* Category badges */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {dealer.categories.map((cat) => (
                  <span key={cat} className="badge badge-orange">
                    {MATERIAL_CATEGORIES[cat].icon} {MATERIAL_CATEGORIES[cat].label}
                  </span>
                ))}
              </div>

              {/* Price preview */}
              <div className="bg-earth-50 rounded-xl p-3 space-y-1.5">
                {dealer.materials.slice(0, 2).map((mat) => (
                  <div key={mat.name} className="flex items-center justify-between text-sm">
                    <span className="text-earth-600">{mat.name}</span>
                    <span className="font-semibold text-earth-900">
                      ₹{mat.priceMin.toLocaleString()} – ₹{mat.priceMax.toLocaleString()}/{mat.unit}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-earth-400">Tap to view & enquire</span>
                <button
                  className="flex items-center gap-1.5 text-sm font-medium text-brand-500"
                  onClick={(e) => {
                    e.preventDefault();
                    // Open enquiry modal
                  }}
                >
                  <Phone className="w-3.5 h-3.5" /> Send Enquiry
                </button>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-earth-300 mx-auto mb-3" />
            <p className="text-earth-500">No dealers found for your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
