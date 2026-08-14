import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/providers/AppShell";

export const metadata: Metadata = {
  title: "Kattadam — Construction marketplace",
  description:
    "கட்டடம் — materials, Kattadam Experts, real estate, and home services. Coimbatore, Tirupur, Erode, Namakkal, Salem.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cement-50 text-cement-900 font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
