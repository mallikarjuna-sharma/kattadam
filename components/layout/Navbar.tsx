"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Package, Home, Wrench, Menu, X } from "lucide-react";
import { useState } from "react";
import { useSiteLang } from "@/components/providers/AppShell";

const HREF = {
  materials: "/materials",
  experts: "/builders",
  realestate: "/properties",
  homeservices: "/services",
} as const;

export default function Navbar({ variant = "light" }: { variant?: "light" | "dark" }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { t, lang, setLang } = useSiteLang();
  const dark = variant === "dark";

  const NAV = [
    { label: t("nav_homeservices"), href: HREF.homeservices, icon: Wrench },
    { label: t("nav_experts"), href: HREF.experts, icon: Building2 },
    { label: t("nav_materials"), href: HREF.materials, icon: Package },
    { label: t("nav_realestate"), href: HREF.realestate, icon: Home },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur border-b ${
        dark ? "bg-[#121212]/95 border-white/10 text-white" : "bg-white/95 border-cement-200"
      }`}
    >
      <div className="page-container flex items-center justify-between h-16 gap-2">
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <Image
            src="/logo.jpeg"
            alt="Kattadam"
            width={36}
            height={36}
            className="rounded-lg object-cover flex-shrink-0"
            priority
          />
          <span
            className={`font-display text-lg font-bold tracking-tight truncate ${
              dark ? "text-white" : "text-cement-900"
            }`}
          >
            Kattadam
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                path.startsWith(n.href)
                  ? dark
                    ? "bg-[#4CAF50]/20 text-[#4CAF50]"
                    : "bg-brand-50 text-brand-700"
                  : dark
                    ? "text-cement-300 hover:text-[#4CAF50] hover:bg-white/5"
                    : "text-cement-600 hover:text-brand-600 hover:bg-cement-50"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <div
            className={`flex rounded-lg border overflow-hidden text-xs font-semibold ${
              dark ? "border-white/20" : "border-cement-200"
            }`}
          >
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-2.5 py-1.5 ${
                lang === "en"
                  ? dark
                    ? "bg-[#4CAF50] text-[#0d1f0f]"
                    : "bg-cement-900 text-white"
                  : dark
                    ? "bg-transparent text-cement-300"
                    : "bg-white text-cement-600"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("ta")}
              className={`px-2.5 py-1.5 ${
                lang === "ta"
                  ? dark
                    ? "bg-[#4CAF50] text-[#0d1f0f]"
                    : "bg-cement-900 text-white"
                  : dark
                    ? "bg-transparent text-cement-300"
                    : "bg-white text-cement-600"
              }`}
            >
              TA
            </button>
          </div>
          <Link
            href="/auth/login"
            className={`text-sm px-3 py-2 whitespace-nowrap rounded-xl font-semibold border transition-colors ${
              dark
                ? "border-white/25 text-white hover:bg-white/10"
                : "btn-outline"
            }`}
          >
            {t("nav_login")}
          </Link>
          <Link
            href="/auth/login"
            className={`text-sm px-3 py-2 whitespace-nowrap rounded-xl font-semibold transition-colors ${
              dark
                ? "bg-[#4CAF50] text-[#0d1f0f] hover:bg-[#5ee06a]"
                : "btn-primary"
            }`}
          >
            {t("nav_register")}
          </Link>
        </div>

        <button
          className={`md:hidden p-2 flex-shrink-0 ${dark ? "text-white" : ""}`}
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div
          className={`md:hidden border-t px-4 py-3 space-y-1 ${
            dark ? "border-white/10 bg-[#1a1a1a]" : "border-cement-100 bg-white"
          }`}
        >
          <div className="flex gap-2 pb-2">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold border ${
                lang === "en"
                  ? dark
                    ? "bg-[#4CAF50] text-[#0d1f0f] border-[#4CAF50]"
                    : "bg-cement-900 text-white"
                  : dark
                    ? "border-white/20 text-cement-300"
                    : "border-cement-200"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang("ta")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold border ${
                lang === "ta"
                  ? dark
                    ? "bg-[#4CAF50] text-[#0d1f0f] border-[#4CAF50]"
                    : "bg-cement-900 text-white"
                  : dark
                    ? "border-white/20 text-cement-300"
                    : "border-cement-200"
              }`}
            >
              தமிழ்
            </button>
          </div>
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                dark ? "text-cement-200 hover:bg-white/5" : "text-cement-700 hover:bg-cement-50"
              }`}
            >
              <n.icon className="w-4 h-4" /> {n.label}
            </Link>
          ))}
          <div className="pt-2 flex gap-2">
            <Link
              href="/auth/login"
              className={`flex-1 text-sm py-2 text-center rounded-xl font-semibold border ${
                dark ? "border-white/25 text-white" : "btn-outline"
              }`}
              onClick={() => setOpen(false)}
            >
              {t("nav_login")}
            </Link>
            <Link
              href="/auth/login"
              className={`flex-1 text-sm py-2 text-center rounded-xl font-semibold ${
                dark ? "bg-[#4CAF50] text-[#0d1f0f]" : "btn-primary"
              }`}
              onClick={() => setOpen(false)}
            >
              {t("nav_register")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
