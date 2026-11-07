import { getTranslations } from "next-intl/server";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitWords } from "@/components/motion/SplitWords";
import { TextReveal } from "@/components/motion/TextReveal";
import { VideoLoop } from "@/components/motion/VideoLoop";
import { buttonClass } from "@/components/ui/Button";
import { clip } from "@/content/media";
import { CONSULTATION_URL, EMAIL, PHONE, PHONE_HREF } from "@/lib/links";

/** Closing call: pitch-day clip behind a dark scrim, giant word reveal, magnetic button. */
export async function CTA() {
  const t = await getTranslations("home.cta");
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate scroll-mt-20 overflow-hidden">
      <VideoLoop {...clip("pitch-stage")} className="absolute inset-0 -z-20" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(11_13_18/.96),rgb(11_13_18/.82)_55%,rgb(118_0_231/.35))]" />
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 py-32 md:py-44">
        <TextReveal>
          <h2 id="contact-title" className="max-w-5xl font-display text-[clamp(2.75rem,7.5vw,7rem)] leading-[0.98] font-semibold tracking-tight">
            <SplitWords text={t("title")} />
          </h2>
        </TextReveal>
        <p className="max-w-xl text-lg text-mist md:text-xl">{t("body")}</p>
        <Magnetic strength={0.45}>
          <a href={CONSULTATION_URL} target="_blank" rel="noopener" className={`${buttonClass("primary")} min-h-16 px-10 text-lg shadow-[0_10px_50px_-10px_rgb(118_0_231/.9)]`}>{t("button")}</a>
        </Magnetic>
        <p className="text-mist">
          {t("or")}: <a href={`mailto:${EMAIL}`} className="text-paper underline underline-offset-4">{EMAIL}</a>
          {" · "}<a href={PHONE_HREF} className="text-paper underline underline-offset-4">{PHONE}</a>
        </p>
      </div>
    </section>
  );
}
