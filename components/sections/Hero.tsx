import { getTranslations } from "next-intl/server";
import { buttonClass } from "@/components/ui/Button";
import { CONSULTATION_URL } from "@/lib/links";

const letters = [
  ["S", "text-steam-s"], ["T", "text-steam-t"], ["E", "text-steam-e"], ["A", "text-steam-a"], ["M", "text-steam-m"],
] as const;

export async function Hero() {
  const t = await getTranslations("home.hero");
  return (
    <section className="relative overflow-hidden">
      {/* Art-directed backdrop until original footage arrives (Q1). Decorative only. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-60 [background:radial-gradient(60%_50%_at_80%_20%,rgb(61_90_254/.35),transparent),radial-gradient(40%_40%_at_10%_80%,rgb(255_61_127/.22),transparent),radial-gradient(35%_35%_at_60%_90%,rgb(34_195_166/.2),transparent)]" />
      <div className="mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-center gap-8 px-6 py-24">
        <p className="flex items-center gap-3 font-mono text-sm text-mist">
          <span aria-hidden className="flex gap-1 font-semibold">
            {letters.map(([l, c]) => <span key={l} className={c}>{l}</span>)}
          </span>
          {t("eyebrow")}
        </p>
        <h1 className="max-w-4xl font-display text-5xl leading-[1.02] font-semibold tracking-tight md:text-7xl">{t("headline")}</h1>
        <p className="max-w-2xl text-lg text-mist md:text-xl">{t("sub")}</p>
        <div className="flex flex-wrap gap-4">
          <a href={CONSULTATION_URL} target="_blank" rel="noopener" className={buttonClass("primary")}>{t("ctaPrimary")}</a>
          <a href="#programs" className={buttonClass("ghost")}>{t("ctaSecondary")}</a>
        </div>
      </div>
    </section>
  );
}
