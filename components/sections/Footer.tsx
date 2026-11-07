import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { EMAIL, PHONE, PHONE_HREF } from "@/lib/links";

export async function Footer() {
  const t = await getTranslations("home.footer");
  const tp = await getTranslations("pages");
  const tn = await getTranslations("home.nav");
  const links = [["/programs", tn("programs")], ["/method", tp("method.title")], ["/world-citizens", tp("worldCitizens.title")], ["/safety", tp("safety.title")], ["/about", tp("about.title")], ["/faq", tp("faq.title")], ["/contact", tp("contact.title")]] as const;
  return (
    <footer className="border-t border-mist/10">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-4">
        <p aria-hidden className="font-display text-6xl font-semibold tracking-tight md:text-7xl">coded</p>
        <nav aria-labelledby="footer-explore" className="flex flex-col gap-2 text-sm text-mist">
          <h2 id="footer-explore" className="font-mono tracking-wide text-paper uppercase">{t("explore")}</h2>
          {links.map(([href, label]) => <Link key={href} href={href} className="hover:text-paper">{label}</Link>)}
        </nav>
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
