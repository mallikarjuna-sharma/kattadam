"use client";
import Image from "next/image";
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
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-cement-200">
      <div className="page-container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.jpeg"
            alt="KATTADAM"
            width={36}
            height={36}
            className="rounded-lg object-cover"
            priority
          />
          <span className="font-display text-lg font-bold text-cement-900 tracking-tight">KATTADAM</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                path.startsWith(n.href)
                  ? "bg-brand-50 text-brand-700"
                  : "text-cement-600 hover:text-brand-600 hover:bg-cement-50"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/admin" className="text-sm text-cement-500 hover:text-brand-600 font-medium px-2">
            Admin
          </Link>
          <Link href="/auth/login" className="btn-outline text-sm px-4 py-2">
            Login
          </Link>
          <Link href="/auth/login" className="btn-primary text-sm px-4 py-2">
            Register
          </Link>
        </div>

        <button className="md:hidden p-2" type="button" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-cement-100 bg-white px-4 py-3 space-y-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-cement-700 hover:bg-cement-50"
            >
              <n.icon className="w-4 h-4" /> {n.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-cement-700 hover:bg-cement-50"
            onClick={() => setOpen(false)}
          >
            Admin panel
          </Link>
          <div className="pt-2 flex gap-2">
            <Link href="/auth/login" className="flex-1 btn-outline text-sm py-2 text-center">
              Login
            </Link>
            <Link href="/auth/login" className="flex-1 btn-primary text-sm py-2 text-center">
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
