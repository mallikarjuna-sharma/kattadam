"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import EnquiryModal from "@/components/ui/EnquiryModal";
import { ArrowRight, MapPin, Star, Shield, Phone, CheckCircle } from "lucide-react";
import KD360Logo from "@/components/ui/KD360Logo";
import { KD360_PHONE_DISPLAY, KD360_TEL_HREF } from "@/lib/kd360-contact";

const HERO_PILLS = ["Centralized", "Priced", "Scale", "Revolution", "Safety"] as const;

const SHOWCASE_CARDS = [
  {
    image: "/images/landing/card-materials.png",
    title: "Explore Materials",
    desc: "Cement, TMT steel, bricks, paint and more from verified local dealers across our districts.",
    primaryHref: "/materials",
    primaryLabel: "Browse materials",
    secondaryHref: "/builders",
    secondaryLabel: "Kattadam experts",
    enquiryTarget: "Materials",
  },
  {
    image: "/images/landing/card-experts.png",
    title: "Kattadam Experts",
    desc: "Engineers, architects, and builders — verified professionals to plan and deliver your project.",
    primaryHref: "/builders",
    primaryLabel: "Find experts",
    secondaryHref: "/builders",
    secondaryLabel: "View projects",
    enquiryTarget: "Kattadam Experts",
  },
  {
    image: "/images/landing/card-realestate.png",
    title: "Explore Real Estate",
    desc: "Buy, sell, or rent plots, flats, and land — clear listings from verified sellers.",
    primaryHref: "/properties",
    primaryLabel: "Browse listings",
    secondaryHref: "/properties",
    secondaryLabel: "Browse projects",
    enquiryTarget: "Real estate",
  },
  {
    image: "/images/landing/card-homeservices.png",
    title: "Explore Home Services",
    desc: "Interiors, renovations, painting, electrical, plumbing, and masonry — skilled verified workers.",
    primaryHref: "/services",
    primaryLabel: "Browse services",
    secondaryHref: "/services",
    secondaryLabel: "Book online",
    enquiryTarget: "Home services",
  },
] as const;

function ServiceShowcaseCard({
  image,
  title,
  desc,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  onSendEnquiry,
}: {
  image: string;
  title: string;
  desc: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  onSendEnquiry: () => void;
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e1e] shadow-xl">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image src={image} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] via-transparent to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="font-display text-xl font-bold text-white">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-cement-300">{desc}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href={primaryHref}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#4CAF50] px-4 py-2 text-sm font-semibold text-[#0d1f0f] transition-colors hover:bg-[#5ee06a]"
          >
            {primaryLabel} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-transparent px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/5"
          >
            {secondaryLabel} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={onSendEnquiry}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-cement-400 transition-colors hover:border-[#4CAF50]/50 hover:text-[#4CAF50]"
          >
            <Phone className="h-3.5 w-3.5" /> Send enquiry
          </button>
        </div>
      </div>
      <div className="flex items-center justify-end border-t border-white/10 bg-[#141414] px-4 py-3">
        <a
          href={KD360_TEL_HREF}
          className="inline-flex items-center gap-2 rounded-full bg-[#4CAF50] px-4 py-2 text-sm font-bold text-[#0d1f0f] transition-colors hover:bg-[#5ee06a]"
        >
          <Phone className="h-4 w-4" /> Call now
        </a>
      </div>
    </article>
  );
}

export default function LandingPage() {
  const [enquiry, setEnquiry] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar variant="dark" />

      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/landing/hero-construction.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/85 via-[#121212]/70 to-[#121212]" />
        </div>

        <div className="page-container relative py-14 md:py-20">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              Construction made{" "}
              <span className="text-[#4CAF50]">simple</span>,{" "}
              <span className="text-[#4CAF50]">transparent</span>, and{" "}
              <span className="text-[#4CAF50]">local</span>.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-cement-200 md:text-lg">
              From materials to Kattadam experts — everything you need, verified in one place.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-cement-300">
              {HERO_PILLS.map((pill) => (
                <span key={pill} className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4CAF50]" aria-hidden />
                  {pill}
                </span>
              ))}
            </div>
            <p className="mt-5 flex flex-wrap items-center gap-2 text-sm text-cement-300 md:text-base">
              <MapPin className="h-4 w-4 text-[#4CAF50]" aria-hidden />
              Coimbatore · Tirupur · Erode · Namakkal · Salem
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {SHOWCASE_CARDS.map((card) => (
              <ServiceShowcaseCard
                key={card.title}
                {...card}
                onSendEnquiry={() => setEnquiry(card.enquiryTarget)}
              />
            ))}
          </div>
        </div>

        <div className="relative border-t border-white/10">
          <div className="page-container grid grid-cols-2 gap-6 py-8 text-center md:grid-cols-4">
            {[
              { v: "50+", l: "Verified dealers" },
              { v: "30+", l: "Kattadam Experts" },
              { v: "200+", l: "Real estate listings" },
              { v: "5", l: "District service area" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-bold text-[#4CAF50] md:text-3xl">{s.v}</div>
                <div className="mt-1 text-sm text-cement-400">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-20">
        <div className="page-container max-w-3xl mx-auto text-center">
          <p className="text-2xl mb-3" aria-hidden>
            🔶
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight">
            Why Kattadam?
          </h2>
          <p className="text-cement-300 text-lg leading-relaxed mb-10">
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
                <div className="w-11 h-11 bg-[#4CAF50]/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-[#4CAF50]" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-lg mb-2">
                    <span className="mr-2" aria-hidden>
                      {item.emoji}
                    </span>
                    {item.title}
                  </h4>
                  <p className="text-sm text-cement-400 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-xl">
            <Image
              src="/images/kd360-truck-hero.png"
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#052010]/95 via-[#052010]/85 to-[#052010]/70" />
            <div className="relative space-y-5 p-8 text-white md:p-10">
              <h3 className="font-display text-2xl font-bold leading-snug md:text-3xl">
                Kattadam — You dream. We build. End-to-end construction ecosystem.
              </h3>
              <p className="text-sm leading-relaxed text-cement-200 md:text-base">
                From land — raw materials — final handover, Kattadam integrates every stage of construction into a single
                intelligent system.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-white/10">
        <div className="page-container grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">Kattadam partners</h3>
            <p className="text-cement-400 text-sm mb-6 leading-relaxed">
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
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] flex-shrink-0" />
                  <span className="text-cement-300 text-sm">{item}</span>
                </div>
              ))}
            </ul>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-full bg-[#4CAF50] px-8 py-3 text-sm font-semibold text-[#0d1f0f] transition-colors hover:bg-[#5ee06a]"
            >
              Register as Kattadam partner
            </Link>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#1e1e1e] p-8">
            <p className="text-sm text-cement-300 leading-relaxed">
              Whether you supply materials, offer home services, or are a Kattadam Expert, partner onboarding is handled
              through the same trusted flow — so homeowners see one consistent, professional experience.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#4CAF50]">
        <div className="page-container text-center text-[#0d1f0f]">
          <h2 className="mb-2 flex justify-center">
            <KD360Logo size="xl" className="text-[#0d1f0f]" />
          </h2>
          <p className="font-semibold text-lg tracking-wide mb-4">+91 {KD360_PHONE_DISPLAY}</p>
          <p className="mb-8 max-w-lg mx-auto text-base leading-relaxed opacity-90">
            Speak with our team for materials, experts, real estate, or services — we&apos;ll guide your next step.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={KD360_TEL_HREF}
              className="inline-flex items-center gap-2 bg-[#121212] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#1e1e1e] transition-colors shadow-lg text-base"
            >
              <Phone className="w-4 h-4" /> Call +91 {KD360_PHONE_DISPLAY}
            </a>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 border-2 border-[#0d1f0f]/30 text-[#0d1f0f] font-semibold px-8 py-4 rounded-full hover:bg-[#0d1f0f]/10 transition-colors text-base"
            >
              Get started free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {enquiry && <EnquiryModal target={enquiry} onClose={() => setEnquiry(null)} />}

      <footer className="bg-[#0a0a0a] text-cement-400 py-10 border-t border-white/10">
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
