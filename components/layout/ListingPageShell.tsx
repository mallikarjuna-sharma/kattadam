"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

type Props = {
  title: string;
  subtitle?: string;
  searchPlaceholder: string;
  search: string;
  onSearchChange: (value: string) => void;
  backHref?: string;
  children: React.ReactNode;
};

export default function ListingPageShell({
  title,
  subtitle,
  searchPlaceholder,
  search,
  onSearchChange,
  backHref,
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-earth-50">
      <Navbar />
      <div className="bg-earth-900 text-white">
        <div className="page-container py-8">
          {backHref ? (
            <Link
              href={backHref}
              className="text-earth-500 text-sm hover:text-earth-300 transition-colors mb-3 inline-block"
            >
              ← Back
            </Link>
          ) : null}
          <h1 className={`font-display text-3xl font-bold ${subtitle ? "mb-1" : "mb-4"}`}>{title}</h1>
          {subtitle ? <p className="text-earth-400 text-sm mb-4">{subtitle}</p> : null}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
            <input
              className="w-full bg-white/10 border border-white/20 text-white placeholder-earth-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:bg-white/15"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
