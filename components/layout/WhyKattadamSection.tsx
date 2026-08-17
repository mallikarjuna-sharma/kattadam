"use client";

import Image from "next/image";
import { ShieldCheck, Lock, TrendingDown, Compass, Sparkles, ArrowRight } from "lucide-react";
import { useSiteLang } from "@/components/providers/AppShell";
import whyChooseUsHero from "@/assets/images/landing/why-choose-us-hero.png";

export default function WhyKattadamSection({
  onSendEnquiry,
}: {
  onSendEnquiry?: (target: string) => void;
}) {
  const { lang } = useSiteLang();
  const isTa = lang === "ta";

  return (
    <section className="relative bg-background py-20 md:py-28 overflow-hidden border-t border-border">
      
      {/* Background Circular Arc Pattern matching reference image */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full border border-dashed border-primary/40 animate-[spin_60s_linear_infinite]" />
        <div className="absolute w-[400px] h-[400px] md:w-[550px] md:h-[550px] rounded-full border border-primary/20" />
      </div>

      <div className="page-container relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isTa ? "ஏன் கட்டடம்?" : "THE KATTADAM ADVANTAGE"}</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight">
            {isTa ? (
              <>
                ஏன் தேர்வு செய்ய வேண்டும் <span className="italic font-serif text-primary">எங்களை?</span>
              </>
            ) : (
              <>
                Why choose <span className="italic font-serif text-primary">us?</span>
              </>
            )}
          </h2>

          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            {isTa
              ? "நிலம் தேர்வு முதல் சாவி ஒப்படைப்பு வரை, உங்கள் கட்டடப் பயணத்தை வெளிப்படையான விலைகள் மற்றும் நம்பகமான சேவையுடன் நாங்கள் பார்த்துக் கொள்கிறோம்."
              : "From land acquisition to final handover, we've got your construction journey covered with transparent pricing and verified experts."}
          </p>
        </div>

        {/* 3-Column Layout: Left Features | Center Image & CTA | Right Features */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center max-w-6xl mx-auto">
          
          {/* Left Column (2 Points) */}
          <div className="lg:col-span-4 flex flex-col justify-center space-y-12 text-center lg:text-right">
            
            {/* Feature 1 */}
            <div className="group space-y-3 p-4 rounded-2xl transition-all hover:bg-white/5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/15 text-primary border border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {isTa ? "சரிபார்க்கப்பட்ட நிபுணர்கள்" : "Expert Professionals"}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto lg:ml-auto lg:mr-0">
                {isTa
                  ? "அனைத்து பொறியாளர்கள் மற்றும் ஒப்பந்ததாரர்கள் சரிபார்க்கப்பட்ட பிறகே இணைக்கப்படுகிறார்கள்."
                  : "Our verified experts provide top-quality service. Trust us for accurate planning and quality construction."}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group space-y-3 p-4 rounded-2xl transition-all hover:bg-white/5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/15 text-primary border border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-md">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {isTa ? "100% ஸ்பேம் பாதுகாப்பு" : "100% Lead Privacy"}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto lg:ml-auto lg:mr-0">
                {isTa
                  ? "தேவையில்லாத தொலைபேசி அழைப்புகள் இல்லை. உங்கள் விருப்பப்படி மட்டுமே தொடர்புகொள்ள முடியும்."
                  : "Your enquiry stays fully in your control. No random calls, no spam — you decide who can contact you."}
              </p>
            </div>

          </div>

          {/* Center Column (Hero Image with Offset Backdrop & CTA) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center my-4 lg:my-0">
            <div className="relative w-full max-w-[320px] sm:max-w-[340px]">
              
              {/* Offset Background Accent Box matching screenshot */}
              <div className="absolute inset-0 translate-x-3 translate-y-3 bg-primary/20 border border-primary/40 rounded-3xl -z-10 transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4" />

              {/* Main Image Box */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-border shadow-2xl bg-[#181818]">
                <Image
                  src={whyChooseUsHero}
                  alt="Why Choose Kattadam"
                  fill
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
            </div>

            {/* CTA Button below image */}
            <div className="mt-8 text-center">
              <button
                onClick={() => onSendEnquiry?.("Why Choose Us Enquiry")}
                className="inline-flex items-center gap-2.5 rounded-2xl bg-primary px-8 py-4 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-[#5ee06a] hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span>{isTa ? "இலவச மதிப்பீடு பெற" : "Get a FREE estimate"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column (2 Points) */}
          <div className="lg:col-span-4 flex flex-col justify-center space-y-12 text-center lg:text-left">
            
            {/* Feature 3 */}
            <div className="group space-y-3 p-4 rounded-2xl transition-all hover:bg-white/5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/15 text-primary border border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-md">
                <TrendingDown className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {isTa ? "வெளிப்படையான விலைகள்" : "Affordable & Clear Pricing"}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto lg:mr-auto lg:ml-0">
                {isTa
                  ? "மறைமுகக் கட்டணங்கள் இல்லை. பல விநியோகஸ்தர்களின் சிமெண்ட், கம்பி விலைகளை ஒப்பிட்டு வாங்கலாம்."
                  : "High-quality materials at prices you can afford. No hidden fees, just honest and transparent pricing."}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group space-y-3 p-4 rounded-2xl transition-all hover:bg-white/5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/15 text-primary border border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-md">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {isTa ? "முழுமையான சேவைகள்" : "All-Inclusive Services"}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto lg:mr-auto lg:ml-0">
                {isTa
                  ? "வரைபடம், மூலப்பொருட்கள் முதல் இன்டீரியர் வரை அனைத்துத் தேவைகளுக்கும் ஒரே இடம்."
                  : "From raw materials to complex architecture, we handle it all. Your one-stop shop for construction needs."}
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
