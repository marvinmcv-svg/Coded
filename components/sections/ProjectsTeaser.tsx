import { getTranslations } from "next-intl/server";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { Parallax } from "@/components/motion/Parallax";
import { photo, type BuiltImage } from "@/content/media";
import { programs, type Program } from "@/content/programs";
import { Link } from "@/lib/i18n/navigation";
import { SectionHeading } from "./SectionHeading";

const cover: Record<Program["slug"], BuiltImage> = {
  "orlando-steam-league": "orl-colony",
  "europe-steam-league": "eu-vr",
  "steam-league-ai": "ai-workshop-build",
  "tokyo-steam-championship": "tokyo-project",
};

/** Home: the four program challenges as tall cards (staggered on md+), each opening its chapter on /projects. */
export async function ProjectsTeaser() {
  const t = await getTranslations("home.projects");
  const tp = await getTranslations("pages.projects");
  const tm = await getTranslations("media");
  return (
    <section aria-labelledby="projects-title" className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading id="projects-title" eyebrow={t("eyebrow")} title={t("title")} />
        <Link href="/projects" className="font-mono text-sm text-mist hover:text-paper">{t("more")} →</Link>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {programs.map((p, i) => (
          <li key={p.slug} className={i % 2 ? "lg:mt-16" : ""}>
            <Link href={`/projects#${p.slug}`} className="group relative block overflow-hidden rounded-[var(--radius-card)]" data-cursor="">
              <ClipReveal className="aspect-[3/4] bg-ink-2" delay={i * 0.08}>
                <Parallax className="size-full">
                  {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized webp + srcset (content/media.ts) */}
                  <img {...photo(cover[p.slug])} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw" alt={tm(cover[p.slug])} loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-700 ease-[var(--ease-expo-out)] group-hover:scale-105" />
                </Parallax>
              </ClipReveal>
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6">
                <span className="font-mono text-xs tracking-widest text-mist uppercase">{p.name}</span>
                <span className="font-display text-2xl leading-tight font-semibold group-hover:text-accent-soft">{tp(`chapters.${p.slug}.title`)} <span aria-hidden>→</span></span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
