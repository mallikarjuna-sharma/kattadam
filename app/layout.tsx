import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
    preload: false,                      // ← added
  fallback: ["Georgia", "serif"],      // ← added
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kattodam — Coimbatore's Construction Marketplace",
  description:
    "Find materials, builders, architects, and properties in Coimbatore. One platform for all your construction needs.",
  keywords: ["construction", "materials", "builders", "coimbatore", "cement", "steel", "property"],
  openGraph: {
    title: "Kattodam",
    description: "Coimbatore's Construction Marketplace",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-earth-50 text-earth-900 font-sans antialiased">{children}</body>
    </html>
  );
}
