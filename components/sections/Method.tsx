import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { ScrubLine } from "@/components/motion/ScrubLine";
import { Link } from "@/lib/i18n/navigation";
import { SectionHeading } from "./SectionHeading";

const steps = ["experts", "workshops", "projects", "coding"] as const;

export async function Method() {
  const t = await getTranslations("home.method");
  return (
    <section id="method" aria-labelledby="method-title" className="mx-auto flex max-w-6xl scroll-mt-20 flex-col gap-12 px-6 py-24">
      <SectionHeading id="method-title" eyebrow={t("eyebrow")} title={t("title")} />
      <div className="relative">
        <ScrubLine className="absolute inset-x-0 top-0 z-10" />
        <ol className="grid gap-6 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s}>
              <Reveal className="flex h-full flex-col gap-3 border-t border-mist/20 pt-6">
                <span aria-hidden className="font-mono text-sm text-accent-soft">0{i + 1}</span>
                <h3 className="font-display text-xl font-semibold">{t(`steps.${s}.title`)}</h3>
                <p className="text-mist">{t(`steps.${s}.body`)}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
      <Link href="/method" className="self-start font-semibold underline underline-offset-4">{t("more")} →</Link>
    </section>
  );
}
