import { setRequestLocale } from "next-intl/server";
import { Championship } from "@/components/sections/Championship";
import { CTA } from "@/components/sections/CTA";
import { Gallery } from "@/components/sections/Gallery";
import { GlobeRoute } from "@/components/sections/GlobeRoute";
import { Hero } from "@/components/sections/Hero";
import { Method } from "@/components/sections/Method";
import { Programs } from "@/components/sections/Programs";
import { Reviews } from "@/components/sections/Reviews";
import { Skills } from "@/components/sections/Skills";
import { Teachers } from "@/components/sections/Teachers";
import { Ticker } from "@/components/sections/Ticker";
import { Trust } from "@/components/sections/Trust";

// Re-render daily so a cohort that has started drops off without a redeploy.
export const revalidate = 86400;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main">
      <Hero />
      <Ticker />
      <GlobeRoute />
      <Programs />
      <Gallery />
      <Method />
      <Skills />
      <Championship />
      <Teachers />
      <Reviews />
      <Trust />
      <CTA />
    </main>
  );
}
