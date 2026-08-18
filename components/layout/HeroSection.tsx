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
    <section className="relative overflow-hidden bg-background text-foreground min-h-[85vh] flex flex-col justify-between transition-colors duration-300">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative pt-28 sm:pt-32 md:pt-36 pb-16 md:pb-20">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary backdrop-blur-md">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-extrabold text-primary-foreground">
                KD
              </span>
              <span>TRUSTED HOME & COMMERCIAL CONSTRUCTION PLATFORM</span>
            </div>

            {/* Giant Title Typography */}
            <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Build <span className="font-serif italic font-normal text-primary">Better.</span> <br />
              Build with{" "}
              <span className="bg-primary text-primary-foreground px-3 py-0.5 rounded-lg inline-block font-black shadow-lg shadow-primary/20">
                Confidence.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base font-bold tracking-widest text-primary uppercase md:text-lg">
              Simple. Transparent. Trusted.
            </p>

            {/* Main Description */}
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              From quality materials to verified construction professionals and reliable services, <strong className="text-foreground">KATTADAM</strong> brings everything you need to build your KATTADAM — Land to Living.
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
                  className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary shadow-sm backdrop-blur-sm"
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
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-[#5ee06a] hover:scale-105"
              >
                Get a Free Consultation <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <a
                href={KD360_TEL_HREF}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-bold text-foreground backdrop-blur-md transition-all hover:border-primary/50 hover:bg-accent shadow-sm"
              >
                <Phone className="h-4 w-4 text-primary" />
                <span>Call Now: +91 {KD360_PHONE_DISPLAY}</span>
              </a>
            </div>

            {/* Social Proof Badge */}
            <div className="flex items-center gap-3 pt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1 text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-primary" />
                ))}
              </div>
              <span className="font-semibold text-foreground">5/5 Verified</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-primary" />
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
