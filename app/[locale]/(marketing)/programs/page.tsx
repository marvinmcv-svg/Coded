import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Programs } from "@/components/sections/Programs";

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const tp = await getTranslations({ locale, namespace: "programs.index" });
  return { title: t("programsTitle"), description: tp("metaDescription") };
}

export default async function ProgramsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="main">
      <Programs asPage />
    </main>
  );
}
