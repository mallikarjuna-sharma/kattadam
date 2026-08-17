"use client";

import Link from "next/link";
import { Phone, ArrowRight, Sparkles } from "lucide-react";
import { KD360_PHONE_DISPLAY, KD360_TEL_HREF } from "@/lib/kd360-contact";
import { useSiteLang } from "@/components/providers/AppShell";

export default function CallToActionSection({
  onSendEnquiry,
}: {
  onSendEnquiry?: (target: string) => void;
}) {
  const { lang } = useSiteLang();
  const isTa = lang === "ta";

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      
      {/* Right Side Concentric Ripple Rings matching reference image design */}
      <div className="absolute top-1/2 -right-40 md:-right-10 -translate-y-1/2 pointer-events-none flex items-center justify-center select-none">
        <div className="w-[1100px] h-[1100px] rounded-full bg-white/[0.04] flex items-center justify-center">
          <div className="w-[900px] h-[900px] rounded-full bg-white/[0.06] flex items-center justify-center">
            <div className="w-[700px] h-[700px] rounded-full bg-white/[0.08] flex items-center justify-center">
              <div className="w-[500px] h-[500px] rounded-full bg-white/[0.12] flex items-center justify-center">
                <div className="w-[300px] h-[300px] rounded-full bg-white/[0.18] flex items-center justify-center">
                  <div className="w-[150px] h-[150px] rounded-full bg-white/[0.25]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container relative z-10 py-16 md:py-24">
        <div className="max-w-2xl text-left space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-primary-foreground backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isTa ? "நேரடி தொடர்பு" : "LET'S GET IN TOUCH"}</span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-primary-foreground">
            {isTa ? (
              <>எங்களுடன் <span className="italic font-serif">தொடர்புகொள்ளுங்கள்.</span></>
            ) : (
              <>Let&apos;s Get <span className="italic font-serif">In Touch.</span></>
            )}
          </h2>

          {/* Description */}
          <p className="text-base md:text-lg leading-relaxed font-medium text-primary-foreground/90 max-w-xl">
            {isTa
              ? "பொருட்கள், ஒப்பந்ததாரர்கள், நிலங்கள் அல்லது வீட்டு சேவைகள் — எங்களின் நிபுணத்துவ குழுவிடம் பேசி உங்கள் திட்டத்தைத் தொடங்குங்கள்."
              : "Speak with our team for raw materials, verified experts, real estate listings, or skilled home services — we'll guide your next step."}
          </p>

          {/* Pill Buttons matching reference image style */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            
            {/* Button 1 */}
            <a
              href={KD360_TEL_HREF}
              className="group inline-flex items-center justify-between gap-4 bg-primary-foreground text-white font-extrabold pl-6 pr-2 py-2.5 rounded-full hover:bg-black transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 text-sm"
            >
              <span>{isTa ? "அழைக்க (+91 " + KD360_PHONE_DISPLAY + ")" : "Call +91 " + KD360_PHONE_DISPLAY}</span>
              <div className="w-9 h-9 rounded-full bg-white text-primary-foreground flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Phone className="w-4 h-4 fill-current" />
              </div>
            </a>

            {/* Button 2 */}
            <Link
              href="/auth/login"
              className="group inline-flex items-center justify-between gap-4 bg-primary-foreground text-white font-extrabold pl-6 pr-2 py-2.5 rounded-full hover:bg-black transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 text-sm"
            >
              <span>{isTa ? "இலவசமாக தொடங்க" : "Get started free"}</span>
              <div className="w-9 h-9 rounded-full bg-white text-primary-foreground flex items-center justify-center shadow-md group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
}
