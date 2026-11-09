import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { ThreeMount } from "@/components/three/ThreeMount";
import { Cursor } from "@/components/motion/Cursor";
import { ConsentBanner } from "@/components/sections/ConsentBanner";
import { StickyCta } from "@/components/sections/StickyCta";
import { UtmCapture } from "@/components/sections/UtmCapture";
import { Cody } from "@/components/cody/Cody";
import type { CodyLabels } from "@/components/cody/types";

export default async function MarketingLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale); // keeps these routes static (no header-based locale lookup)
  const t = await getTranslations("common");
  const all = await getTranslations();
  return (
    <>
      <Header />
      {children}
      <Footer />
      <ThreeMount />
      <Cursor />
      <UtmCapture />
      <StickyCta label={t("bookCall")} />
      <Cody locale={locale === "es" ? "es" : "en"} labels={all.raw("cody") as CodyLabels} />
      <ConsentBanner labels={{ text: t("consent.text"), accept: t("consent.accept"), decline: t("consent.decline") }} />
    </>
  );
}
