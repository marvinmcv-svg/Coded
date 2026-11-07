import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

const items = ["guardian", "doctor", "insurance", "app", "staff"] as const;

/** Deliberately calm: fades only, light paper theme (PLAN §5 #9). Wording avoids custody claims (C16 🔴). */
export async function Trust() {
  const t = await getTranslations("home.trust");
  return (
    <section id="safety" aria-labelledby="safety-title" className="scroll-mt-20 bg-paper text-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-24 [&_.text-mist]:text-ink/70">
        <SectionHeading id="safety-title" eyebrow={t("eyebrow")} title={t("title")} />
        <ul className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((k) => (
            <li key={k}>
              <Reveal calm className="flex flex-col gap-2 border-t border-ink/15 pt-5">
                <h3 className="font-display text-lg font-semibold">{t(`items.${k}.title`)}</h3>
                <p className="text-ink/70">{t(`items.${k}.body`)}</p>
              </Reveal>
            </li>
          ))}
        </ul>
        <Reveal calm className="flex flex-col gap-3 rounded-[var(--radius-card)] bg-ink/5 p-8">
          <h3 className="font-mono text-sm tracking-wide uppercase">{t("credentials")}</h3>
          <ul className="flex flex-col gap-2">
            <li>{t("sellerOfTravel")}</li>
            <li>{t("stemOrg")}</li>
            <li>{t("countries")}</li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
