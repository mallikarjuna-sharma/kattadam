"use client";

import Link from "next/link";
import { 
  ShieldCheck, 
  Sparkles, 
  CreditCard, 
  Briefcase, 
  Inbox, 
  Award,
  ArrowRight,
  Building2,
  Users,
  Wrench,
  Truck
} from "lucide-react";
import { useSiteLang } from "@/components/providers/AppShell";

export default function PartnersSection() {
  const { lang } = useSiteLang();
  const isTa = lang === "ta";

  const BENEFITS = [
    {
      num: "01",
      icon: CreditCard,
      title: isTa ? "நேரடி கட்டண பாதுகாப்பு" : "Guaranteed Direct Payouts",
      desc: isTa
        ? "நாங்கள் கட்டணத்தைப் பாதுகாப்பாகப் பெறுகிறோம் — நீங்கள் ஆர்டரை விநியோகித்து பாதுகாப்பாகப் பணத்தைப் பெறுங்கள்."
        : "We manage secure payments — you supply the order and receive guaranteed timely payouts.",
    },
    {
      num: "02",
      icon: Briefcase,
      title: isTa ? "திட்டங்கள் & திறன்களைக் காட்டுங்கள்" : "Showcase Project Portfolio",
      desc: isTa
        ? "உங்கள் முந்தைய கட்டடப் பணிகள் மற்றும் வாடிக்கையாளர் மதிப்புரைகளை ஒரே இடத்தில் காட்சிப்படுத்துங்கள்."
        : "Display your past projects, licenses, and verified customer ratings to win client trust.",
    },
    {
      num: "03",
      icon: Inbox,
      title: isTa ? "ஒரே இடத்தில் அனைத்து ஆர்டர்கள்" : "Centralized Order Management",
      desc: isTa
        ? "வாடிக்கையாளர்களின் தேவைகள், புதிய திட்டங்கள் மற்றும் ஆர்டர்களை ஒரே டேஷ்போர்டில் பெறலாம்."
        : "Receive verified client enquiries, material orders, and service requests in one unified dashboard.",
    },
    {
      num: "04",
      icon: Award,
      title: isTa ? "சரிபார்க்கப்பட்ட அங்கீகாரம்" : "Verified Partner Badge",
      desc: isTa
        ? "சரிபார்க்கப்பட்ட பேட்ஜ் மூலம் வாடிக்கையாளர்களிடம் உங்கள் வணிகத்திற்கான முழு நம்பிக்கையை உருவாக்குங்கள்."
        : "Stand out with a verified Kattadam Partner badge that builds instant customer confidence.",
    },
  ];

  const PARTNER_TYPES = [
    { label: isTa ? "பொருட்கள் விற்பனையாளர்கள்" : "Material Dealers", icon: Truck },
    { label: isTa ? "கட்டட பொறியாளர்கள்" : "Civil Engineers", icon: Building2 },
    { label: isTa ? "ஒப்பந்ததாரர்கள்" : "Contractors", icon: Users },
    { label: isTa ? "வீட்டு சேவை நிபுணர்கள்" : "Home Technicians", icon: Wrench },
  ];

  return (
    <section className="relative bg-background py-20 md:py-28 overflow-hidden border-t border-border">
      {/* Background Accent Glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="page-container relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-md">
            <Sparkles className="h-4 w-4" />
            <span>{isTa ? "வணிக வளர்ச்சி" : "PARTNER WITH KATTADAM"}</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight">
            {isTa ? (
              <>
                கட்டடம் <span className="italic font-serif text-primary">பங்காளராக?</span>
              </>
            ) : (
              <>
                Become a <span className="italic font-serif text-primary">partner?</span>
              </>
            )}
          </h2>

          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {isTa
              ? "கோவை, திருப்பூர், ஈரோடு, சேலம், நாமக்கல் மற்றும் சென்னையில் உங்கள் வணிகத்தைப் பதிவு செய்து நேரடி வாடிக்கையாளர்களை அடையுங்கள்."
              : "List your business and connect with high-intent buyers across Coimbatore, Tirupur, Erode, Salem, Namakkal & Chennai."}
          </p>

          {/* Partner Categories Ticker */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            {PARTNER_TYPES.map((cat) => (
              <span
                key={cat.label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md"
              >
                <cat.icon className="h-3.5 w-3.5 text-primary" />
                {cat.label}
              </span>
            ))}
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Left Side: 4 Benefit Cards Grid */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {BENEFITS.map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden flex flex-col justify-between rounded-2xl border border-border bg-cement-50 dark:bg-gradient-to-br dark:from-[#1c1c1c]/90 dark:via-[#161616]/80 dark:to-[#121212]/90 p-6 backdrop-blur-md transition-all duration-500 hover:border-primary/60 hover:shadow-primary/10 hover:-translate-y-1 shadow-lg hover:bg-cement-100"
              >
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity" />

                {/* Corner Radial Glow */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/25 transition-colors duration-500 pointer-events-none" />

                {/* Watermark Icon */}
                <item.icon className="absolute -top-3 -right-3 w-28 h-28 text-foreground/[0.04] group-hover:text-primary/15 group-hover:scale-110 transition-all duration-500 pointer-events-none stroke-1" />

                <div className="relative z-10">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-md">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black tracking-widest text-zinc-600 group-hover:text-primary transition-colors">
                      {item.num}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground text-base md:text-lg mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side: Onboarding Spotlight Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative flex-1 rounded-3xl border border-primary/30 bg-primary/5 dark:bg-gradient-to-br dark:from-[#0f2413] dark:via-[#0d1f11] dark:to-[#08140b] p-8 md:p-10 shadow-2xl flex flex-col justify-between overflow-hidden group">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isTa ? "நம்பகமான தளம்" : "Unified Onboarding"}</span>
                </div>

                <h3 className="font-display text-2xl md:text-3xl font-extrabold text-foreground leading-snug">
                  {isTa ? (
                    <>ஒரே தளத்தில் <span className="text-primary">அனைத்து பங்காளர்களும்</span></>
                  ) : (
                    <>One Streamlined Platform for <span className="text-primary">All Partners</span></>
                  )}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isTa
                    ? "நீங்கள் பொருட்கள் விற்பனையாளராகவோ, சேவை நிபுணராகவோ அல்லது கட்டடம் வல்லுநராகவோ இருந்தாலும் — எங்களின் எளிய பதிவு மூலம் உடனே சேவையைத் தொடங்குங்கள்."
                    : "Whether you supply materials, offer home services, or are a Kattadam Expert, partner onboarding is handled through a single trusted workflow — delivering a consistent experience for home owners."}
                </p>
              </div>

              <div className="relative z-10 pt-8">
                <Link
                  href="/auth/login"
                  className="w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-8 py-4 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-[#5ee06a] hover:scale-102 transition-all duration-300"
                >
                  <span>{isTa ? "பங்காளராகப் பதிவு செய்ய" : "Register as Kattadam Partner"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
