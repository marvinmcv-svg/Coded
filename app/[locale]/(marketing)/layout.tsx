import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";

export default async function MarketingLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale); // keeps these routes static (no header-based locale lookup)
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
