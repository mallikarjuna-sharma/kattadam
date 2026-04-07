"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Shield, ArrowRight, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp" | "done">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <div className="min-h-screen bg-cement-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-cement-900 flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.jpeg" alt="" width={40} height={40} className="rounded-xl object-cover" />
          <span className="font-display text-2xl font-bold text-white tracking-tight">KATTADAM</span>
        </Link>
        <div>
          <h1 className="font-display text-5xl font-bold text-white leading-tight mb-6">
            Construction Materials & Services
          </h1>
          <p className="text-cement-400 text-lg leading-relaxed mb-10">
            Materials, builders, architects, and properties — everything you need to build.
          </p>
          <div className="space-y-3">
            {[
              "Verified dealers & builders",
              "Compare material prices",
              "Hyper-local, covering Coimbatore",
              "Free to use for buyers",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-brand-400" />
                <span className="text-cement-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-cement-500 text-sm">© {new Date().getFullYear()} KATTADAM</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <Image src="/logo.jpeg" alt="" width={32} height={32} className="rounded-lg object-cover" />
            <span className="font-display text-xl font-bold text-cement-900 tracking-tight">KATTADAM</span>
          </Link>

          <div className="card p-8">
            {step === "phone" && (
              <>
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-5">
                  <Phone className="w-6 h-6 text-brand-600" />
                </div>
                <h2 className="text-2xl font-bold text-cement-900 mb-1">Enter Your Number</h2>
                <p className="text-cement-500 text-sm mb-6">We&apos;ll send a 6-digit OTP to verify</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-cement-700 mb-1.5">Mobile Number</label>
                    <div className="flex gap-2">
                      <span className="flex items-center px-3 bg-cement-50 border border-cement-200 rounded-xl text-cement-600 text-sm font-medium">
                        +91
                      </span>
                      <input
                        className="input flex-1"
                        placeholder="98765 43210"
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => phone.length === 10 && setStep("otp")}
                    disabled={phone.length !== 10}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Send OTP <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {step === "otp" && (
              <>
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-5">
                  <Shield className="w-6 h-6 text-brand-600" />
                </div>
                <h2 className="text-2xl font-bold text-cement-900 mb-1">Verify OTP</h2>
                <p className="text-cement-500 text-sm mb-6">
                  Sent to +91 {phone}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setStep("phone");
                      setOtp("");
                    }}
                    className="text-brand-600 hover:underline"
                  >
                    Change
                  </button>
                </p>
                <div className="space-y-4">
                  <input
                    className="input text-center text-3xl tracking-[1rem] font-bold"
                    placeholder="······"
                    type="tel"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  />
                  <button
                    type="button"
                    onClick={() => otp.length === 6 && router.push("/home")}
                    disabled={otp.length !== 6}
                    className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Verify & Continue
                  </button>
                  <button
                    type="button"
                    className="w-full text-center text-sm text-cement-400 hover:text-brand-600 transition-colors"
                  >
                    Resend OTP
                  </button>
                </div>
              </>
            )}
          </div>

          <p className="text-center text-xs text-cement-400 mt-5">
            By continuing you agree to our{" "}
            <Link href="#" className="underline">
              Terms
            </Link>{" "}
            &{" "}
            <Link href="#" className="underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
