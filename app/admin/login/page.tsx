"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight } from "lucide-react";
import {
  isAdminClientAuthed,
  setAdminClientAuthed,
  validateAdminCredentials,
} from "@/lib/admin-auth-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminClientAuthed()) {
      router.replace("/admin");
    }
  }, [router]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (validateAdminCredentials(username, password)) {
      setAdminClientAuthed();
      router.replace("/admin");
      router.refresh();
    } else {
      setError("Invalid username or password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <Link href="/" className="absolute top-6 left-6 text-cement-400 text-sm hover:text-white transition-colors">
        ← Back to site
      </Link>
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image src="/logo.jpeg" alt="" width={56} height={56} className="rounded-xl object-cover border border-white/10" />
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-cement-100">
          <h1 className="font-display text-2xl font-bold text-cement-900 text-center mb-1">Kattadam Admin</h1>
          <p className="text-center text-cement-500 text-sm mb-8">Sign in with your admin credentials</p>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-cement-600 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cement-400" />
                <input
                  className="w-full rounded-xl border border-cement-200 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="kattadam"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-cement-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cement-400" />
                <input
                  type="password"
                  className="w-full rounded-xl border border-cement-200 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50"
            >
              Sign in to admin <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
        <p className="text-center text-[11px] text-cement-500 mt-6 max-w-sm mx-auto leading-relaxed">
          This gate is validated in the browser only. Do not use for sensitive production data without server-side
          authentication.
        </p>
      </div>
    </div>
  );
}
