import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter_Tight, JetBrains_Mono, Unbounded } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/lib/i18n/routing";
import { INDEXABLE, pageMetadata, SITE_URL } from "@/lib/seo/meta";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import "../globals.css";

const display = Unbounded({ subsets: ["latin"], variable: "--font-unbounded", display: "swap" });
const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });

// Only /es and /en exist: anything else in this segment (e.g. /favicon.ico) is a plain 404, never a runtime render.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    ...pageMetadata(locale, "", t("homeTitle"), t("homeDescription")),
    ...(INDEXABLE ? {} : { robots: { index: false, follow: false } }),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "common" });
  // Client components get only what they need: the error boundary's strings (it can't receive server props).
  const { errors } = (await getMessages()) as { errors: { error: Record<string, string> } };

  return (
    <html lang={locale} className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-paper focus:px-4 focus:py-2 focus:text-ink">
          {t("skipToContent")}
        </a>
        <NextIntlClientProvider messages={{ errors: { error: errors.error } }}>
          <SmoothScroll />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
