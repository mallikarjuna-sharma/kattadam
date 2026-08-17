"use client";
import { useState } from "react";
import { X, Phone, CheckCircle, AlertCircle, Mail } from "lucide-react";
import { buildCreateEnquiryPayload, submitEnquiry } from "@/lib/enquiries-api";

const ENQUIRY_SUBTITLE = "Submit your enquiry and we'll connect you with the right dealer.";

interface Props {
  target: string;
  /** When set (real dealer UUID from live catalogue), stored as assigned_dealer_id */
  dealerId?: string;
  /** When set (material UUID), stored as material_id on the enquiry */
  materialId?: string;
  onClose: () => void;
}

export default function EnquiryModal({ target, dealerId, materialId, onClose }: Props) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    altPhone: "",
    email: "",
    currentAddress: "",
    deliveryAddress: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.phone.length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (form.altPhone && form.altPhone.length !== 10) {
      setError("Enter a valid 10-digit alternate mobile number.");
      return;
    }
    if (form.altPhone && form.altPhone === form.phone) {
      setError("Alternate mobile must be different from the primary mobile number.");
      return;
    }
    if (!form.currentAddress.trim()) {
      setError("Current address is required.");
      return;
    }
    if (!form.deliveryAddress.trim()) {
      setError("Delivery address is required.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = buildCreateEnquiryPayload(form, { target, dealerId, materialId });
      const data = await submitEnquiry(payload);
      if (!data.ok) {
        console.error("[EnquiryModal] Submit failed:", data);
        const devDetail =
          process.env.NODE_ENV === "development" && data.detail && data.detail !== data.error
            ? ` (${data.detail})`
            : "";
        setError(data.error + devDetail);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center py-[6dvh] px-3 sm:px-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-card text-card-foreground rounded-3xl border border-border dark:border-zinc-800 w-full max-w-full sm:max-w-xl md:max-w-2xl shadow-2xl max-h-[88dvh] flex flex-col overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {!submitted ? (
          <>
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-border dark:border-zinc-800 shrink-0">
              <h3 className="font-extrabold text-foreground dark:text-white text-lg sm:text-xl">Send Enquiry</h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="w-8 h-8 rounded-full bg-muted dark:bg-zinc-800 flex items-center justify-center hover:bg-muted/80 dark:hover:bg-zinc-700 transition-colors text-foreground dark:text-white shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="px-4 sm:px-6 pt-4 pb-6 space-y-4 overflow-y-auto flex-1 min-h-0 overscroll-contain"
            >
              <div className="rounded-2xl border border-primary/40 bg-primary/10 dark:bg-primary/15 px-4 py-3.5 text-center">
                <p className="text-sm sm:text-base font-extrabold text-primary">{target}</p>
                <p className="text-xs sm:text-sm text-foreground/80 dark:text-zinc-300 font-medium mt-1 leading-snug">{ENQUIRY_SUBTITLE}</p>
              </div>

              {error && (
                <div className="flex gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground dark:text-zinc-200 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full py-3 px-4 rounded-2xl bg-background dark:bg-zinc-900 text-foreground dark:text-white border border-border dark:border-zinc-700 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-medium transition-all"
                  placeholder="Eg: Karthik Kumar"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="min-w-0">
                  <label className="block text-xs sm:text-sm font-bold text-foreground dark:text-zinc-200 mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 bg-muted dark:bg-zinc-800 border border-border dark:border-zinc-700 rounded-2xl text-foreground dark:text-zinc-200 text-sm font-bold shrink-0">
                      +91
                    </span>
                    <input
                      className="w-full py-3 px-4 rounded-2xl bg-background dark:bg-zinc-900 text-foreground dark:text-white border border-border dark:border-zinc-700 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-medium transition-all flex-1 min-w-0"
                      placeholder="98765 43210"
                      required
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      maxLength={10}
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                      }
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <label className="block text-xs sm:text-sm font-bold text-foreground dark:text-zinc-200 mb-1.5">
                    Alternate Mobile <span className="text-muted-foreground dark:text-zinc-400 font-normal text-xs">(optional)</span>
                  </label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 bg-muted dark:bg-zinc-800 border border-border dark:border-zinc-700 rounded-2xl text-foreground dark:text-zinc-200 text-sm font-bold shrink-0">
                      +91
                    </span>
                    <input
                      className="w-full py-3 px-4 rounded-2xl bg-background dark:bg-zinc-900 text-foreground dark:text-white border border-border dark:border-zinc-700 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-medium transition-all flex-1 min-w-0"
                      placeholder="Another number"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={form.altPhone}
                      onChange={(e) =>
                        setForm({ ...form, altPhone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground dark:text-zinc-200 mb-1.5">
                  Email <span className="text-muted-foreground dark:text-zinc-400 font-normal text-xs">(optional)</span>
                </label>
                <div className="flex gap-2 min-w-0">
                  <span className="flex items-center px-3.5 bg-muted dark:bg-zinc-800 border border-border dark:border-zinc-700 rounded-2xl text-muted-foreground dark:text-zinc-300 shrink-0">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    className="w-full py-3 px-4 rounded-2xl bg-background dark:bg-zinc-900 text-foreground dark:text-white border border-border dark:border-zinc-700 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-medium transition-all flex-1 min-w-0"
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground dark:text-zinc-200 mb-1.5">
                  Current address <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full py-3 px-4 rounded-2xl bg-background dark:bg-zinc-900 text-foreground dark:text-white border border-border dark:border-zinc-700 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-medium transition-all resize-none min-h-[72px]"
                  placeholder="Site / home address with area and district"
                  required
                  rows={2}
                  value={form.currentAddress}
                  onChange={(e) => setForm({ ...form, currentAddress: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground dark:text-zinc-200 mb-1.5">
                  Delivery address <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full py-3 px-4 rounded-2xl bg-background dark:bg-zinc-900 text-foreground dark:text-white border border-border dark:border-zinc-700 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-medium transition-all resize-none min-h-[72px]"
                  placeholder="Delivery location with area and district"
                  required
                  rows={2}
                  value={form.deliveryAddress}
                  onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-foreground dark:text-zinc-200 mb-1.5">
                  Requirement <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full py-3 px-4 rounded-2xl bg-background dark:bg-zinc-900 text-foreground dark:text-white border border-border dark:border-zinc-700 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-medium transition-all resize-none h-20 sm:h-24"
                  placeholder="Describe what you need..."
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-primary text-primary-foreground font-extrabold text-sm hover:bg-[#5ee06a] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-60"
              >
                <Phone className="w-4 h-4 fill-current" /> {submitting ? "Sending…" : "Submit Enquiry"}
              </button>
              <p className="text-xs text-muted-foreground dark:text-zinc-400 text-center pb-1 sm:pb-0">
                Your details are saved for the team to follow up
              </p>
            </form>
          </>
        ) : (
          <div className="px-4 sm:px-6 py-8 text-center overflow-y-auto flex-1 min-h-0">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-extrabold text-foreground dark:text-white text-xl mb-2">Enquiry Sent!</h3>
            <p className="text-muted-foreground dark:text-zinc-300 text-sm mb-6 leading-relaxed">
              {materialId && !dealerId
                ? "Our team will contact you on "
                : "The dealer will contact you on "}
              <strong className="text-foreground dark:text-white">+91 {form.phone}</strong> shortly.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-extrabold text-sm hover:bg-[#5ee06a] transition-all shadow-md shadow-primary/20"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
