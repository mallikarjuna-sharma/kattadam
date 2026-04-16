"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, CheckCircle, UserPlus } from "lucide-react";

type Tab = "signin" | "register" | "partner";

const SESSION_KEY = "kattadam_session_id";
const USER_KEY = "kattadam_user";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not sign in.");
        setLoading(false);
        return;
      }
      if (data.sessionId) localStorage.setItem(SESSION_KEY, data.sessionId);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      router.push("/home");
    } catch {
      setError("Network error. Try again.");
    }
    setLoading(false);
  };

  const onRegister = async (mode: "user" | "partner") => {
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, name: name.trim(), email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Registration failed.");
        setLoading(false);
        return;
      }
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();
      if (loginRes.ok && loginData.ok) {
        if (loginData.sessionId) localStorage.setItem(SESSION_KEY, loginData.sessionId);
        localStorage.setItem(USER_KEY, JSON.stringify(loginData.user));
      }
      router.push("/home");
    } catch {
      setError("Network error. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cement-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-cement-900 flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.jpeg" alt="" width={40} height={40} className="rounded-xl object-cover" />
          <span className="font-display text-2xl font-bold text-white tracking-tight">Kattadam</span>
        </Link>
        <div>
          <h1 className="font-display text-5xl font-bold text-white leading-tight mb-6">
            Build better, together — with email sign-in.
          </h1>
          <p className="text-cement-400 text-lg leading-relaxed mb-10">
            Materials, Kattadam Experts, real estate, and home services — verified and local.
          </p>
          <div className="space-y-3">
            {[
              "Verified dealers & Kattadam Experts",
              "Compare material prices",
              "Transparent enquiries",
              "Free for buyers to get started",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-brand-400" />
                <span className="text-cement-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-cement-500 text-sm">© {new Date().getFullYear()} Kattadam</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <Image src="/logo.jpeg" alt="" width={32} height={32} className="rounded-lg object-cover" />
            <span className="font-display text-xl font-bold text-cement-900 tracking-tight">Kattadam</span>
          </Link>

          <div className="flex gap-1 p-1 bg-cement-100 rounded-xl mb-6">
            {(
              [
                ["signin", "Sign in"],
                ["register", "New user"],
                ["partner", "Kattadam partner"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setTab(id);
                  setError(null);
                }}
                className={`flex-1 text-xs sm:text-sm font-semibold py-2.5 rounded-lg transition-colors ${
                  tab === id ? "bg-white text-cement-900 shadow-sm" : "text-cement-500 hover:text-cement-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="card p-8">
            {tab === "signin" && (
              <>
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-5">
                  <Mail className="w-6 h-6 text-brand-600" />
                </div>
                <h2 className="text-2xl font-bold text-cement-900 mb-1">Sign in with email</h2>
                <p className="text-cement-500 text-sm mb-6">Use the email and password you registered with.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-cement-700 mb-1.5">Email</label>
                    <input
                      className="input"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value.trim())}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cement-700 mb-1.5">Password</label>
                    <input
                      className="input"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button
                    type="button"
                    onClick={() => void onSignIn()}
                    disabled={loading || !email || !password}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {(tab === "register" || tab === "partner") && (
              <>
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-5">
                  <UserPlus className="w-6 h-6 text-brand-600" />
                </div>
                <h2 className="text-2xl font-bold text-cement-900 mb-1">
                  {tab === "partner" ? "Kattadam partner" : "Create your account"}
                </h2>
                <p className="text-cement-500 text-sm mb-6">
                  {tab === "partner"
                    ? "Register your business. Our team will review and activate your listing."
                    : "Join as a homeowner or buyer — free to get started."}
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-cement-700 mb-1.5">Full name</label>
                    <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cement-700 mb-1.5">Email</label>
                    <input
                      className="input"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value.trim())}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cement-700 mb-1.5">Password</label>
                    <input
                      className="input"
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cement-700 mb-1.5">Confirm password</label>
                    <input
                      className="input"
                      type="password"
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button
                    type="button"
                    onClick={() => void onRegister(tab === "partner" ? "partner" : "user")}
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    <Lock className="w-4 h-4" /> Register & continue
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
