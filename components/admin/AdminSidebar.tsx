"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ClipboardList,
  Bell,
  Star,
  MapPinned,
  Settings,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/dealers", label: "Dealers", icon: Store },
  { href: "/admin/materials", label: "Materials", icon: Package },
  { href: "/admin/enquiries", label: "Enquiries", icon: ClipboardList },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/zones", label: "Zones & matching", icon: MapPinned },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const path = usePathname();

  return (
    <aside className="hidden md:flex w-64 bg-cement-900 text-white flex-col flex-shrink-0">
      <div className="p-4 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src="/logo.jpeg" alt="" width={40} height={40} className="rounded-lg object-cover" />
          <div>
            <div className="font-display font-bold text-sm tracking-tight">KATTADAM</div>
            <div className="text-cement-400 text-xs">Admin</div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map((n) => {
          const linkActive =
            n.href === "/admin"
              ? path === "/admin" || path === "/admin/"
              : path === n.href || path.startsWith(`${n.href}/`);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                linkActive ? "bg-brand-600 text-white" : "text-cement-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <n.icon className="w-4 h-4 flex-shrink-0" />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <Link href="/" className="text-xs text-cement-400 hover:text-white transition-colors">
          ← Customer site
        </Link>
      </div>
    </aside>
  );
}
