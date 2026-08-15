"use client";

import Navbar from "@/components/layout/Navbar";
import FooterSection from "@/components/layout/FooterSection";
import { KD360_PHONE_DISPLAY, KD360_GSTIN, KD360_NAME } from "@/lib/kd360-contact";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-bold text-primary mb-6">
              <ShieldCheck className="w-4 h-4" />
              100% Secure & Trusted
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
              Privacy <span className="text-primary">Policy</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Effective Date: {new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="space-y-10 text-muted-foreground leading-relaxed text-base md:text-lg">
            
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
              <p>
                Welcome to <strong className="text-zinc-200">{KD360_NAME}</strong> ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform, use our construction marketplace, or engage with our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
              <p className="mb-4">We may collect personal and business information that you voluntarily provide to us when you register on our platform, express an interest in obtaining information about our products/services, or otherwise contact us. The information we collect may include:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                <li><strong className="text-zinc-200">Personal Info:</strong> Name, phone number, email address, and delivery addresses.</li>
                <li><strong className="text-zinc-200">Business Info:</strong> Company name, GSTIN (e.g., {KD360_GSTIN}), trade licenses, and business addresses for our verified dealer network.</li>
                <li><strong className="text-zinc-200">Project Details:</strong> Construction requirements, material estimates, and service requests used to match you with appropriate vendors.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
              <p className="mb-4">Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Platform to:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                <li>Connect home owners with verified material dealers, experts, and skilled labor.</li>
                <li>Process and manage orders, enquiries, and lead generation.</li>
                <li>Verify the authenticity of our vendors (via GSTIN and official documents) to maintain a trusted ecosystem.</li>
                <li>Improve our website functionality, customer service, and overall user experience.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Lead Privacy Guarantee</h2>
              <p>
                At {KD360_NAME}, we take the privacy of our business partners seriously. We operate a strict <strong className="text-zinc-200">Lead Privacy Guarantee</strong>. This means that customer enquiries and project leads distributed to our registered vendors are strictly confidential and shared only with the relevant matched partners to ensure fair business practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Sharing and Disclosure</h2>
              <p className="mb-4">
                We may share your information with third parties only in the ways that are described in this Privacy Policy:
              </p>
              <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                <li><strong className="text-zinc-200">Service Providers:</strong> We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us (e.g., delivery logistics).</li>
                <li><strong className="text-zinc-200">Legal Compliance:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, or court order.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Data Security</h2>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>
            </section>

            <section className="bg-card p-6 md:p-8 rounded-2xl border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Contact Us</h2>
              <p className="mb-4">
                If you have questions or comments about this Privacy Policy, please contact our Customer Support team:
              </p>
              <ul className="space-y-3 font-medium">
                <li className="flex items-center gap-3">
                  <span className="text-primary">Phone:</span> 
                  <span className="text-foreground">+91 {KD360_PHONE_DISPLAY}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-primary">Location:</span> 
                  <span className="text-foreground">Coimbatore, Tamil Nadu, India</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-primary">GSTIN:</span> 
                  <span className="text-foreground font-mono">{KD360_GSTIN}</span>
                </li>
              </ul>
            </section>

          </div>

        </div>
      </main>

      <FooterSection />
    </div>
  );
}
