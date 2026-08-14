import type { Metadata } from "next";
import AdminLayoutShell from "@/components/admin/AdminLayoutShell";

/** Admin loads data from Supabase; do not prerender at build time. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — Kattadam",
  description: "Operations dashboard",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
