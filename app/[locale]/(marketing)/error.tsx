"use client";

import { useTranslations } from "next-intl";
import { Button, ButtonLink } from "@/components/ui/Button";

/** Render-time failure inside a marketing page: keep header/footer, offer a retry. Strings come from `errors.error`. */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("errors.error");
  return (
    <main id="main" className="mx-auto flex min-h-[70svh] max-w-4xl flex-col justify-center gap-7 px-6 py-24">
      <p className="flex items-center gap-3 font-mono text-sm tracking-[0.2em] text-mist uppercase">
        <span aria-hidden className="h-px w-8 bg-accent-soft" />
        {t("eyebrow")}
      </p>
      <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.98] font-semibold tracking-tight">{t("title")}</h1>
      <p className="max-w-xl text-lg text-mist">{t("body")}</p>
      <div className="flex flex-wrap gap-4">
        <Button type="button" onClick={reset}>{t("retry")}</Button>
        <ButtonLink href="/" variant="ghost">{t("home")}</ButtonLink>
      </div>
    </main>
  );
}
