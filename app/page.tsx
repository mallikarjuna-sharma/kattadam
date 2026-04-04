// app/page.tsx — Kattodam Landing Page

import Link from "next/link";
import {
  Building2, Package, Home, Wrench,
  ArrowRight, MapPin, Star, Shield, Phone
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-earth-200">
        <div className="page-container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-earth-900">Kattodam</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-earth-600">
            <Link href="/materials" className="hover:text-brand-500 transition-colors">Materials</Link>
            <Link href="/builders" className="hover:text-brand-500 transition-colors">Builders</Link>
            <Link href="/properties" className="hover:text-brand-500 transition-colors">Properties</Link>
            <Link href="/services" className="hover:text-brand-500 transition-colors">Services</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-secondary text-sm px-4 py-2">Login</Link>
            <Link href="/auth/login" className="btn-primary text-sm px-4 py-2">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-earth-900 text-white">
        {/* Geometric background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-400 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        </div>
        <div className="page-container py-20 md:py-28 relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-4 h-4 text-brand-400" />
              <span className="text-sm text-earth-300 font-medium">Serving Coimbatore</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              Build Better,{" "}
              <span className="text-brand-400">Together.</span>
            </h1>
            <p className="text-earth-300 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              Coimbatore's first unified marketplace for construction materials, trusted builders,
              architects, and properties — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/materials" className="btn-primary inline-flex items-center gap-2 justify-center">
                Explore Materials <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/builders" className="btn-secondary inline-flex items-center gap-2 justify-center bg-white/10 border-white/20 text-white hover:bg-white/20">
                Find Builders
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-white/10">
          <div className="page-container py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Verified Dealers", value: "50+" },
              { label: "Builders & Architects", value: "30+" },
              { label: "Properties Listed", value: "200+" },
              { label: "Coimbatore Areas", value: "15+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-brand-400">{stat.value}</div>
                <div className="text-sm text-earth-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 Main Categories ── */}
      <section className="py-16 bg-earth-50">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">Everything You Need to Build</h2>
            <p className="text-earth-500 max-w-xl mx-auto">
              From raw materials to finished spaces — Kattodam connects you with trusted
              professionals across Coimbatore.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Package,
                title: "Materials",
                desc: "Cement, TMT steel, bricks, sand, paint and more from verified dealers",
                href: "/materials",
                color: "text-orange-500",
                bg: "bg-orange-50",
              },
              {
                icon: Building2,
                title: "Builders & Arch",
                desc: "Connect with experienced builders, architects, and contractors",
                href: "/builders",
                color: "text-blue-500",
                bg: "bg-blue-50",
              },
              {
                icon: Home,
                title: "Properties",
                desc: "Buy, sell, or rent residential and commercial properties",
                href: "/properties",
                color: "text-green-500",
                bg: "bg-green-50",
              },
              {
                icon: Wrench,
                title: "Services",
                desc: "Interior, plumbing, electrical, and skilled worker services",
                href: "/services",
                color: "text-purple-500",
                bg: "bg-purple-50",
              },
            ].map((cat) => (
              <Link key={cat.title} href={cat.href} className="card p-6 group cursor-pointer">
                <div className={`w-12 h-12 ${cat.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <cat.icon className={`w-6 h-6 ${cat.color}`} />
                </div>
                <h3 className="font-semibold text-earth-900 mb-2">{cat.title}</h3>
                <p className="text-sm text-earth-500 leading-relaxed">{cat.desc}</p>
                <div className={`mt-4 flex items-center gap-1 text-sm font-medium ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Browse <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Kattodam ── */}
      <section className="py-16 bg-white">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="section-title mb-4">Why Choose Kattodam?</h2>
              <p className="text-earth-500 mb-8 leading-relaxed">
                We're a Coimbatore-first platform built to solve the real challenges people face
                when constructing homes — opacity, overpricing, and unreliable contractors.
              </p>
              <div className="space-y-5">
                {[
                  {
                    icon: Shield,
                    title: "Verified Dealers & Builders",
                    desc: "Every dealer and builder is manually verified before listing.",
                  },
                  {
                    icon: Phone,
                    title: "Lead Protection",
                    desc: "Your contact goes through us — no spam, you control the conversation.",
                  },
                  {
                    icon: Star,
                    title: "Price Transparency",
                    desc: "Compare material prices across multiple dealers before you enquire.",
                  },
                  {
                    icon: MapPin,
                    title: "Hyper-local Focus",
                    desc: "We know Coimbatore — RS Puram to Peelamedu, we have it covered.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-brand-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-earth-900 mb-0.5">{item.title}</h4>
                      <p className="text-sm text-earth-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-earth-900 rounded-3xl p-8 text-white">
              <h3 className="font-display text-2xl font-bold mb-6">For Dealers & Builders</h3>
              <div className="space-y-4 mb-8">
                {[
                  "Get verified leads directly to your dashboard",
                  "Showcase your projects and past work",
                  "Manage enquiries in one place",
                  "Subscription plans starting soon",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-earth-300 text-sm">{item}</p>
                  </div>
                ))}
              </div>
              <Link href="/auth/login" className="btn-primary w-full text-center block">
                Register as Dealer / Builder
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 gradient-brand">
        <div className="page-container text-center text-white">
          <h2 className="font-display text-4xl font-bold mb-4">Ready to Build in Coimbatore?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Join hundreds of homeowners, dealers, and builders who trust Kattodam.
          </p>
          <Link href="/auth/login" className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold px-8 py-4 rounded-xl hover:bg-earth-50 transition-colors shadow-lg">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-earth-900 text-earth-400 py-10">
        <div className="page-container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 gradient-brand rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-white font-bold">Kattodam</span>
          </div>
          <p className="text-sm">Coimbatore's Construction Marketplace © {new Date().getFullYear()}</p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
