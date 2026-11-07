import { getTranslations } from "next-intl/server";
import { EMAIL, PHONE, PHONE_HREF } from "@/lib/links";

export async function Footer() {
  const t = await getTranslations("home.footer");
  return (
    <footer className="border-t border-mist/10">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3">
        <p aria-hidden className="font-display text-6xl font-semibold tracking-tight md:text-7xl">coded</p>
        <div className="flex flex-col gap-2 text-sm text-mist">
          <h2 className="font-mono tracking-wide text-paper uppercase">{t("offices")}</h2>
          <p>{t("miami")}</p>
          <p>{t("london")}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-mist">
          <h2 className="font-mono tracking-wide text-paper uppercase">{t("contact")}</h2>
          <a href={`mailto:${EMAIL}`} className="hover:text-paper">{EMAIL}</a>
          <a href={PHONE_HREF} className="hover:text-paper">{PHONE}</a>
        </div>
      </div>
      <p className="mx-auto max-w-6xl px-6 pb-10 text-sm text-mist">{t("rights", { year: new Date().getFullYear() })}</p>
    </footer>
  );
}
