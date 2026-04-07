import type { Metadata } from "next";
import AdminConfigBanner from "@/components/admin/AdminConfigBanner";
import AdminMobileNav from "@/components/admin/AdminMobileNav";
import AdminSidebar from "@/components/admin/AdminSidebar";

/** Admin loads data from Supabase; do not prerender at build time. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — KATTADAM",
  description: "Operations dashboard",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminConfigBanner />
      <div className="min-h-screen flex flex-col md:flex-row bg-cement-50">
        <AdminMobileNav />
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">{children}</div>
      </div>
    </>
  );
}
