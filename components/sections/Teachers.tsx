import { getTranslations } from "next-intl/server";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { photo } from "@/content/media";
import { teachers } from "@/content/teachers";
import { SectionHeading } from "./SectionHeading";

const initials = (n: string) => n.replace(/^Dr\s+/, "").split(" ").map((p) => p[0]).slice(0, 2).join("");

/** Teachers & team (content/teachers.ts). Portraits wipe in, go from duotone to colour on hover. */
export async function Teachers() {
  const t = await getTranslations("home.teachers");
  return (
    <section id="teachers" aria-labelledby="teachers-title" className="mx-auto flex max-w-7xl scroll-mt-20 flex-col gap-12 px-6 py-24">
      <SectionHeading id="teachers-title" eyebrow={t("eyebrow")} title={t("title")} />
      <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {teachers.map((p, i) => (
          <li key={p.slug} className="group flex flex-col gap-3">
            <ClipReveal className="aspect-square rounded-3xl bg-ink-2" delay={(i % 4) * 0.08}>
              {p.photo ? (
                // eslint-disable-next-line @next/next/no-img-element -- pre-sized webp (content/media.ts)
                <img {...photo(p.photo)} sizes="(min-width: 1024px) 22vw, 45vw" alt={p.name} loading="lazy" decoding="async" className="size-full object-cover grayscale-[0.85] transition duration-700 ease-[var(--ease-expo-out)] group-hover:scale-105 group-hover:grayscale-0" />
              ) : (
                <div role="img" aria-label={p.name} className="flex size-full items-center justify-center bg-[radial-gradient(circle_at_30%_30%,rgb(118_0_231/.6),rgb(26_30_39))] font-display text-5xl font-semibold text-paper/90">
                  {initials(p.name)}
                </div>
              )}
            </ClipReveal>
            <div>
              <h3 className="font-display text-lg font-semibold">{p.name}</h3>
              <p className="text-sm text-mist">{t(`roles.${p.slug}`)}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
