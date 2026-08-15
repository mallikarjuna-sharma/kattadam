"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Building2, Check, Hammer, Home, Phone, Shield, UserCheck, X } from "lucide-react";
import KD360CallButton from "@/components/ui/KD360CallButton";
import KD360Logo from "@/components/ui/KD360Logo";
import ChatEnquiryWidget from "@/components/ui/ChatEnquiryWidget";
import truckHero from "@/assets/images/kd360-truck-hero.png";
import { KD360_PHONE_DISPLAY, KD360_TEL_HREF } from "@/lib/kd360-contact";

const LANG_KEY = "kattadam_lang";
const SESSION_KEY = "kattadam_session_id";
const POPUP_MIN_KEY = "kattadam_expert_popup_minutes";
const POPUP_SHOWN_KEY = "kattadam_expert_popup_shown";

type Lang = "en" | "ta";

const DICT: Record<Lang, Record<string, string>> = {
  en: {
    nav_materials: "Materials",
    nav_experts: "Kattadam Experts",
    nav_realestate: "Real estate",
    nav_homeservices: "Home services",
    nav_login: "Login",
    nav_register: "Register",
    lang_en: "English",
    lang_ta: "தமிழ்",
    expert_popup_heading_free: "FREE",
    expert_popup_heading_consultation: "CONSULTATION",
    expert_popup_subtitle: "Get clarity before you build!",
    expert_popup_materials: "Materials",
    expert_popup_experts: "Experts",
    expert_popup_homeservices: "Home Services",
    expert_popup_offer_free: "Free",
    expert_popup_offer_tagline: "clarity before you build",
    expert_popup_call: "Call now",
    expert_popup_later: "Maybe later",
    expert_popup_footer: "Offer valid on first consultation. T&C apply.",
  },
  ta: {
    nav_materials: "பொருட்கள்",
    nav_experts: "கட்டடம் நிபுணர்கள்",
    nav_realestate: "நிலம் & வீடு",
    nav_homeservices: "வீட்டு சேவைகள்",
    nav_login: "உள்நுழை",
    nav_register: "பதிவு",
    lang_en: "English",
    lang_ta: "தமிழ்",
    expert_popup_heading_free: "இலவச",
    expert_popup_heading_consultation: "ஆலோசனை",
    expert_popup_subtitle: "கட்டுவதற்கு முன் தெளிவு பெறுங்கள்!",
    expert_popup_materials: "பொருட்கள்",
    expert_popup_experts: "நிபுணர்கள்",
    expert_popup_homeservices: "வீட்டு சேவைகள்",
    expert_popup_offer_free: "இலவசம்",
    expert_popup_offer_tagline: "கட்டுவதற்கு முன் தெளிவு",
    expert_popup_call: "இப்போது அழைக்க",
    expert_popup_later: "பிறகு",
    expert_popup_footer: "முதல் ஆலோசனைக்கு மட்டும் செல்லுபடி. விதிமுறைகள் பொருந்தும்.",
  },
};

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function useSiteLang(): LangContextValue {
  const v = useContext(LangContext);
  if (!v) {
    return {
      lang: "en",
      setLang: () => {},
      t: (k) => DICT.en[k] ?? k,
    };
  }
  return v;
}

function SessionPing() {
  useEffect(() => {
    const id = localStorage.getItem(SESSION_KEY);
    if (!id) return;
    const tick = () => {
      void fetch("/api/session/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: id }),
      });
    };
    tick();
    const iv = window.setInterval(tick, 60_000);
    return () => window.clearInterval(iv);
  }, []);
  return null;
}

const POPUP_PHONE_FORMATTED = `${KD360_PHONE_DISPLAY.slice(0, 5)} ${KD360_PHONE_DISPLAY.slice(5)}`;

const POPUP_SERVICE_CARDS = [
  { key: "expert_popup_experts", icon: UserCheck },
  { key: "expert_popup_homeservices", icon: Home },
  { key: "expert_popup_materials", icon: Hammer },
] as const;

function ExpertCallPopup() {
  const path = usePathname();
  const { t } = useSiteLang();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (path?.startsWith("/admin")) return;
    if (path?.startsWith("/auth")) return;
    if (sessionStorage.getItem(POPUP_SHOWN_KEY)) return;
    const mins = Number.parseFloat(localStorage.getItem(POPUP_MIN_KEY) || "3");
    const safeMins = Number.isFinite(mins) && mins > 0 ? mins : 3;
    const timer = window.setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(POPUP_SHOWN_KEY, "1");
    }, safeMins * 60_000);
    return () => window.clearTimeout(timer);
  }, [path]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-2xl transition-colors duration-300">
        
        {/* Header Image with Gradient */}
        <div className="relative h-32 overflow-hidden">
          <Image
            src={truckHero}
            alt="Kattadam Construction"
            fill
            className="object-cover object-center opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-card" />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-black/60 px-3 py-1 text-[11px] font-extrabold tracking-wider text-primary backdrop-blur-md">
              <Building2 className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
              KATTADAM
            </span>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition-all hover:bg-white/20 hover:scale-105"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-5 pb-6 pt-1">
          <h2 className="text-center font-display text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight text-foreground">
            {t("expert_popup_heading_free")} {t("expert_popup_heading_consultation")}
          </h2>
          <p className="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-center text-xs font-semibold text-primary">
            <KD360Logo size="sm" />
            <span>· {t("expert_popup_subtitle")}</span>
          </p>

          {/* Service Pill Badges */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {POPUP_SERVICE_CARDS.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-cement-50 dark:bg-white/5 px-2 py-3 transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                <Icon className="h-5 w-5 text-primary" strokeWidth={2} />
                <span className="text-center text-[10px] font-extrabold leading-tight text-foreground">
                  {t(key)}
                </span>
              </div>
            ))}
          </div>

          {/* Phone Offer Card */}
          <div className="mt-4 flex items-center gap-3.5 rounded-2xl border border-primary/30 bg-primary/10 p-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
              <Check className="h-5 w-5" strokeWidth={3} />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                <span className="mr-1.5 line-through opacity-60">₹500</span>
                <span className="font-extrabold text-primary">{t("expert_popup_offer_free")}</span>
                {" — "}
                {t("expert_popup_offer_tagline")}
              </p>
              <p className="mt-0.5 text-lg font-black tracking-wide text-foreground">
                +91 {KD360_PHONE_DISPLAY}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex gap-2.5">
            <a
              href={KD360_TEL_HREF}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-center text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-[#5ee06a] hover:scale-105 active:scale-95"
            >
              <Phone className="h-4 w-4 fill-current" />
              <span className="truncate">
                {t("expert_popup_call")} · +91 {POPUP_PHONE_FORMATTED}
              </span>
            </a>
            <button
              type="button"
              className="shrink-0 rounded-2xl border border-border bg-cement-100 dark:bg-white/10 px-4 py-3 text-xs font-bold text-foreground transition-all hover:bg-cement-200 dark:hover:bg-white/15"
              onClick={() => setOpen(false)}
            >
              {t("expert_popup_later")}
            </button>
          </div>

          {/* Footer Guarantee */}
          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[10px] text-muted-foreground">
            <Shield className="h-3.5 w-3.5 shrink-0 text-primary" />
            {t("expert_popup_footer")}
          </p>
        </div>

      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    const s = localStorage.getItem(LANG_KEY) as Lang | null;
    if (s === "ta" || s === "en") setLangState(s);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(LANG_KEY, l);
    if (typeof document !== "undefined") {
      document.documentElement.lang = l === "ta" ? "ta" : "en";
    }
  }, []);

  const t = useCallback((k: string) => DICT[lang][k] ?? DICT.en[k] ?? k, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return (
    <LangContext.Provider value={value}>
      <SessionPing />
      {!isAdmin && (
        <>
          <KD360CallButton />
          <ExpertCallPopup />
          <ChatEnquiryWidget />
        </>
      )}
      {children}
    </LangContext.Provider>
  );
}
