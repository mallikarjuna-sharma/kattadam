import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KATTADAM — Construction Materials & Services",
  description:
    "கட்டுமானப் பொருட்கள் & சேவைகள். Find materials, builders, architects, and properties.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cement-50 text-cement-900 font-sans antialiased">{children}</body>
    </html>
  );
}
