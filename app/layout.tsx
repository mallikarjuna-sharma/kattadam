import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/providers/AppShell";

export const metadata: Metadata = {
  title: "Kattadam — Construction marketplace",
  description:
    "கட்டடம் — materials, Kattadam Experts, real estate, and home services. Coimbatore, Tirupur, Erode, Namakkal, Salem.",
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
