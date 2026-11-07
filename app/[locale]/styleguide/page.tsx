import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { LocaleSwitch } from "@/components/ui/LocaleSwitch";
import { MotionTierLabel } from "@/components/motion/MotionTierLabel";
import { Reveal } from "@/components/motion/Reveal";
import { dur, ease } from "@/lib/motion/tokens";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("styleguideTitle"), robots: { index: false, follow: false }, alternates: { canonical: `/${locale}/styleguide` }, openGraph: null };
}

const swatches = [
  ["ink", "bg-ink"], ["ink-2", "bg-ink-2"], ["paper", "bg-paper"], ["mist", "bg-mist"], ["accent", "bg-accent"], ["accent-soft", "bg-accent-soft"], ["brand-magenta", "bg-brand-magenta"], ["brand-blue", "bg-brand-blue"],
  ["steam-s", "bg-steam-s"], ["steam-t", "bg-steam-t"], ["steam-e", "bg-steam-e"], ["steam-a", "bg-steam-a"], ["steam-m", "bg-steam-m"],
] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6 border-t border-mist/20 pt-10">
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default async function StyleguidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("styleguide");
  const tc = await getTranslations("common");

  return (
    <main id="main" className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-20">
      <header className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-4xl font-semibold md:text-5xl">{t("title")}</h1>
          <LocaleSwitch label={tc("otherLocaleName")} title={tc("switchLocale")} />
        </div>
        <p className="text-lg text-mist">{t("intro")}</p>
      </header>

      <Section title={t("colors")}>
        <p className="text-sm text-mist">{t("paletteNote")}</p>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {swatches.map(([name, cls]) => (
            <li key={name} className="flex flex-col gap-2">
              <span className={`h-20 rounded-2xl border border-mist/20 ${cls}`} />
              <span className="font-mono text-sm">{name}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t("type")}>
        <div className="flex flex-col gap-2">
          <p className="font-mono text-sm text-mist">{t("typeDisplay")}</p>
          <p className="font-display text-5xl leading-tight font-semibold md:text-7xl">{t("typeSample")}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-mono text-sm text-mist">{t("typeBody")}</p>
          <p className="max-w-2xl text-xl">{t("bodySample")}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-mono text-sm text-mist">{t("typeMono")}</p>
          <p className="font-mono">S · T · E · A · M</p>
        </div>
      </Section>

      <Section title={t("motion")}>
        <MotionTierLabel label={t.raw("motionTier") as string} />
        <dl className="grid gap-6 font-mono text-sm sm:grid-cols-2">
          <div>
            <dt className="mb-2 text-mist">{t("durations")}</dt>
            {Object.entries(dur).map(([k, v]) => <dd key={k}>--dur-{k}: {v}s</dd>)}
          </div>
          <div>
            <dt className="mb-2 text-mist">{t("eases")}</dt>
            {Object.values(ease).map((v) => <dd key={v}>{v}</dd>)}
          </div>
        </dl>
        <Reveal className="rounded-[var(--radius-card)] bg-ink-2 p-8">
          <p>{t("motionReveal")}</p>
        </Reveal>
      </Section>

      <Section title={t("components")}>
        <h3 className="font-display text-lg">{t("buttons")}</h3>
        <div className="flex flex-wrap gap-4">
          <Button>{t("buttonPrimary")}</Button>
          <Button variant="secondary">{t("buttonSecondary")}</Button>
          <ButtonLink href="/" variant="ghost">{t("buttonGhost")}</ButtonLink>
        </div>
        <h3 className="font-display text-lg">{t("chips")}</h3>
        <div className="flex flex-wrap gap-3">
          <Chip status="open">{t("chipOpen")}</Chip>
          <Chip status="few">{t("chipFew")}</Chip>
          <Chip status="closed">{t("chipClosed")}</Chip>
        </div>
      </Section>
    </main>
  );
}
