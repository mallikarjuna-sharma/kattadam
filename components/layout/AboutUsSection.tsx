"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, MapPin, Target, ArrowRight, Award, CheckCircle2 } from "lucide-react";
import { useSiteLang } from "@/components/providers/AppShell";
import { KD360_GSTIN } from "@/lib/kd360-contact";

export default function AboutUsSection() {
  const { lang } = useSiteLang();
  const isTa = lang === "ta";

  const PILLARS = [
    {
      icon: Target,
      title: isTa ? "எங்களின் நோக்கம்" : "Our Mission",
      desc: isTa
        ? "தமிழ்நாட்டில் வீடு கட்டுவோருக்கும், சிறந்த கட்டடப் பொருள் விநியோகஸ்தர்கள் மற்றும் பொறியாளர்களுக்கும் இடையே ஒரு வெளிப்படையான இணைப்பை உருவாக்குவது."
        : "To create a seamless, transparent bridge between home builders and verified material suppliers, civil engineers, and skilled technicians.",
    },
    {
      icon: MapPin,
      title: isTa ? "மண்டல பலம்" : "Regional Focus",
      desc: isTa
        ? "கோவை, திருப்பூர், ஈரோடு, சேலம், நாமக்கல் மற்றும் சென்னை மாவட்டங்களில் நேரடி சேவை மற்றும் உள்ளூர் விநியோகம்."
        : "Deep root coverage across Coimbatore, Tirupur, Erode, Salem, Namakkal, and Chennai districts.",
    },
    {
      icon: ShieldCheck,
      title: isTa ? "100% பாதுகாப்பு & நம்பிக்கை" : "100% Verified Quality",
      desc: isTa
        ? "நாங்கள் இணைக்கும் ஒவ்வொரு ஒப்பந்ததாரரும், பொறியாளரும் மற்றும் மூலப்பொருள் விநியோகஸ்தரும் சரிபார்க்கப்பட்ட பின்னரே தளத்தில் இணைக்கப்படுகின்றனர்."
        : "Every material dealer, civil engineer, and service expert undergoes strict vetting for quality assurance.",
    },
  ];

  return (
    <section className="relative bg-background py-20 md:py-28 overflow-hidden border-t border-border">
      
      {/* Radial Background Accent Glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="page-container relative z-10 space-y-16">
        
        {/* Section Title & Subtitle (Kept as requested) */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-md">
            <Sparkles className="h-4 w-4" />
            <span>{isTa ? "கட்டடம் 360° பற்றி" : "ABOUT KATTADAM 360°"}</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            {isTa ? (
              <>
                தமிழ்நாட்டின் நம்பிக்கையான <span className="italic font-serif text-primary">கட்டட சேவை அமைப்பு</span>
              </>
            ) : (
              <>
                Building Tamil Nadu&apos;s Most Trusted <span className="italic font-serif text-primary">Construction Ecosystem</span>
              </>
            )}
          </h2>

          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            {isTa
              ? "தரமான கட்டடப் பொருட்கள் முதல் சிறந்த கட்டட வல்லுனர்கள் வரை அனைத்தையும் ஒரே தளத்தில் வழங்குகிறோம். உங்கள் கனவு இல்லத்தை நம்பிக்கையுடன் கட்டுங்கள்."
              : "We bring verified quality materials, top-rated civil engineers, and skilled services into one transparent platform. Build your dream space with confidence."}
          </p>
        </div>

        {/* 2-Column Section: Left Content + Right Collage Image */}
        <div className="grid lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
          
          {/* Left Column: Content & GST Badge */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* GST Registered Company Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/40 bg-primary/15 px-4 py-2 text-xs font-extrabold text-primary backdrop-blur-md shadow-lg">
              <Award className="w-4 h-4 text-primary" />
              <span>
                {isTa ? "GST பதிவு செய்யப்பட்ட நிறுவனம் · 100% நம்பகமானது" : "GST Registered Company · Verified Business"}
              </span>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-2xl md:text-3xl font-black text-foreground leading-snug">
                {isTa
                  ? "வெளிப்படையான தளம், இடைத்தரகர்கள் இல்லாத நேரடி சேவை."
                  : "Transparent Regional Platform with Zero Hidden Markups."}
              </h3>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {isTa
                  ? "நாங்கள் அரசு அனுமதி பெற்ற மற்றும் GST பதிவு செய்யப்பட்ட கட்டட தளமாக இயங்குகிறோம். வாடிக்கையாளர்களுக்கு சிறந்த தரமான பொருட்களை நியாயமான விலையில் பெற்றுத் தருகிறோம்."
                  : "We operate as an officially registered and GST compliant construction platform. We protect customer privacy and directly connect home builders with verified suppliers."}
              </p>
            </div>

            {/* 3 Pillars List */}
            <div className="space-y-4 pt-2">
              {PILLARS.map((pillar) => (
                <div
                  key={pillar.title}
                  className="flex items-start gap-4 rounded-2xl border border-border bg-cement-50 p-4 transition-all hover:border-primary/40 hover:bg-cement-100 dark:bg-[#141b15]/70 dark:backdrop-blur-md dark:hover:bg-[#18241a]/80"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <pillar.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-base mb-1">{pillar.title}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Link */}
            <div className="pt-2">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground font-extrabold px-7 py-3.5 rounded-full hover:bg-[#5ee06a] transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 text-sm"
              >
                <span>{isTa ? "இப்போதே இணையுங்கள்" : "Explore Our Ecosystem"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

          {/* Right Column: Collage Style Image Layout */}
          <div className="lg:col-span-6 relative pt-4 pb-6">
            
            {/* Background Offset Glow Box */}
            <div className="absolute -inset-2 bg-gradient-to-br from-[#4CAF50]/25 via-[#4CAF50]/10 to-transparent rounded-3xl transform rotate-2 blur-sm pointer-events-none" />

            {/* Main Collage Hero Image */}
            <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl bg-[#121a14]">
              <Image
                src="/about-us-collage.png"
                alt="Kattadam Construction Collage"
                width={600}
                height={450}
                className="w-full h-[380px] md:h-[420px] object-cover hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d120e] via-transparent to-transparent opacity-80" />
            </div>

            {/* Secondary Overlapping Floating Card Image */}
            <div className="absolute -bottom-6 -left-6 w-44 md:w-52 rounded-2xl overflow-hidden border-2 border-border shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-300 hidden sm:block">
              <Image
                src="/images/landing/card-materials.png"
                alt="Materials & Steel"
                width={220}
                height={160}
                className="w-full h-32 object-cover"
              />
              <div className="bg-white/90 dark:bg-[#121c14]/90 p-2.5 backdrop-blur-md border-t border-border text-left">
                <span className="text-[11px] font-bold text-foreground block">Quality Materials</span>
                <span className="text-[10px] text-primary">Steel · Cement · Sand</span>
              </div>
            </div>

            {/* Top Right Floating GST Verified Badge */}
            <div className="absolute -top-5 -right-3 md:-right-5 rounded-2xl border border-primary/50 bg-white/95 dark:bg-[#0d1910]/95 p-3.5 md:p-4 backdrop-blur-xl shadow-2xl flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black shadow-md shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-foreground">
                  {isTa ? "GST பதிவு செய்யப்பட்ட நிறுவனம்" : "GST Registered Company"}
                </p>
                <p className="text-[11px] font-mono font-bold text-primary">
                  GSTIN: {KD360_GSTIN}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
