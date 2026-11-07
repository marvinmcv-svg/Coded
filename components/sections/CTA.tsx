import { getTranslations } from "next-intl/server";
import { buttonClass } from "@/components/ui/Button";
import { CONSULTATION_URL, EMAIL, PHONE, PHONE_HREF } from "@/lib/links";

export async function CTA() {
  const t = await getTranslations("home.cta");
  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-auto flex max-w-6xl scroll-mt-20 flex-col items-start gap-6 px-6 py-28">
      <h2 id="contact-title" className="max-w-3xl font-display text-4xl leading-tight font-semibold md:text-6xl">{t("title")}</h2>
      <p className="max-w-xl text-lg text-mist">{t("body")}</p>
      <a href={CONSULTATION_URL} target="_blank" rel="noopener" className={buttonClass("primary")}>{t("button")}</a>
      <p className="text-mist">
        {t("or")}: <a href={`mailto:${EMAIL}`} className="text-paper underline underline-offset-4">{EMAIL}</a>
        {" · "}<a href={PHONE_HREF} className="text-paper underline underline-offset-4">{PHONE}</a>
      </p>
    </section>
  );
}
