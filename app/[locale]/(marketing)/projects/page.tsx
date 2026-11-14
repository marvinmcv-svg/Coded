import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { CTA } from "@/components/sections/CTA";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Skills } from "@/components/sections/Skills";
import { buttonClass } from "@/components/ui/Button";
import { photo, type BuiltImage } from "@/content/media";
import { programs, type Program } from "@/content/programs";
import { Link } from "@/lib/i18n/navigation";
import { pageMetadata } from "@/lib/seo/meta";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.projects" });
  return pageMetadata(locale, "/projects", `${t("title")} — Coded`, t("metaDescription"));
}

// Briefs are Coded's own wording from the codingeducation.us program pages (CONTENT_FACTS §3, "Projects").
const shots: Record<Program["slug"], [BuiltImage, BuiltImage, BuiltImage]> = {
  "orlando-steam-league": ["orl-colony", "orl-sketch", "orl-sketching"],
  "europe-steam-league": ["eu-vr", "eu-mentor", "eu-laptop-focus"],
  "steam-league-ai": ["ai-workshop-build", "ai-workshop-team", "ai-workshop-code"],
  "tokyo-steam-championship": ["tokyo-project", "tokyo-build", "tokyo-cap"],
};
const dot: Record<string, string> = { "steam-s": "bg-steam-s", "steam-t": "bg-steam-t", "steam-e": "bg-steam-e", "steam-a": "bg-steam-a", "steam-m": "bg-steam-m" };
const letterColor: Record<string, string> = { S: "text-steam-s", T: "text-steam-t", E: "text-steam-e", A: "text-steam-a", M: "text-steam-m" };

export default async function ProjectsPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.projects");
  const tp = await getTranslations("programs");
  const tm = await getTranslations("media");
  const steps = t.raw("steps") as { title: string; body: string }[];

  const img = (k: BuiltImage, sizes: string, className = "") => (
    // eslint-disable-next-line @next/next/no-img-element -- pre-sized webp + srcset (content/media.ts)
    <img {...photo(k)} sizes={sizes} alt={tm(k)} loading="lazy" decoding="async" className={`size-full object-cover ${className}`} />
  );

  return (
    <main id="main">
      <PageHero eyebrow={t("eyebrow")} title={t("heroTitle")} intro={t("intro")} image="orl-workbook">
        <nav aria-label={t("title")} className="flex flex-wrap gap-2">
          {programs.map((p) => (
            <a key={p.slug} href={`#${p.slug}`} className="flex min-h-10 items-center gap-2 rounded-full border border-mist/25 px-4 text-sm hover:border-accent-soft">
              <span aria-hidden className={`size-2 rounded-full ${dot[p.accent]}`} />
              {t(`chapters.${p.slug}.title`)}
            </a>
          ))}
        </nav>
      </PageHero>

      {/* How a project works */}
      <section aria-labelledby="how-title" className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-24">
        <SectionHeading id="how-title" eyebrow={t("howEyebrow")} title={t("howTitle")} />
        <ol className="grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-mist/15 md:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.title} className="bg-ink">
              <Reveal className="flex h-full flex-col gap-4 p-7">
                <span aria-hidden className="font-display text-5xl leading-none font-semibold text-outline">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                <p className="text-mist">{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* One chapter per program */}
      {programs.map((p, i) => {
        const [main, a, b] = shots[p.slug];
        const pathway = tp.raw(`${p.slug}.pathway`) as Record<string, string> | string[];
        const items = Array.isArray(pathway) ? pathway.map((v) => [null, v] as const) : Object.entries(pathway);
        const flip = i % 2 === 1;
        return (
          <section key={p.slug} id={p.slug} aria-labelledby={`${p.slug}-title`} className="scroll-mt-20 overflow-x-clip border-t border-mist/10">
            <div className="mx-auto grid max-w-7xl items-start gap-12 px-6 py-24 md:grid-cols-2 md:gap-16">
              <div className={`relative ${flip ? "md:order-2" : ""}`}>
                <ClipReveal className="aspect-[4/5] rounded-[var(--radius-card)] bg-ink-2" from={flip ? "right" : "left"}>
                  <Parallax className="size-full">
                    {img(main, "(min-width: 768px) 45vw, 90vw")}
                  </Parallax>
                </ClipReveal>
                <div className="mt-4 grid grid-cols-2 gap-4 md:absolute md:-bottom-10 md:mt-0 md:w-2/3 md:[&>*]:shadow-[0_30px_80px_-20px_rgb(0_0_0/.7)] md:right-0 xl:right-[-6%]">
                  <ClipReveal className="aspect-square rounded-2xl bg-ink-2" delay={0.1}>{img(a, "(min-width: 768px) 15vw, 45vw")}</ClipReveal>
                  <ClipReveal className="aspect-square rounded-2xl bg-ink-2" delay={0.2}>{img(b, "(min-width: 768px) 15vw, 45vw")}</ClipReveal>
                </div>
              </div>

              <Reveal className="flex flex-col gap-7 md:sticky md:top-24">
                <p className="flex items-center gap-3 font-mono text-sm tracking-[0.2em] text-mist uppercase">
                  <span aria-hidden className={`size-2.5 rounded-full ${dot[p.accent]}`} />
                  {p.name}
                </p>
                <h2 id={`${p.slug}-title`} className="font-display text-[clamp(2.25rem,4.5vw,4rem)] leading-[1.02] font-semibold tracking-tight">{t(`chapters.${p.slug}.title`)}</h2>
                <figure className="flex flex-col gap-3 border-l-2 border-accent-soft pl-6">
                  <figcaption className="font-mono text-xs tracking-widest text-accent-soft uppercase">{t("brief")}</figcaption>
                  <blockquote className="font-display text-2xl leading-snug">{t(`chapters.${p.slug}.brief`)}</blockquote>
                </figure>
                <p className="text-lg text-mist">{t(`chapters.${p.slug}.body`)}</p>
                <div className="flex flex-col gap-3">
                  <h3 className="font-mono text-xs tracking-widest text-mist uppercase">{t("workshops")}</h3>
                  <ul className="flex flex-col">
                    {items.map(([letter, text]) => (
                      <li key={text} className="flex gap-4 border-t border-mist/15 py-3">
                        {letter ? <span aria-hidden className={`w-5 font-display font-semibold ${letterColor[letter]}`}>{letter}</span> : <span aria-hidden className="text-accent-soft">—</span>}
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href={`/programs/${p.slug}`} className={`${buttonClass("ghost")} w-fit`}>{t("programLink")} →</Link>
              </Reveal>
            </div>
          </section>
        );
      })}

      {/* Pitch day */}
      <section aria-labelledby="pitch-title" className="relative isolate overflow-hidden">
        <Parallax className="absolute inset-0 -z-10">
          {img("orl-pitch-stage", "100vw")}
        </Parallax>
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/80 to-ink/50" />
        <div className="mx-auto flex min-h-[80svh] max-w-7xl flex-col justify-end gap-6 px-6 py-24">
          <SectionHeading id="pitch-title" eyebrow={t("pitchEyebrow")} title={t("pitchTitle")} />
          <p className="max-w-xl text-xl text-paper/90">{t("pitchBody")}</p>
        </div>
      </section>

      {/* Road to Tokyo */}
      <section aria-labelledby="road-title" className="mx-auto grid max-w-7xl items-end gap-10 px-6 py-24 md:grid-cols-[1.2fr_1fr]">
        <h2 id="road-title" className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] font-semibold tracking-tight">{t("roadTitle")}</h2>
        <Reveal className="flex flex-col items-start gap-6">
          <p className="text-lg text-mist">{t("roadBody")}</p>
          <Link href="/championship" className={buttonClass("primary")}>{t("roadLink")} →</Link>
        </Reveal>
      </section>

      <Skills />
      <CTA />
    </main>
  );
}
