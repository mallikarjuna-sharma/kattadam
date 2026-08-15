"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/layout/HeroSection";
import ThirukkuralSection from "@/components/layout/ThirukkuralSection";
import ServicesShowcaseSection from "@/components/layout/ServicesShowcaseSection";
import StatsBannerSection from "@/components/layout/StatsBannerSection";
import WhyKattadamSection from "@/components/layout/WhyKattadamSection";
import AboutUsSection from "@/components/layout/AboutUsSection";
import PartnersSection from "@/components/layout/PartnersSection";
import CallToActionSection from "@/components/layout/CallToActionSection";
import FooterSection from "@/components/layout/FooterSection";
import EnquiryModal from "@/components/ui/EnquiryModal";

export default function LandingPage() {
  const [enquiry, setEnquiry] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <HeroSection onSendEnquiry={(target) => setEnquiry(target)} />
      <ThirukkuralSection />

      <ServicesShowcaseSection onSendEnquiry={(target) => setEnquiry(target)} />
      <StatsBannerSection />

      <AboutUsSection />

      <WhyKattadamSection onSendEnquiry={(target) => setEnquiry(target)} />

      <PartnersSection />

      <CallToActionSection onSendEnquiry={(target) => setEnquiry(target)} />

      {enquiry && <EnquiryModal target={enquiry} onClose={() => setEnquiry(null)} />}

      <FooterSection />
    </div>
  );
}
