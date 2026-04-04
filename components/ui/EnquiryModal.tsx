"use client";
import { useState } from "react";
import { X, Phone, CheckCircle } from "lucide-react";

interface Props {
  target: string;
  onClose: () => void;
}

export default function EnquiryModal({ target, onClose }: Props) {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {!submitted ? (
          <>
            <div className="flex items-center justify-between p-5 border-b border-earth-100">
              <div>
                <h3 className="font-semibold text-earth-900">Send Enquiry</h3>
                <p className="text-xs text-earth-500 mt-0.5">{target}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-earth-50 flex items-center justify-center hover:bg-earth-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1.5">Your Name</label>
                <input className="input" placeholder="Eg: Karthik Kumar" required
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1.5">Mobile Number</label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-earth-50 border border-earth-200 rounded-xl text-earth-600 text-sm">+91</span>
                  <input className="input flex-1" placeholder="98765 43210" required type="tel" maxLength={10}
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1.5">Requirement</label>
                <textarea className="input resize-none h-24" placeholder="Describe what you need..." required
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" /> Submit Enquiry
              </button>
              <p className="text-xs text-earth-400 text-center">Your details will be shared with the dealer</p>
            </form>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-semibold text-earth-900 text-lg mb-2">Enquiry Sent!</h3>
            <p className="text-earth-500 text-sm mb-5">The dealer will contact you on <strong>+91 {form.phone}</strong> shortly.</p>
            <button onClick={onClose} className="btn-primary px-8">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
