"use client";

import Image from "next/image";
import { ArrowRight, MapPin, Star, Phone, CheckCircle2, ShieldCheck, Box, Clock, Layers } from "lucide-react";
import { KD360_PHONE_DISPLAY, KD360_TEL_HREF } from "@/lib/kd360-contact";
import heroDarkBuildings from "@/assets/images/landing/hero-dark-buildings.png";
import cardExperts from "@/assets/images/landing/card-experts.png";
import cardMaterials from "@/assets/images/landing/card-materials.png";

interface HeroSectionProps {
  onSendEnquiry: (target: string) => void;
}

export default function HeroSection({ onSendEnquiry }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden text-white min-h-[85vh] flex flex-col justify-between">
      {/* Background building image with softer gradient shade */}
      <div className="absolute inset-0">
        <Image
          src="/about-us-collage.png"
          alt="Modern Construction Skyline"
          fill
          className="object-cover object-center opacity-100"
          priority
          sizes="100vw"
        />
        {/* Soft gradient overlays: Dark left for text, clear right for image visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/60 to-transparent sm:via-[#121212]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
      </div>

      <div className="w-full px-6 sm:px-10 lg:px-16 relative pt-28 sm:pt-32 md:pt-36 pb-16 md:pb-20">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6 max-w-3xl">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/50 bg-[var(--primary)]/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-[var(--primary)] backdrop-blur-md">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-extrabold text-[#0d1f0f]">
                KD
              </span>
              <span>TRUSTED HOME & COMMERCIAL CONSTRUCTION PLATFORM</span>
            </div>

            {/* Giant Title Typography */}
            <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
              Build <span className="font-serif italic font-normal text-[var(--primary)]">Better.</span> <br />
              Build with{" "}
              <span className="bg-[var(--primary)] text-[#0d1f0f] px-3 py-0.5 rounded-lg inline-block font-black shadow-lg shadow-[var(--primary)]/20">
                Confidence.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base font-bold tracking-widest text-[var(--primary)] uppercase md:text-lg">
              Simple. Transparent. Trusted.
            </p>

            {/* Main Description */}
            <p className="max-w-2xl text-base leading-relaxed text-cement-300 md:text-lg">
              From quality materials to verified construction professionals and reliable services, <strong className="text-white">KATTADAM</strong> brings everything you need to build your KATTADAM — Land to Living.
            </p>

            {/* Verified Feature Badges */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 pt-1">
              {[
                "✓ Verified Network",
                "✓ Transparent Pricing",
                "✓ Quality Materials",
                "✓ Trusted Services",
              ].map((pill) => (
                <div
                  key={pill}
                  className="flex items-center gap-1.5 rounded-full border border-[var(--primary)]/30 bg-[#0d1f0f]/90 px-3.5 py-1.5 text-xs font-bold text-[var(--primary)] shadow-sm backdrop-blur-sm"
                >
                  {pill}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                type="button"
                onClick={() => onSendEnquiry("General Construction")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3.5 text-sm font-extrabold text-[#0d1f0f] shadow-lg shadow-[var(--primary)]/20 transition-all hover:bg-[#5ee06a] hover:scale-105"
              >
                Get a Free Consultation <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <a
                href={KD360_TEL_HREF}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/10"
              >
                <Phone className="h-4 w-4 text-[var(--primary)]" />
                <span>Call Now: +91 {KD360_PHONE_DISPLAY}</span>
              </a>
            </div>

            {/* Social Proof Badge */}
            <div className="flex items-center gap-3 pt-3 text-xs text-cement-400">
              <div className="flex items-center gap-1 text-[var(--primary)]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[var(--primary)]" />
                ))}
              </div>
              <span className="font-semibold text-white">5/5 Verified</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[var(--primary)]" />
                Coimbatore · Tirupur · Erode · Salem · Chennai
              </span>
            </div>
          </div>

          {/* Right Column - Reference-Style Grid Collage Layout */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end pt-8 lg:pt-0">
            {/* Background Accent Radial Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[var(--primary)]/30 via-[var(--primary)]/10 to-transparent blur-3xl rounded-full opacity-80 pointer-events-none" />

            {/* Transparent Grid Collage Container */}
            <div className="relative w-full max-w-[460px]">
              
              {/* Grid 2-Column Layout */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* Left Column */}
                <div className="flex flex-col gap-3">
                  {/* Frame 1: Luxury Villa (Tall) */}
                  <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-white/20 group shadow-xl bg-black/40">
                    <Image
                      src="/hero-collage-1.png"
                      alt="Luxury Villa Construction"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 border border-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                        🏡 Villa Projects
                      </span>
                    </div>
                  </div>

                  {/* Frame 2: Happy Family (Horizontal) */}
                  <div className="relative h-36 sm:h-40 rounded-2xl overflow-hidden border border-white/20 group shadow-xl bg-black/40">
                    <Image
                      src="/hero-collage-3.png"
                      alt="Happy Homeowners"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 border border-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                        ❤️ Happy Families
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-3">
                  {/* Frame 3: Civil Engineers (Horizontal) */}
                  <div className="relative h-36 sm:h-40 rounded-2xl overflow-hidden border border-white/20 group shadow-xl bg-black/40">
                    <Image
                      src="/hero-collage-2.png"
                      alt="Verified Civil Engineers"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 border border-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                        👷 Verified Experts
                      </span>
                    </div>
                  </div>

                  {/* Frame 4: Building Materials (Tall) */}
                  <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-[var(--primary)]/40 group shadow-xl bg-black/40">
                    <Image
                      src="/hero-collage-4.png"
                      alt="Quality Building Materials"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)] px-2.5 py-1 text-[10px] font-extrabold text-[#0d1f0f] shadow-md">
                        🧱 Quality Materials
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Floating Top Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full border border-[var(--primary)]/50 bg-black/90 px-4 py-1.5 text-xs font-extrabold text-white shadow-2xl backdrop-blur-md whitespace-nowrap">
                <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
                <span>Tamil Nadu&apos;s #1 Ecosystem</span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
