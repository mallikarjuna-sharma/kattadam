"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Phone, X } from "lucide-react";
import { KD360_NAME, KD360_PHONE_DISPLAY, KD360_TEL_HREF } from "@/lib/kd360-contact";

/**
 * Fixed bottom-right dial control: icon only until opened, panel opens above the button.
 */
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

  /** `/home` has a fixed mobile bottom nav; lift FAB above it on small screens only. */
  const bottomOffset = path === "/home" ? "bottom-24 md:bottom-8" : "bottom-6 md:bottom-8";

  return (
    <div
      ref={wrapRef}
      className={`fixed right-4 z-[60] md:right-6 flex flex-col items-end gap-2 ${bottomOffset}`}
    >
      {open && (
        <div
          className="rounded-2xl border border-cement-200 bg-white shadow-xl p-4 w-[min(18rem,calc(100vw-2rem))] text-left"
          role="dialog"
          aria-label={`${KD360_NAME} contact`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="font-display font-bold text-cement-900 text-sm">{KD360_NAME}</p>
            <button
              type="button"
              className="p-1 rounded-lg text-cement-400 hover:bg-cement-100 hover:text-cement-700"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-cement-500 mb-3">Customer support</p>
          <a
            href={KD360_TEL_HREF}
            className="block text-center text-lg font-bold tracking-wide text-brand-700 hover:text-brand-800 py-2 rounded-xl bg-brand-50 border border-brand-200"
            onClick={() => setOpen(false)}
          >
            +91 {KD360_PHONE_DISPLAY}
          </a>
          <p className="text-[10px] text-cement-400 mt-2 text-center">Tap number to dial</p>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg border-2 border-white/30 hover:bg-brand-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`Open ${KD360_NAME} phone number`}
      >
        <Phone className="w-6 h-6" strokeWidth={2.25} />
      </button>
    </div>
  );
}
