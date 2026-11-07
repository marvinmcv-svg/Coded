import { getTranslations, setRequestLocale } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <main id="main" className="mx-auto flex min-h-svh max-w-5xl flex-col justify-center gap-8 px-6 py-24">
      <h1 className="font-display text-4xl leading-tight font-semibold md:text-6xl">{t("headline")}</h1>
      <p className="max-w-xl text-lg text-mist">{t("wip")}</p>
      <div>
        <ButtonLink href="/styleguide" variant="ghost">
          {t("styleguideLink")}
        </ButtonLink>
      </div>
    </main>
  );
}
