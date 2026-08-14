"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminConfigBanner from "@/components/admin/AdminConfigBanner";
import AdminMobileNav from "@/components/admin/AdminMobileNav";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { isAdminClientAuthed } from "@/lib/admin-auth-client";

export default function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const isLoginRoute = path === "/admin/login";

  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (isLoginRoute) {
      setChecked(true);
      setAuthed(true);
      return;
    }
    const ok = isAdminClientAuthed();
    setAuthed(ok);
    setChecked(true);
    if (!ok) {
      router.replace("/admin/login");
    }
  }, [isLoginRoute, path, router]);

  if (isLoginRoute) {
    return <div className="min-h-screen bg-cement-900">{children}</div>;
  }

  if (!checked) {
    return (
      <div className="min-h-screen bg-cement-50 flex items-center justify-center text-cement-600 text-sm">
        Checking access…
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-cement-50 flex items-center justify-center text-cement-600 text-sm">
        Redirecting to sign-in…
      </div>
    );
  }

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
