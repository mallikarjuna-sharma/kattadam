import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { Building2, Package, Home, Wrench, ArrowRight, MapPin, Star, Shield, Phone, CheckCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-earth-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #f97316 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />

        <div className="page-container py-20 md:py-28 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <MapPin className="w-3.5 h-3.5" /> Serving Coimbatore
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
              Build Better.<br />
              <span className="text-brand-400">Together.</span>
            </h1>
            <p className="text-earth-300 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              Coimbatore's first unified marketplace for construction materials, builders,
              architects, and properties — all verified, all local.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/materials" className="btn-primary inline-flex items-center gap-2 justify-center text-base px-8 py-3.5">
                Explore Materials <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/builders" className="inline-flex items-center gap-2 justify-center text-base px-8 py-3.5 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors font-semibold">
                Find Builders
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="page-container py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { v: "50+", l: "Verified Dealers" },
              { v: "30+", l: "Builders & Architects" },
              { v: "200+", l: "Properties Listed" },
              { v: "15+", l: "Areas in Coimbatore" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-bold text-brand-400">{s.v}</div>
                <div className="text-sm text-earth-500">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Categories */}
      <section className="py-20 bg-earth-50">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-earth-900 mb-3">Everything to Build With</h2>
            <p className="text-earth-500 max-w-lg mx-auto">From raw materials to finished homes — one platform for all of Coimbatore's construction needs.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Package, title: "Materials", desc: "Cement, TMT steel, bricks, paint and more from verified local dealers", href: "/materials", color: "text-orange-500", bg: "bg-orange-50", border: "hover:border-orange-200" },
              { icon: Building2, title: "Builders & Arch", desc: "Connect with experienced builders, architects, and contractors", href: "/builders", color: "text-blue-500", bg: "bg-blue-50", border: "hover:border-blue-200" },
              { icon: Home, title: "Properties", desc: "Buy, sell, or rent residential and commercial properties", href: "/properties", color: "text-green-500", bg: "bg-green-50", border: "hover:border-green-200" },
              { icon: Wrench, title: "Services", desc: "Interior, plumbing, electrical and skilled workers", href: "/services", color: "text-purple-500", bg: "bg-purple-50", border: "hover:border-purple-200" },
            ].map((c) => (
              <Link key={c.title} href={c.href} className={`card p-6 group ${c.border} transition-all`}>
                <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <c.icon className={`w-6 h-6 ${c.color}`} />
                </div>
                <h3 className="font-semibold text-earth-900 text-lg mb-2">{c.title}</h3>
                <p className="text-sm text-earth-500 leading-relaxed">{c.desc}</p>
                <div className={`mt-4 flex items-center gap-1 text-sm font-medium ${c.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Browse <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Kattodam */}
      <section className="py-20 bg-white">
        <div className="page-container grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl font-bold text-earth-900 mb-4">Why Kattodam?</h2>
            <p className="text-earth-500 mb-8 leading-relaxed">
              We're built to solve the real problems in Coimbatore construction — opaque pricing, unreliable contractors, and scattered information.
            </p>
            <div className="space-y-5">
              {[
                { icon: Shield, title: "Verified Dealers & Builders", desc: "Every listing is manually verified before going live on the platform." },
                { icon: Phone, title: "Lead Protection", desc: "Your contact goes through us — no cold calls, no spam, you're in control." },
                { icon: Star, title: "Transparent Pricing", desc: "Compare material prices across multiple dealers before you enquire." },
                { icon: MapPin, title: "Hyper-local Focus", desc: "We know every area — RS Puram to Sulur. Built for Coimbatore." },
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
            <h3 className="font-display text-2xl font-bold mb-2">For Dealers & Builders</h3>
            <p className="text-earth-400 text-sm mb-6">Get your business in front of thousands of buyers in Coimbatore.</p>
            <div className="space-y-3 mb-8">
              {["Get qualified leads directly", "Showcase projects & past work", "Manage enquiries in one dashboard", "Verified badge builds trust", "Subscription plans — affordable"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  <span className="text-earth-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <Link href="/auth/login" className="btn-primary w-full text-center block">Register Your Business</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-500">
        <div className="page-container text-center text-white">
          <h2 className="font-display text-4xl font-bold mb-4">Ready to Build in Coimbatore?</h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">Join homeowners, dealers, and builders who trust Kattodam.</p>
          <Link href="/auth/login" className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold px-8 py-4 rounded-xl hover:bg-earth-50 transition-colors shadow-lg text-base">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-earth-900 text-earth-400 py-10">
        <div className="page-container flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-white font-bold">Kattodam</span>
          </div>
          <p>Coimbatore's Construction Marketplace © {new Date().getFullYear()}</p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Contact"].map((l) => (
              <Link key={l} href="#" className="hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
