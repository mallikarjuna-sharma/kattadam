"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, ShieldCheck, ArrowRight, Heart } from "lucide-react";
import { KD360_PHONE_DISPLAY, KD360_TEL_HREF, KD360_GSTIN } from "@/lib/kd360-contact";
import { useSiteLang } from "@/components/providers/AppShell";

export default function FooterSection() {
  const { lang } = useSiteLang();
  const isTa = lang === "ta";

  return (
    <footer className="relative bg-background text-muted-foreground pt-16 pb-12 border-t border-border overflow-hidden">
      
      {/* Background Accent Glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="page-container relative z-10 space-y-16">
        
        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Column 1: Brand Info (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Kattadam"
                width={220}
                height={80}
                className="h-16 md:h-20 w-auto object-contain rounded-2xl hover:scale-105 transition-transform"
                priority
              />
            </Link>

            <p className="text-sm leading-relaxed text-muted-foreground max-w-sm">
              {isTa
                ? "தமிழ்நாட்டின் நம்பிக்கையான கட்டட சேவை தளம். சரிபார்க்கப்பட்ட விநியோகஸ்தர்கள், பொறியாளர்கள், நிலங்கள் மற்றும் வீட்டு சேவைகளை ஒரே இடத்தில் இணைக்கிறது."
                : "Tamil Nadu's trusted regional construction ecosystem — connecting home owners with verified material dealers, experts, real estate, and skilled labor."}
            </p>

            {/* Regional Badge Ticker */}
            <div className="pt-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                {isTa ? "சேவை பகுதிகள்:" : "Service Districts:"}
              </span>
              <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                {["Coimbatore", "Tirupur", "Erode", "Salem", "Namakkal", "Chennai"].map((city) => (
                  <span key={city} className="rounded-md border border-border bg-background px-2.5 py-1">
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-foreground text-sm font-bold uppercase tracking-wider">
              {isTa ? "சேவைகள்" : "Ecosystem"}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/properties" className="hover:text-primary transition-colors">
                  {isTa ? "நிலம் & வீடுகள்" : "Real Estate Listings"}
                </Link>
              </li>
              <li>
                <Link href="/builders" className="hover:text-primary transition-colors">
                  {isTa ? "நிபுணரைக் கண்டறி" : "Find Experts"}
                </Link>
              </li>
              <li>
                <Link href="/materials" className="hover:text-primary transition-colors">
                  {isTa ? "மூலப்பொருட்கள்" : "Buy Materials"}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  {isTa ? "திறன்மிகு தொழிலாளர்கள்" : "Skilled Labour & Services"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Partner Network */}
          <div className="space-y-4">
            <h4 className="text-foreground text-sm font-bold uppercase tracking-wider">
              {isTa ? "பங்காளர்கள்" : "Partners"}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/auth/login" className="hover:text-primary transition-colors">
                  {isTa ? "பங்காளராகப் பதிவு செய்ய" : "Register as Partner"}
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground">
                  {isTa ? "சரிபார்க்கப்பட்ட விற்பனையாளர்" : "Verified Dealer Network"}
                </span>
              </li>
              <li>
                <span className="text-muted-foreground">
                  {isTa ? "லீட் பாதுகாப்பு கொள்கை" : "Lead Privacy Guarantee"}
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Direct Support */}
          <div className="space-y-4">
            <h4 className="text-foreground text-sm font-bold uppercase tracking-wider">
              {isTa ? "தொடர்புகொள்ள" : "Support"}
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href={KD360_TEL_HREF}
                className="flex items-center gap-2.5 text-primary font-bold hover:underline"
              >
                <Phone className="w-4 h-4" />
                <span>+91 {KD360_PHONE_DISPLAY}</span>
              </a>

              <div className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <span>Coimbatore, Tamil Nadu, India</span>
              </div>

              <div className="pt-2 space-y-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isTa ? "100% பாதுகாப்பான சேவை" : "Verified Marketplace"}
                </span>

                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="text-muted-foreground font-semibold">GSTIN:</span>
                  <span className="text-foreground font-mono font-bold tracking-wider">{KD360_GSTIN}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Legal Line */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-2">
            <span>© {new Date().getFullYear()} Kattadam Construction Ecosystem. All rights reserved.</span>
            <span>·</span>
            <span className="font-mono text-muted-foreground">GSTIN: {KD360_GSTIN}</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-muted-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-conditions" className="hover:text-muted-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-muted-foreground transition-colors">
              Support
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
