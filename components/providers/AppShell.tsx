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
import { Phone, X } from "lucide-react";
import KD360CallButton from "@/components/ui/KD360CallButton";
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
    expert_popup_title: "KD360degree",
    expert_popup_body: "Call our desk for materials, experts, real estate, or home services.",
    expert_popup_call: "Call now",
    expert_popup_later: "Maybe later",
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
    expert_popup_title: "KD360degree",
    expert_popup_body: "பொருட்கள், நிபுணர்கள், பட்டியல்கள், சேவைகள் — தொடர்புக்கு அழைக்கவும்.",
    expert_popup_call: "இப்போது அழைக்க",
    expert_popup_later: "பிறகு",
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
    const t = window.setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(POPUP_SHOWN_KEY, "1");
    }, safeMins * 60_000);
    return () => window.clearTimeout(t);
  }, [path]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          type="button"
          className="absolute top-4 right-4 p-1 rounded-lg text-cement-400 hover:bg-cement-100"
          aria-label="Close"
          onClick={() => setOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">Kattadam</p>
        <h3 className="font-display text-xl font-bold text-cement-900 mb-2">{t("expert_popup_title")}</h3>
        <p className="text-sm text-cement-600 mb-2 leading-relaxed">{t("expert_popup_body")}</p>
        <p className="text-sm text-cement-600 mb-4 leading-relaxed">
          <span className="line-through text-cement-400 mr-2">₹500</span>
          <span className="font-semibold text-brand-700">Free consultations</span> — get clarity before you build.
        </p>
        <p className="text-center text-lg font-bold text-brand-700 tracking-wide mb-4">
          +91 {KD360_PHONE_DISPLAY}
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <a
            href={KD360_TEL_HREF}
            className="btn-primary inline-flex items-center justify-center gap-2 py-3 text-center"
          >
            <Phone className="w-4 h-4" /> {t("expert_popup_call")} · +91 {KD360_PHONE_DISPLAY}
          </a>
          <button type="button" className="btn-outline py-3" onClick={() => setOpen(false)}>
            {t("expert_popup_later")}
          </button>
        </div>
        <p className="text-[10px] text-cement-400 mt-4 text-center">
          Popup delay: change minutes in localStorage key <code className="bg-cement-100 px-1 rounded">{POPUP_MIN_KEY}</code>{" "}
          (default 3).
        </p>
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
