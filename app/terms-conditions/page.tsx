"use client";

import Navbar from "@/components/layout/Navbar";
import FooterSection from "@/components/layout/FooterSection";
import { KD360_PHONE_DISPLAY, KD360_GSTIN, KD360_NAME } from "@/lib/kd360-contact";
import { ShieldCheck } from "lucide-react";

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-bold text-primary mb-6">
              <ShieldCheck className="w-4 h-4" />
              Verified Legal Document
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
              Terms & <span className="text-primary">Conditions</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Effective Date: {new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="space-y-10 text-muted-foreground leading-relaxed text-base md:text-lg">
            
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction & Acceptance</h2>
              <p>
                Welcome to <strong className="text-zinc-200">{KD360_NAME}</strong>. These Terms and Conditions govern your use of our platform, website, and services. By accessing or using the Kattadam Construction Ecosystem, you agree to be bound by these terms. If you do not agree with any part of these terms, you must not use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Description of Services</h2>
              <p className="mb-4">
                {KD360_NAME} acts as a specialized regional construction ecosystem connecting:
              </p>
              <ul className="list-disc pl-6 space-y-2 marker:text-primary mb-4">
                <li>Home owners and individual builders with verified material suppliers.</li>
                <li>Clients looking for construction experts, architects, and skilled labor.</li>
                <li>Individuals interested in verified real estate and property listings.</li>
              </ul>
              <p>
                We provide a digital marketplace and lead generation platform but do not directly manufacture construction materials or provide direct building services unless explicitly stated.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts & Partner Registration</h2>
              <p className="mb-4">
                When registering an account as a partner or vendor on {KD360_NAME}, you must provide accurate and complete information. For verified dealers:
              </p>
              <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                <li>You are required to submit valid business registration details, including your GSTIN. Our platform operates strictly with registered entities (Our GSTIN: <strong className="text-zinc-200">{KD360_GSTIN}</strong>).</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>We reserve the right to suspend or terminate accounts that provide false information or violate our platform integrity guidelines.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Marketplace Guidelines & Transactions</h2>
              <p className="mb-4">
                While {KD360_NAME} facilitates connections between buyers and sellers in the construction industry:
              </p>
              <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                <li>We strive to verify all vendors, but users are advised to exercise their own due diligence before entering into financial transactions.</li>
                <li>Any agreements, contracts, or payments made directly between home owners and vendors/builders are strictly between those parties.</li>
                <li>{KD360_NAME} shall not be held liable for disputes arising from material quality, delivery delays, or service deficiencies provided by independent vendors on our platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Intellectual Property Rights</h2>
              <p>
                All content on the {KD360_NAME} platform, including logos, text, graphics, images (including our 3D construction collages), and software, is the intellectual property of {KD360_NAME} and is protected by copyright laws. You may not reproduce, distribute, or create derivative works without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, {KD360_NAME} and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of your access to or use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Governing Law and Jurisdiction</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts located in Coimbatore, Tamil Nadu, India.
              </p>
            </section>

            <section className="bg-card p-6 md:p-8 rounded-2xl border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Contact Us</h2>
              <p className="mb-4">
                For any legal enquiries or questions regarding these Terms, please reach out to us:
              </p>
              <ul className="space-y-3 font-medium">
                <li className="flex items-center gap-3">
                  <span className="text-primary">Support Helpline:</span> 
                  <span className="text-foreground">+91 {KD360_PHONE_DISPLAY}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-primary">Head Office:</span> 
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
