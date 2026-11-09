import { getTranslations } from "next-intl/server";
import { LocaleSwitch } from "@/components/ui/LocaleSwitch";
import { Link } from "@/lib/i18n/navigation";
import { buttonClass } from "@/components/ui/Button";
import { consultationHref } from "@/lib/links";

const items = [
  ["programs", "/programs"],
  ["schools", "/schools"],
  ["worldCitizens", "/world-citizens"],
  ["championship", "/championship"],
  ["safety", "/safety"],
  ["contact", "/contact"],
] as const;

export async function Header() {
  const t = await getTranslations("home.nav");
  const tc = await getTranslations("common");
  const th = await getTranslations("home.hero");

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/60 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight">coded</Link>
        <nav aria-label={t("label")} className="hidden lg:block">
          <ul className="flex gap-6 text-sm text-mist">
            {items.map(([key, href]) => (
              <li key={key}><Link href={href} className="hover:text-paper">{t(key)}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <LocaleSwitch label={tc("otherLocaleName")} title={tc("switchLocale")} />
          <Link prefetch={false} href={consultationHref()} className={`${buttonClass("primary")} hidden min-h-10 px-4 text-sm sm:inline-flex`}>
            {th("ctaPrimary")}
          </Link>
        </div>
      </div>
    </header>
  );
}
