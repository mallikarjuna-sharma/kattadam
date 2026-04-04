"use client";

// app/home/page.tsx — Authenticated Home Screen

import Link from "next/link";
import { Package, Building2, Home, Wrench, ArrowRight, MapPin, Search } from "lucide-react";

const CATEGORIES = [
  {
    icon: Package,
    title: "Materials",
    subtitle: "Cement, Steel, Bricks & more",
    href: "/materials",
    color: "bg-orange-500",
    lightBg: "bg-orange-50",
    textColor: "text-orange-600",
    count: "50+ dealers",
  },
  {
    icon: Building2,
    title: "Builders & Arch",
    subtitle: "Trusted local professionals",
    href: "/builders",
    color: "bg-blue-500",
    lightBg: "bg-blue-50",
    textColor: "text-blue-600",
    count: "30+ listings",
  },
  {
    icon: Home,
    title: "Properties",
    subtitle: "Buy / Sell / Rent",
    href: "/properties",
    color: "bg-green-500",
    lightBg: "bg-green-50",
    textColor: "text-green-600",
    count: "200+ listings",
  },
  {
    icon: Wrench,
    title: "Services",
    subtitle: "Interior, Plumbing, Electrical",
    href: "/services",
    color: "bg-purple-500",
    lightBg: "bg-purple-50",
    textColor: "text-purple-600",
    count: "Coming soon",
  },
];

const QUICK_CATEGORIES = [
  { label: "Cement", emoji: "🏗️", href: "/materials?category=CEMENT" },
  { label: "TMT Steel", emoji: "🔩", href: "/materials?category=TMT_STEEL" },
  { label: "Bricks", emoji: "🧱", href: "/materials?category=BRICKS" },
  { label: "Sand", emoji: "⛱️", href: "/materials?category=SAND" },
  { label: "Paint", emoji: "🎨", href: "/materials?category=PAINT" },
  { label: "Tiles", emoji: "◼️", href: "/materials?category=TILES" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-earth-50 pb-24 md:pb-0">
      {/* Header */}
      <header className="bg-earth-900 text-white">
        <div className="page-container py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5 text-earth-400 text-sm mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Coimbatore</span>
              </div>
              <h1 className="font-display text-xl font-bold">Good morning! 👋</h1>
            </div>
            <Link href="/admin" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <span className="text-sm font-bold">A</span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
            <input
              type="text"
              placeholder="Search materials, builders, properties..."
              className="w-full bg-white/10 border border-white/20 text-white placeholder-earth-400 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:bg-white/20 transition-colors"
            />
          </div>
        </div>
      </header>

      <div className="page-container py-6 space-y-8">
        {/* Main 4 categories */}
        <section>
          <h2 className="font-semibold text-earth-700 text-sm uppercase tracking-wider mb-4">
            What are you looking for?
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.title} href={cat.href} className="card p-5 group">
                <div className={`w-10 h-10 ${cat.lightBg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  <cat.icon className={`w-5 h-5 ${cat.textColor}`} />
                </div>
                <h3 className="font-semibold text-earth-900 text-sm mb-0.5">{cat.title}</h3>
                <p className="text-earth-400 text-xs">{cat.subtitle}</p>
                <span className={`mt-2 inline-block text-xs font-medium ${cat.textColor}`}>
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick material access */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-earth-700 text-sm uppercase tracking-wider">
              Browse Materials
            </h2>
            <Link href="/materials" className="text-xs text-brand-500 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="card p-4 text-center group hover:border-brand-200"
              >
                <div className="text-2xl mb-2">{cat.emoji}</div>
                <div className="text-xs font-medium text-earth-700">{cat.label}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured properties CTA */}
        <section>
          <div className="bg-earth-900 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full -translate-y-8 translate-x-8" />
            <Home className="w-6 h-6 text-brand-400 mb-3" />
            <h3 className="font-display text-xl font-bold mb-1">List Your Property</h3>
            <p className="text-earth-400 text-sm mb-4">Reach serious buyers & tenants in Coimbatore</p>
            <Link href="/properties/new" className="btn-primary text-sm inline-flex items-center gap-1.5">
              Post Free <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Recent enquiries summary */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-earth-700 text-sm uppercase tracking-wider">
              Your Enquiries
            </h2>
            <Link href="/enquiries" className="text-xs text-brand-500 font-medium">View all</Link>
          </div>
          <div className="card p-6 text-center">
            <p className="text-earth-400 text-sm">No enquiries yet. Start exploring!</p>
            <Link href="/materials" className="mt-3 inline-block text-sm text-brand-500 font-medium">
              Browse Materials →
            </Link>
          </div>
        </section>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-earth-200 md:hidden">
        <div className="flex">
          {[
            { icon: Home, label: "Home", href: "/home" },
            { icon: Package, label: "Materials", href: "/materials" },
            { icon: Building2, label: "Builders", href: "/builders" },
            { icon: Home, label: "Property", href: "/properties" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex-1 flex flex-col items-center py-3 text-earth-400 hover:text-brand-500 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
