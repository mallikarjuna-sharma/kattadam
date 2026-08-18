"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, Package, Home, Building, Wrench, Menu, X, Sparkles, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { useSiteLang } from "@/components/providers/AppShell";
import { useTheme } from "next-themes";

const HREF = {
  home: "/",
  materials: "/materials",
  experts: "/builders",
  realestate: "/properties",
  homeservices: "/services",
} as const;

export default function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { t, lang, setLang } = useSiteLang();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isTa = lang === "ta";

  const NAV = [
    { label: isTa ? "முகப்பு" : "Home", href: HREF.home, icon: Home },
    { label: t("nav_realestate"), href: HREF.realestate, icon: Building },
    { label: t("nav_experts"), href: HREF.experts, icon: Building2 },
    { label: t("nav_materials"), href: HREF.materials, icon: Package },
    { label: t("nav_homeservices"), href: HREF.homeservices, icon: Wrench },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Full-Width Glassmorphic Bar */}
      <div className="w-full border-b backdrop-blur-2xl transition-all duration-300 shadow-xl bg-white/10 border-white/20 text-cement-900 dark:bg-black/20 dark:border-white/10 dark:text-white dark:shadow-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20 gap-4">
          
          {/* Logo Only */}
          <Link href="/" prefetch={true} className="flex items-center group shrink-0">
            <Image
              src="/logo.png"
              alt="Kattadam"
              width={160}
              height={60}
              className="h-12 md:h-14 w-auto object-contain rounded-xl hover:scale-105 transition-transform"
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-0.5 lg:gap-1 bg-black/20 p-1 lg:p-1.5 rounded-full border border-border shrink-0 max-w-full overflow-hidden">
            {NAV.map((n) => {
              const isActive = n.href === "/" ? path === "/" : path.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  prefetch={true}
                  onMouseEnter={() => router.prefetch(n.href)}
                  onTouchStart={() => router.prefetch(n.href)}
                  className={`px-2.5 lg:px-3.5 xl:px-5 py-2 xl:py-2.5 rounded-full text-xs xl:text-sm font-extrabold transition-all duration-300 flex items-center gap-1.5 xl:gap-2.5 whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-cement-800 hover:text-brand-600 hover:bg-cement-100 dark:text-zinc-200 dark:hover:text-foreground dark:hover:bg-white/10"
                  }`}
                >
                  <n.icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                  <span>{n.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Bar (Language Switcher + Auth) */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-3 shrink-0">
            
            {/* Language Switcher Pill */}
            <div className="flex items-center p-1 rounded-full border text-xs font-extrabold border-cement-200 bg-cement-50 dark:border-border dark:bg-black/40">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2.5 lg:px-3 py-1 rounded-full transition-all duration-300 ${
                  lang === "en"
                    ? "bg-primary text-primary-foreground shadow-sm font-black"
                    : "text-cement-500 hover:text-cement-900 dark:text-muted-foreground dark:hover:text-foreground"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("ta")}
                className={`px-2.5 lg:px-3 py-1 rounded-full transition-all duration-300 ${
                  lang === "ta"
                    ? "bg-primary text-primary-foreground shadow-sm font-black"
                    : "text-cement-500 hover:text-cement-900 dark:text-muted-foreground dark:hover:text-foreground"
                }`}
              >
                TA
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2 lg:p-2.5 rounded-full border transition-all duration-300 flex items-center justify-center border-cement-200 bg-cement-50 text-cement-700 hover:text-cement-900 hover:bg-cement-100 dark:border-border dark:bg-black/40 dark:text-zinc-300 dark:hover:text-white ${mounted ? 'opacity-100' : 'opacity-0'}`}
              aria-label="Toggle Theme"
            >
              {mounted && theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Login Button */}
            <Link
              href="/auth/login"
              className="text-xs xl:text-sm px-3.5 lg:px-5 xl:px-6 py-2 xl:py-2.5 rounded-full font-extrabold bg-primary text-primary-foreground hover:bg-[#5ee06a] hover:scale-105 active:scale-95 transition-all duration-300 shadow-md shadow-primary/20 whitespace-nowrap"
            >
              {t("nav_login")}
            </Link>
          </div>

          {/* Mobile Right Controls: Theme Toggle + Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center border-border bg-zinc-100 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}
              aria-label="Toggle Theme"
            >
              {mounted && theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />}
            </button>
            <button
              type="button"
              className="p-2.5 rounded-xl border transition-all duration-300 bg-zinc-100 border-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              onClick={() => setOpen(!open)}
              aria-label="Toggle Menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {open && (
          <div className="md:hidden border-t border-border dark:border-zinc-800 px-4 py-5 space-y-4 bg-white dark:bg-zinc-900 rounded-b-3xl shadow-2xl">
            <div className="flex gap-2 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                  lang === "en"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-zinc-600 dark:text-zinc-300 hover:text-foreground dark:hover:text-white"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang("ta")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                  lang === "ta"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-zinc-600 dark:text-zinc-300 hover:text-foreground dark:hover:text-white"
                }`}
              >
                தமிழ்
              </button>
            </div>

            <div className="space-y-1 pt-1">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  prefetch={true}
                  onMouseEnter={() => router.prefetch(n.href)}
                  onTouchStart={() => router.prefetch(n.href)}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-primary dark:hover:text-primary transition-all"
                >
                  <n.icon className="w-4 h-4 text-primary shrink-0" />
                  <span>{n.label}</span>
                </Link>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/auth/login"
                className="flex-1 block text-sm py-3.5 text-center rounded-2xl font-extrabold bg-primary text-primary-foreground hover:bg-[#5ee06a] transition-all shadow-md shadow-primary/20"
                onClick={() => setOpen(false)}
              >
                {t("nav_login")}
              </Link>
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-white flex items-center justify-center shrink-0"
                aria-label="Toggle Theme"
              >
                {mounted && theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
