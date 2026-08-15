"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Phone, X, ShieldCheck } from "lucide-react";
import KD360Logo from "@/components/ui/KD360Logo";
import { KD360_NAME, KD360_PHONE_DISPLAY, KD360_TEL_HREF } from "@/lib/kd360-contact";

export default function KD360CallButton() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  if (path?.startsWith("/admin")) return null;

  const bottomOffset = path === "/home" ? "bottom-24 md:bottom-8" : "bottom-6 md:bottom-8";

  return (
    <div
      ref={wrapRef}
      className={`fixed right-4 z-[95] md:right-6 flex flex-col items-end gap-3 ${bottomOffset}`}
    >
      {open && (
        <div
          className="rounded-2xl border border-primary/40 bg-[#0d1810]/95 backdrop-blur-2xl shadow-2xl p-5 w-[min(19rem,calc(100vw-2rem))] text-left space-y-4 animate-in fade-in zoom-in-95 duration-200"
          role="dialog"
          aria-label={`${KD360_NAME} contact`}
        >
          <div className="flex items-start justify-between gap-2 border-b border-border pb-3">
            <KD360Logo size="sm" className="text-foreground" />
            <button
              type="button"
              className="p-1.5 rounded-full text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-primary">Customer Support Hotline</p>
            <p className="text-[11px] text-muted-foreground">Available 9 AM - 8 PM (Mon - Sat)</p>
          </div>

          <a
            href={KD360_TEL_HREF}
            className="flex items-center justify-center gap-2 text-center text-lg font-black tracking-wide text-primary-foreground py-3 rounded-xl bg-primary hover:bg-[#5ee06a] transition-all duration-300 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
            onClick={() => setOpen(false)}
          >
            <Phone className="w-4 h-4 fill-current" />
            <span>+91 {KD360_PHONE_DISPLAY}</span>
          </a>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Verified Kattadam Support Line</span>
          </div>
        </div>
      )}

      {/* Floating Call Button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary hover:bg-[#5ee06a] text-foreground shadow-xl shadow-primary/30 hover:scale-105 transition-all duration-300 focus:outline-none"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`Open ${KD360_NAME} phone number`}
      >
        <Phone className="w-6 h-6 text-foreground fill-current group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
}
