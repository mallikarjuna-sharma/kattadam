"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Package, Home, Wrench, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { label: "Materials", href: "/materials", icon: Package },
  { label: "Builders", href: "/builders", icon: Building2 },
  { label: "Properties", href: "/properties", icon: Home },
  { label: "Services", href: "/services", icon: Wrench },
];

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-earth-200">
      <div className="page-container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold text-earth-900">Kattodam</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                path.startsWith(n.href)
                  ? "bg-brand-50 text-brand-600"
                  : "text-earth-600 hover:text-brand-500 hover:bg-earth-50"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login" className="btn-outline text-sm px-4 py-2">Login</Link>
          <Link href="/auth/login" className="btn-primary text-sm px-4 py-2">Register</Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-earth-100 bg-white px-4 py-3 space-y-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-earth-700 hover:bg-earth-50">
              <n.icon className="w-4 h-4" /> {n.label}
            </Link>
          ))}
          <div className="pt-2 flex gap-2">
            <Link href="/auth/login" className="flex-1 btn-outline text-sm py-2 text-center">Login</Link>
            <Link href="/auth/login" className="flex-1 btn-primary text-sm py-2 text-center">Register</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
