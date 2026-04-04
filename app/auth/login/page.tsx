"use client";

// app/auth/login/page.tsx — OTP Login Page

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Phone, ArrowRight, Loader2, Shield } from "lucide-react";

type Step = "phone" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("otp");
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      phone,
      otp,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/home");
    } else {
      setError("Invalid or expired OTP. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-earth-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-earth flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-2xl font-bold text-white">Kattodam</span>
        </Link>

        <div>
          <h1 className="font-display text-5xl font-bold text-white leading-tight mb-6">
            Coimbatore's Construction Marketplace
          </h1>
          <p className="text-earth-400 text-lg leading-relaxed mb-10">
            Materials, builders, architects, and properties — everything you need to build,
            in one trusted platform.
          </p>
          <div className="space-y-4">
            {[
              "Verified dealers & builders",
              "Compare material prices",
              "Direct enquiry to your phone",
              "Covering all of Coimbatore",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-earth-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-earth-600 text-sm">© {new Date().getFullYear()} Kattodam</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-earth-900">Kattodam</span>
          </Link>

          <div className="bg-white rounded-2xl border border-earth-200 shadow-sm p-8">
            {step === "phone" ? (
              <>
                <div className="mb-8">
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                    <Phone className="w-6 h-6 text-brand-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-earth-900 mb-1">Enter Your Number</h2>
                  <p className="text-earth-500 text-sm">We'll send a 6-digit OTP to verify your number</p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">Mobile Number</label>
                    <div className="flex gap-3">
                      <div className="flex items-center px-3 bg-earth-50 border border-earth-200 rounded-xl text-earth-600 text-sm font-medium">
                        +91
                      </div>
                      <input
                        type="tel"
                        className="input flex-1"
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => {
                          setError("");
                          setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                        }}
                        maxLength={10}
                        autoFocus
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</div>
                  )}

                  <button type="submit" disabled={loading || phone.length !== 10} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>Send OTP <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-brand-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-earth-900 mb-1">Verify OTP</h2>
                  <p className="text-earth-500 text-sm">
                    Sent to <strong>+91 {phone}</strong>{" "}
                    <button onClick={() => { setStep("phone"); setOtp(""); setError(""); }} className="text-brand-500 hover:underline">
                      Change
                    </button>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">6-Digit OTP</label>
                    <input
                      type="tel"
                      className="input text-center text-2xl tracking-widest font-bold"
                      placeholder="••••••"
                      value={otp}
                      onChange={(e) => {
                        setError("");
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                      }}
                      maxLength={6}
                      autoFocus
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</div>
                  )}

                  <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Continue"}
                  </button>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full text-center text-sm text-earth-500 hover:text-brand-500 transition-colors"
                  >
                    Resend OTP
                  </button>
                </form>
              </>
            )}
          </div>

          <p className="text-center text-xs text-earth-400 mt-6">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-earth-600">Terms</Link> and{" "}
            <Link href="/privacy" className="underline hover:text-earth-600">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
