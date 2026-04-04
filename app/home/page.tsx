"use client";
import Link from "next/link";
import { Package, Building2, Home, Wrench, ArrowRight, MapPin, Search, Bell, LogOut } from "lucide-react";
import { MATERIAL_CATEGORIES } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-earth-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-earth-900 text-white">
        <div className="page-container py-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5 text-earth-400 text-xs mb-1">
                <MapPin className="w-3 h-3" /> Coimbatore
              </div>
              <h1 className="font-display text-lg font-bold">Good morning! 👋</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </button>
              <Link href="/" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
            <input placeholder="Search materials, builders, properties..." className="w-full bg-white/10 border border-white/20 text-white placeholder-earth-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:bg-white/15" />
          </div>
        </div>
      </header>

      <div className="page-container py-6 space-y-8">
        {/* 4 Main tiles */}
        <section>
          <p className="text-xs font-semibold text-earth-500 uppercase tracking-wider mb-3">What are you looking for?</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Package, title: "Materials", sub: "Cement, Steel, Bricks…", href: "/materials", color: "text-orange-500", bg: "bg-orange-50", count: "50+ dealers" },
              { icon: Building2, title: "Builders & Arch", sub: "Trusted professionals", href: "/builders", color: "text-blue-500", bg: "bg-blue-50", count: "30+ listings" },
              { icon: Home, title: "Properties", sub: "Buy / Sell / Rent", href: "/properties", color: "text-green-500", bg: "bg-green-50", count: "200+ listings" },
              { icon: Wrench, title: "Services", sub: "Plumbing, Electrical…", href: "/services", color: "text-purple-500", bg: "bg-purple-50", count: "Coming soon" },
            ].map((c) => (
              <Link key={c.title} href={c.href} className="card p-4 group">
                <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <c.icon className={`w-5 h-5 ${c.color}`} />
                </div>
                <h3 className="font-semibold text-earth-900 text-sm">{c.title}</h3>
                <p className="text-earth-400 text-xs mt-0.5">{c.sub}</p>
                <span className={`mt-2 text-xs font-medium ${c.color}`}>{c.count}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick material categories */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-earth-500 uppercase tracking-wider">Browse Materials</p>
            <Link href="/materials" className="text-xs text-brand-500 font-medium flex items-center gap-0.5">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {MATERIAL_CATEGORIES.slice(0, 10).map((c) => (
              <Link key={c.key} href={`/materials?cat=${c.key}`}
                className="card p-3 text-center hover:border-brand-200 group">
                <div className="text-xl mb-1">{c.emoji}</div>
                <div className="text-[10px] font-medium text-earth-600 leading-tight">{c.label}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Property CTA */}
        <section>
          <div className="bg-earth-900 rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-brand-500/20 rounded-full -translate-y-6 translate-x-6" />
            <Home className="w-5 h-5 text-brand-400 mb-2" />
            <h3 className="font-display text-lg font-bold mb-1">List Your Property</h3>
            <p className="text-earth-400 text-xs mb-4">Reach buyers & tenants in Coimbatore — free listing</p>
            <Link href="/properties" className="btn-primary text-sm inline-flex items-center gap-1.5 py-2 px-4">
              Post Free <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>

      {/* Bottom nav mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-earth-200 md:hidden">
        <div className="flex">
          {[
            { icon: Home, label: "Home", href: "/home" },
            { icon: Package, label: "Materials", href: "/materials" },
            { icon: Building2, label: "Builders", href: "/builders" },
            { icon: Home, label: "Property", href: "/properties" },
          ].map((item) => (
            <Link key={item.label} href={item.href}
              className="flex-1 flex flex-col items-center py-3 text-earth-400 hover:text-brand-500 transition-colors">
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
