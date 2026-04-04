import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kattodam — Coimbatore's Construction Marketplace",
  description: "Find materials, builders, architects, and properties in Coimbatore.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-earth-50 text-earth-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
