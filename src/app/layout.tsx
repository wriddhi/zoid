import "./globals.css";

import type { Metadata } from "next";
import { geistSans, geistMono } from "@/app/fonts";

import { ClerkProvider } from "@clerk/nextjs";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "@/providers";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Zoid | Make your brand stand out",
  description:
    "Zoid is a comprehensive tool for entrepreneurs and businesses to search domain name availability across ICANN, check brand name registrations in WIPO's global database, and design minimalist logos with ease. Secure your brand identity today!",
  keywords: [
    "Brand name checker",
    "domain availability search",
    "ICANN domain search",
    "WIPO global brand db",
    "brand verification tool",
    "logo maker",
    "minimalist logo",
    "secure brand identity",
    "business branding",
    "Zoid",
  ],
  icons: ["/favicon.svg"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            geistSans.variable,
            geistMono.variable,
            "antialiased font-sans bg-transparent",
            "selection:text-white selection:bg-black",
            "[&_*::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:w-2",
            "[&_*::-webkit-scrollbar-track]:bg-black",
            "[&::-webkit-scrollbar-track]:bg-black",
            "[&_*::-webkit-scrollbar-thumb]:bg-slate-400",
            "[&::-webkit-scrollbar-thumb]:bg-slate-400"
          )}
        >
          <Providers>
            <div
              className={cn(
                "h-full min-h-screen",
                "w-full min-w-screen",
                "flex flex-col justify-between"
              )}
            >
              <Header />
              {children}
              <Footer />
            </div>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
