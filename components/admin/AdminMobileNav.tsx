"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/activity", label: "Activity" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/dealers", label: "Dealers" },
  { href: "/admin/experts", label: "Experts" },
  { href: "/admin/home-services", label: "Home services" },
  { href: "/admin/properties", label: "Real estate" },
  { href: "/admin/materials", label: "Materials" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/notifications", label: "Notifications" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/zones", label: "Zones" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden sticky top-0 z-50 bg-cement-900 text-white border-b border-white/10">
      <div className="flex items-center justify-between px-4 h-14">
        <Link href="/admin" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image src="/logo.jpeg" alt="" width={32} height={32} className="rounded-md object-cover" />
          <span className="font-bold text-sm">Kattadam</span>
        </Link>
        <button type="button" className="p-2" aria-label="Menu" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/10 px-3 py-2 space-y-1 max-h-[70vh] overflow-y-auto">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block px-3 py-2.5 rounded-lg text-sm hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
