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
      className="fixed inset-0 z-50 flex items-center justify-center py-[10dvh] px-3 sm:px-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-full sm:max-w-xl md:max-w-2xl shadow-2xl max-h-[80dvh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {!submitted ? (
          <>
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-earth-100 shrink-0">
              <h3 className="font-semibold text-earth-900 text-base sm:text-lg">Send Enquiry</h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="w-8 h-8 rounded-lg bg-earth-50 flex items-center justify-center hover:bg-earth-100 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="px-4 sm:px-6 pt-4 pb-6 space-y-3 sm:space-y-4 overflow-y-auto flex-1 min-h-0 overscroll-contain"
            >
              <div className="rounded-lg border-2 border-brand-600 bg-[#CFE3DD]/60 px-3 py-2.5 sm:px-4 sm:py-3 text-center ring-2 ring-brand-500/30">
                <p className="text-sm sm:text-base font-semibold text-brand-800">{target}</p>
                <p className="text-xs sm:text-sm text-brand-700 mt-1 leading-snug">{ENQUIRY_SUBTITLE}</p>
              </div>

              {error && (
                <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  className="input w-full"
                  placeholder="Eg: Karthik Kumar"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-earth-700 mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-1.5">
                    <span className="flex items-center px-2.5 bg-earth-50 border border-earth-200 rounded-xl text-earth-600 text-sm shrink-0">
                      +91
                    </span>
                    <input
                      className="input flex-1 min-w-0"
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
                  <label className="block text-sm font-medium text-earth-700 mb-1.5">
                    Alternate Mobile <span className="text-earth-400 font-normal">(optional)</span>
                  </label>
                  <div className="flex gap-1.5">
                    <span className="flex items-center px-2.5 bg-earth-50 border border-earth-200 rounded-xl text-earth-600 text-sm shrink-0">
                      +91
                    </span>
                    <input
                      className="input flex-1 min-w-0"
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
                <label className="block text-sm font-medium text-earth-700 mb-1.5">
                  Email <span className="text-earth-400 font-normal">(optional)</span>
                </label>
                <div className="flex gap-2 min-w-0">
                  <span className="flex items-center px-3 bg-earth-50 border border-earth-200 rounded-xl text-earth-500 shrink-0">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    className="input flex-1 min-w-0"
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1.5">
                  Current address <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="input resize-none min-h-[72px] w-full"
                  placeholder="Site / home address with area and district"
                  required
                  rows={2}
                  value={form.currentAddress}
                  onChange={(e) => setForm({ ...form, currentAddress: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1.5">
                  Delivery address <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="input resize-none min-h-[72px] w-full"
                  placeholder="Delivery location with area and district"
                  required
                  rows={2}
                  value={form.deliveryAddress}
                  onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1.5">
                  Requirement <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="input resize-none h-20 sm:h-24 w-full"
                  placeholder="Describe what you need..."
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Phone className="w-4 h-4" /> {submitting ? "Sending…" : "Submit Enquiry"}
              </button>
              <p className="text-xs text-earth-400 text-center pb-1 sm:pb-0">
                Your details are saved for the team to follow up
              </p>
            </form>
          </>
        ) : (
          <div className="px-4 sm:px-6 py-8 text-center overflow-y-auto flex-1 min-h-0">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-semibold text-earth-900 text-lg mb-2">Enquiry Sent!</h3>
            <p className="text-earth-500 text-sm mb-5">
              {materialId && !dealerId
                ? "Our team will contact you on "
                : "The dealer will contact you on "}
              <strong>+91 {form.phone}</strong> shortly.
            </p>
            <button type="button" onClick={onClose} className="btn-primary px-8 w-full sm:w-auto">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
