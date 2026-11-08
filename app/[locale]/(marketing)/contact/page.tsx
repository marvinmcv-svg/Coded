import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { buttonClass } from "@/components/ui/Button";
import { Link } from "@/lib/i18n/navigation";
import { consultationHref, EMAIL, PHONE, PHONE_HREF } from "@/lib/links";
import { pageMetadata, SITE_URL } from "@/lib/seo/meta";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.contact" });
  return pageMetadata(locale, "/contact", `${t("title")} — Coded`, t("metaDescription"));
}

// CONTENT_FACTS §1 (🟡): offices, phone, email, Florida Seller of Travel registration.
const offices = [
  { key: "miami", address: { streetAddress: "255 Giralda Ave", addressLocality: "Coral Gables", addressRegion: "FL", postalCode: "33134", addressCountry: "US" } },
  { key: "london", address: { streetAddress: "Studio 43, Great Western Studios, 65 Alfred Rd", addressLocality: "London", postalCode: "W2 5EU", addressCountry: "GB" } },
] as const;

export default async function ContactPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.contact");
  const tf = await getTranslations("home.footer");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Coded",
    url: SITE_URL,
    email: EMAIL,
    telephone: PHONE,
    address: offices.map((o) => ({ "@type": "PostalAddress", ...o.address })),
  };

  return (
    <main id="main" className="mx-auto flex max-w-4xl flex-col gap-14 px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <header className="flex flex-col gap-5">
        <h1 className="font-display text-4xl leading-tight font-semibold md:text-6xl">{t("title")}</h1>
        <p className="max-w-3xl text-lg text-mist">{t("intro")}</p>
      </header>

      <Reveal className="flex flex-col items-start gap-4 rounded-[var(--radius-card)] bg-accent/15 p-8">
        <h2 className="font-display text-2xl font-semibold">{t("call.title")}</h2>
        <p className="text-lg text-mist">{t("call.body")}</p>
        <Link prefetch={false} href={consultationHref()} className={buttonClass("primary")}>{t("call.button")}</Link>
      </Reveal>

      <Reveal className="flex flex-col gap-4 border-t border-mist/20 pt-8">
        <h2 className="font-display text-2xl font-semibold">{t("write.title")}</h2>
        <ul className="flex flex-col gap-2 text-lg">
          <li>{t("write.email")}: <a href={`mailto:${EMAIL}`} className="underline underline-offset-4">{EMAIL}</a></li>
          <li>{t("write.phone")}: <a href={PHONE_HREF} className="underline underline-offset-4">{PHONE}</a></li>
        </ul>
      </Reveal>

      <Reveal className="flex flex-col gap-4 border-t border-mist/20 pt-8">
        <h2 className="font-display text-2xl font-semibold">{tf("offices")}</h2>
        <ul className="flex flex-col gap-2 text-lg text-mist">
          {offices.map((o) => <li key={o.key}>{tf(o.key)}</li>)}
        </ul>
        <p className="text-sm text-mist">{t("sellerOfTravel")}</p>
      </Reveal>
    </main>
  );
}
