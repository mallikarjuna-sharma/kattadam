"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, Sparkles, ArrowLeft } from "lucide-react";
import { useSiteLang } from "@/components/providers/AppShell";
import { KD360_TEL_HREF } from "@/lib/kd360-contact";
import cardHomeservices from "@/assets/images/landing/card-homeservices-v2.png";
import cardExperts from "@/assets/images/landing/card-experts.png";
import cardMaterials from "@/assets/images/landing/card-materials.png";
import cardRealestate from "@/assets/images/landing/card-realestate.png";
import { useRef } from "react";

const SHOWCASE_CARDS = [
  {
    image: cardRealestate,
    category: "Real Estate",
    title: "Plots & Properties",
    desc: "Buy, sell, or rent plots, flats, and land with verified transparent listings.",
    primaryHref: "/properties",
    primaryLabel: "View Listings",
    enquiryTarget: "Real estate",
  },
  {
    image: cardExperts,
    category: "Professionals",
    title: "Find Expert",
    desc: "Engineers, architects, and builders to plan, design, and deliver your project.",
    primaryHref: "/builders",
    primaryLabel: "Find Experts",
    enquiryTarget: "Kattadam Experts",
  },
  {
    image: cardMaterials,
    category: "Direct Supply",
    title: "Quality Materials",
    desc: "Cement, TMT steel, bricks, and paint from verified local dealers.",
    primaryHref: "/materials",
    primaryLabel: "Browse Materials",
    enquiryTarget: "Materials",
  },
  {
    image: cardHomeservices,
    category: "Home Services",
    title: "Skilled Labour",
    desc: "Interiors, painting, plumbing, electrical, and masonry from verified professionals.",
    primaryHref: "/services",
    primaryLabel: "Book Service",
    enquiryTarget: "Home services",
  },
] as const;

function ServiceShowcaseCard({
  image,
  category,
  title,
  desc,
  primaryHref,
  primaryLabel,
  onSendEnquiry,
}: any) {
  return (
    <article className="group relative flex h-[350px] md:h-[400px] w-full flex-col justify-end overflow-hidden bg-[#0a0a0a]">
      {/* Background Image */}
      <Image
        src={image}
        alt={title}
        fill
        quality={100}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:opacity-90"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      {/* Gradients for readability */}
      <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
      
      {/* Content Container */}
      <div className="relative z-10 flex w-full flex-col items-center px-6 pb-12 pt-6 text-center">
        {/* Category Badge */}
        <div className="mb-4 inline-flex items-center rounded-full border border-border bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-2">
          {category}
        </div>
        
        {/* Title */}
        <h3 className="font-display text-2xl md:text-3xl font-bold text-white transition-transform duration-500 group-hover:-translate-y-2">
          {title}
        </h3>
        
        {/* Animated Reveal Section */}
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-in-out group-hover:grid-rows-[1fr] w-full">
          <div className="overflow-hidden flex flex-col items-center w-full">
            <p className="mt-3 mb-6 text-sm leading-relaxed text-zinc-300 opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100">
              {desc}
            </p>
            <div className="flex w-full gap-3 opacity-0 transition-opacity duration-500 delay-150 group-hover:opacity-100">
              <Link 
                href={primaryHref} 
                className="flex-1 rounded-full bg-primary py-3 text-xs font-extrabold text-primary-foreground hover:bg-[#5ee06a] transition-colors"
              >
                {primaryLabel}
              </Link>
              <button 
                onClick={onSendEnquiry} 
                className="flex-1 rounded-full border border-white/20 bg-white/10 py-3 text-xs font-bold text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                Enquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ServicesShowcaseSection({
  onSendEnquiry,
}: {
  onSendEnquiry: (target: string) => void;
}) {
  const { lang } = useSiteLang();
  const isTa = lang === "ta";
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };
  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="bg-background py-16 md:py-24 border-t border-border overflow-hidden">
      <div className="page-container flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center max-w-5xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isTa ? "கட்டடம் சேவைகள் & தீர்வுகள்" : "KATTADAM ECOSYSTEM"}</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
            {isTa ? (
              <>
                நமது <span className="italic font-serif text-primary">சேவைகள் & பொருட்கள்</span>
              </>
            ) : (
              <>
                Explore <span className="italic font-serif text-primary">Services & Marketplace</span>
              </>
            )}
          </h2>

          <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            {isTa
              ? "உங்கள் கட்டடத் தேவைக்கான அனைத்து வசதிகளும் — சரிபார்க்கப்பட்ட நிபுணர்கள், தரமான பொருட்கள், நிலங்கள் மற்றும் வீட்டு சேவைகள்."
              : "Everything you need for your construction project — verified professionals, quality materials, real estate listings, and skilled home services."}
          </p>
        </div>
      </div>

      {/* Curved 3D-like Gallery */}
      <div className="w-full max-w-[1600px] mx-auto mt-6 px-0 sm:px-4 md:px-8">
        {/* The Mask Container */}
        <div 
          className="overflow-hidden bg-background"
          style={{ 
            clipPath: "ellipse(95% 50% at 50% 50%)", 
            WebkitClipPath: "ellipse(95% 50% at 50% 50%)" 
          }}
        >
          {/* Horizontal scroll carousel for all devices */}
          <div 
            ref={scrollRef}
            className="flex gap-1 md:gap-1.5 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          >
            {SHOWCASE_CARDS.map((card) => (
              <div key={card.title} className="w-[85vw] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] shrink-0 snap-center">
                <ServiceShowcaseCard
                  {...card}
                  onSendEnquiry={() => onSendEnquiry(card.enquiryTarget)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button onClick={scrollLeft} className="p-3 rounded-full border border-border text-foreground hover:bg-white/10 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <button onClick={scrollRight} className="p-3 rounded-full border border-border text-foreground hover:bg-white/10 transition-colors">
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
