"use client";

import Link from "next/link";
import { Package, Building2, Home, Wrench, ArrowRight, Search, Bell, LogOut, Phone } from "lucide-react";
import { MATERIAL_CATEGORIES } from "@/lib/mock-data";
import { KD360_NAME, KD360_PHONE_DISPLAY, KD360_TEL_HREF } from "@/lib/kd360-contact";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-earth-50 pb-24 md:pb-0">
      <header className="bg-earth-900 text-white">
        <div className="page-container py-8 md:py-10">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="space-y-3 min-w-0">
              <p className="font-display text-3xl md:text-4xl font-bold tracking-tight">கட்டடம்</p>
              <p className="text-earth-200 text-lg md:text-xl font-medium">Build Better. Together.</p>
              <p className="text-earth-300 text-sm md:text-base leading-relaxed max-w-xl">
                Construction made simple, transparent, and local. From materials to Kattadam experts — everything you
                need, verified in one place.
              </p>
              <p className="text-earth-200 text-sm flex flex-wrap items-center gap-2 pt-1">
                <span aria-hidden>📍</span>
                <span>Coimbatore · Tirupur · Erode · Namakkal · Salem</span>
              </p>
              <p className="text-earth-100 text-sm font-medium pt-2 border-t border-white/10 mt-4 max-w-lg">
                No middlemen. No confusion. Just trusted connections.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button type="button" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </button>
              <Link href="/" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
            <input
              placeholder="Search materials, experts, real estate…"
              className="w-full bg-white/10 border border-white/20 text-white placeholder-earth-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:bg-white/15"
            />
          </div>
        </div>
      </header>

      <div className="page-container py-8 space-y-10">
        <section className="rounded-2xl border border-earth-200 bg-white p-5 md:p-6 shadow-sm space-y-4">
          <p className="text-xs font-semibold text-earth-500 uppercase tracking-wider">Explore</p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <Link
              href="/materials"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 text-white px-5 py-3 text-sm font-semibold"
            >
              Explore materials <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/builders"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-earth-200 bg-earth-50 px-5 py-3 text-sm font-semibold text-earth-900"
            >
              Explore Kattadam experts <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={KD360_TEL_HREF}
              className="inline-flex flex-col items-center justify-center rounded-xl border-2 border-brand-400 bg-brand-50 px-4 py-3 text-center text-xs font-semibold text-brand-900"
            >
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {KD360_NAME}
              </span>
              <span className="mt-0.5 text-[11px] font-bold text-brand-800">+91 {KD360_PHONE_DISPLAY}</span>
              <span className="mt-1 font-normal text-earth-600">
                <span className="line-through text-earth-400">₹500</span>{" "}
                <span className="font-semibold text-brand-700">Free consultations</span>
              </span>
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-earth-100 text-center text-xs">
            {[
              ["50+", "Dealers"],
              ["30+", "Experts"],
              ["200+", "Listings"],
              ["5", "Districts"],
            ].map(([v, l]) => (
              <div key={l} className="py-2">
                <div className="text-lg font-bold text-brand-600">{v}</div>
                <div className="text-earth-500">{l}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-earth-200 bg-white p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <Link
              href="/properties"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-earth-900 text-white px-5 py-3 text-sm font-semibold"
            >
              Explore real estate <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-earth-200 bg-earth-50 px-5 py-3 text-sm font-semibold text-earth-900"
            >
              Explore home services <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={KD360_TEL_HREF}
              className="inline-flex flex-col items-center justify-center rounded-xl border-2 border-brand-400 bg-brand-50 px-4 py-3 text-center text-xs font-semibold text-brand-900"
            >
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {KD360_NAME}
              </span>
              <span className="mt-0.5 text-[11px] font-bold text-brand-800">+91 {KD360_PHONE_DISPLAY}</span>
              <span className="mt-1 font-normal text-earth-600">
                <span className="line-through text-earth-400">₹500</span>{" "}
                <span className="font-semibold text-brand-700">Free consultations</span>
              </span>
            </a>
          </div>
        </section>

        <section>
          <p className="text-xs font-semibold text-earth-500 uppercase tracking-wider mb-3">What are you looking for?</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Package, title: "Materials", sub: "Cement, steel, bricks…", href: "/materials", color: "text-orange-500", bg: "bg-orange-50", count: "50+ dealers" },
              { icon: Building2, title: "Kattadam Experts", sub: "Engineers & builders", href: "/builders", color: "text-blue-500", bg: "bg-blue-50", count: "30+ listings" },
              { icon: Home, title: "Real estate", sub: "Buy / rent", href: "/properties", color: "text-green-500", bg: "bg-green-50", count: "200+ listings" },
              { icon: Wrench, title: "Home services", sub: "Interiors, plumbing…", href: "/services", color: "text-purple-500", bg: "bg-purple-50", count: "Local pros" },
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

        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-earth-500 uppercase tracking-wider">Browse materials</p>
            <Link href="/materials" className="text-xs text-brand-500 font-medium flex items-center gap-0.5">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {MATERIAL_CATEGORIES.slice(0, 10).map((c) => (
              <Link
                key={c.key}
                href={`/materials?cat=${c.key}`}
                className="card p-3 text-center hover:border-brand-200 group"
              >
                <div className="text-xl mb-1">{c.emoji}</div>
                <div className="text-[10px] font-medium text-earth-600 leading-tight">{c.label}</div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="bg-earth-900 rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-brand-500/20 rounded-full -translate-y-6 translate-x-6" />
            <Home className="w-5 h-5 text-brand-400 mb-2" />
            <h3 className="font-display text-lg font-bold mb-1">List on Kattadam</h3>
            <p className="text-earth-400 text-xs mb-4">Real estate or partner services — reach verified buyers.</p>
            <Link href="/properties" className="btn-primary text-sm inline-flex items-center gap-1.5 py-2 px-4">
              Post free <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-earth-200 md:hidden z-40">
        <div className="flex">
          {[
            { icon: Home, label: "Home", href: "/home" },
            { icon: Package, label: "Materials", href: "/materials" },
            { icon: Building2, label: "Experts", href: "/builders" },
            { icon: Home, label: "Property", href: "/properties" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex-1 flex flex-col items-center py-3 text-earth-400 hover:text-brand-500 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
