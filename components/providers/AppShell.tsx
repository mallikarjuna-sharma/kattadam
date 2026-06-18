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
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60">
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-[#50D890]/30 bg-[#052010] shadow-2xl">
        <div className="relative h-36 overflow-hidden">
          <Image
            src="/images/kd360-truck-hero.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#052010]/20 via-transparent to-[#052010]" />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#50D890] px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#50D890]">
              <Building2 className="h-3 w-3" strokeWidth={2.5} />
              KATTADAM
            </span>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#50D890]/70 text-[#50D890] transition-colors hover:bg-[#50D890]/10"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-5 pb-5">
          <h2 className="text-center font-display text-3xl font-extrabold leading-tight tracking-tight text-white">
            {t("expert_popup_heading_free")}
            <br />
            {t("expert_popup_heading_consultation")}
          </h2>
          <p className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5 text-center text-sm font-medium text-[#50D890]">
            <KD360Logo size="sm" variant="light" />
            <span>· {t("expert_popup_subtitle")}</span>
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {POPUP_SERVICE_CARDS.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-[#50D890]/40 bg-[#0a2e18] px-2 py-3"
              >
                <Icon className="h-5 w-5 text-[#50D890]" strokeWidth={1.75} />
                <span className="text-center text-[10px] font-semibold leading-tight text-[#50D890]">
                  {t(key)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#50D890]/40 bg-[#0a2e18] px-3 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#50D890]">
              <Check className="h-5 w-5 text-[#052010]" strokeWidth={3} />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-[#50D890]/90">
                <span className="mr-1.5 line-through text-[#50D890]/50">₹500</span>
                <span className="font-bold text-[#50D890]">{t("expert_popup_offer_free")}</span>
                {" — "}
                {t("expert_popup_offer_tagline")}
              </p>
              <p className="mt-0.5 text-lg font-bold tracking-wide text-white">
                +91 {KD360_PHONE_DISPLAY}
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <a
              href={KD360_TEL_HREF}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#50D890] px-3 py-3 text-center text-sm font-bold text-[#052010] transition-colors hover:bg-[#5ee89d]"
            >
              <Phone className="h-4 w-4" strokeWidth={2.5} />
              <span className="truncate">
                {t("expert_popup_call")} · +91 {POPUP_PHONE_FORMATTED}
              </span>
            </a>
            <button
              type="button"
              className="shrink-0 rounded-xl border border-[#50D890]/50 px-3 py-3 text-xs font-semibold text-[#50D890] transition-colors hover:bg-[#50D890]/10"
              onClick={() => setOpen(false)}
            >
              {t("expert_popup_later")}
            </button>
          </div>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[10px] text-[#50D890]/60">
            <Shield className="h-3 w-3 shrink-0" />
            {t("expert_popup_footer")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

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
      <KD360CallButton />
      <ExpertCallPopup />
      {children}
    </LangContext.Provider>
  );
}
