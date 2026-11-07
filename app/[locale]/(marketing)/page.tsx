import { setRequestLocale } from "next-intl/server";
import { Championship } from "@/components/sections/Championship";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Method } from "@/components/sections/Method";
import { Programs } from "@/components/sections/Programs";
import { Skills } from "@/components/sections/Skills";
import { Trust } from "@/components/sections/Trust";

// Re-render daily so a cohort that has started drops off without a redeploy.
export const revalidate = 86400;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Programs />
        <Method />
        <Skills />
        <Championship />
        <Trust />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
