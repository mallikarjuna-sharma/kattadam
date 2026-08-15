"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { useSiteLang } from "@/components/providers/AppShell";
import thiruvalluvarImg from "@/assets/images/landing/thiruvalluvar.png";

export default function ThirukkuralSection() {
  const { lang } = useSiteLang();
  const isTa = lang === "ta";

  return (
    <section className="relative overflow-hidden bg-[#161616] py-3 text-foreground border-y border-border">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        <div className="grid lg:grid-cols-12 gap-4 items-center">
          
          {/* Left Column: Thirukkural 2 Lines (Line 1: 4 words, Line 2: 3 words) */}
          <div className="lg:col-span-5 flex items-center gap-3">
            <Quote className="h-6 w-6 text-primary shrink-0 opacity-80" />
            <div>
              <p className="font-serif text-sm sm:text-base font-bold text-primary leading-snug tracking-wide">
                செய்வானை நாடி வினைநாடிக் காலத்தோடு
              </p>
              <p className="font-serif text-sm sm:text-base font-bold text-primary leading-snug tracking-wide">
                எய்த உணர்ந்து செயல்.
              </p>
              <span className="text-[10px] text-cement-400 font-mono tracking-wider">
                — {isTa ? "திருக்குறள் 516" : "Thirukkural 516"}
              </span>
            </div>
          </div>

          {/* Right Column: Dynamic Explanation Banner + Thiruvalluvar Image */}
          <div className="lg:col-span-7 flex items-center gap-3">
            {/* Elegant Explanation Quote Card */}
            <div className="flex-1 rounded-2xl border border-primary/30 bg-[#0f2013]/70 p-4 shadow-lg backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary" />
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span>{isTa ? "விளக்கவுரை" : "PHILOSOPHY MEANING"}</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-zinc-200 font-medium italic">
                {isTa ? (
                  "“சரியான நிலம், சரியான நபர்கள், தரமான பொருட்கள், நம்பகமான சேவை — இவற்றைத் தேர்ந்தெடுத்து, பணியைப் புரிந்து, திட்டமிட்டு, சரியான நேரத்தில் கட்டடத்தைத் தொடங்குங்கள்.”"
                ) : (
                  "“Choose the right land, the right people, quality materials, and reliable services — understand the work, plan it well, and begin your KATTADAM at the right time.”"
                )}
              </p>
            </div>

            {/* Thiruvalluvar Image + Green Accent Line */}
            <div className="flex flex-col items-center shrink-0">
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 shrink-0">
                <Image
                  src={thiruvalluvarImg}
                  alt="Thiruvalluvar"
                  fill
                  className="object-contain object-bottom drop-shadow-lg"
                />
              </div>
              <div className="h-0.5 w-12 bg-primary rounded-full -mt-0.5 opacity-90" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
