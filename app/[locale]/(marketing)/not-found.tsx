import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buttonClass } from "@/components/ui/Button";
import { Link } from "@/lib/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("errors.notFound");
  return { title: t("metaTitle") }; // Next adds <meta name="robots" content="noindex"> to every 404 itself
}

export default async function NotFound() {
  const t = await getTranslations("errors.notFound");
  return (
    <main id="main" className="mx-auto flex min-h-[70svh] max-w-4xl flex-col justify-center gap-7 px-6 py-24">
      <p className="flex items-center gap-3 font-mono text-sm tracking-[0.2em] text-mist uppercase">
        <span aria-hidden className="h-px w-8 bg-accent-soft" />
        {t("eyebrow")}
      </p>
      <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.98] font-semibold tracking-tight">{t("title")}</h1>
      <p className="max-w-xl text-lg text-mist">{t("body")}</p>
      <div className="flex flex-wrap gap-4">
        <Link href="/" className={buttonClass("primary")}>{t("home")}</Link>
        <Link prefetch={false} href="/programs" className={buttonClass("ghost")}>{t("programs")}</Link>
      </div>
    </main>
  );
}
