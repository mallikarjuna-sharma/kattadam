import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import {
  Building2,
  Package,
  Home,
  Wrench,
  ArrowRight,
  MapPin,
  Star,
  Shield,
  Phone,
  CheckCircle,
} from "lucide-react";
import { KD360_NAME, KD360_PHONE_DISPLAY, KD360_TEL_HREF } from "@/lib/kd360-contact";

function ConsultLink() {
  return (
    <a
      href={KD360_TEL_HREF}
      className="inline-flex flex-col items-center justify-center rounded-xl border-2 border-brand-400 bg-brand-50 px-4 py-3 text-center text-sm font-semibold text-brand-800 hover:bg-brand-100 transition-colors min-w-[160px]"
    >
      <span>{KD360_NAME}</span>
      <span className="mt-0.5 text-xs font-bold text-brand-700 tracking-wide">+91 {KD360_PHONE_DISPLAY}</span>
      <span className="mt-1 text-xs font-normal text-cement-600">
        <span className="line-through text-cement-400">₹500</span>{" "}
        <span className="font-semibold text-brand-700">Free consultations</span>
      </span>
    </a>
  );
}

function ExploreRow({
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-cement-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex flex-wrap gap-3">
          <Link
            href={primaryHref}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 text-white px-5 py-3 text-sm font-semibold hover:bg-brand-700 transition-colors"
          >
            {primaryLabel} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex items-center gap-2 rounded-xl border border-cement-200 bg-cement-50 px-5 py-3 text-sm font-semibold text-cement-800 hover:border-brand-300 transition-colors"
          >
            {secondaryLabel} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ConsultLink />
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="bg-cement-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #4caf50 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/15 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />

        <div className="page-container py-20 md:py-28 relative">
          <div className="max-w-3xl space-y-8">
            <div className="flex flex-wrap items-start gap-6">
              <Image
                src="/logo.jpeg"
                alt=""
                width={72}
                height={72}
                className="rounded-2xl object-cover border border-white/10 shadow-lg"
                priority
              />
              <div>
                <p className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">கட்டடம்</p>
                <p className="text-brand-100/90 text-sm md:text-base mt-2 leading-relaxed max-w-md">
                  Build Better. Together.
                </p>
              </div>
            </div>

            <div>
              <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.12] text-white">
                Construction made simple, transparent, and local.
              </h1>
              <p className="text-cement-200 text-lg md:text-xl leading-relaxed mt-6 max-w-2xl">
                From materials to Kattadam experts — everything you need, verified in one place.
              </p>
            </div>

            <p className="text-brand-100 text-base md:text-lg flex flex-wrap items-center gap-2">
              <span className="text-xl" aria-hidden>
                📍
              </span>
              <span>Coimbatore · Tirupur · Erode · Namakkal · Salem</span>
            </p>

            <p className="text-cement-200 text-lg font-medium max-w-xl">
              No middlemen. No confusion. Just trusted connections.
            </p>

            <hr className="border-white/15 max-w-md" />

            <div className="space-y-6">
              <ExploreRow
                primaryHref="/materials"
                primaryLabel="Explore materials"
                secondaryHref="/builders"
                secondaryLabel="Explore Kattadam experts"
              />
              <ExploreRow
                primaryHref="/properties"
                primaryLabel="Explore real estate"
                secondaryHref="/services"
                secondaryLabel="Explore home services"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="page-container py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { v: "50+", l: "Verified dealers" },
              { v: "30+", l: "Kattadam Experts" },
              { v: "200+", l: "Real estate listings" },
              { v: "5", l: "District service area" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-bold text-brand-400">{s.v}</div>
                <div className="text-sm text-cement-400">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-cement-50">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-cement-900 mb-3">Everything to build with</h2>
            <p className="text-cement-500 max-w-lg mx-auto">
              One place for materials, experts, real estate, and home services across our districts.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Package,
                title: "Materials",
                desc: "Cement, TMT steel, bricks, paint and more from verified local dealers",
                href: "/materials",
                color: "text-brand-600",
                bg: "bg-brand-50",
                border: "hover:border-brand-200",
              },
              {
                icon: Building2,
                title: "Kattadam Experts",
                desc: "Engineers, architects, and builders — verified professionals",
                href: "/builders",
                color: "text-cement-600",
                bg: "bg-cement-100",
                border: "hover:border-cement-300",
              },
              {
                icon: Home,
                title: "Real estate",
                desc: "Buy, sell, or rent with clear plot, flat, and land options",
                href: "/properties",
                color: "text-brand-700",
                bg: "bg-brand-50",
                border: "hover:border-brand-200",
              },
              {
                icon: Wrench,
                title: "Home services",
                desc: "Interiors, renovations, painting, electrical, plumbing, masonry",
                href: "/services",
                color: "text-cement-600",
                bg: "bg-cement-100",
                border: "hover:border-cement-300",
              },
            ].map((c) => (
              <Link key={c.title} href={c.href} className={`card p-6 group ${c.border} transition-all`}>
                <div
                  className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                >
                  <c.icon className={`w-6 h-6 ${c.color}`} />
                </div>
                <h3 className="font-semibold text-cement-900 text-lg mb-2">{c.title}</h3>
                <p className="text-sm text-cement-500 leading-relaxed">{c.desc}</p>
                <div
                  className={`mt-4 flex items-center gap-1 text-sm font-medium ${c.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                >
                  Browse <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-white">
        <div className="page-container max-w-3xl mx-auto text-center">
          <p className="text-2xl mb-3" aria-hidden>
            🔶
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cement-900 mb-8 tracking-tight">
            Why Kattadam?
          </h2>
          <p className="text-cement-600 text-lg leading-relaxed mb-10">
            Because construction shouldn&apos;t be confusing, risky, or overpriced. We&apos;re building a trusted
            ecosystem for regional construction — solving real problems like hidden pricing, unreliable contractors, and
            scattered information.
          </p>
        </div>
        <div className="page-container grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            {[
              {
                icon: Shield,
                emoji: "✅",
                title: "Verified dealers & Kattadam Experts",
                body: "Every dealer, contractor, and service provider is strictly verified before listing — so you connect only with reliable professionals.",
              },
              {
                icon: Phone,
                emoji: "🛡️",
                title: "Lead protection",
                body: "No random calls. No spam. Your enquiry stays fully in your control — you decide who can contact you.",
              },
              {
                icon: Star,
                emoji: "💰",
                title: "Transparent pricing",
                body: "Compare material prices from multiple dealers in your area — no more guesswork, no more overpaying.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-cement-900 text-lg mb-2">
                    <span className="mr-2" aria-hidden>
                      {item.emoji}
                    </span>
                    {item.title}
                  </h4>
                  <p className="text-sm text-cement-600 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-cement-900 to-cement-800 text-white p-8 md:p-10 shadow-xl space-y-5">
            <h3 className="font-display text-2xl md:text-3xl font-bold leading-snug">
              Kattadam — You dream. We build. End-to-end construction ecosystem.
            </h3>
            <p className="text-cement-300 text-sm md:text-base leading-relaxed">
              From land — raw materials — final handover, Kattadam integrates every stage of construction into a single
              intelligent system.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-cement-50 border-y border-cement-100">
        <div className="page-container grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-display text-2xl font-bold text-cement-900 mb-2">Kattadam partners</h3>
            <p className="text-cement-500 text-sm mb-6 leading-relaxed">
              List your firm and reach serious buyers across Coimbatore, Tirupur, Erode, Namakkal, and Salem.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Qualified leads with context",
                "Showcase projects and credentials",
                "Manage enquiries in one place",
                "Verified badge builds trust",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <span className="text-cement-600 text-sm">{item}</span>
                </div>
              ))}
            </ul>
            <Link href="/auth/login" className="btn-primary inline-block text-center px-8 py-3">
              Register as Kattadam partner
            </Link>
          </div>
          <div className="card p-8 bg-white">
            <p className="text-sm text-cement-600 leading-relaxed">
              Whether you supply materials, offer home services, or are a Kattadam Expert, partner onboarding is handled
              through the same trusted flow — so homeowners see one consistent, professional experience.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-600">
        <div className="page-container text-center text-white">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">{KD360_NAME}</h2>
          <p className="text-white font-semibold text-lg tracking-wide mb-4">+91 {KD360_PHONE_DISPLAY}</p>
          <p className="text-white/90 mb-8 max-w-lg mx-auto text-base leading-relaxed">
            Speak with our team for materials, experts, real estate, or services — we&apos;ll guide your next step.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={KD360_TEL_HREF}
              className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-8 py-4 rounded-xl hover:bg-cement-50 transition-colors shadow-lg text-base"
            >
              <Phone className="w-4 h-4" /> Call +91 {KD360_PHONE_DISPLAY}
            </a>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 border border-white/40 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-base"
            >
              Get started free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-cement-900 text-cement-400 py-10">
        <div className="page-container flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Image src="/logo.jpeg" alt="" width={28} height={28} className="rounded-md object-cover" />
            <span className="font-display text-white font-bold tracking-tight">Kattadam</span>
          </div>
          <p>Construction marketplace © {new Date().getFullYear()}</p>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms
            </Link>
            <a href={KD360_TEL_HREF} className="hover:text-white transition-colors">
              Contact · +91 {KD360_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
